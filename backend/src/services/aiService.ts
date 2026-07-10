import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock OpenAI API for now (replace with real OpenAI API key)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'mock-key';

interface AIAnalysisResult {
  score: number;
  insights: string[];
  recommendations: string[];
  confidence: number;
}

interface TutorMatchResult {
  tutorId: string;
  compatibilityScore: number;
  matchReason: string;
  strengths: string[];
  hourlyRate: number;
  rating: number;
  experience: number;
}

interface ProgressAnalysis {
  overallScore: number;
  subjectPerformance: Record<string, number>;
  trends: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextSteps: string[];
}

interface LearningPlan {
  timeline: string[];
  weeklySchedule: Record<string, string[]>;
  resources: string[];
  milestones: string[];
  practiceExercises: string[];
  estimatedCompletion: string;
}

interface CareerGuidance {
  careerPaths: string[];
  skillGaps: string[];
  recommendations: string[];
  timeline: string[];
  confidence: number;
}

export class AIService {
  private async callOpenAI(prompt: string): Promise<string> {
    // Mock AI response for now
    // In production, replace with actual OpenAI API call
    const mockResponses = {
      'tutor-matching': 'Based on the student profile, I recommend focusing on tutors with strong expertise in the requested subjects and compatible teaching styles.',
      'progress-analysis': 'The student shows consistent improvement in core subjects with particular strength in analytical thinking.',
      'learning-plan': 'A structured approach with daily practice sessions and weekly assessments would be most effective.',
      'career-guidance': 'Given the academic performance and interests, engineering and technology fields show strong potential.'
    };

    const responseType = Object.keys(mockResponses).find(type => prompt.includes(type)) || 'general';
    return mockResponses[responseType as keyof typeof mockResponses] || 'AI analysis completed successfully.';
  }

  async analyzeTutorCompatibility(
    studentId: string,
    subject: string,
    topic: string
  ): Promise<TutorMatchResult[]> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Find tutors with relevant expertise
    const tutors = await prisma.tutor.findMany({
      where: {
        expertise: { has: subject },
        isAvailable: true
      },
      include: { user: true }
    });

    const matches: TutorMatchResult[] = [];

    for (const tutor of tutors) {
      // Calculate compatibility score based on multiple factors
      let score = 0;
      const factors: string[] = [];

      // Subject expertise match
      if (tutor.expertise.includes(subject)) {
        score += 30;
        factors.push('Subject expertise');
      }

      // Rating consideration
      score += (tutor.rating - 3.5) * 10;
      factors.push(`Rating: ${tutor.rating.toFixed(1)}`);

      // Experience consideration
      score += Math.min(tutor.experience * 2, 20);
      factors.push(`Experience: ${tutor.experience} years`);

      // Learning style compatibility (if available)
      if (student.learningStyle && tutor.bio) {
        const learningStyleKeywords = {
          'Visual': ['visual', 'diagram', 'chart', 'graph'],
          'Auditory': ['audio', 'discussion', 'conversation', 'explanation'],
          'Kinesthetic': ['hands-on', 'practice', 'experiment', 'activity'],
          'Analytical': ['logical', 'step-by-step', 'systematic', 'analysis']
        };

        const styleKeywords = learningStyleKeywords[student.learningStyle as keyof typeof learningStyleKeywords] || [];
        const bioLower = tutor.bio.toLowerCase();
        const styleMatch = styleKeywords.some(keyword => bioLower.includes(keyword));
        
        if (styleMatch) {
          score += 15;
          factors.push('Learning style match');
        }
      }

      // Price consideration (lower price = higher score)
      const priceScore = Math.max(0, 20 - (tutor.hourlyRate - 500) / 50);
      score += priceScore;
      factors.push(`Price: ₹${tutor.hourlyRate}/hr`);

      // Availability and session history
      if (tutor.totalSessions > 100) {
        score += 10;
        factors.push('High experience');
      }

      // Normalize score to 0-100
      score = Math.max(0, Math.min(100, score));

      if (score > 50) { // Only include good matches
        matches.push({
          tutorId: tutor.id,
          compatibilityScore: score,
          matchReason: factors.join(', '),
          strengths: factors,
          hourlyRate: tutor.hourlyRate,
          rating: tutor.rating,
          experience: tutor.experience
        });
      }
    }

