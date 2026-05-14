import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import {
  Box, Typography, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Alert, Paper, Grid, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Card, CardContent, Chip, IconButton, Tooltip, Divider,
  Tabs, Tab, Skeleton,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import './App.css';

function StatCard({ label, value, icon, color }) {
  return (
    <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </Typography>
          <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            backgroundColor: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 18, color } })}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight={700} sx={{ color }}>
          {value ?? <Skeleton width={40} />}
        </Typography>
      </CardContent>
    </Card>
  );
}

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [patients, setPatients] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [patientForm, setPatientForm] = useState({ patient_id: '', name: '', age: '', condition: '' });
  const [assignForm, setAssignForm] = useState({ patient_id: '', caregiver_id: '' });

  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [defaultPassword, setDefaultPassword] = useState('');

  const showMessage = (msg, sev = 'success') => {
    setMessage(msg);
    setSeverity(sev);
    setTimeout(() => setMessage(''), 6000);
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchPatients(), fetchCaregivers(), fetchStats(), fetchLogs(), fetchAssignments()]);
    setLoading(false);
  };

  const fetchPatients    = async () => { try { const r = await axiosInstance.get('/api/patients');    setPatients(r.data);    } catch {} };
  const fetchCaregivers  = async () => { try { const r = await axiosInstance.get('/api/caregivers');  setCaregivers(r.data);  } catch {} };
  const fetchAssignments = async () => { try { const r = await axiosInstance.get('/api/assignments'); setAssignments(r.data); } catch {} };
  const fetchStats       = async () => { try { const r = await axiosInstance.get('/api/stats');       setStats(r.data);       } catch {} };
  const fetchLogs        = async () => { try { const r = await axiosInstance.get('/api/logs');        setLogs(r.data);        } catch {} };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    try {
      const payload = { patient_id: patientForm.patient_id.trim(), name: patientForm.name.trim() };
      if (patientForm.age) payload.age = parseInt(patientForm.age, 10);
      if (patientForm.condition) payload.condition = patientForm.condition.trim();
      const res = await axiosInstance.post('/api/patients', payload);
      showMessage(`Patient registered. Default password: ${res.data.default_password}`, 'success');
      setDefaultPassword(res.data.default_password);
      setPatientForm({ patient_id: '', name: '', age: '', condition: '' });
      fetchPatients(); fetchStats();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Error registering patient.', 'error');
    }
  };

  const handleAssignCaregiver = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/assign', assignForm);
      showMessage('Caregiver assigned successfully.', 'success');
      setAssignForm({ patient_id: '', caregiver_id: '' });
      fetchAssignments(); fetchStats();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Error assigning caregiver.', 'error');
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('Remove this assignment?')) return;
    try {
      await axiosInstance.delete(`/api/assignments/${id}`);
      showMessage('Assignment removed.', 'success');
      fetchAssignments(); fetchStats();
    } catch {
      showMessage('Error removing assignment.', 'error');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }} className="fadeIn">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Admin Panel</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage patients, caregivers, and assignments
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchAll} size="small">
          Refresh All
        </Button>
      </Box>

      {message && (
        <Alert severity={severity} sx={{ mb: 3 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard label="Patients" value={stats.patients ?? 0} icon={<PeopleIcon />} color="#0077B6" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Caregivers" value={stats.caregivers ?? 0} icon={<PersonAddIcon />} color="#2D9B6F" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Assignments" value={stats.assignments ?? 0} icon={<AssignmentIndIcon />} color="#7B3FA0" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Readings" value={stats.readings ?? 0} icon={<MonitorHeartIcon />} color="#E07B00" />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ p: 0, overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': { fontWeight: 600, fontSize: '0.85rem', textTransform: 'none', minHeight: 52 },
          }}
        >
          <Tab label="Register Patient" icon={<PersonAddIcon fontSize="small" />} iconPosition="start" />
          <Tab label="Assign Caregiver" icon={<AssignmentIndIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`Patients (${patients.length})`} icon={<PeopleIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`Caregivers (${caregivers.length})`} icon={<PeopleIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`Assignments (${assignments.length})`} icon={<AssignmentIndIcon fontSize="small" />} iconPosition="start" />
          <Tab label="Activity Log" icon={<ListAltIcon fontSize="small" />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Tab 0 — Register Patient */}
          <TabPanel value={tab} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Register New Patient</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  A login account will be created automatically with a default password.
                </Typography>
                <form onSubmit={handleRegisterPatient}>
                  <TextField fullWidth label="Patient ID (login username)" value={patientForm.patient_id}
                    onChange={(e) => setPatientForm({ ...patientForm, patient_id: e.target.value })}
                    required sx={{ mb: 2 }} />
                  <TextField fullWidth label="Full Name" value={patientForm.name}
                    onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                    required sx={{ mb: 2 }} />
                  <TextField fullWidth label="Age (optional)" type="number" value={patientForm.age}
                    onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                    sx={{ mb: 2 }} inputProps={{ min: 0, max: 150 }} />
                  <TextField fullWidth label="Condition (optional)" value={patientForm.condition}
                    onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
                    sx={{ mb: 3 }} />
                  <Button type="submit" variant="contained" startIcon={<PersonAddIcon />} size="large">
                    Register Patient
                  </Button>
                </form>
                {defaultPassword && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    Default password: <strong>{defaultPassword}</strong>
                    <br />
                    <Typography variant="caption">Share this with the patient so they can log in.</Typography>
                  </Alert>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 1 — Assign Caregiver */}
          <TabPanel value={tab} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Assign Caregiver to Patient</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Caregivers must register themselves via the Register page before they appear here.
                </Typography>
                {patients.length === 0 || caregivers.length === 0 ? (
                  <Alert severity="info">
                    {patients.length === 0 && 'No patients registered yet. '}
                    {caregivers.length === 0 && 'No caregivers registered yet.'}
                  </Alert>
                ) : (
                  <form onSubmit={handleAssignCaregiver}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Patient</InputLabel>
                      <Select value={assignForm.patient_id} label="Patient"
                        onChange={(e) => setAssignForm({ ...assignForm, patient_id: e.target.value })} required>
                        {patients.map((p) => (
                          <MenuItem key={p.id} value={p.patient_id}>
                            {p.patient_id} — {p.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Caregiver</InputLabel>
                      <Select value={assignForm.caregiver_id} label="Caregiver"
                        onChange={(e) => setAssignForm({ ...assignForm, caregiver_id: e.target.value })} required>
                        {caregivers.map((c) => (
                          <MenuItem key={c.id} value={c.caregiver_id}>
                            {c.caregiver_id} — {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" startIcon={<AssignmentIndIcon />} size="large">
                      Assign Caregiver
                    </Button>
                  </form>
                )}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2 — Patients */}
          <TabPanel value={tab} index={2}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Registered Patients</Typography>
            <Divider sx={{ mb: 2 }} />
            {loading ? <Skeleton variant="rounded" height={200} /> : patients.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No patients registered yet.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Condition</TableCell>
                      <TableCell>Registered</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell><Typography fontWeight={600} variant="body2">{p.patient_id}</Typography></TableCell>
                        <TableCell>{p.name || '—'}</TableCell>
                        <TableCell>{p.age ?? '—'}</TableCell>
                        <TableCell>{p.condition || '—'}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {new Date(p.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Tab 3 — Caregivers */}
          <TabPanel value={tab} index={3}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Registered Caregivers</Typography>
            <Divider sx={{ mb: 2 }} />
            {loading ? <Skeleton variant="rounded" height={200} /> : caregivers.length === 0 ? (
              <Alert severity="info">
                No caregivers yet. Caregivers register themselves via the Register page.
              </Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Caregiver ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Specialization</TableCell>
                      <TableCell>Registered</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {caregivers.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell><Typography fontWeight={600} variant="body2">{c.caregiver_id}</Typography></TableCell>
                        <TableCell>{c.name || '—'}</TableCell>
                        <TableCell>{c.specialization || '—'}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {new Date(c.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Tab 4 — Assignments */}
          <TabPanel value={tab} index={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Active Assignments</Typography>
            <Divider sx={{ mb: 2 }} />
            {loading ? <Skeleton variant="rounded" height={200} /> : assignments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No assignments yet.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient ID</TableCell>
                      <TableCell>Caregiver ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Assigned At</TableCell>
                      <TableCell align="center">Remove</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell><Typography fontWeight={600} variant="body2">{a.patient_id}</Typography></TableCell>
                        <TableCell>{a.caregiver_id}</TableCell>
                        <TableCell>
                          <Chip
                            label={a.status}
                            color={a.status === 'active' ? 'success' : 'default'}
                            size="small"
                            sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {new Date(a.assigned_at).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Remove assignment">
                            <IconButton size="small" color="error" onClick={() => handleDeleteAssignment(a.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Tab 5 — Activity Log */}
          <TabPanel value={tab} index={5}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Recent Activity</Typography>
            <Divider sx={{ mb: 2 }} />
            {loading ? <Skeleton variant="rounded" height={200} /> : logs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <Typography>No activity recorded yet.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Event</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log, i) => (
                      <TableRow key={i}>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.event}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminDashboard;
