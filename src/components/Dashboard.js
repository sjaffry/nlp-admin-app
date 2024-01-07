import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Button, Typography, Paper, List, ListItem, ListItemIcon, TextField, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard = ({
  filesListing,
  jwtToken,
  prefix
}) => {

  const [isCombining, setIsCombining] = useState(false);
  const [combinedFile, setCombinedFile] = useState(null);

  const handleCombineClick = async (jwtToken, prefix) => {
    setIsCombining(true);
    var file_prefix = prefix;
  
    try {
      const response = await fetch('https://88697n8lk5.execute-api.us-east-1.amazonaws.com/Prod/?prefix=' + file_prefix, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwtToken
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.text();
      setCombinedFile(responseData);
      setIsCombining(false);
  
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }  
  return (
    <Box>    
      <Box sx={{ display: 'flex', mb: 6, justifyContent: 'space-between' }}>
        <Paper sx={{ width: '50%', p: 2, borderColor: 'black', border: 0.3, mr: 3 }}>
          <Typography variant="h5" gutterBottom>Individual review files</Typography>
          <TextField 
            multiline
            variant="outlined" 
            InputProps={{
              readOnly: true,
            }}
            rows={12} 
            fullWidth 
            value={filesListing ? filesListing : ''}
          />
        </Paper>
        <Paper sx={{ width: '50%', p: 2, borderColor: 'black', border: 0.3, mr: 3 }}>
          <Typography variant="h5" gutterBottom>Combined reviews</Typography>
          <TextField 
            multiline
            variant="outlined" 
            InputProps={{
              readOnly: true,
            }}
            rows={12} 
            fullWidth 
            value={combinedFile ? combinedFile : ''}
          />
        </Paper>
      </Box>
      <Box sx={{ display: 'flex', mb: 6 }}>
        <Button 
          variant="contained" 
          disabled={filesListing == null || jwtToken == '' || isCombining}
          onClick= {() => handleCombineClick(jwtToken, prefix)}
          sx={
            {width: '30%', p: 2, 
            color: filesListing ? 'white' : '#1d2636', 
            backgroundColor: filesListing ? '#1d2636' : 'white',
            mr: 3
            }}> 
            Combine reviews
        </Button>
        {isCombining && <CircularProgress />}
        <Button 
          variant="contained" 
          disabled={filesListing == null || jwtToken == '' || isCombining}
          onClick= {() => setCombinedFile(null) }
          sx={
            {width: '20%', p: 2, 
            color: filesListing ? 'white' : '#1d2636', 
            backgroundColor: filesListing ? '#1d2636' : 'white',
            }}> 
            Clear
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
