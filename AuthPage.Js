// src/app/AuthPage.js (or AuthPage.tsx)

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Tabs, Tab, AppBar } from '@mui/material';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      if (isLogin) {
        // Handle login
        console.log('Logging in with:', email, password);
      } else {
        // Handle signup
        console.log('Signing up with:', email, password);
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">{isLogin ? 'Sign In' : 'Sign Up'}</Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleAuth}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
