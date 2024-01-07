import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { List, ListItem, ListItemIcon, Box, Paper, TextField, Typography, Button, CircularProgress } from '@mui/material';
import { Link } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Sidepanel from './components/Sidepanel';
Amplify.configure(awsExports);


const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
});

const App = ({ signOut, user }) => {
  const [selectedTile, setSelectedTile] = useState(null);
  const [s3Prefix, setS3Prefix] = useState(null); 
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reviewDate, setReviewDate] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [filesListing, setFilesListing] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [externalData, setExternalData] = useState(null);
  const [subFolders, setSubFolders] = useState(null);
  const jwtToken = user.signInUserSession.idToken.jwtToken;

// Call page load API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await axios.get('https://becwe5ajfl.execute-api.us-east-1.amazonaws.com/Prod', {
          params: {
            prefix: 'transcribe-output'
          },           
          headers: {
            Authorization: jwtToken
          },
        });
        setExternalData(res.data);
        setErrorMsg(null);
      } catch (error) {
        console.error('Error:', error);
        setErrorMsg(error.message);
      }
    };

    fetchInitialData();

  }, []); 

  const handleTileClick = async (index, businessName) => {
    setSelectedTile(index);
    setFilesListing(null);
    const updatedPrefix = 'transcribe-output/' + businessName + '/';
    setS3Prefix(updatedPrefix);

    try {
      const res = await axios.get('https://becwe5ajfl.execute-api.us-east-1.amazonaws.com/Prod', {
        params: {
          prefix: updatedPrefix
        },           
        headers: {
          Authorization: jwtToken
        },
      });
      setFilesListing(res.data.data);
      setErrorMsg(null);
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg(error.message);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', bgcolor: 'white', height: '100vh' }}>
        <Button variant="contained" sx={{ position: 'absolute', top: 2, right: 2, backgroundColor: '#1d2636'}} onClick={signOut}>
          Logout
        </Button>
        <Sidepanel/>
        <Box sx={{ width: '80%', p: 2, overflow: 'auto' }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>Welcome {user.signInUserSession.idToken.payload.given_name}</Typography>
          {errorMsg && (
          <p style={{ color: 'red' }}>{errorMsg}</p>
          )}
          <Typography variant="h5" gutterBottom>Combine reviews</Typography>
          {externalData && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
            {externalData["data"].map((folder, index) => {
                    return (
                        <Button
                            key={index}
                            variant="contained"
                            sx={{
                                width: '30%',
                                p: 2,
                                backgroundColor: selectedTile === index ? '#1d2636' : 'white',
                                color: selectedTile === index ? 'white' : '#1d2636',
                                '&:hover': {
                                    backgroundColor: selectedTile === index ? '#1d2636' : 'white',
                                },
                            }}
                            onClick={() => handleTileClick(index, folder)}
                        >
                            {folder}
                        </Button>
                    );
            })}
          </Box>
          )}
          <Dashboard
            filesListing={filesListing}
            jwtToken={jwtToken}
            prefix={s3Prefix}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default withAuthenticator(App);

