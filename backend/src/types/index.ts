import { Request, Response, NextFunction } from 'express';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  profileData?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  userId: string;
  grade: number;
  interests: string[];
  goals: string[];
  knowledgeGraph?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tutor {
  id: string;
  userId: string;
  expertise: string[];
  keywords: string[];
  sampleVideos: string[];
  bio?: string;
  hourlyRate: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  studentId: string;
  tutorId: string;
  scheduledTime: Date;
  duration: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  sessionNotes?: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: string;
  studentId: string;
  reportType: 'PROGRESS' | 'CAREER_GUIDANCE' | 'LEARNING_PLAN' | 'ASSESSMENT';
  content: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
} 