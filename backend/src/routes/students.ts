import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get student profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    
    const student = await prisma.student.findFirst({
      where: { userId },
      include: { user: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    res.json({ success: true, student });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ error: 'Failed to fetch student profile' });
  }
});

// Get recent sessions for student
router.get('/recent', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    
    const student = await prisma.student.findFirst({
      where: { userId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const sessions = await prisma.session.findMany({
      where: { studentId: student.id },
      include: { tutor: { include: { user: true } } },
      orderBy: { scheduledTime: 'desc' },
      take: 10
    });

    res.json({ success: true, sessions });
  } catch (error) {
    console.error('Error fetching recent sessions:', error);
    res.status(500).json({ error: 'Failed to fetch recent sessions' });
  }
});

export default router; 