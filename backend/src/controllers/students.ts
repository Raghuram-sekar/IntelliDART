import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await prisma.student.findMany({
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
      data: students
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
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

    if (!student) {
      return next(createError('Student not found.', 404));
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { grade, interests, goals } = req.body;
    const userId = (req as any).user.id;

    const student = await prisma.student.create({
      data: {
        userId,
        grade: parseInt(grade),
        interests,
        goals
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
      data: student,
      message: 'Student profile created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { grade, interests, goals, knowledgeGraph } = req.body;

    const student = await prisma.student.update({
      where: { id },
      data: {
        grade: parseInt(grade),
        interests,
        goals,
        knowledgeGraph
      }
    });

    res.json({
      success: true,
      data: student,
      message: 'Student profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.student.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Student profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const sessions = await prisma.session.findMany({
      where: { studentId: id },
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

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const reports = await prisma.report.findMany({
      where: { studentId: id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
}; 