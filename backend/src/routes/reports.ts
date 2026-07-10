import { Router } from 'express';
import { 
  getReports, 
  getReportById, 
  createReport, 
  updateReport, 
  deleteReport,
  generateReport
} from '../controllers/reports';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get all reports (filtered by user)
router.get('/', authenticate, getReports);

// Get report by ID
router.get('/:id', authenticate, getReportById);

// Create new report
router.post('/', authenticate, createReport);

// Update report
router.put('/:id', authenticate, updateReport);

// Delete report
router.delete('/:id', authenticate, deleteReport);

// Generate AI report
router.post('/generate', authenticate, generateReport);

export default router; 