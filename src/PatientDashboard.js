import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from './axiosInstance';
import {
  Box, Typography, Alert, Paper, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  Grid, Card, CardContent, Skeleton, Divider,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import './App.css';

const STATUS_CONFIG = {
  normal:     { color: '#2D9B6F', bg: '#E8F5EE', label: 'Normal',     icon: '✅', severity: 'success' },
  low:        { color: '#D32F2F', bg: '#FFEBEE', label: 'Low',        icon: '⚠️', severity: 'error' },
  high:       { color: '#E07B00', bg: '#FFF3E0', label: 'High',       icon: '🚨', severity: 'warning' },
  borderline: { color: '#E07B00', bg: '#FFF3E0', label: 'Borderline', icon: '⚠️', severity: 'warning' },
};

const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.normal;

function PatientDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const patientId = localStorage.getItem('username');

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    setError('');
    try {
      const res = await axiosInstance.get(`/api/breathing/patient/${patientId}`);
      setData(res.data);
      setLastUpdated(new Date());
    } catch {
      if (!silent) setError('Unable to fetch your data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      fetchData();
      const interval = setInterval(() => fetchData(true), 10000);
      return () => clearInterval(interval);
    }
  }, [patientId, fetchData]);

  const latestReading = data[0];
  const latestCfg = getStatusConfig(latestReading?.status);
  const avgRR = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.rr, 0) / data.length)
    : null;
  const minRR = data.length > 0 ? Math.min(...data.map(d => d.rr)) : null;
  const maxRR = data.length > 0 ? Math.max(...data.map(d => d.rr)) : null;

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" width={280} height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[1,2,3].map(i => <Grid item xs={12} sm={4} key={i}><Skeleton variant="rounded" height={90} /></Grid>)}
        </Grid>
        <Skeleton variant="rounded" height={300} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }} className="fadeIn">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            My Health Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: '#2D9B6F' }} />
            <Typography variant="body2" color="text.secondary">
              Auto-refreshes every 10s
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
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Current status banner */}
      {latestReading && latestReading.status !== 'normal' && (
        <Alert severity={latestCfg.severity} className="alert-pulse" sx={{ mb: 3, fontWeight: 600 }}>
          Your latest reading shows <strong>{latestCfg.label.toUpperCase()}</strong> respiratory rate
          ({latestReading.rr} bpm). Please contact your caregiver if you feel unwell.
        </Alert>
      )}

      {/* Current status card */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: latestReading
            ? `linear-gradient(135deg, ${latestCfg.bg} 0%, #ffffff 100%)`
            : 'background.paper',
          border: '1px solid',
          borderColor: latestReading ? `${latestCfg.color}33` : 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '14px',
              backgroundColor: latestReading ? latestCfg.bg : '#F0F4F8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid',
              borderColor: latestReading ? `${latestCfg.color}44` : 'divider',
            }}
          >
            <FavoriteIcon sx={{ color: latestReading ? latestCfg.color : '#9E9E9E', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Current Status
            </Typography>
            {latestReading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                <Chip
                  label={`${latestCfg.icon} ${latestCfg.label}`}
                  sx={{
                    backgroundColor: latestCfg.bg,
                    color: latestCfg.color,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    height: 30,
                  }}
                />
                <Typography variant="h5" fontWeight={700} sx={{ color: latestCfg.color }}>
                  {latestReading.rr} bpm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  at {new Date(latestReading.recorded_at).toLocaleTimeString()}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                No readings yet
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Stats */}
      {data.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Average RR', value: `${avgRR} bpm`, color: '#0077B6' },
            { label: 'Minimum RR', value: `${minRR} bpm`, color: '#2D9B6F' },
            { label: 'Maximum RR', value: `${maxRR} bpm`, color: '#E07B00' },
          ].map((s) => (
            <Grid item xs={12} sm={4} key={s.label}>
              <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary"
                    sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {s.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: s.color, mt: 0.5 }}>
                    {s.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Readings table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Recent Readings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {data.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
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
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <Typography variant="h6" gutterBottom>No readings yet</Typography>
            <Typography variant="body2">
              Your data will appear here once the monitoring device sends readings.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default PatientDashboard;
