import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Card, CardContent,
  CardActions, Chip, Stack,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './App.css';

const roles = [
  {
    icon: <PersonIcon sx={{ fontSize: 32 }} />,
    title: 'Patient',
    description: 'View your respiratory readings and current health status in real time.',
    color: '#2D9B6F',
    bg: '#E8F5EE',
    chip: 'Self-monitoring',
  },
  {
    icon: <DashboardIcon sx={{ fontSize: 32 }} />,
    title: 'Caregiver',
    description: "Monitor all assigned patients' respiratory rates with live alerts.",
    color: '#0077B6',
    bg: '#E0F2FE',
    chip: 'Live monitoring',
  },
  {
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />,
    title: 'Admin',
    description: 'Manage patients, register caregivers, and configure assignments.',
    color: '#7B3FA0',
    bg: '#F3E8FF',
    chip: 'System control',
  },
];

function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #EBF5FB 0%, #F0F4F8 50%, #EEF2FF 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
      className="fadeIn"
    >
      <Container maxWidth="md">
        {/* Hero */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 12px 32px rgba(0,119,182,0.25)',
            }}
          >
            <MonitorHeartIcon sx={{ color: 'white', fontSize: 38 }} />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.75rem' },
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #0077B6 0%, #023E8A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 2,
            }}
          >
            Smart Respiratory<br />Monitoring System
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 480, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.7 }}
          >
            Real-time respiratory rate monitoring for patients, caregivers, and
            healthcare administrators — powered by IoT and cloud.
          </Typography>
        </Box>

        {/* Role cards */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
        >
          {roles.map((role) => (
            <Card
              key={role.title}
              sx={{
                flex: 1,
                maxWidth: { sm: 260 },
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: `0 20px 40px ${role.color}22`,
                },
              }}
            >
              {/* Colored top strip */}
              <Box sx={{ height: 4, background: role.color }} />

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    backgroundColor: role.bg,
                    color: role.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  {role.icon}
                </Box>

                <Chip
                  label={role.chip}
                  size="small"
                  sx={{
                    backgroundColor: role.bg,
                    color: role.color,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    mb: 1.5,
                    height: 22,
                  }}
                />

                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {role.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                  {role.description}
                </Typography>
              </CardContent>

              <CardActions sx={{ px: 3, pb: 3 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: role.color,
                    '&:hover': {
                      backgroundColor: role.color,
                      filter: 'brightness(0.9)',
                      boxShadow: `0 6px 16px ${role.color}44`,
                    },
                  }}
                >
                  Login as {role.title}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: 'block', textAlign: 'center', mt: 6 }}
        >
          © {new Date().getFullYear()} SRMS · Smart Respiratory Monitoring System
        </Typography>
      </Container>
    </Box>
  );
}

export default Home;
