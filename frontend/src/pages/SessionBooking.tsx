import React from 'react';
import { Box, Typography } from '@mui/material';

const SessionBooking: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Book a Session
      </Typography>
      <Typography variant="body1">
        Schedule your tutoring session with our expert tutors.
      </Typography>
    </Box>
  );
};

export default SessionBooking; 