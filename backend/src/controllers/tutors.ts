import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tutors = await prisma.tutor.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: tutors
    });
  } catch (error) {
    next(error);
  }
};

export const searchTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, expertise, maxRate } = req.query;

    const where: any = {
      isAvailable: true
    };

    if (expertise) {
      where.expertise = {
        has: expertise as string
      };
    }

    if (maxRate) {
      where.hourlyRate = {
        lte: parseFloat(maxRate as string)
      };
    }

    const tutors = await prisma.tutor.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: tutors
    });
  } catch (error) {
    next(error);
  }
};

export const getTutorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const tutor = await prisma.tutor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!tutor) {
      return next(createError('Tutor not found.', 404));
    }

    res.json({
      success: true,
      data: tutor
    });
  } catch (error) {
    next(error);
  }
};

export const createTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { expertise, keywords, sampleVideos, bio, hourlyRate } = req.body;
    const userId = (req as any).user.id;

    const tutor = await prisma.tutor.create({
      data: {
        userId,
        expertise,
        keywords,
        sampleVideos,
        bio,
        hourlyRate: parseFloat(hourlyRate)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: tutor,
      message: 'Tutor profile created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { expertise, keywords, sampleVideos, bio, hourlyRate, isAvailable } = req.body;

    const tutor = await prisma.tutor.update({
      where: { id },
      data: {
        expertise,
        keywords,
        sampleVideos,
        bio,
        hourlyRate: parseFloat(hourlyRate),
        isAvailable
      }
    });

    res.json({
      success: true,
      data: tutor,
      message: 'Tutor profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.tutor.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Tutor profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getTutorSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const sessions = await prisma.session.findMany({
      where: { tutorId: id },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
}; 