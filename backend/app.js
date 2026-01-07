const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { OPCUAClient, AttributeIds } = require("node-opcua");

const app = express();
const PORT = 4000;

app.use(cors());

// 🔹 OPC UA Simulator endpoint
const endpointUrl = "opc.tcp://localhost:53530/OPCUA/SimulationServer";

// 🔹 Working tags (Prosys Simulation Server)
const TAGS = [
  "ns=3;s=Simulation Examples.Functions.Random1",
  "ns=3;s=Simulation Examples.Functions.Random2",
  "ns=3;s=Simulation Examples.Functions.Random3",
  "ns=3;s=Simulation Examples.Functions.Random4",
  "ns=3;s=Simulation Examples.Functions.Random5",
  "ns=3;s=Simulation Examples.Functions.Random6",
  "ns=3;s=Simulation Examples.Functions.Random7",
  "ns=3;s=Simulation Examples.Functions.Random8",
  "ns=3;s=Simulation Examples.Functions.Random9",
  "ns=3;s=Simulation Examples.Functions.Random10",
];

let latestValues = [];

const client = OPCUAClient.create({
  endpointMustExist: false,
});

function getHourlyFileName() {
  const now = new Date();
  const hour = now.toISOString().slice(0, 13);
  return `OPC_Log_${hour}.csv`;
}

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    const header =
      "Timestamp,EpochUTC," +
      TAGS.map((_, i) => `Tag${i + 1}`).join(",") +
      "\n";
    fs.writeFileSync(filePath, header);
  }
}

async function startOPCClient() {
  try {
    console.log("Connecting to OPC UA Server...");
    await client.connect(endpointUrl);

    const session = await client.createSession();
    console.log("OPC UA session created");

    // Delay before first read
    setTimeout(() => {
      setInterval(async () => {
        try {
          const timestamp = new Date();
          const epoch = Math.floor(timestamp.getTime() / 1000);

          const dataValues = await session.read(
            TAGS.map((tag) => ({
              nodeId: tag,
              attributeId: AttributeIds.Value,
            }))
          );

          const values = dataValues.map((d) =>
            d.value && d.value.value !== null ? d.value.value : ""
          );

          latestValues = values;

          const fileName = getHourlyFileName();
          const filePath = path.join(__dirname, fileName);
          ensureFile(filePath);

          const row =
            `${timestamp.toISOString().replace("T", " ").slice(0, 19)},` +
            `${epoch},` +
            values.join(",") +
            "\n";

          fs.appendFileSync(filePath, row);
          console.log("Logged values:", values);
        } catch (readErr) {
          console.error("Read error:", readErr.message);
        }
      }, 60 * 1000);
    }, 3000);
  } catch (connErr) {
    console.error("Connection failed:", connErr.message);
  }
}

// API for React
app.get("/api/live", (req, res) => {
  res.json({
    timestamp: new Date(),
    values: latestValues,
  });
});

startOPCClient();

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
