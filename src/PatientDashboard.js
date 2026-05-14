import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Alert,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { API_BASE_URL } from './config';
import './App.css';

const getStatusColor = (status) => {
  switch (status) {
    case "low": return "#dc3545";
    case "high": return "#ff6b35";
    case "borderline": return "#ffc107";
    default: return "#28a745";
  }
};

function PatientDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestStatus, setLatestStatus] = useState(null);

  const patientId = localStorage.getItem('username');

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/api/latest`);
        const patientData = res.data.filter(d => d.patient_id === patientId);
        setData(patientData);
        if (patientData.length > 0) {
          setLatestStatus(patientData[0].status);
        } else {
          setLatestStatus(null);
        }
      } catch (err) {
        setError('Unable to fetch data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  return (
    <Container maxWidth="md" className="fadeIn">
      <Typography variant="h4" component="h1" gutterBottom>
        My Respiratory Status
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome, {patientId}. Here is your latest respiratory data.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {latestStatus && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Current Status
          </Typography>
          <Chip
            label={
              latestStatus === "normal" ? "✅ Normal" :
              latestStatus === "low" ? "⚠️ Low" :
              latestStatus === "borderline" ? "⚠️ Borderline" : "🚨 High"
            }
            sx={{ backgroundColor: getStatusColor(latestStatus), color: 'white' }}
          />
        </Paper>
      )}

      {data.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Recent Readings
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>RR (bpm)</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.recorded_at).toLocaleString()}</TableCell>
                    <TableCell>{entry.rr}</TableCell>
                    <TableCell style={{ color: getStatusColor(entry.status), fontWeight: "bold" }}>
                      {entry.status.toUpperCase()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {data.length === 0 && !loading && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No data available yet.</Typography>
        </Paper>
      )}
    </Container>
  );
}

export default PatientDashboard;