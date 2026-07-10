import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    let sessions;
    if (userRole === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId }
      });
      sessions = await prisma.session.findMany({
        where: { studentId: student?.id },
        include: {
          tutor: {
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
    } else if (userRole === 'TUTOR') {
      const tutor = await prisma.tutor.findUnique({
        where: { userId }
      });
      sessions = await prisma.session.findMany({
        where: { tutorId: tutor?.id },
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
    } else {
      sessions = await prisma.session.findMany({
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
          },
          tutor: {
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
    }

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id },
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
        },
        tutor: {
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

    if (!session) {
      return next(createError('Session not found.', 404));
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId, tutorId, scheduledTime, duration } = req.body;

    const session = await prisma.session.create({
      data: {
        studentId,
        tutorId,
        scheduledTime: new Date(scheduledTime),
        duration: parseInt(duration)
      },
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
        },
        tutor: {
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

    res.status(201).json({
      success: true,
      data: session,
      message: 'Session created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { scheduledTime, duration, status, sessionNotes, videoUrl } = req.body;

    const session = await prisma.session.update({
      where: { id },
      data: {
        scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
        duration: duration ? parseInt(duration) : undefined,
        status,
        sessionNotes,
        videoUrl
      }
    });

    res.json({
      success: true,
      data: session,
      message: 'Session updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.session.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const joinSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        student: true,
        tutor: true
      }
    });

    if (!session) {
      return next(createError('Session not found.', 404));
    }

    // Check if user is authorized to join this session
    const isAuthorized = 
      (session.student.userId === userId) || 
      (session.tutor.userId === userId);

    if (!isAuthorized) {
      return next(createError('Not authorized to join this session.', 403));
    }

    // Generate video call URL (in a real app, this would integrate with WebRTC/Zoom)
    const videoUrl = `https://meet.intellidart.com/session/${id}`;

    res.json({
      success: true,
      data: {
        sessionId: id,
        videoUrl,
        session
      },
      message: 'Session joined successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const endSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { sessionNotes } = req.body;

    const session = await prisma.session.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        sessionNotes
      }
    });

    res.json({
      success: true,
      data: session,
      message: 'Session ended successfully'
    });
  } catch (error) {
    next(error);
  }
}; 