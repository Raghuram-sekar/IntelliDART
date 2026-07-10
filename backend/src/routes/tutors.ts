import { Router } from 'express';
import { 
  getTutors, 
  getTutorById, 
  createTutor, 
  updateTutor, 
  deleteTutor,
  searchTutors,
  getTutorSessions
} from '../controllers/tutors';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get all tutors
router.get('/', getTutors);

// Search tutors
router.get('/search', searchTutors);

// Get tutor by ID
router.get('/:id', getTutorById);

// Get tutor sessions
router.get('/:id/sessions', authenticate, getTutorSessions);

// Create tutor profile
router.post('/', authenticate, authorize(['TUTOR']), createTutor);

// Update tutor profile
router.put('/:id', authenticate, authorize(['TUTOR']), updateTutor);

// Delete tutor profile
router.delete('/:id', authenticate, authorize(['TUTOR', 'ADMIN']), deleteTutor);

export default router; 