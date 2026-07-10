import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';

const Reports: React.FC = () => {
  const mockReports = [
    {
      id: 1,
      title: 'Learning Progress Report',
      type: 'PROGRESS',
      date: '2024-01-15',
      content: 'Your learning progress shows excellent improvement in Mathematics.',
    },
    {
      id: 2,
      title: 'Tutor Performance Analysis',
      type: 'PERFORMANCE',
      date: '2024-01-14',
      content: 'Analysis of your tutoring sessions and student feedback.',
    },
    {
      id: 3,
      title: 'Career Guidance Report',
      type: 'CAREER',
      date: '2024-01-13',
      content: 'Personalized career recommendations based on your interests.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          View your learning progress, performance analytics, and personalized insights.
        </Typography>

        <Grid container spacing={3}>
          {mockReports.map((report) => (
            <Grid item xs={12} md={6} lg={4} key={report.id}>
              <Card>
                <CardHeader
                  title={report.title}
                  subheader={`${report.type} • ${report.date}`}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {report.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Completed Mathematics session with Dr. Sarah Johnson
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Started new Physics course module
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Achieved 85% score in Chemistry quiz
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Reports; 