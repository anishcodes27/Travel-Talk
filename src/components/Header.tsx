import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

export default function Header() {
  return (
    <AppBar position="static" elevation={0} color="primary">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageIcon sx={{ mr: 1 }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            TravelTalk
          </Typography>
        </Box>
        
        <Typography 
          variant="subtitle1" 
          component="div" 
          sx={{ ml: 2, flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          Real-time Travel Translation
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
