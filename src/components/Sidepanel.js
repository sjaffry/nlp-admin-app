import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';

const Sidepanel = ({
  }) => {
    return (
        <Box component={Paper} sx={{ width: '20%', p: 2, height: '100%', bgcolor: '#1d2636', color: 'white' }}>
        <Typography variant="h4" gutterBottom color='#6366F1'>Admin</Typography>
        <List>
            <ListItem sx={{ mb: 2 }}>
            <ListItemIcon><EventRepeatIcon sx={{ color: 'white' }}/></ListItemIcon>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                Manual execution
            </Link>
            </ListItem>
            <ListItem sx={{ mb: 2 }}>
            <ListItemIcon><LocalActivityIcon sx={{ color: 'white' }}/></ListItemIcon>
            <Link to="/Events_summary" style={{ color: 'white', textDecoration: 'none' }}>
                Setup
            </Link>
            </ListItem>
            <ListItem sx={{ mb: 2 }}>
            <ListItemIcon><AssignmentIcon sx={{ color: 'white' }}/></ListItemIcon>
            <Link to="/Ad_hoc_summary" style={{ color: 'white', textDecoration: 'none' }}>
                Users
            </Link>
            </ListItem>
        </List>
        </Box>
    );};

    export default Sidepanel;