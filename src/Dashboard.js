import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "./axiosInstance";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  Box, Typography, Chip, Button, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Grid, Card, CardContent, Skeleton, Divider,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import "./App.css";

const THRESHOLDS = { LOW: 8, NORMAL_MAX: 20, HIGH: 25 };

const STATUS_CONFIG = {
  normal:     { color: '#2D9B6F', bg: '#E8F5EE', label: 'Normal',     icon: '✅' },
  low:        { color: '#D32F2F', bg: '#FFEBEE', label: 'Low',        icon: '⚠️' },
  high:       { color: '#E07B00', bg: '#FFF3E0', label: 'High',       icon: '🚨' },
  borderline: { color: '#E07B00', bg: '#FFF3E0', label: 'Borderline', icon: '⚠️' },
};

const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.normal;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const cfg = getStatusConfig(d.status);
    return (
      <div className="custom-tooltip">
        <p className="tooltip-time">{new Date(label).toLocaleString()}</p>
        <p className="tooltip-rr">Rate: <strong>{d.rr} bpm</strong></p>
        <p className="tooltip-status" style={{ color: cfg.color }}>
          {cfg.icon} {cfg.label}
        </p>
        <p style={{ fontSize: 11, color: '#5A6A7A', margin: '4px 0 0' }}>
          Patient: {d.patient_id}
        </p>
      </div>
    );
  }
  return null;
};

function StatCard({ label, value, color, bg }) {
  return (
    <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ color, mt: 0.5 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [data, setData] = useState([]);
  const [lastAlert, setLastAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await axiosInstance.get('/api/latest');
      setData(res.data);
      const latest = res.data[0];
      if (latest && latest.status !== "normal") {
        setLastAlert({ status: latest.status, rr: latest.rr, patientId: latest.patient_id, time: latest.recorded_at });
      } else {
        setLastAlert(null);
      }
      setLastUpdated(new Date());
      setError(null);
    } catch {
      if (!silent) setError("Cannot reach the server. Check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const chartData = [...data].reverse();
  const hasData = chartData.length > 0;
  const minRR = hasData ? Math.min(...data.map(d => d.rr)) : 0;
  const maxRR = hasData ? Math.max(...data.map(d => d.rr)) : 35;
  const yDomain = [Math.max(0, minRR - 3), Math.min(45, maxRR + 3)];

  const latestReading = data[0];
  const latestCfg = getStatusConfig(latestReading?.status);

  // Quick stats from current data
  const normalCount = data.filter(d => d.status === 'normal').length;
  const alertCount = data.filter(d => d.status !== 'normal').length;
  const avgRR = hasData ? Math.round(data.reduce((s, d) => s + d.rr, 0) / data.length) : 0;

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[1,2,3].map(i => <Grid item xs={12} sm={4} key={i}><Skeleton variant="rounded" height={90} /></Grid>)}
        </Grid>
        <Skeleton variant="rounded" height={360} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }} className="fadeIn">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Caregiver Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: '#2D9B6F', animation: 'none' }} />
            <Typography variant="body2" color="text.secondary">
              Live · Auto-refreshes every 5s
              {lastUpdated && ` · Updated ${lastUpdated.toLocaleTimeString()}`}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => fetchData(false)}
          disabled={refreshing}
          size="small"
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} action={
          <Button size="small" onClick={() => fetchData(false)}>Retry</Button>
        }>
          {error}
        </Alert>
      )}

      {lastAlert && (
        <Alert
          severity="warning"
          className="alert-pulse"
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Patient <strong>{lastAlert.patientId}</strong> — {lastAlert.status.toUpperCase()} breathing
          ({lastAlert.rr} bpm) at {new Date(lastAlert.time).toLocaleTimeString()}
        </Alert>
      )}

      {/* Stat cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            label="Latest Status"
            value={latestReading ? `${latestCfg.icon} ${latestCfg.label}` : '— No data'}
            color={latestCfg.color}
            bg={latestCfg.bg}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Avg RR (last 20)" value={hasData ? `${avgRR} bpm` : '—'} color="#0077B6" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Alerts in last 20" value={alertCount} color={alertCount > 0 ? '#D32F2F' : '#2D9B6F'} />
        </Grid>
      </Grid>

      {/* Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Respiratory Rate — Last 20 Readings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          All patients combined · Threshold lines shown
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {hasData ? (
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={chartData} margin={{ top: 8, right: 40, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="recorded_at"
                tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                interval="preserveStartEnd"
                minTickGap={40}
                tick={{ fontSize: 11, fill: '#5A6A7A' }}
              />
              <YAxis
                domain={yDomain}
                tick={{ fontSize: 11, fill: '#5A6A7A' }}
                label={{
                  value: 'RR (bpm)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: '#5A6A7A', textAnchor: 'middle' },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rr"
                stroke="#0077B6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0077B6', strokeWidth: 0 }}
                activeDot={{ r: 7, fill: '#023E8A' }}
              />
              <ReferenceLine y={THRESHOLDS.LOW} stroke="#D32F2F" strokeDasharray="4 3"
                label={{ value: 'Low (8)', position: 'right', fill: '#D32F2F', fontSize: 11 }} />
              <ReferenceLine y={THRESHOLDS.NORMAL_MAX} stroke="#E07B00" strokeDasharray="4 3"
                label={{ value: 'Borderline (20)', position: 'right', fill: '#E07B00', fontSize: 11 }} />
              <ReferenceLine y={THRESHOLDS.HIGH} stroke="#E07B00" strokeDasharray="4 3"
                label={{ value: 'High (25)', position: 'right', fill: '#E07B00', fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="h6" gutterBottom>No data yet</Typography>
            <Typography variant="body2">Waiting for ESP32 to send readings…</Typography>
          </Box>
        )}
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Latest Readings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {hasData ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Patient ID</TableCell>
                  <TableCell>RR (bpm)</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((entry) => {
                  const cfg = getStatusConfig(entry.status);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {new Date(entry.recorded_at).toLocaleString()}
                      </TableCell>
                      <TableCell fontWeight={500}>{entry.patient_id}</TableCell>
                      <TableCell>
                        <Typography fontWeight={600} sx={{ color: cfg.color }}>
                          {entry.rr}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${cfg.icon} ${cfg.label}`}
                          size="small"
                          sx={{
                            backgroundColor: cfg.bg,
                            color: cfg.color,
                            fontWeight: 600,
                            fontSize: '0.72rem',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <Typography>No readings recorded yet.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Dashboard;
