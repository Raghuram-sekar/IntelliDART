import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import { 
  School, 
  VideoCall, 
  Assessment, 
  Work, 
  TrendingUp, 
  People,
  Star,
  ArrowForward,
  PlayCircle,
  MenuBook,
  TrackChanges,
  EmojiEvents
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Expert Tutors',
      description: 'Connect with qualified STEM tutors who specialize in your subjects.',
      color: '#2563eb',
    },
    {
      icon: <VideoCall sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Live Sessions',
      description: 'Interactive video sessions with real-time collaboration tools.',
      color: '#7c3aed',
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'AI Reports',
      description: 'Get personalized progress reports and learning recommendations.',
      color: '#10b981',
    },
    {
      icon: <Work sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Career Guidance',
      description: 'Explore career paths and get guidance for your future.',
      color: '#f59e0b',
    },
  ];

  const stats = [
    { number: '500+', label: 'Expert Tutors', icon: <People /> },
    { number: '10K+', label: 'Students', icon: <School /> },
    { number: '95%', label: 'Success Rate', icon: <TrendingUp /> },
    { number: '4.9', label: 'Rating', icon: <Star /> },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      avatar: 'S',
      text: 'IntelliDART helped me ace my algorithms course. The AI-powered recommendations were spot on!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Physics Major',
      avatar: 'M',
      text: 'The live tutoring sessions are incredible. My tutor explained complex concepts so clearly.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Mathematics Student',
      avatar: 'E',
      text: 'The personalized learning plan made all the difference. I improved my grades significantly!',
      rating: 5,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography variant="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Master STEM with
                  <Box component="span" sx={{ color: '#fbbf24', display: 'block' }}>
                    AI-Powered Learning
                  </Box>
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Connect with expert tutors, get personalized learning plans, and track your progress with intelligent insights.
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                    endIcon={<ArrowForward />}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'grey.300' } }}
                    startIcon={<PlayCircle />}
                  >
                    Watch Demo
                  </Button>
                </Stack>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                sx={{ textAlign: 'center' }}
              >
                <Box
                  sx={{
                    width: 400,
                    height: 300,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography variant="h4" sx={{ opacity: 0.8 }}>
                    Interactive Learning Platform
                  </Typography>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </MotionBox>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{ textAlign: 'center', p: 3 }}
                >
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </MotionBox>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Why Choose IntelliDART?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Our AI-powered platform combines expert tutoring with intelligent insights to accelerate your learning journey.
          </Typography>
        </MotionBox>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
              What Our Students Say
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          sx={{ 
            textAlign: 'center', 
            bgcolor: 'primary.main', 
            color: 'white',
            borderRadius: 4,
            p: 8,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          }}
        >
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Ready to Transform Your Learning?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students who are already achieving their goals with IntelliDART.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
              }}
              endIcon={<ArrowForward />}
            >
              Start Learning Today
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'grey.300' } }}
            >
              Learn More
            </Button>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Home; 