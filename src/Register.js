import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { API_BASE_URL } from './config';

function Register() {
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.role === 'admin') {
      setError('Admins cannot register through this form. Please contact system administrator.');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/register`, {
        username: form.username,
        password: form.password,
        role: form.role,
      });
      setSuccess('Account created successfully! You can now login.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }} className="fadeIn">
      <Paper sx={{ p: 4, boxShadow: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <PersonAddIcon sx={{ mr: 1, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4">Register for SRMS</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <MenuItem value="caregiver">Caregiver</MenuItem>
              <MenuItem value="patient">Patient</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" fullWidth>
            Register
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account? <Button onClick={() => navigate('/login')}>Login</Button>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Register;