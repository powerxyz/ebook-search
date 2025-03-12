import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <MenuBookIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
            E-Book Search
          </RouterLink>
        </Typography>
        {isAuthenticated ? (
          <>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/search"
            >
              Search
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/history"
            >
              History
            </Button>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/login"
            >
              Login
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/register"
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 