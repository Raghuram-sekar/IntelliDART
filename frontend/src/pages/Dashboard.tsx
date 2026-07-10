import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Badge,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert
} from '@mui/material';
import {
  EmojiEvents,
  TrackChanges,
  MenuBook,
  Notifications,
  MoreVert,
  Person,
  School,
  TrendingUp,
  Psychology,
  Work,
  Schedule,
  Star,
  VideoCall,
  Assessment,
  Lightbulb,
  Close
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TUTOR';
}

interface Student {
  id: string;
  grade: number;
  subjects: string[];
  learningStyle: string;
  targetScore: number;
  currentLevel: string;
  totalSessions: number;
  averageRating: number;
  studyHours: number;
}

interface Session {
  id: string;
  subject: string;
  topic: string;
  tutor: { name: string };
  scheduledTime: string;
  duration: number;
  status: string;
}

interface DetailedTutor {
  id: string;
  name: string;
  expertise: string[];
  subjects: string[];
  keywords: string[];
  bio: string;
  rating: number;
  experience: number;
  education: string;
  hourly_rate: number;
  total_sessions: number;
  total_students: number;
  availability: string;
  languages: string[];
  certifications: string[];
  sample_videos: string[];
  specializations: string[];
  match_score: number;
  reasons: string[];
  goals: string[];
}

// Professional helper functions for styling
const getPerformanceGradient = (level: string) => {
  switch (level.toLowerCase()) {
    case 'foundational':
      return 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)';
    case 'intermediate':
      return 'linear-gradient(135deg, #059669 0%, #047857 100%)';
    case 'advanced':
      return 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
    default:
      return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
  }
};

const getWeekGradient = (performanceLevel: string) => {
  const gradients = {
    'Foundational': 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    'Intermediate': 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    'Advanced': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
  };
  return gradients[performanceLevel as keyof typeof gradients] || gradients.Intermediate;
};

