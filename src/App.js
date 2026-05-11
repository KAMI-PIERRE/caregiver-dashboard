import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { API_BASE_URL } from "./config";
import "./App.css";

// Thresholds (bpm)
const THRESHOLDS = {
  LOW: 8,
  NORMAL_MAX: 20,
  HIGH: 25,
};

const getStatusColor = (status) => {
  switch (status) {
    case "low": return "#dc3545";
    case "high": return "#ff6b35";
    case "borderline": return "#ffc107";
    default: return "#28a745";
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-time">{new Date(label).toLocaleString()}</p>
        <p className="tooltip-rr">Rate: <strong>{data.rr} bpm</strong></p>
        <p className="tooltip-status" style={{ color: getStatusColor(data.status) }}>
          Status: {data.status.toUpperCase()}
        </p>
      </div>
    );
  }
  return null;
};

function App() {
  const [data, setData] = useState([]);
  const [lastAlert, setLastAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
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
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      if (!silent) setError("Cannot reach the server. Check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 5000); // silent refresh every 5s
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleManualRefresh = () => fetchData(false);

  // Prepare chart data
  const chartData = [...data].reverse();
  const hasData = chartData.length > 0;
  const minRR = hasData ? Math.min(...data.map(d => d.rr), 0) : 0;
  const maxRR = hasData ? Math.max(...data.map(d => d.rr), 35) : 40;
  const yDomain = [Math.max(0, minRR - 2), Math.min(45, maxRR + 2)];

  const latestReading = data[0];
  const latestStatus = latestReading?.status || "none";
  const statusColor = getStatusColor(latestStatus);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error} <button onClick={handleManualRefresh}>Retry</button></div>;

  return (
    <div className="dashboard">
      <div className="header">
        <h1>🫁 SRMS – Caregiver Dashboard</h1>
        <div className="header-actions">
          <div className="status-badge" style={{ backgroundColor: statusColor }}>
            {latestStatus === "normal" ? "✅ Normal" : latestStatus === "low" ? "⚠️ Low" : latestStatus === "borderline" ? "⚠️ Borderline" : "🚨 High"}
          </div>
          <button onClick={handleManualRefresh} disabled={refreshing} className="refresh-btn">
            {refreshing ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {lastAlert && (
        <div className="alert-card">
          ⚠️ ALERT – {lastAlert.status.toUpperCase()} breathing ({lastAlert.rr} bpm) at {new Date(lastAlert.time).toLocaleTimeString()}
        </div>
      )}

      <div className="chart-container">
        <h2>Real‑time Respiratory Rate (last 20 readings)</h2>
        {hasData ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="recorded_at"
                tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                domain={yDomain}
                label={{ value: "Respiratory Rate (bpm)", angle: -90, position: "insideLeft", style: { textAnchor: 'middle' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rr"
                stroke="#2c7da0"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2c7da0" }}
                activeDot={{ r: 6 }}
              />
              {/* Threshold reference lines */}
              <ReferenceLine y={THRESHOLDS.LOW} stroke="#dc3545" strokeDasharray="3 3" label={{ value: "Low (8)", position: "right", fill: "#dc3545", fontSize: 11 }} />
              <ReferenceLine y={THRESHOLDS.NORMAL_MAX} stroke="#ffc107" strokeDasharray="3 3" label={{ value: "Borderline (20)", position: "right", fill: "#ffc107", fontSize: 11 }} />
              <ReferenceLine y={THRESHOLDS.HIGH} stroke="#ff6b35" strokeDasharray="3 3" label={{ value: "High (25)", position: "right", fill: "#ff6b35", fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-chart">No data yet. Waiting for ESP32 to send readings...</div>
        )}
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Latest Readings</h2>
          {lastUpdated && <span className="last-updated">Last updated: {lastUpdated.toLocaleTimeString()}</span>}
        </div>
        {hasData ? (
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
                <tr key={entry.id} className={entry.status === "normal" ? "row-normal" : "row-alert"}>
                  <td>{new Date(entry.recorded_at).toLocaleString()}</td>
                  <td>{entry.rr}</td>
                  <td style={{ color: getStatusColor(entry.status), fontWeight: "bold" }}>
                    {entry.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-table">No readings recorded yet.</div>
        )}
      </div>
    </div>
  );
}

export default App;