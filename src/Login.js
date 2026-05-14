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
import LoginIcon from '@mui/icons-material/Login';
import { API_BASE_URL } from './config';

function Login() {
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username: form.username,
        password: form.password,
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', form.username);
      // Redirect based on role
      if (response.data.role === 'admin') navigate('/admin');
      else if (response.data.role === 'caregiver') navigate('/dashboard');
      else if (response.data.role === 'patient') navigate('/patient');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || 'Unable to login. Please check the backend.';
      setError(message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }} className="fadeIn">
      <Paper sx={{ p: 4, boxShadow: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <LoginIcon sx={{ mr: 1, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4">Login to SRMS</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="caregiver">Caregiver</MenuItem>
              <MenuItem value="patient">Patient</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Don't have an account? <Button onClick={() => navigate('/register')}>Register</Button>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;