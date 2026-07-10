import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiService } from '../services/aiService';

const prisma = new PrismaClient();

// AI-powered tutor recommendations
export const getTutorRecommendations = async (req: Request, res: Response) => {
  try {
    const { subject, topic } = req.body;
    const userId = (req as any).user.id;

    // Get student ID from user
    const student = await prisma.student.findFirst({
      where: { userId },
      include: { user: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Use AI service for intelligent matching
    const recommendations = await aiService.analyzeTutorCompatibility(
      student.id,
      subject,
      topic
    );

    // Get full tutor details for top recommendations
    const topRecommendations = await Promise.all(
      recommendations.slice(0, 5).map(async (rec) => {
        const tutor = await prisma.tutor.findUnique({
          where: { id: rec.tutorId },
          include: { user: true }
        });

        return {
          ...rec,
          tutor: {
            id: tutor?.id,
            name: tutor?.user.name,
            bio: tutor?.bio,
            education: tutor?.education,
            subjects: tutor?.subjects,
            keywords: tutor?.keywords
          }
        };
      })
    );

    res.json({
      success: true,
      recommendations: topRecommendations,
      totalFound: recommendations.length,
      analysis: {
        subject,
        topic,
        criteria: ['Subject expertise', 'Rating', 'Experience', 'Learning style compatibility', 'Price']
      }
    });
  } catch (error) {
    console.error('Error in tutor recommendations:', error);
    res.status(500).json({ error: 'Failed to generate tutor recommendations' });
  }
};

// Generate comprehensive progress reports
export const generateProgressReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get student ID from user
    const student = await prisma.student.findFirst({
      where: { userId },
      include: { user: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Use AI service for comprehensive analysis
    const analysis = await aiService.analyzeProgress(student.id);

    // Get recent sessions for detailed report
    const recentSessions = await prisma.session.findMany({
      where: { studentId: student.id },
      include: { tutor: { include: { user: true } } },
      orderBy: { completedAt: 'desc' },
      take: 10
    });

    const report = {
      student: {
        name: student.user?.name,
        grade: student.grade,
        subjects: student.subjects,
        learningStyle: student.learningStyle,
        targetScore: student.targetScore
      },
      analysis: {
        overallScore: analysis.overallScore,
        subjectPerformance: analysis.subjectPerformance,
        trends: analysis.trends,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendations: analysis.recommendations,
        nextSteps: analysis.nextSteps
      },
      recentSessions: recentSessions.map(session => ({
        subject: session.subject,
        topic: session.topic,
        score: session.score,
        rating: session.rating,
        tutor: session.tutor.user.name,
        date: session.completedAt
      })),
      summary: {
        totalSessions: recentSessions.length,
        averageScore: analysis.overallScore,
        improvementTrend: analysis.trends[0] || 'Stable',
        keyInsights: analysis.strengths.slice(0, 3)
      }
    };

    res.json({
      success: true,
      report,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating progress report:', error);
    res.status(500).json({ error: 'Failed to generate progress report' });
  }
};

// Generate personalized learning plans
export const generateLearningPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get student ID from user
    const student = await prisma.student.findFirst({
      where: { userId },
      include: { user: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Use AI service for personalized learning plan
    const learningPlan = await aiService.generateLearningPlan(student.id);

    // Get current sessions for context
    const currentSessions = await prisma.session.findMany({
      where: { studentId: student.id },
      include: { tutor: { include: { user: true } } },
      orderBy: { completedAt: 'desc' },
      take: 5
    });

    const plan = {
      student: {
        name: student.user?.name,
        currentLevel: student.currentLevel,
        targetScore: student.targetScore,
        learningStyle: student.learningStyle,
        subjects: student.subjects,
        goals: student.goals
      },
      plan: {
        timeline: learningPlan.timeline,
        weeklySchedule: learningPlan.weeklySchedule,
        resources: learningPlan.resources,
        milestones: learningPlan.milestones,
        practiceExercises: learningPlan.practiceExercises,
        estimatedCompletion: learningPlan.estimatedCompletion
      },
      currentProgress: {
        recentSessions: currentSessions.length,
        averageScore: currentSessions.length > 0 
          ? currentSessions.reduce((sum, s) => sum + (s.score || 0), 0) / currentSessions.length 
          : 0,
        subjects: [...new Set(currentSessions.map(s => s.subject))]
      },
      recommendations: {
        focusAreas: student.subjects.filter(subject => 
          !currentSessions.some(s => s.subject === subject)
        ),
        intensity: student.currentLevel === 'Beginner' ? 'Moderate' : 'High',
        frequency: '3-4 sessions per week recommended'
      }
    };

    res.json({
      success: true,
      plan,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating learning plan:', error);
    res.status(500).json({ error: 'Failed to generate learning plan' });
  }
};

// Generate career guidance reports
export const generateCareerGuidance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get student ID from user
    const student = await prisma.student.findFirst({
      where: { userId },
      include: { user: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Use AI service for career guidance
    const careerGuidance = await aiService.generateCareerGuidance(student.id);

    // Get performance data for detailed analysis
    const sessions = await prisma.session.findMany({
      where: { studentId: student.id },
      orderBy: { completedAt: 'desc' }
    });

    const subjectAnalysis = sessions.reduce((acc, session) => {
      if (!acc[session.subject]) {
        acc[session.subject] = { total: 0, count: 0, scores: [] };
      }
      acc[session.subject].total += session.score || 0;
      acc[session.subject].count += 1;
      acc[session.subject].scores.push(session.score || 0);
      return acc;
    }, {} as Record<string, { total: number; count: number; scores: number[] }>);

    const detailedAnalysis = Object.entries(subjectAnalysis).map(([subject, data]) => ({
      subject,
      averageScore: data.total / data.count,
      sessionsCount: data.count,
      trend: data.scores.length > 1 
        ? (data.scores[data.scores.length - 1] > data.scores[0] ? 'Improving' : 'Declining')
        : 'Stable'
    }));

    const guidance = {
      student: {
        name: student.user?.name,
        grade: student.grade,
        interests: student.interests || [],
        goals: student.goals || [],
        learningStyle: student.learningStyle
      },
      analysis: {
        careerPaths: careerGuidance.careerPaths,
        skillGaps: careerGuidance.skillGaps,
        recommendations: careerGuidance.recommendations,
        timeline: careerGuidance.timeline,
        confidence: careerGuidance.confidence
      },
      performance: {
        subjectAnalysis: detailedAnalysis,
        strongSubjects: detailedAnalysis.filter(s => s.averageScore >= 80).map(s => s.subject),
        weakSubjects: detailedAnalysis.filter(s => s.averageScore < 70).map(s => s.subject),
        overallTrend: detailedAnalysis.length > 0 
          ? detailedAnalysis.reduce((sum, s) => sum + s.averageScore, 0) / detailedAnalysis.length
          : 0
      },
      insights: {
        bestFit: careerGuidance.careerPaths[0] || 'General studies',
        preparationNeeded: careerGuidance.skillGaps.length > 0,
        timeToGoal: careerGuidance.timeline.length > 0 ? `${careerGuidance.timeline.length} phases` : 'Variable'
      }
    };

    res.json({
      success: true,
      guidance,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating career guidance:', error);
    res.status(500).json({ error: 'Failed to generate career guidance' });
  }
}; 