import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:4000/api/live")
        .then((res) => res.json())
        .then((json) => {
          if (Array.isArray(json.values)) {
            setData(json.values);
          }
        })
        .catch((err) => console.error(err));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>OPC UA Live Values</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="2">Waiting for data...</td>
            </tr>
          ) : (
            data.map((val, i) => (
              <tr key={i}>
                <td>Tag {i + 1}</td>
                <td>{val}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
