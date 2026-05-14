import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, CardActions, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import './App.css';

function Home() {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 2, mb: 2 }} className="fadeIn">
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        SRMS System
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 1 }}>
        Smart Respiratory Monitoring System for efficient healthcare management.
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}>
        Our advanced system provides real-time respiratory rate monitoring, enabling healthcare professionals to track patient vital signs remotely and ensure timely interventions for better patient outcomes.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Choose your role to continue:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
        <Card sx={{ width: 250, minHeight: 200, display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 8, transform: 'scale(1.05)' }, transition: 'all 0.3s ease' }}>
          <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 2 }}>
            <PersonIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" component="h2">
              Patient
            </Typography>
            <Typography variant="body2">
              View your respiratory status and readings.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button size="small" component={Link} to="/login" variant="contained">
              Login as Patient
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ width: 250, minHeight: 200, display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 8, transform: 'scale(1.05)' }, transition: 'all 0.3s ease' }}>
          <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 2 }}>
            <DashboardIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" component="h2">
              Caregiver
            </Typography>
            <Typography variant="body2">
              Monitor patients' respiratory rates in real-time.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button size="small" component={Link} to="/login" variant="contained">
              Login as Caregiver
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ width: 250, minHeight: 200, display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 8, transform: 'scale(1.05)' }, transition: 'all 0.3s ease' }}>
          <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 2 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" component="h2">
              Admin
            </Typography>
            <Typography variant="body2">
              Manage patients and assign caregivers.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button size="small" component={Link} to="/login" variant="contained">
              Login as Admin
            </Button>
          </CardActions>
        </Card>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © 2026 SRMS. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;