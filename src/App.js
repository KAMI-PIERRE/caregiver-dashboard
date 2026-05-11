import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { API_BASE_URL } from "./config";
import "./App.css";

console.log("API_BASE_URL:", API_BASE_URL);

function App() {
  const [data, setData] = useState([]);
  const [lastAlert, setLastAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/latest`);
      setData(res.data);
      const latest = res.data[0];
      if (latest && latest.status !== "normal") {
        setLastAlert({
          status: latest.status,
          rr: latest.rr,
          time: latest.recorded_at,
        });
      } else {
        setLastAlert(null);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Cannot connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const chartData = [...data].reverse(); // oldest to newest for the chart

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>🫁 SRMS – Caregiver Dashboard</h1>

      {lastAlert && (
        <div className="alert-card">
          ⚠️ ALERT – {lastAlert.status.toUpperCase()} breathing!<br />
          Rate: <strong>{lastAlert.rr} bpm</strong> at{" "}
          {new Date(lastAlert.time).toLocaleTimeString()}
        </div>
      )}

      <div className="chart-container">
        <h2>Real‑time Respiratory Rate (last 20 readings)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eee" />
            <XAxis
              dataKey="recorded_at"
              tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
            />
            <YAxis domain={[0, 40]} label={{ value: "bpm", angle: -90, position: "insideLeft" }} />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
            <Line
              type="monotone"
              dataKey="rr"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="table-container">
        <h2>Latest Readings</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>RR (bpm)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr
                key={entry.id}
                className={entry.status === "normal" ? "row-normal" : "row-alert"}
              >
                <td>{new Date(entry.recorded_at).toLocaleString()}</td>
                <td>{entry.rr}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;