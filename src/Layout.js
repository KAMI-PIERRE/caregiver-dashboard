import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

function Layout({ children }) {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SRMS System
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{ textTransform: 'none' }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/patient"
            startIcon={<PersonIcon />}
            sx={{ textTransform: 'none' }}
          >
            Patient
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            startIcon={<DashboardIcon />}
            sx={{ textTransform: 'none' }}
          >
            Caregiver
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/admin"
            startIcon={<AdminPanelSettingsIcon />}
            sx={{ textTransform: 'none' }}
          >
            Admin
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;