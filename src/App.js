import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './Layout';
import Home from './Home';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import PatientDashboard from './PatientDashboard';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b', // Medical teal
    },
    secondary: {
      main: '#0288d1', // Medical blue
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['caregiver', 'admin']}><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;