const getPerformanceBadgeColor = (performanceLevel: string) => {
  const colors = {
    'Foundational': '#2563eb',
    'Intermediate': '#059669',
    'Advanced': '#dc2626'
  };
  return colors[performanceLevel as keyof typeof colors] || colors.Intermediate;
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<DetailedTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [learningPlanDialogOpen, setLearningPlanDialogOpen] = useState(false);
  const [learningPlan, setLearningPlan] = useState<any>(null);
  const [learningPlanLoading, setLearningPlanLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<any>(null);
  const [weekDetailOpen, setWeekDetailOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dayDetailOpen, setDayDetailOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        // Instead of redirecting, show a login prompt
        setLoading(false);
        return;
      }

      // Fetch user profile
      console.log('Fetching user profile with token...');
      const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Profile response status:', userResponse.status);
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);

        // Fetch student data if user is a student
        if (userData.user.role === 'STUDENT') {
          const studentResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/students/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            setStudent(studentData.student);
          }

          // Fetch recent sessions
          const sessionsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/sessions/recent`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (sessionsResponse.ok) {
            const sessionsData = await sessionsResponse.json();
            setSessions(sessionsData.sessions);
          }
        }
      } else {
        // Token is invalid or expired
        console.log('Profile request failed, removing invalid token');
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear potentially invalid token
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const getAiRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_AI_SERVICE_URL}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: selectedTopic,
          student_id: user?.id || 'demo-student',
          student_profile: {
            id: user?.id || 'demo-student',
            grade: 12, // Default to grade 12, could be from user profile
            interests: selectedSubject ? [selectedSubject] : ['Mathematics', 'Science'],
            goals: ['Academic Excellence', 'College Preparation'],
            current_level: 'Intermediate', // Could be fetched from user profile
            average_rating: 4.2, // Student's average session rating
            total_sessions: 8, // Total tutoring sessions completed
            study_hours: 45, // Total study hours
            target_score: 85, // Target academic score
            recent_scores: [72, 78, 81, 75, 79], // Recent test/session scores
            weak_subjects: selectedSubject === 'Mathematics' ? ['Calculus', 'Statistics'] : 
                          selectedSubject === 'Physics' ? ['Quantum Mechanics'] :
                          selectedSubject === 'Chemistry' ? ['Organic Chemistry'] : [],
            strong_subjects: selectedSubject === 'Mathematics' ? ['Algebra', 'Geometry'] :
                           selectedSubject === 'Computer Science' ? ['Programming', 'Algorithms'] : []
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('AI recommendations received:', data);
        if (data.success && data.data && data.data.tutors) {
          setAiRecommendations(data.data.tutors);
          
          // Show AI status to user
          if (data.data.ai_powered) {
            console.log('🤖 Real AI (GPT-4) recommendations active!');
          } else {
            console.log('⚡ Using smart algorithmic matching (AI fallback)');
          }
          
          // Log detailed explanation
          if (data.data.matching_explanation) {
            console.log('📊 Matching Factors:', data.data.matching_explanation.scoring_factors);
          }
        } else {
          console.error('Invalid AI response format:', data);
          alert('Failed to get AI recommendations. Please try again.');
        }
      } else {
        console.error('AI service error:', response.status, response.statusText);
        alert('AI service is currently unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    }
  };

  const generateLearningPlan = async () => {
    setLearningPlanLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_AI_SERVICE_URL}/learning-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_data: {
            currentLevel: 'Intermediate',
            weakSubjects: selectedSubject === 'Mathematics' ? ['Calculus', 'Statistics'] : 
                         selectedSubject === 'Physics' ? ['Quantum Mechanics'] :
                         selectedSubject === 'Chemistry' ? ['Organic Chemistry'] : [],
            strongSubjects: selectedSubject === 'Mathematics' ? ['Algebra', 'Geometry'] :
                           selectedSubject === 'Computer Science' ? ['Programming', 'Algorithms'] : [],
            studyHours: 10,
            recentScores: { [selectedSubject || 'Mathematics']: [72, 78, 81, 75, 79] }
          },
          subject: selectedSubject || 'Mathematics',
          goals: ['Academic Excellence', 'College Preparation', 'Skill Mastery'],
          timeframe: '8 weeks'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Learning plan generated:', data);
        if (data.success && data.plan) {
          setLearningPlan(data.plan);
          setLearningPlanDialogOpen(true);
        } else {
          alert('Failed to generate learning plan. Please try again.');
        }
      } else {
        alert('AI service is currently unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating learning plan:', error);
      alert('Error generating learning plan. Please check your connection.');
    } finally {
      setLearningPlanLoading(false);
    }
  };

  const generateProgressReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/progress-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Handle progress report data
        console.log('Progress Report:', data);
      }
    } catch (error) {
      console.error('Error generating progress report:', error);
    }
  };

  const generateCareerGuidance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/career-guidance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Handle career guidance data
        console.log('Career Guidance:', data);
      }
    } catch (error) {
      console.error('Error generating career guidance:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
        <Card sx={{ maxWidth: 400, p: 4 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <Person />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                IntelliDART
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                STEM Tutor Marketplace
              </Typography>
            </Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please log in to access your dashboard
            </Alert>
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={() => window.location.href = '/login'}
              sx={{ mb: 2 }}
            >
              Go to Login
            </Button>
            <Button 
              variant="outlined" 
              fullWidth 
              size="large"
              onClick={() => window.location.href = '/register'}
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Mock data for charts (replace with real data)
  const progressData = [
    { week: 'Week 1', score: 65 },
    { week: 'Week 2', score: 72 },
    { week: 'Week 3', score: 78 },
    { week: 'Week 4', score: 85 },
    { week: 'Week 5', score: 88 },
    { week: 'Week 6', score: 92 }
  ];

  const subjectData = [
    { name: 'Mathematics', value: 35, color: '#8884d8' },
    { name: 'Physics', value: 25, color: '#82ca9d' },
    { name: 'Chemistry', value: 20, color: '#ffc658' },
    { name: 'Biology', value: 15, color: '#ff7300' },
    { name: 'Computer Science', value: 5, color: '#00ff00' }
  ];

  const upcomingSessions = sessions.slice(0, 3).map(session => ({
    id: session.id,
    tutor: session.tutor.name,
    subject: session.subject,
    topic: session.topic,
    time: new Date(session.scheduledTime).toLocaleString(),
    duration: session.duration,
    type: 'Live Session'
  }));

  const achievements = [
    {
      icon: <EmojiEvents sx={{ color: 'gold' }} />,
      title: 'Perfect Score',
      description: 'Aced your Calculus quiz',
      time: '2 hours ago'
    },
    {
      icon: <TrendingUp sx={{ color: 'green' }} />,
      title: 'Study Streak',
      description: '7 days of consistent study',
      time: '1 day ago'
    },
    {
      icon: <Star sx={{ color: 'purple' }} />,
      title: 'Tutor Feedback',
      description: 'Excellent progress in Physics',
      time: '3 days ago'
    }
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              IntelliDART
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            p: 3,
            mb: 3,
            color: 'white'
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            Welcome back, {user.name}!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {user.role === 'STUDENT' ? 'Student' : 'Tutor'} • {student?.currentLevel || 'Advanced'} Level
          </Typography>
          {student && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {student.subjects.slice(0, 3).map((subject, index) => (
                <Chip
                  key={index}
                  label={subject}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              ))}
            </Box>
          )}
        </Box>
      </motion.div>

      {/* AI Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb /> AI-Powered Features
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setAiDialogOpen(true)}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  <Psychology sx={{ mr: 1 }} />
                  AI Tutor Matching
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={generateProgressReport}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  <Assessment sx={{ mr: 1 }} />
                  Progress Analysis
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={generateLearningPlan}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  <School sx={{ mr: 1 }} />
                  Learning Plan
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={generateCareerGuidance}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  <Work sx={{ mr: 1 }} />
                  Career Guidance
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Sessions
                    </Typography>
                    <Typography variant="h4">
                      {student?.totalSessions || 45}
                    </Typography>
                    <Chip label="+12%" color="success" size="small" />
                  </Box>
                  <VideoCall sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Average Rating
                    </Typography>
                    <Typography variant="h4">
                      {student?.averageRating?.toFixed(1) || '4.8'}
                    </Typography>
                    <Chip label="+0.2" color="success" size="small" />
                  </Box>
                  <Star sx={{ fontSize: 40, color: 'success.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Study Hours
                    </Typography>
                    <Typography variant="h4">
                      {student?.studyHours || 120}
                    </Typography>
                    <Chip label="+8h" color="primary" size="small" />
                  </Box>
                  <Schedule sx={{ fontSize: 40, color: 'purple' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Subjects
                    </Typography>
                    <Typography variant="h4">
                      {student?.subjects?.length || 3}
                    </Typography>
                    <Chip label="+1" color="warning" size="small" />
                  </Box>
                  <MenuBook sx={{ fontSize: 40, color: 'orange' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ 
              p: 3, 
              height: '100%',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#111827', 
                    mb: 1,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}
                >
                  Academic Performance Analytics
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: { xs: '0.875rem', sm: '0.875rem' }
                  }}
                >
                  Comprehensive grade tracking and performance insights
                </Typography>
              </Box>
              
              {/* Current Semester Overview */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                      3.7
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>Current GPA</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>↗ +0.2</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                      87th
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>Percentile</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>↗ +5</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                      A-
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>Avg Grade</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>↗ B+ → A-</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                      18
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>Credit Hours</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>Full Load</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              {/* Subject Performance with Grade History */}
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
                Subject Performance & Grade Trends
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>Linear Algebra (MATH 2210)</Typography>
                    <Chip label="A" size="small" sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 600 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>Previous: B+ → A</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>94%</Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={94} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#059669',
                      borderRadius: 3
                    }
                  }} 
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>Data Structures (CS 2420)</Typography>
                    <Chip label="A-" size="small" sx={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 600 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>Previous: B → A-</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e40af' }}>89%</Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={89} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#1e40af',
                      borderRadius: 3
                    }
                  }} 
                />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>Physics II (PHYS 2220)</Typography>
                    <Chip label="B+" size="small" sx={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 600 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: '#dc2626' }}>Previous: A- → B+</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400e' }}>83%</Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={83} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#92400e',
                      borderRadius: 3
                    }
                  }} 
                />
              </Box>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card sx={{ 
              p: 3, 
              height: '100%',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 3 }}>
                Performance Insights & Benchmarks
              </Typography>
              
              {/* Percentile Comparison */}
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                  Class Ranking
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                  87th Percentile
                </Typography>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                  ↗ Improved from 82nd percentile
                </Typography>
              </Box>
              
              {/* Semester Comparison */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', mb: 2 }}>
                  Semester-over-Semester Progress
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>Fall 2023</Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>Spring 2024</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#6b7280' }}>3.5 GPA</Typography>
                  <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600 }}>→ +0.2</Typography>
                  <Typography variant="h6" sx={{ color: '#111827', fontWeight: 600 }}>3.7 GPA</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2, backgroundColor: '#e5e7eb' }} />
              
              {/* Strengths and Areas for Improvement */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', mb: 1 }}>Academic Strengths</Typography>
                <Chip label="Mathematical Analysis" size="small" sx={{ mr: 1, mb: 1, backgroundColor: '#dcfce7', color: '#166534' }} />
                <Chip label="Problem Solving" size="small" sx={{ mr: 1, mb: 1, backgroundColor: '#dcfce7', color: '#166534' }} />
              </Box>
              
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', mb: 1 }}>Growth Opportunities</Typography>
                <Chip label="Physics Applications" size="small" sx={{ mr: 1, mb: 1, backgroundColor: '#fef3c7', color: '#92400e' }} />
                <Chip label="Time Management" size="small" sx={{ mr: 1, mb: 1, backgroundColor: '#fef3c7', color: '#92400e' }} />
              </Box>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Weekly Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card sx={{ mt: 3, p: 3, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827', mb: 3 }}>
            Academic Progress Trend Analysis
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="week" 
                stroke="#6b7280" 
                tick={{ fill: '#6b7280', fontSize: 11 }}
                interval={0}
              />
              <YAxis 
                stroke="#6b7280" 
                tick={{ fill: '#6b7280', fontSize: 11 }}
                width={40}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#111827',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#1e40af" 
                strokeWidth={2}
                dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#1e40af', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Weekly insights */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={4} sm={4}>
              <Box sx={{ 
                textAlign: 'center', 
                p: { xs: 1.5, sm: 2 }, 
                backgroundColor: '#f9fafb', 
                borderRadius: 2, 
                border: '1px solid #e5e7eb' 
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#111827', 
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  +15 pts
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  Weekly Improvement
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Box sx={{ 
                textAlign: 'center', 
                p: { xs: 1.5, sm: 2 }, 
                backgroundColor: '#f9fafb', 
                borderRadius: 2, 
                border: '1px solid #e5e7eb' 
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#111827', 
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  3 Weeks
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  Consecutive Growth
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Box sx={{ 
                textAlign: 'center', 
                p: { xs: 1.5, sm: 2 }, 
                backgroundColor: '#f9fafb', 
                borderRadius: 2, 
                border: '1px solid #e5e7eb' 
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#111827', 
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  95%
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  Semester Target
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </motion.div>

      {/* Bottom Sections */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Upcoming Sessions</Typography>
                  <Button size="small">View All</Button>
                </Box>
                <List>
                  {upcomingSessions.map((session, index) => (
                    <React.Fragment key={session.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {session.tutor.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={`${session.subject} - ${session.tutor}`}
                          secondary={`${session.time} • ${session.duration} min`}
                        />
                        <Chip label={session.type} color="primary" size="small" />
                      </ListItem>
                      {index < upcomingSessions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Achievements
                </Typography>
                <List>
                  {achievements.map((achievement, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {achievement.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={achievement.title}
                          secondary={achievement.description}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {achievement.time}
                        </Typography>
                      </ListItem>
                      {index < achievements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* AI Tutor Matching Dialog */}
      <Dialog open={aiDialogOpen} onClose={() => setAiDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">AI-Powered Tutor Matching</Typography>
            <IconButton onClick={() => setAiDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Subject
              </Typography>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Topic
              </Typography>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="Enter specific topic"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={getAiRecommendations}
            disabled={!selectedSubject || !selectedTopic}
            fullWidth
          >
            Get AI Recommendations
          </Button>
          
          {aiRecommendations.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology color="primary" />
                AI-Matched Tutors ({aiRecommendations.length} found)
              </Typography>
              {aiRecommendations.map((tutor, index) => (
                <Card key={index} sx={{ mb: 3, overflow: 'hidden' }}>
                  {/* Header with Match Score */}
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {tutor.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {tutor.education}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {tutor.match_score}%
                      </Typography>
                      <Typography variant="caption">Match Score</Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {/* Bio Section */}
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                      {tutor.bio}
                    </Typography>

                    {/* Key Stats Row */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Star sx={{ color: '#ffc107', mb: 0.5 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {tutor.rating}
                          </Typography>
                          <Typography variant="caption">Rating</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Work sx={{ color: '#4caf50', mb: 0.5 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {tutor.experience}y
                          </Typography>
                          <Typography variant="caption">Experience</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <School sx={{ color: '#2196f3', mb: 0.5 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {tutor.total_students}
                          </Typography>
                          <Typography variant="caption">Students</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <VideoCall sx={{ color: '#ff9800', mb: 0.5 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {tutor.total_sessions}
                          </Typography>
                          <Typography variant="caption">Sessions</Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Expertise & Specializations */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        🎯 Expertise & Specializations
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        {tutor.expertise.map((skill, i) => (
                          <Chip 
                            key={i} 
                            label={skill} 
                            color="primary" 
                            variant="outlined" 
                            size="small"
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tutor.specializations?.map((spec, i) => (
                          <Chip 
                            key={i} 
                            label={spec} 
                            color="secondary" 
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Match Reasons */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ✨ Why This Tutor Matches You
                      </Typography>
                      <List dense>
                        {tutor.reasons?.map((reason, i) => (
                          <ListItem key={i} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <Lightbulb sx={{ fontSize: 16, color: '#4caf50' }} />
                            </ListItemIcon>
                            <ListItemText primary={reason} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    {/* Additional Details */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>💰 Hourly Rate</Typography>
                        <Typography variant="body1">${tutor.hourly_rate}/hour</Typography>
                        
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>🌍 Languages</Typography>
                        <Typography variant="body2">{tutor.languages?.join(', ') || 'English'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>⏰ Availability</Typography>
                        <Typography variant="body2">{tutor.availability || 'Contact for schedule'}</Typography>
                        
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>🏆 Certifications</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {tutor.certifications?.join(', ') || 'Professional qualifications verified'}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        startIcon={<VideoCall />}
                        onClick={() => alert(`Booking session with ${tutor.name}...`)}
                      >
                        Book Session
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<Assessment />}
                        onClick={() => alert(`Viewing ${tutor.name}'s sample videos...`)}
                      >
                        View Samples
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<Person />}
                        onClick={() => alert(`Viewing ${tutor.name}'s full profile...`)}
                      >
                        Full Profile
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Learning Plan Generation Button */}
      <Box sx={{ position: 'fixed', bottom: 80, right: 20, zIndex: 1000 }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<School />}
          onClick={generateLearningPlan}
          disabled={learningPlanLoading}
          sx={{
            borderRadius: '25px',
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(156, 39, 176, 0.4)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {learningPlanLoading ? 'Generating...' : 'Generate Learning Plan'}
        </Button>
      </Box>

      {/* Learning Plan Dialog */}
      <Dialog 
        open={learningPlanDialogOpen} 
        onClose={() => setLearningPlanDialogOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
              🎯 AI-Generated Learning Plan
            </Typography>
            <IconButton onClick={() => setLearningPlanDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {learningPlan && (
            <Box sx={{ mt: 1 }}>
              
              <Card sx={{ 
                mb: 4, 
                p: 4, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
                  Professional Learning Strategy
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, opacity: 0.9 }}>
                        {learningPlan.total_weeks}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Weeks</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, opacity: 0.9 }}>
                        {learningPlan.subject}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Subject</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, opacity: 0.9 }}>
                        {learningPlan.student_level}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Level</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, opacity: 0.9 }}>
                        {learningPlan.weekly_plan?.length || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Phases</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              {/* Professional Weekly Plan with Drill-down */}
              <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Box sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    Adaptive Learning Roadmap
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 0 }}>
                    Click on any week to view detailed daily breakdown
                  </Typography>
                </Box>
                
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {learningPlan.weekly_plan.map((week: any, index: number) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card 
                          sx={{ 
                            p: 0,
                            borderRadius: 2,
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                              borderColor: '#667eea'
                            }
                          }}
                          onClick={() => {
                            setSelectedWeek(week);
                            setWeekDetailOpen(true);
                          }}
                        >
                          {/* Week Header */}
                          <Box sx={{ 
                            p: 3,
                            background: getWeekGradient(week.performance_level),
                            color: 'white',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8
                          }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                              Week {week.week}: {week.phase}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              {week.approach} • {week.estimated_hours}h/week
                            </Typography>
                          </Box>
                          
                          {/* Week Content */}
                          <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Chip 
                                label={week.performance_level}
                                size="small"
                                sx={{ 
                                  mr: 2,
                                  backgroundColor: getPerformanceBadgeColor(week.performance_level),
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {week.total_tasks} tasks planned
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" sx={{ color: '#374151', mb: 2, lineHeight: 1.6 }}>
                              {week.week_summary?.primary_focus}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                Click to view daily breakdown
                              </Typography>
                              <IconButton size="small" sx={{ color: '#667eea' }}>
                                <Assessment />
                              </IconButton>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Card>

              {/* Daily Schedule */}
              <Card sx={{ mb: 3, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                  📆 Daily Study Schedule
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(learningPlan.daily_schedule).map(([day, schedule]: [string, any]) => (
                    <Grid item xs={12} sm={6} md={4} key={day}>
                      <Card sx={{ p: 2, backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                          {day}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                          ⏰ {schedule.duration}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976d2', mb: 1 }}>
                          {schedule.focus}
                        </Typography>
                        {schedule.activities.map((activity: string, i: number) => (
                          <Typography key={i} variant="caption" sx={{ display: 'block', color: '#6c757d' }}>
                            • {activity}
                          </Typography>
                        ))}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>

              {/* Resources */}
              <Card sx={{ mb: 3, p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                  📚 Recommended Resources
                </Typography>
                <Grid container spacing={3}>
                  {Object.entries(learningPlan.resources).map(([category, items]: [string, any]) => (
                    <Grid item xs={12} sm={6} md={4} key={category}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#495057', mb: 2, textTransform: 'capitalize' }}>
                          {category.replace('_', ' ')}
                        </Typography>
                        {items.map((item: string, i: number) => (
                          <Typography key={i} variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                            • {item}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>

              {/* Assessment Plan */}
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                  📝 Assessment Schedule
                </Typography>
                <Grid container spacing={2}>
                  {learningPlan.assessments.map((assessment: any, index: number) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card sx={{ p: 2, backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#856404', mb: 1 }}>
                          {assessment.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#856404', mb: 1 }}>
                          📅 Week {assessment.week} • {assessment.format}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#856404' }}>
                          ⏱️ {assessment.duration} • Weight: {assessment.weight}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLearningPlanDialogOpen(false)} variant="outlined">
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Assessment />}
            onClick={() => alert('Learning plan saved to your profile!')}
          >
            Save Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Professional Week Detail Dialog */}
      <Dialog 
        open={weekDetailOpen} 
        onClose={() => setWeekDetailOpen(false)} 
        maxWidth="xl" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '90vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Week {selectedWeek?.week}: {selectedWeek?.phase}
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                {selectedWeek?.approach} • {selectedWeek?.performance_level} Level
              </Typography>
            </Box>
            <IconButton onClick={() => setWeekDetailOpen(false)} sx={{ color: '#64748b' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedWeek && (
            <Box sx={{ mt: 2 }}>
              {/* Week Summary */}
              <Card sx={{ 
                mb: 4, 
                p: 4, 
                background: getWeekGradient(selectedWeek.performance_level),
                color: 'white',
                borderRadius: 3
              }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, opacity: 0.9 }}>
                      Primary Focus
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {selectedWeek.week_summary?.primary_focus}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, opacity: 0.9 }}>
                      Key Outcomes
                    </Typography>
                    {selectedWeek.week_summary?.key_outcomes?.map((outcome: string, i: number) => (
                      <Typography key={i} variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                        • {outcome}
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, opacity: 0.9 }}>
                      Success Metrics
                    </Typography>
                    {selectedWeek.week_summary?.success_metrics?.map((metric: string, i: number) => (
                      <Typography key={i} variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                        ✓ {metric}
                      </Typography>
                    ))}
                  </Grid>
                </Grid>
              </Card>

              {/* Daily Breakdown */}
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                Daily Learning Schedule
              </Typography>
              <Grid container spacing={3}>
                {selectedWeek.daily_plans && Object.entries(selectedWeek.daily_plans).map(([day, plan]: [string, any]) => (
                  <Grid item xs={12} sm={6} md={4} key={day}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                          borderColor: getPerformanceBadgeColor(selectedWeek.performance_level)
                        }
                      }}
                      onClick={() => {
                        setSelectedDay(day);
                        setDayDetailOpen(true);
                      }}
                    >
                      {/* Day Header */}
                      <Box sx={{ 
                        p: 2,
                        background: `linear-gradient(135deg, ${getPerformanceBadgeColor(selectedWeek.performance_level)}22 0%, ${getPerformanceBadgeColor(selectedWeek.performance_level)}11 100%)`,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                          {day}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {plan.estimated_hours}h • {plan.primary_focus}
                        </Typography>
                      </Box>
                      
                      {/* Day Content Preview */}
                      <Box sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ color: '#374151', mb: 2, fontWeight: 500 }}>
                          {plan.tasks?.length || 0} tasks planned
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Top Tasks
                          </Typography>
                          {plan.tasks?.slice(0, 2).map((task: string, i: number) => (
                            <Typography key={i} variant="body2" sx={{ color: '#4b5563', mt: 1, fontSize: '0.85rem' }}>
                              • {task}
                            </Typography>
                          ))}
                          {plan.tasks?.length > 2 && (
                            <Typography variant="caption" sx={{ color: '#9ca3af', mt: 1, display: 'block' }}>
                              +{plan.tasks.length - 2} more tasks...
                            </Typography>
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            Click for details
                          </Typography>
                          <Chip 
                            label={plan.assessment}
                            size="small"
                            sx={{ 
                              backgroundColor: `${getPerformanceBadgeColor(selectedWeek.performance_level)}22`,
                              color: getPerformanceBadgeColor(selectedWeek.performance_level),
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setWeekDetailOpen(false)} variant="outlined" sx={{ mr: 2 }}>
            Close
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              background: selectedWeek ? getWeekGradient(selectedWeek.performance_level) : 'primary',
              '&:hover': { opacity: 0.9 }
            }}
            onClick={() => alert('Week plan saved to your schedule!')}
          >
            Add to Calendar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Professional Day Detail Dialog */}
      <Dialog 
        open={dayDetailOpen} 
        onClose={() => setDayDetailOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '85vh'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {selectedDay} - Detailed Plan
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Week {selectedWeek?.week}: {selectedWeek?.phase}
              </Typography>
            </Box>
            <IconButton onClick={() => setDayDetailOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDay && selectedWeek?.daily_plans?.[selectedDay] && (
            <Box sx={{ mt: 2 }}>
              {(() => {
                const dayPlan = selectedWeek.daily_plans[selectedDay];
                return (
                  <>
                    {/* Day Overview */}
                    <Card sx={{ 
                      mb: 3, 
                      p: 3, 
                      background: `linear-gradient(135deg, ${getPerformanceBadgeColor(selectedWeek.performance_level)}22 0%, ${getPerformanceBadgeColor(selectedWeek.performance_level)}11 100%)`,
                      borderRadius: 3
                    }}>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                            {dayPlan.estimated_hours} Hours
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>Estimated Time</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                            {dayPlan.tasks?.length || 0} Tasks
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>Planned Activities</Typography>
                        </Grid>
                      </Grid>
                      <Typography variant="body1" sx={{ color: '#374151', mt: 2, fontWeight: 500 }}>
                        Focus: {dayPlan.primary_focus}
                      </Typography>
                    </Card>

                    {/* Goals */}
                    <Card sx={{ mb: 3, p: 3, borderRadius: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                        Daily Goals
                      </Typography>
                      {dayPlan.goals?.map((goal: string, i: number) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            backgroundColor: getPerformanceBadgeColor(selectedWeek.performance_level),
                            mr: 2
                          }} />
                          <Typography variant="body1" sx={{ color: '#374151' }}>
                            {goal}
                          </Typography>
                        </Box>
                      ))}
                    </Card>

                    {/* Tasks */}
                    <Card sx={{ mb: 3, p: 3, borderRadius: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                        Scheduled Tasks
                      </Typography>
                      {dayPlan.tasks?.map((task: string, i: number) => (
                        <Box key={i} sx={{ 
                          p: 2, 
                          mb: 2, 
                          backgroundColor: '#f8fafc', 
                          borderRadius: 2,
                          border: '1px solid #e2e8f0'
                        }}>
                          <Typography variant="body1" sx={{ color: '#374151', fontWeight: 500 }}>
                            {i + 1}. {task}
                          </Typography>
                        </Box>
                      ))}
                    </Card>

                    {/* Resources & Assessment */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                            Resources
                          </Typography>
                          {dayPlan.resources?.map((resource: string, i: number) => (
                            <Typography key={i} variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                              • {resource}
                            </Typography>
                          ))}
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                            Assessment
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#374151' }}>
                            {dayPlan.assessment}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </>
                );
              })()}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDayDetailOpen(false)} variant="outlined">
            Close
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              background: selectedWeek ? getWeekGradient(selectedWeek.performance_level) : 'primary',
              '&:hover': { opacity: 0.9 }
            }}
          >
            Mark Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 