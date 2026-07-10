import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Avatar,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Slider,
  Stack,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  Star,
  VideoCall,
  Schedule,
  LocationOn,
  School,
  Work,
  Language,
  Favorite,
  FavoriteBorder,
  Message,
  BookOnline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MotionCard = motion(Card);

const TutorSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([20, 100]);
  const [rating, setRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [bookingDialog, setBookingDialog] = useState(false);

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Engineering', 'Statistics', 'Economics', 'Psychology', 'English'
  ];

  const tutors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      avatar: 'S',
      subjects: ['Mathematics', 'Statistics'],
      rating: 4.9,
      reviews: 127,
      price: 45,
      experience: '8 years',
      education: 'PhD Mathematics, MIT',
      languages: ['English', 'Spanish'],
      availability: 'Mon-Fri, 9AM-6PM',
      description: 'Expert in calculus, linear algebra, and statistics. Passionate about making complex concepts accessible.',
      specializations: ['Calculus', 'Linear Algebra', 'Statistics'],
      hourlyRate: 45,
      totalStudents: 234,
      successRate: 98,
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      avatar: 'M',
      subjects: ['Physics', 'Engineering'],
      rating: 4.8,
      reviews: 89,
      price: 55,
      experience: '12 years',
      education: 'PhD Physics, Stanford',
      languages: ['English', 'Mandarin'],
      availability: 'Mon-Sun, Flexible',
      description: 'Specialized in quantum mechanics and engineering applications. Former NASA researcher.',
      specializations: ['Quantum Physics', 'Mechanical Engineering', 'Thermodynamics'],
      hourlyRate: 55,
      totalStudents: 156,
      successRate: 95,
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      avatar: 'E',
      subjects: ['Computer Science', 'Mathematics'],
      rating: 4.7,
      reviews: 203,
      price: 40,
      experience: '6 years',
      education: 'PhD Computer Science, Berkeley',
      languages: ['English', 'Portuguese'],
      availability: 'Mon-Fri, 2PM-10PM',
      description: 'Expert in algorithms, data structures, and software engineering. Industry experience at Google.',
      specializations: ['Algorithms', 'Data Structures', 'Machine Learning'],
      hourlyRate: 40,
      totalStudents: 312,
      successRate: 97,
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      avatar: 'J',
      subjects: ['Chemistry', 'Biology'],
      rating: 4.6,
      reviews: 76,
      price: 35,
      experience: '10 years',
      education: 'PhD Chemistry, Harvard',
      languages: ['English'],
      availability: 'Mon-Sat, 10AM-8PM',
      description: 'Specialized in organic chemistry and biochemistry. Published researcher with 50+ papers.',
      specializations: ['Organic Chemistry', 'Biochemistry', 'Molecular Biology'],
      hourlyRate: 35,
      totalStudents: 189,
      successRate: 94,
    },
  ];

  const handleBooking = (tutor: any) => {
    setSelectedTutor(tutor);
    setBookingDialog(true);
  };

  const confirmBooking = () => {
    toast.success(`Booking request sent to ${selectedTutor.name}!`);
    setBookingDialog(false);
    navigate('/booking');
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = !subject || tutor.subjects.includes(subject);
    const matchesPrice = tutor.price >= priceRange[0] && tutor.price <= priceRange[1];
    const matchesRating = !rating || tutor.rating >= rating;
    
    return matchesSearch && matchesSubject && matchesPrice && matchesRating;
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Find Your Perfect Tutor
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Connect with expert STEM tutors who can help you achieve your learning goals
          </Typography>
        </CardContent>
      </MotionCard>

      {/* Search and Filters */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={3}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterList sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filters
                </Typography>
              </Box>

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  placeholder="Search tutors or subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={subject}
                    label="Subject"
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <MenuItem value="">All Subjects</MenuItem>
                    {subjects.map((subj) => (
                      <MenuItem key={subj} value={subj}>{subj}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Price Range (per hour)
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(_, newValue) => setPriceRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    min={10}
                    max={150}
                    sx={{ mt: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">${priceRange[0]}</Typography>
                    <Typography variant="body2">${priceRange[1]}</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Minimum Rating
                  </Typography>
                  <Rating
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue || 0)}
                    size="large"
                  />
                </Box>
              </Stack>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} lg={9}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {filteredTutors.length} Tutors Found
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {filteredTutors.map((tutor, index) => (
              <Grid item xs={12} md={6} key={tutor.id}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
                        {tutor.avatar}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {tutor.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={tutor.rating} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {tutor.rating} ({tutor.reviews} reviews)
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {tutor.education}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <FavoriteBorder />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      {tutor.subjects.map((subject) => (
                        <Chip
                          key={subject}
                          label={subject}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {tutor.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                        <Work sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {tutor.experience}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <School sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {tutor.totalStudents} students
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                        <Language sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {tutor.languages.join(', ')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {tutor.availability}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          ${tutor.price}/hour
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tutor.successRate}% success rate
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Message />}
                        >
                          Message
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<BookOnline />}
                          onClick={() => handleBooking(tutor)}
                        >
                          Book Session
                        </Button>
                      </Stack>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Book Session with {selectedTutor?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Session Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rate: ${selectedTutor?.price}/hour
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Subjects: {selectedTutor?.subjects.join(', ')}
            </Typography>
          </Box>
          <Typography variant="body2">
            You'll be redirected to the booking page to select your preferred time and session type.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button onClick={confirmBooking} variant="contained">
            Continue to Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TutorSearch; 