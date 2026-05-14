import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Divider, Tooltip, useMediaQuery, useTheme, Chip,
} from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LoginIcon from '@mui/icons-material/Login';

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED = 64;

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const isLoggedIn = !!token;

  // Pages that use the sidebar layout (logged-in pages)
  const useSidebar = isLoggedIn && !['/login', '/register', '/'].includes(location.pathname);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const roleColor = {
    admin: 'error',
    caregiver: 'primary',
    patient: 'success',
  }[role] || 'default';

  const roleLabel = {
    admin: 'Admin',
    caregiver: 'Caregiver',
    patient: 'Patient',
  }[role] || '';

  // Nav items per role
  const navItems = [
    ...(role === 'patient' ? [
      { label: 'My Status', icon: <PersonIcon />, path: '/patient' },
    ] : []),
    ...(role === 'caregiver' || role === 'admin' ? [
      { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ] : []),
    ...(role === 'admin' ? [
      { label: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin' },
    ] : []),
  ];

  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          px: collapsed ? 1 : 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minHeight: 64,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <MonitorHeartIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        {!collapsed && (
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main" lineHeight={1.2}>
              SRMS
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              Monitoring System
            </Typography>
          </Box>
        )}
      </Box>

      {/* User info */}
      {isLoggedIn && (
        <Box
          sx={{
            px: collapsed ? 1 : 2.5,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {username ? username[0].toUpperCase() : '?'}
          </Avatar>
          {!collapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                sx={{ color: 'text.primary' }}
              >
                {username}
              </Typography>
              <Chip
                label={roleLabel}
                color={roleColor}
                size="small"
                sx={{ height: 18, fontSize: '0.65rem', mt: 0.25 }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Nav items */}
      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Tooltip
              key={item.path}
              title={collapsed ? item.label : ''}
              placement="right"
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    borderRadius: '10px',
                    px: collapsed ? 1.5 : 2,
                    py: 1,
                    minHeight: 44,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    backgroundColor: active ? 'rgba(0,119,182,0.1)' : 'transparent',
                    color: active ? 'primary.main' : 'text.secondary',
                    borderLeft: active ? '3px solid' : '3px solid transparent',
                    borderColor: active ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0,119,182,0.06)',
                      color: 'primary.main',
                    },
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 36,
                      color: 'inherit',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: active ? 600 : 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      {/* Bottom actions */}
      <Box sx={{ px: 1, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        {isLoggedIn ? (
          <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '10px',
                px: collapsed ? 1.5 : 2,
                py: 1,
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: 'error.main',
                '&:hover': { backgroundColor: 'rgba(211,47,47,0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: 'inherit', justifyContent: 'center' }}>
                <LogoutIcon />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ) : (
          <Tooltip title={collapsed ? 'Login' : ''} placement="right">
            <ListItemButton
              component={Link}
              to="/login"
              sx={{
                borderRadius: '10px',
                px: collapsed ? 1.5 : 2,
                py: 1,
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: 'primary.main',
                '&:hover': { backgroundColor: 'rgba(0,119,182,0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: 'inherit', justifyContent: 'center' }}>
                <LoginIcon />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary="Login"
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  // Public pages (Home, Login, Register) — simple top bar only
  if (!useSidebar) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
              }}
            >
              <MonitorHeartIcon sx={{ color: 'white', fontSize: 18 }} />
            </Box>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                flexGrow: 1,
                letterSpacing: '-0.01em',
              }}
            >
              SRMS
            </Typography>
            <Tooltip title="Home">
              <IconButton component={Link} to="/" color="inherit" size="small">
                <HomeIcon />
              </IconButton>
            </Tooltip>
            {!isLoggedIn && (
              <Tooltip title="Login">
                <IconButton component={Link} to="/login" color="primary" size="small">
                  <LoginIcon />
                </IconButton>
              </Tooltip>
            )}
            {isLoggedIn && (
              <Tooltip title="Logout">
                <IconButton onClick={handleLogout} color="error" size="small">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    );
  }

  // Authenticated pages — sidebar layout
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile top bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
            zIndex: (t) => t.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '7px',
                background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
              }}
            >
              <MonitorHeartIcon sx={{ color: 'white', fontSize: 16 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ flexGrow: 1 }}>
              SRMS
            </Typography>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
              {username ? username[0].toUpperCase() : '?'}
            </Avatar>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              borderRight: '1px solid',
              borderColor: 'divider',
              backgroundColor: '#FFFFFF',
              transition: 'width 0.2s ease',
              overflowX: 'hidden',
            },
          }}
        >
          {/* Collapse toggle */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: -12,
              zIndex: 10,
            }}
          >
            <IconButton
              size="small"
              onClick={() => setCollapsed(!collapsed)}
              sx={{
                width: 24,
                height: 24,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 1,
                '&:hover': { backgroundColor: 'primary.light', color: 'white' },
              }}
            >
              <MenuIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              backgroundColor: '#FFFFFF',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: isMobile ? 8 : 0,
          backgroundColor: 'background.default',
          minHeight: '100vh',
          transition: 'margin 0.2s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