    // Sort by compatibility score
    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  async analyzeProgress(studentId: string): Promise<ProgressAnalysis> {
    const sessions = await prisma.session.findMany({
      where: { studentId },
      include: { tutor: { include: { user: true } } }
    });

    if (sessions.length === 0) {
      throw new Error('No sessions found for analysis');
    }

    // Calculate overall performance
    const totalSessions = sessions.length;
    const averageScore = sessions.reduce((sum, session) => sum + (session.score || 0), 0) / totalSessions;
    const averageRating = sessions.reduce((sum, session) => sum + session.rating, 0) / totalSessions;

    // Analyze subject performance
    const subjectPerformance: Record<string, number> = {};
    const subjectSessions: Record<string, any[]> = {};

    sessions.forEach(session => {
      if (!subjectSessions[session.subject]) {
        subjectSessions[session.subject] = [];
      }
      subjectSessions[session.subject].push(session);
    });

    Object.keys(subjectSessions).forEach(subject => {
      const scores = subjectSessions[subject].map(s => s.score || 0);
      subjectPerformance[subject] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    // Identify trends
    const recentSessions = sessions.slice(-5);
    const recentAvg = recentSessions.reduce((sum, session) => sum + (session.score || 0), 0) / recentSessions.length;
    const trends = [];
    
    if (recentAvg > averageScore + 5) {
      trends.push('Improving performance');
    } else if (recentAvg < averageScore - 5) {
      trends.push('Performance declining');
    } else {
      trends.push('Stable performance');
    }

    // Identify strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    Object.entries(subjectPerformance).forEach(([subject, score]) => {
      if (score >= 80) {
        strengths.push(`Strong performance in ${subject}`);
      } else if (score < 70) {
        weaknesses.push(`Needs improvement in ${subject}`);
      }
    });

    // Generate recommendations
    const recommendations: string[] = [];
    if (weaknesses.length > 0) {
      recommendations.push('Focus on improving weak subjects');
    }
    if (averageRating < 4) {
      recommendations.push('Consider trying different tutors for better learning experience');
    }
    if (totalSessions < 10) {
      recommendations.push('Increase session frequency for better progress');
    }

    const nextSteps = [
      'Continue with current study plan',
      'Schedule more sessions in weak subjects',
      'Review and revise study materials',
      'Take practice tests regularly'
    ];

    return {
      overallScore: averageScore,
      subjectPerformance,
      trends,
      strengths,
      weaknesses,
      recommendations,
      nextSteps
    };
  }

  async generateLearningPlan(studentId: string): Promise<LearningPlan> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const sessions = await prisma.session.findMany({
      where: { studentId }
    });

    // Analyze current level and goals
    const currentLevel = student.currentLevel || 'Intermediate';
    const targetScore = student.targetScore || 85;
    const learningStyle = student.learningStyle || 'Visual';

    // Generate personalized timeline
    const timeline = [
      'Week 1-2: Foundation review and assessment',
      'Week 3-6: Core concept strengthening',
      'Week 7-10: Advanced topic exploration',
      'Week 11-12: Practice and mock tests',
      'Week 13-14: Final preparation and review'
    ];

    // Create weekly schedule based on learning style
    const weeklySchedule: Record<string, string[]> = {
      'Monday': ['Theory review', 'Concept mapping'],
      'Tuesday': ['Practice problems', 'Problem-solving'],
      'Wednesday': ['Group study', 'Discussion'],
      'Thursday': ['Application exercises', 'Real-world examples'],
      'Friday': ['Assessment', 'Progress review'],
      'Saturday': ['Mock tests', 'Performance analysis'],
      'Sunday': ['Rest and reflection', 'Next week planning']
    };

