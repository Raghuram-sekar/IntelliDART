import { Router } from 'express';
import { 
  getTutorRecommendations, 
  generateProgressReport, 
  generateLearningPlan, 
  generateCareerGuidance 
} from '../controllers/ai';
import { authenticate } from '../middleware/auth';

const router = Router();

// AI-powered tutor recommendations
router.post('/recommendations', authenticate, getTutorRecommendations);

// Generate comprehensive progress reports
router.post('/progress-report', authenticate, generateProgressReport);

// Generate personalized learning plans
router.post('/learning-plan', authenticate, generateLearningPlan);

// Generate career guidance reports
router.post('/career-guidance', authenticate, generateCareerGuidance);

export default router; 