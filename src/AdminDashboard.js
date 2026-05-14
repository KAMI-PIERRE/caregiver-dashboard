import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { API_BASE_URL } from './config';
import './App.css';

function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [patientForm, setPatientForm] = useState({ patient_id: '', name: '' });
  const [assignForm, setAssignForm] = useState({ patient_id: '', caregiver_id: '' });
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchCaregivers();
    fetchStats();
    fetchLogs();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patients`);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchCaregivers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/caregivers`);
      setCaregivers(response.data);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/logs`);
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/patients`, patientForm);
      setMessage('Patient registered successfully!');
      setSeverity('success');
      setPatientForm({ patient_id: '', name: '' });
      fetchPatients();
      fetchStats();
    } catch (error) {
      setMessage('Error registering patient.');
      setSeverity('error');
      console.error(error);
    }
  };

  const handleAssignCaregiver = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/assign`, assignForm);
      setMessage('Caregiver assigned successfully!');
      setSeverity('success');
      setAssignForm({ patient_id: '', caregiver_id: '' });
      fetchStats();
    } catch (error) {
      setMessage('Error assigning caregiver.');
      setSeverity('error');
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg" className="fadeIn">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      {message && (
        <Alert severity={severity} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Patients
              </Typography>
              <Typography variant="h5">
                {stats.patients || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Caregivers
              </Typography>
              <Typography variant="h5">
                {stats.caregivers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Assignments
              </Typography>
              <Typography variant="h5">
                {stats.assignments || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Readings
              </Typography>
              <Typography variant="h5">
                {stats.readings || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonAddIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Register Patient</Typography>
            </Box>
            <form onSubmit={handleRegisterPatient}>
              <TextField
                fullWidth
                label="Patient ID"
                value={patientForm.patient_id}
                onChange={(e) => setPatientForm({ ...patientForm, patient_id: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Name"
                value={patientForm.name}
                onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" fullWidth>
                Register Patient
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <AssignmentIndIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Assign Caregiver to Patient</Typography>
            </Box>
            <form onSubmit={handleAssignCaregiver}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Patient</InputLabel>
                <Select
                  value={assignForm.patient_id}
                  onChange={(e) => setAssignForm({ ...assignForm, patient_id: e.target.value })}
                  required
                >
                  {patients.map((p) => (
                    <MenuItem key={p.id} value={p.patient_id}>
                      {p.patient_id} - {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Caregiver</InputLabel>
                <Select
                  value={assignForm.caregiver_id}
                  onChange={(e) => setAssignForm({ ...assignForm, caregiver_id: e.target.value })}
                  required
                >
                  {caregivers.map((c) => (
                    <MenuItem key={c.id} value={c.caregiver_id}>
                      {c.caregiver_id} - {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" fullWidth>
                Assign Caregiver
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* System Logs */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <ListAltIcon sx={{ mr: 1 }} />
          <Typography variant="h6">System Logs</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Event</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.event}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default AdminDashboard;