import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    let reports;
    if (userRole === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId }
      });
      reports = await prisma.report.findMany({
        where: { studentId: student?.id },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      reports = await prisma.report.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id }
    });

    if (!report) {
      return next(createError('Report not found.', 404));
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const createReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId, reportType, content } = req.body;

    const report = await prisma.report.create({
      data: {
        studentId,
        reportType,
        content
      }
    });

    res.status(201).json({
      success: true,
      data: report,
      message: 'Report created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const report = await prisma.report.update({
      where: { id },
      data: { content }
    });

    res.json({
      success: true,
      data: report,
      message: 'Report updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.report.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const generateReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId, reportType } = req.body;

    // In a real application, this would call the AI service
    // to generate personalized reports
    const mockContent = {
      summary: "Student shows strong progress in STEM subjects",
      recommendations: [
        "Focus on advanced calculus concepts",
        "Practice problem-solving techniques",
        "Consider AP Computer Science"
      ],
      progress: {
        mathematics: 85,
        physics: 78,
        chemistry: 82,
        computerScience: 90
      }
    };

    const report = await prisma.report.create({
      data: {
        studentId,
        reportType,
        content: mockContent
      }
    });

    res.status(201).json({
      success: true,
      data: report,
      message: 'AI report generated successfully'
    });
  } catch (error) {
    next(error);
  }
}; 