    // Generate resources based on subjects and learning style
    const resources = [
      'Khan Academy for video tutorials',
      'Practice problem sets',
      'Interactive simulations',
      'Study group sessions',
      'Online quizzes and assessments'
    ];

    const milestones = [
      'Complete foundation review',
      'Master core concepts',
      'Achieve 80% in practice tests',
      'Complete advanced topics',
      'Reach target score'
    ];

    const practiceExercises = [
      'Daily problem-solving sessions',
      'Weekly mock tests',
      'Concept application exercises',
      'Peer teaching sessions',
      'Real-world problem analysis'
    ];

    return {
      timeline,
      weeklySchedule,
      resources,
      milestones,
      practiceExercises,
      estimatedCompletion: '14 weeks'
    };
  }

  async generateCareerGuidance(studentId: string): Promise<CareerGuidance> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const sessions = await prisma.session.findMany({
      where: { studentId }
    });

    // Analyze performance patterns
    const subjectScores: Record<string, number> = {};
    sessions.forEach(session => {
      if (!subjectScores[session.subject]) {
        subjectScores[session.subject] = 0;
      }
      subjectScores[session.subject] += session.score || 0;
    });

    // Calculate average scores
    Object.keys(subjectScores).forEach(subject => {
      const sessionsInSubject = sessions.filter(s => s.subject === subject).length;
      subjectScores[subject] = subjectScores[subject] / sessionsInSubject;
    });

    // Determine career paths based on performance and interests
    const careerPaths: string[] = [];
    const skillGaps: string[] = [];
    const recommendations: string[] = [];

    // Analyze strengths
    const strongSubjects = Object.entries(subjectScores)
      .filter(([_, score]) => score >= 80)
      .map(([subject, _]) => subject);

    const interests = student.interests || [];

    // Generate career recommendations
    if (strongSubjects.includes('Mathematics') && strongSubjects.includes('Physics')) {
      careerPaths.push('Engineering (Mechanical, Electrical, Civil)');
      careerPaths.push('Physics Research');
      careerPaths.push('Data Science');
    }

    if (strongSubjects.includes('Chemistry') && strongSubjects.includes('Biology')) {
      careerPaths.push('Medical Doctor');
      careerPaths.push('Biotechnology');
      careerPaths.push('Pharmaceutical Research');
    }

    if (strongSubjects.includes('Computer Science')) {
      careerPaths.push('Software Engineering');
      careerPaths.push('Data Science');
      careerPaths.push('Artificial Intelligence');
    }

    if (interests.includes('Medicine') || interests.includes('Healthcare')) {
      careerPaths.push('Medical Doctor');
      careerPaths.push('Nursing');
      careerPaths.push('Healthcare Administration');
    }

    if (interests.includes('Technology') || interests.includes('Programming')) {
      careerPaths.push('Software Development');
      careerPaths.push('Cybersecurity');
      careerPaths.push('Web Development');
    }

    // Identify skill gaps
    const weakSubjects = Object.entries(subjectScores)
      .filter(([_, score]) => score < 70)
      .map(([subject, _]) => subject);

    weakSubjects.forEach(subject => {
      skillGaps.push(`Improve ${subject} fundamentals`);
    });

    // Generate recommendations
    if (careerPaths.length > 0) {
      recommendations.push('Focus on subjects relevant to chosen career paths');
      recommendations.push('Gain practical experience through internships');
      recommendations.push('Network with professionals in target fields');
    }

    if (skillGaps.length > 0) {
      recommendations.push('Address skill gaps through focused study');
      recommendations.push('Seek additional tutoring in weak subjects');
    }

    const timeline = [
      'Complete current education level',
      'Prepare for entrance exams',
      'Apply to relevant programs',
      'Gain industry experience',
      'Pursue advanced education if needed'
    ];

    const confidence = Math.min(95, 70 + (strongSubjects.length * 5));

    return {
      careerPaths,
      skillGaps,
      recommendations,
      timeline,
      confidence
    };
  }
}

export const aiService = new AIService(); 