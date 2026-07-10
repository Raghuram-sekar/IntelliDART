from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
import openai
import json
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure OpenAI
from openai import OpenAI

# Debug: Check if API key is loaded
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    print(f"✅ OpenAI API key loaded: {api_key[:10]}...{api_key[-4:]}")
    client = OpenAI(api_key=api_key)
else:
    print("❌ OpenAI API key not found in environment variables")
    client = None

app = FastAPI(
    title="IntelliDART AI Service",
    description="AI-powered features for the IntelliDART tutoring platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class StudentProfile(BaseModel):
    id: str
    grade: int
    interests: List[str]
    goals: List[str]
    current_level: Optional[str] = "Intermediate"  # Beginner/Intermediate/Advanced
    average_rating: Optional[float] = 0.0  # Student's average session rating
    total_sessions: Optional[int] = 0
    study_hours: Optional[int] = 0
    target_score: Optional[int] = None
    recent_scores: Optional[List[int]] = []  # Recent session scores
    weak_subjects: Optional[List[str]] = []  # Subjects needing improvement
    strong_subjects: Optional[List[str]] = []  # Subjects student excels in
    knowledge_graph: Optional[Dict[str, Any]] = None

class TutorProfile(BaseModel):
    id: str
    expertise: List[str]
    keywords: List[str]
    bio: Optional[str] = None
    hourly_rate: float

class RecommendationRequest(BaseModel):
    subject: str
    topic: Optional[str] = None
    student_id: Optional[str] = None
    student_profile: Optional[StudentProfile] = None
    preferences: Optional[Dict[str, Any]] = None

class LearningPlanRequest(BaseModel):
    student_id: str
    goals: List[str]
    timeline: str
    current_level: str

class ProgressAnalysisRequest(BaseModel):
    student_id: str
    sessions: List[Dict[str, Any]]
    assessments: List[Dict[str, Any]]

class CareerGuidanceRequest(BaseModel):
    student_id: str
    interests: List[str]
    strengths: List[str]
    goals: List[str]

# Learning Plan Generation Functions
@app.post("/learning-plan")
async def generate_learning_plan(request: LearningPlanRequest):
    """Generate a comprehensive, adaptive learning plan for all subjects based on student performance"""
    
    try:
        print(f"🎓 Generating comprehensive learning plan - {request.timeframe}")
        
        # Extract student data
        student_data = request.student_data
        current_level = student_data.get('currentLevel', 'Intermediate')
        weak_subjects = student_data.get('weakSubjects', [])
        strong_subjects = student_data.get('strongSubjects', [])
        
        # Define all subjects with their performance levels
        all_subjects = {
            'Mathematics': 'intermediate',
            'Physics': 'foundational', 
            'Chemistry': 'intermediate',
            'Computer Science': 'advanced',
            'English': 'intermediate',
            'Biology': 'foundational'
        }
        
        # Update performance levels based on student data
        for subject in weak_subjects:
            if subject in all_subjects:
                all_subjects[subject] = 'foundational'
        
        for subject in strong_subjects:
            if subject in all_subjects:
                all_subjects[subject] = 'advanced'
        
        print(f"📊 Multi-Subject Performance Analysis: {all_subjects}")
        
        # Generate comprehensive multi-subject plan
        return generate_multi_subject_plan(all_subjects, request.goals, request.timeframe)
        
    except Exception as e:
        print(f"❌ Error generating learning plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating learning plan: {str(e)}")

def generate_multi_subject_plan(all_subjects: dict, goals: list, timeframe: str):
    """Generate comprehensive learning plan for all subjects"""
    
    # Calculate timeframe
    weeks = 8
    if 'week' in timeframe.lower():
        weeks = int(''.join(filter(str.isdigit, timeframe))) or 8
    elif 'month' in timeframe.lower():
        weeks = int(''.join(filter(str.isdigit, timeframe))) * 4 or 16
    
    # Generate multi-subject weekly breakdown
    weekly_plan = []
    subject_list = list(all_subjects.keys())
    
    for week in range(1, weeks + 1):
        # Determine primary subject focus for the week (rotate through subjects)
        primary_subject = subject_list[(week - 1) % len(subject_list)]
        primary_performance = all_subjects[primary_subject]
        
        week_plan = {
            'week': week,
            'phase': get_simple_phase(week, weeks, primary_performance),
            'approach': get_approach_by_level(primary_performance),
            'performance_level': primary_performance.title(),
            'primary_subject': primary_subject,
            'estimated_hours': 15,
            'total_tasks': 15,
            'daily_plans': generate_multi_subject_daily_plans(week, all_subjects),
            'milestones': [
                f'Complete week {week} multi-subject fundamentals',
                f'Pass week {week} assessments with 80%+',
                f'Master {primary_performance} level concepts in {primary_subject}'
            ],
            'week_summary': {
                'primary_focus': f'Week {week}: {primary_subject} focus with multi-subject integration',
                'key_outcomes': [f'Master {primary_subject} concepts', 'Progress in all subjects', 'Show measurable improvement'],
                'success_metrics': ['Complete 90%+ of tasks', 'Score 80%+ on assessments', 'Demonstrate understanding across subjects']
            }
        }
        weekly_plan.append(week_plan)
    
    # Generate multi-subject study schedule
    daily_schedule = generate_multi_subject_schedule(all_subjects)
    
    # Create resource recommendations
    resources = generate_resource_recommendations(subject, current_level, goals)
    
    # Generate assessment plan
    assessments = generate_assessment_plan(weeks, subject, goals)
    
    return {
        "subject": subject,
        "timeframe": timeframe,
        "total_weeks": weeks,
        "student_level": current_level,
        "goals": goals,
        "weekly_plan": weekly_plan,
        "daily_schedule": daily_schedule,
        "resources": resources,
        "assessments": assessments,
        "progress_tracking": {
            "completion_rate": 0,
            "milestones_achieved": 0,
            "total_milestones": sum(len(week['milestones']) for week in weekly_plan)
        }
    }

# Simplified helper functions for immediate functionality
def get_simple_phase(week: int, total_weeks: int, performance_level: str):
    """Get simple phase name for the week"""
    phases = {
        'foundational': ['Foundation Building', 'Guided Practice', 'Independent Practice', 'Assessment & Review'],
        'intermediate': ['Concept Review', 'Applied Practice', 'Problem Solving', 'Integration'],
        'advanced': ['Advanced Concepts', 'Complex Challenges', 'Mock Tests', 'Mastery']
    }
    phase_list = phases.get(performance_level, phases['intermediate'])
    phase_index = min((week - 1) // max(1, total_weeks // len(phase_list)), len(phase_list) - 1)
    return phase_list[phase_index]

def get_approach_by_level(performance_level: str):
    """Get learning approach by performance level"""
    approaches = {
        'foundational': 'Theory-First Mastery',
        'intermediate': 'Balanced Development', 
        'advanced': 'Challenge-Based Learning'
    }
    return approaches.get(performance_level, 'Balanced Development')

def generate_simple_daily_plans(week: int, subject: str, performance_level: str):
    """Generate simplified daily plans"""
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    daily_plans = {}
    
    for day in days:
        daily_plans[day] = {
            'estimated_hours': 1.5 if day not in ['Saturday', 'Sunday'] else 1.0,
            'primary_focus': f'{day} {subject} Focus',
            'tasks': [
                f'Study {subject} concepts',
                f'Complete {performance_level} level exercises',
                'Review and practice',
                'Self-assessment'
            ],
            'goals': [
                f'Master {subject} concepts for {day}',
                f'Complete {performance_level}-level tasks',
                'Track progress and gaps'
            ],
            'resources': ['Textbooks', 'Online materials', 'Practice problems'],
            'assessment': 'Daily progress check'
        }
    
    return daily_plans

def generate_multi_subject_daily_plans(week: int, all_subjects: dict):
    """Generate daily plans covering all subjects based on performance levels"""
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    daily_plans = {}
    subject_list = list(all_subjects.keys())
    
    for i, day in enumerate(days):
        # Rotate through subjects for each day
        primary_subject = subject_list[i % len(subject_list)]
        secondary_subject = subject_list[(i + 1) % len(subject_list)]
        
        primary_level = all_subjects[primary_subject]
        secondary_level = all_subjects[secondary_subject]
        
        daily_plans[day] = {
            'estimated_hours': 2.0 if day not in ['Saturday', 'Sunday'] else 1.5,
            'primary_focus': f'{day}: {primary_subject} + {secondary_subject}',
            'tasks': [
                f'Study {primary_subject} ({primary_level} level)',
                f'Practice {secondary_subject} ({secondary_level} level)',
                f'Review previous concepts',
                'Complete assessments'
            ],
            'goals': [
                f'Master {primary_subject} concepts',
                f'Progress in {secondary_subject}',
                'Track multi-subject progress'
            ],
            'resources': ['Subject textbooks', 'Online materials', 'Practice problems', 'Assessment tools'],
            'assessment': f'Daily progress check for {primary_subject} and {secondary_subject}'
        }
    
    return daily_plans

def generate_multi_subject_schedule(all_subjects: dict):
    """Generate multi-subject daily schedule"""
    return {
        'morning': 'Primary subject focus (2 hours)',
        'afternoon': 'Secondary subject practice (1.5 hours)', 
        'evening': 'Review and assessment (1 hour)'
    }

def generate_adaptive_week_plan(week: int, total_weeks: int, subject: str, performance_level: str, avg_score: float, goals: list, study_hours: int):
    """Generate professional, adaptive weekly plan based on student performance"""
    
    # Define learning paths based on performance level
    learning_paths = {
        'foundational': {
            'approach': 'Theory-First Mastery',
            'phases': ['Theory & Concepts', 'Guided Practice', 'Independent Practice', 'Assessment & Review'],
            'daily_structure': {
                'theory_ratio': 0.4,
                'practice_ratio': 0.3,
                'review_ratio': 0.2,
                'assessment_ratio': 0.1
            }
        },
        'intermediate': {
            'approach': 'Balanced Development',
            'phases': ['Concept Reinforcement', 'Applied Practice', 'Problem Solving', 'Skill Integration'],
            'daily_structure': {
                'theory_ratio': 0.25,
                'practice_ratio': 0.4,
                'review_ratio': 0.2,
                'assessment_ratio': 0.15
            }
        },
        'advanced': {
            'approach': 'Challenge-Based Learning',
            'phases': ['Advanced Concepts', 'Complex Problem Solving', 'Mock Assessments', 'Mastery Validation'],
            'daily_structure': {
                'theory_ratio': 0.15,
                'practice_ratio': 0.5,
                'review_ratio': 0.15,
                'assessment_ratio': 0.2
            }
        }
    }
    
    path = learning_paths[performance_level]
    phase_length = max(1, total_weeks // len(path['phases']))
    current_phase_index = min((week - 1) // phase_length, len(path['phases']) - 1)
    current_phase = path['phases'][current_phase_index]
    
    # Generate professional daily breakdown
    daily_plans = generate_professional_daily_plans(
        week, subject, performance_level, current_phase, path['daily_structure'], study_hours
    )
    
    # Calculate weekly metrics
    total_tasks = sum(len(day['tasks']) for day in daily_plans.values())
    estimated_hours = min(study_hours, 20)
    
    return {
        'week': week,
        'phase': current_phase,
        'approach': path['approach'],
        'performance_level': performance_level.title(),
        'estimated_hours': estimated_hours,
        'total_tasks': total_tasks,
        'daily_plans': daily_plans,
        'week_summary': {
            'primary_focus': get_week_primary_focus(subject, performance_level, current_phase),
            'key_outcomes': get_week_outcomes(subject, performance_level, current_phase),
            'success_metrics': get_week_metrics(subject, performance_level, current_phase)
        }
    }

def generate_professional_daily_plans(week: int, subject: str, performance_level: str, phase: str, structure: dict, study_hours: int):
    """Generate detailed daily plans with professional task breakdown"""
    
    daily_hours = study_hours / 7
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    daily_plans = {}
    
    for i, day in enumerate(days):
        # Adjust intensity for weekends
        day_hours = daily_hours * 0.6 if day in ['Saturday', 'Sunday'] else daily_hours
        
        # Generate tasks based on performance level and phase
        tasks = generate_daily_tasks(day, subject, performance_level, phase, structure, day_hours)
        
        daily_plans[day] = {
            'estimated_hours': round(day_hours, 1),
            'primary_focus': get_daily_focus(day, phase, performance_level),
            'tasks': tasks,
            'goals': get_daily_goals(day, subject, performance_level, phase),
            'resources': get_daily_resources(subject, performance_level, phase),
            'assessment': get_daily_assessment(day, performance_level, phase)
        }
    
    return daily_plans

def generate_daily_tasks(day: str, subject: str, performance_level: str, phase: str, structure: dict, hours: float):
    """Generate specific tasks based on performance level and learning phase"""
    
    task_templates = {
        'foundational': {
            'Theory & Concepts': [
                f'Read {subject} fundamentals (Chapter {day[:3]})',
                'Create concept mind maps',
                'Watch explanatory videos',
                'Take detailed notes'
            ],
            'Guided Practice': [
                'Work through guided examples',
                'Complete practice worksheets',
                'Join study group session',
                'Review with tutor'
            ],
            'Independent Practice': [
                'Solve practice problems independently',
                'Complete homework assignments',
                'Self-assess understanding',
                'Identify knowledge gaps'
            ],
            'Assessment & Review': [
                'Take practice quiz',
                'Review incorrect answers',
                'Summarize key learnings',
                'Plan next week focus'
            ]
        },
        'intermediate': {
            'Concept Reinforcement': [
                f'Review advanced {subject} concepts',
                'Solve medium-difficulty problems',
                'Analyze solution methods',
                'Practice time management'
            ],
            'Applied Practice': [
                'Work on real-world applications',
                'Complete case studies',
                'Collaborate on group projects',
                'Present solutions'
            ],
            'Problem Solving': [
                'Tackle challenging problems',
                'Use multiple solution approaches',
                'Explain reasoning process',
                'Optimize solution efficiency'
            ],
            'Skill Integration': [
                'Combine multiple concepts',
                'Work on comprehensive projects',
                'Peer review and feedback',
                'Prepare for assessments'
            ]
        },
        'advanced': {
            'Advanced Concepts': [
                f'Master advanced {subject} theories',
                'Research cutting-edge applications',
                'Analyze complex scenarios',
                'Develop innovative solutions'
            ],
            'Complex Problem Solving': [
                'Solve competition-level problems',
                'Optimize solution strategies',
                'Handle edge cases',
                'Mentor other students'
            ],
            'Mock Assessments': [
                'Take timed practice exams',
                'Simulate test conditions',
                'Analyze performance patterns',
                'Refine test-taking strategies'
            ],
            'Mastery Validation': [
                'Complete capstone projects',
                'Demonstrate expertise',
                'Teach concepts to others',
                'Prepare for advanced courses'
            ]
        }
    }
    
    phase_tasks = task_templates.get(performance_level, {}).get(phase, [])
    # Select appropriate number of tasks based on available hours
    num_tasks = min(len(phase_tasks), max(2, int(hours * 1.5)))
    return phase_tasks[:num_tasks]

def get_week_primary_focus(subject: str, performance_level: str, phase: str):
    """Get the primary focus for the week"""
    focus_map = {
        'foundational': f'Building strong {subject} foundations through {phase.lower()}',
        'intermediate': f'Developing {subject} proficiency via {phase.lower()}',
        'advanced': f'Achieving {subject} mastery through {phase.lower()}'
    }
    return focus_map.get(performance_level, f'{subject} skill development')

def get_week_outcomes(subject: str, performance_level: str, phase: str):
    """Get expected outcomes for the week"""
    outcomes_map = {
        'foundational': [
            f'Understand core {subject} principles',
            'Complete foundational assessments',
            'Build confidence in basic concepts'
        ],
        'intermediate': [
            f'Apply {subject} concepts to problems',
            'Demonstrate problem-solving skills',
            'Show consistent performance improvement'
        ],
        'advanced': [
            f'Master complex {subject} applications',
            'Achieve expert-level problem solving',
            'Mentor others and teach concepts'
        ]
    }
    return outcomes_map.get(performance_level, [f'Improve {subject} skills'])

def get_week_metrics(subject: str, performance_level: str, phase: str):
    """Get success metrics for the week"""
    metrics_map = {
        'foundational': [
            'Complete 100% of assigned readings',
            'Score 70%+ on practice assessments',
            'Demonstrate understanding in 80% of concepts'
        ],
        'intermediate': [
            'Solve 85%+ of practice problems correctly',
            'Complete projects with 80%+ quality',
            'Show improvement in time management'
        ],
        'advanced': [
            'Achieve 90%+ on challenging assessments',
            'Complete advanced projects excellently',
            'Demonstrate teaching/mentoring ability'
        ]
    }
    return metrics_map.get(performance_level, [f'Show progress in {subject}'])

def get_daily_focus(day: str, phase: str, performance_level: str):
    """Get the primary focus for each day"""
    day_focus_map = {
        'Monday': 'New Concept Introduction',
        'Tuesday': 'Guided Practice & Application', 
        'Wednesday': 'Independent Problem Solving',
        'Thursday': 'Advanced Practice & Challenges',
        'Friday': 'Integration & Assessment Prep',
        'Saturday': 'Review & Reinforcement',
        'Sunday': 'Planning & Reflection'
    }
    return day_focus_map.get(day, 'Skill Development')

def get_daily_goals(day: str, subject: str, performance_level: str, phase: str):
    """Get specific goals for each day"""
    return [
        f'Master today\'s {subject} concepts',
        f'Complete {performance_level}-level tasks',
        'Track progress and identify gaps',
        'Prepare for tomorrow\'s challenges'
    ]

def get_daily_resources(subject: str, performance_level: str, phase: str):
    """Get recommended resources for the day"""
    resource_map = {
        'foundational': ['Textbook chapters', 'Video tutorials', 'Practice worksheets'],
        'intermediate': ['Advanced textbooks', 'Online courses', 'Practice platforms'],
        'advanced': ['Research papers', 'Competition problems', 'Expert resources']
    }
    return resource_map.get(performance_level, ['General resources'])

def get_daily_assessment(day: str, performance_level: str, phase: str):
    """Get assessment method for the day"""
    if day == 'Friday':
        return 'Weekly comprehensive assessment'
    elif day in ['Wednesday', 'Saturday']:
        return 'Progress check and self-evaluation'
    else:
        return 'Concept understanding verification'

def generate_daily_schedule(study_hours_per_week: int, subject: str):
    """Generate optimal daily study schedule"""
    
    daily_hours = study_hours_per_week / 7
    
    schedule = {
        "Monday": {
            "duration": f"{daily_hours:.1f} hours",
            "focus": "New Concept Learning",
            "activities": ["Read new material", "Take notes", "Watch instructional videos"]
        },
        "Tuesday": {
            "duration": f"{daily_hours:.1f} hours",
            "focus": "Practice & Application",
            "activities": ["Solve practice problems", "Work on exercises", "Apply concepts"]
        },
        "Wednesday": {
            "duration": f"{daily_hours:.1f} hours",
            "focus": "Review & Reinforcement",
            "activities": ["Review previous material", "Create summaries", "Self-assessment"]
        },
        "Thursday": {
            "duration": f"{daily_hours:.1f} hours",
            "focus": "Problem Solving",
            "activities": ["Tackle challenging problems", "Work on assignments", "Seek help if needed"]
        },
        "Friday": {
            "duration": f"{daily_hours:.1f} hours",
            "focus": "Integration & Synthesis",
            "activities": ["Connect concepts", "Work on projects", "Prepare for assessments"]
        },
        "Saturday": {
            "duration": f"{daily_hours * 0.5:.1f} hours",
            "focus": "Light Review",
            "activities": ["Quick review session", "Flashcards", "Casual reading"]
        },
        "Sunday": {
            "duration": f"{daily_hours * 0.5:.1f} hours",
            "focus": "Planning & Reflection",
            "activities": ["Plan next week", "Reflect on progress", "Set goals"]
        }
    }
    
    return schedule

def generate_resource_recommendations(subject: str, level: str, goals: list):
    """Generate personalized resource recommendations"""
    
    resources = {
        "textbooks": [],
        "online_courses": [],
        "practice_platforms": [],
        "video_content": [],
        "tools": []
    }
    
    if subject == "Mathematics":
        resources["textbooks"] = ["Calculus: Early Transcendentals", "Linear Algebra and Its Applications"]
        resources["online_courses"] = ["Khan Academy Calculus", "MIT OpenCourseWare"]
        resources["practice_platforms"] = ["Wolfram Alpha", "Photomath", "Symbolab"]
        resources["video_content"] = ["3Blue1Brown", "Professor Leonard", "PatrickJMT"]
        resources["tools"] = ["Desmos Graphing Calculator", "GeoGebra", "Mathematica"]
    
    elif subject == "Computer Science":
        resources["textbooks"] = ["Introduction to Algorithms", "Clean Code"]
        resources["online_courses"] = ["CS50", "Coursera Algorithms Specialization"]
        resources["practice_platforms"] = ["LeetCode", "HackerRank", "Codewars"]
        resources["video_content"] = ["CS Dojo", "Tech With Tim", "freeCodeCamp"]
        resources["tools"] = ["VS Code", "Git/GitHub", "Python/Java IDE"]
    
    else:
        # Generic resources for other subjects
        resources["textbooks"] = [f"{subject} Fundamentals", f"Advanced {subject}"]
        resources["online_courses"] = [f"Coursera {subject}", f"edX {subject} Course"]
        resources["practice_platforms"] = ["Quizlet", "Khan Academy", "Udemy"]
        resources["video_content"] = ["YouTube Educational Channels", "TED-Ed"]
        resources["tools"] = ["Note-taking Apps", "Study Planners", "Flashcard Apps"]
    
    return resources

def generate_assessment_plan(weeks: int, subject: str, goals: list):
    """Generate comprehensive assessment plan"""
    
    assessments = []
    
    # Weekly quizzes
    for week in range(1, weeks + 1):
        assessments.append({
            "type": "Weekly Quiz",
            "week": week,
            "title": f"Week {week} Knowledge Check",
            "format": "Multiple Choice + Short Answer",
            "duration": "30 minutes",
            "weight": "10%"
        })
    
    # Midterm assessment (if more than 4 weeks)
    if weeks > 4:
        mid_week = weeks // 2
        assessments.append({
            "type": "Midterm Exam",
            "week": mid_week,
            "title": f"{subject} Midterm Assessment",
            "format": "Comprehensive Exam",
            "duration": "2 hours",
            "weight": "25%"
        })
    
    # Final project/exam
    assessments.append({
        "type": "Final Assessment",
        "week": weeks,
        "title": f"{subject} Final Project",
        "format": "Project + Presentation",
        "duration": "1 week",
        "weight": "35%"
    })
    
    return assessments

# AI-powered recommendation function using OpenAI GPT
async def get_ai_powered_recommendations(student_data: dict, tutors: list, subject: str, topic: str = None):
    """Use OpenAI GPT to intelligently match students with tutors based on comprehensive analysis"""
    try:
        # Check if OpenAI client is available
        if client is None:
            print("❌ OpenAI client not initialized - API key missing")
            return None
        # Prepare student profile summary
        student_summary = f"""
        Student Profile:
        - Grade: {student_data.get('grade', 'Unknown')}
        - Current Level: {student_data.get('current_level', 'Intermediate')}
        - Recent Scores: {student_data.get('recent_scores', [])}
        - Average Score: {sum(student_data.get('recent_scores', [75])) / len(student_data.get('recent_scores', [75])):.1f}%
        - Weak Subjects: {', '.join(student_data.get('weak_subjects', []))}
        - Strong Subjects: {', '.join(student_data.get('strong_subjects', []))}
        - Interests: {', '.join(student_data.get('interests', []))}
        - Goals: {', '.join(student_data.get('goals', []))}
        - Total Sessions: {student_data.get('total_sessions', 0)}
        - Study Hours: {student_data.get('study_hours', 0)}
        """
        
        # Prepare tutor profiles summary
        tutor_summaries = []
        for i, tutor in enumerate(tutors[:10]):  # Limit to top 10 for API efficiency
            tutor_summary = f"""
            Tutor {i+1}: {tutor['name']}
            - Education: {tutor['education']}
            - Experience: {tutor['experience']} years
            - Rating: {tutor['rating']}/5.0 ({tutor['total_students']} students, {tutor['total_sessions']} sessions)
            - Expertise: {', '.join(tutor['expertise'])}
            - Subjects: {', '.join(tutor['subjects'])}
            - Specializations: {', '.join(tutor.get('specializations', []))}
            - Rate: ${tutor['hourly_rate']}/hour
            - Bio: {tutor['bio'][:200]}...
            """
            tutor_summaries.append(tutor_summary)
        
        # Create AI prompt for intelligent matching
        prompt = f"""
        You are an expert AI educational consultant for IntelliDART, a premium tutoring platform. 
        Analyze the student profile and recommend the TOP 3 tutors who would be the best matches.
        
        STUDENT REQUESTING HELP:
        {student_summary}
        
        Subject Requested: {subject}
        {f'Specific Topic: {topic}' if topic else ''}
        
        AVAILABLE TUTORS:
        {''.join(tutor_summaries)}
        
        ANALYSIS REQUIREMENTS:
        1. Consider the student's academic performance and learning needs
        2. Match tutors who specialize in the student's weak areas
        3. Consider teaching style compatibility based on student level
        4. Factor in tutor experience with similar student profiles
        5. Provide specific, actionable reasons for each recommendation
        
        RESPOND IN THIS EXACT JSON FORMAT:
        {{
            "recommendations": [
                {{
                    "tutor_index": 1,
                    "match_score": 95,
                    "reasons": [
                        "Specific reason 1",
                        "Specific reason 2",
                        "Specific reason 3"
                    ],
                    "teaching_approach": "Brief description of how this tutor would help this specific student"
                }}
            ],
            "learning_insights": "Brief analysis of student's learning needs and recommendations"
        }}
        
        Provide exactly 3 tutor recommendations, ranked by match quality.
        """
        
        # Call OpenAI GPT for intelligent analysis
        try:
            print(f"🤖 Calling OpenAI API with model: gpt-4o-mini")
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert AI educational consultant specializing in tutor-student matching with deep understanding of learning psychology and academic performance analysis."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1500
            )
            
            print(f"✅ OpenAI API response received")
            # Parse AI response
            ai_content = response.choices[0].message.content
            print(f"📝 AI Response: {ai_content[:200]}...")
            ai_analysis = json.loads(ai_content)
            return ai_analysis
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {e}")
            print(f"Raw response: {response.choices[0].message.content}")
            return None
        except Exception as api_error:
            print(f"❌ OpenAI API Error: {api_error}")
            return None
        
    except Exception as e:
        print(f"AI recommendation error: {e}")
        # Fallback to rule-based matching if AI fails
        return None

# Routes
@app.get("/")
async def root():
    return {"message": "IntelliDART AI Service", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "IntelliDART AI Service"}

@app.post("/learning-plan")
async def generate_learning_plan(request: dict):
    """Generate personalized learning plan based on student data and goals"""
    try:
        student_data = request.get('student_data', {})
        subject = request.get('subject', 'General')
        goals = request.get('goals', [])
        timeframe = request.get('timeframe', '4 weeks')
        
        print(f"🎓 Generating learning plan for {subject} - {timeframe}")
        
        # Generate comprehensive learning plan
        learning_plan = generate_comprehensive_learning_plan(
            student_data, subject, goals, timeframe
        )
        
        return {
            "success": True,
            "plan": learning_plan,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"❌ Error generating learning plan: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "plan": None
        }

@app.post("/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """Get AI-powered recommendations for tutors and topics"""
    try:
        # Real AI-powered recommendations using OpenAI GPT
        subject = request.subject
        topic = request.topic
        
        # Prepare student data for AI analysis
        student_data = {
            'grade': request.student_profile.grade if request.student_profile else 12,
            'interests': request.student_profile.interests if request.student_profile else [],
            'goals': request.student_profile.goals if request.student_profile else [],
            'current_level': request.student_profile.current_level if request.student_profile else "Intermediate",
            'average_rating': request.student_profile.average_rating if request.student_profile else 0.0,
            'total_sessions': request.student_profile.total_sessions if request.student_profile else 0,
            'recent_scores': request.student_profile.recent_scores if request.student_profile else [],
            'weak_subjects': request.student_profile.weak_subjects if request.student_profile else [],
            'strong_subjects': request.student_profile.strong_subjects if request.student_profile else [],
            'study_hours': request.student_profile.study_hours if request.student_profile else 0,
            'target_score': request.student_profile.target_score if request.student_profile else None
        }
        
        # Comprehensive tutor database covering all major university subjects
        all_tutors = [
            # MATHEMATICS & STATISTICS
            {
                "id": "tutor1",
                "name": "Dr. Sarah Johnson",
                "expertise": ["Linear Algebra", "Calculus", "Advanced Mathematics", "Statistics"],
                "subjects": ["Mathematics", "Statistics", "Calculus"],
                "keywords": ["linear algebra", "matrices", "vector spaces", "eigenvalues", "calculus", "derivatives", "integrals", "statistics"],
                "bio": "PhD in Mathematics from MIT with 8 years of teaching experience. Specializes in making complex mathematical concepts accessible to students. Published researcher in linear algebra applications.",
                "rating": 4.9,
                "experience": 8,
                "education": "PhD Mathematics - MIT, MS Applied Mathematics - Stanford",
                "hourly_rate": 65,
                "total_sessions": 245,
                "total_students": 89,
                "availability": "Available Mon-Fri 9AM-6PM EST",
                "languages": ["English", "Spanish"],
                "certifications": ["MIT Teaching Excellence Award", "Mathematical Association of America Member"],
                "sample_videos": ["Introduction to Linear Algebra", "Matrix Operations Explained"],
                "specializations": ["Linear Algebra for Engineers", "Advanced Calculus", "Mathematical Proofs"]
            },
            {
                "id": "tutor2",
                "name": "Dr. Robert Kumar",
                "expertise": ["Linear Algebra", "Abstract Algebra", "Number Theory", "Discrete Mathematics"],
                "subjects": ["Mathematics", "Discrete Mathematics", "Abstract Algebra"],
                "keywords": ["linear algebra", "abstract algebra", "number theory", "discrete math", "group theory", "ring theory"],
                "bio": "PhD in Pure Mathematics with 9 years of teaching experience. Expert in linear algebra and abstract mathematical structures. Passionate about mathematical proofs and problem-solving techniques.",
                "rating": 4.7,
                "experience": 9,
                "education": "PhD Pure Mathematics - University of Chicago, MS Mathematics - Northwestern",
                "hourly_rate": 58,
                "total_sessions": 198,
                "total_students": 76,
                "availability": "Available Tue-Sat 10AM-8PM CST",
                "languages": ["English", "Hindi"],
                "certifications": ["American Mathematical Society Fellow", "Outstanding Teaching Award"],
                "sample_videos": ["Linear Algebra Fundamentals", "Abstract Algebra Concepts"],
                "specializations": ["Linear Algebra Theory", "Mathematical Proofs", "Abstract Structures"]
            },
            {
                "id": "tutor3",
                "name": "Dr. Maria Garcia",
                "expertise": ["Statistics", "Data Science", "Probability Theory", "Statistical Modeling"],
                "subjects": ["Statistics", "Mathematics", "Data Science"],
                "keywords": ["statistics", "data science", "probability", "statistical modeling", "hypothesis testing", "regression"],
                "bio": "PhD in Statistics with 5 years of experience in both academia and industry. Expert in statistical modeling and data analysis applications.",
                "rating": 4.6,
                "experience": 5,
                "education": "PhD Statistics - UC Berkeley, MS Statistics - Stanford",
                "hourly_rate": 55,
                "total_sessions": 134,
                "total_students": 67,
                "availability": "Available Wed-Sun 1PM-7PM PST",
                "languages": ["English", "Spanish"],
                "certifications": ["American Statistical Association Member", "Data Science Certification"],
                "sample_videos": ["Statistics Fundamentals", "Data Analysis with R"],
                "specializations": ["Biostatistics", "Machine Learning Statistics", "Business Analytics"]
            },
            
            # PHYSICS & ENGINEERING
            {
                "id": "tutor4",
                "name": "Prof. Michael Chen",
                "expertise": ["Quantum Mechanics", "Thermodynamics", "Classical Mechanics", "Electromagnetism"],
                "subjects": ["Physics", "Engineering Physics", "Applied Physics"],
                "keywords": ["quantum mechanics", "thermodynamics", "classical mechanics", "electromagnetism", "wave functions", "statistical mechanics"],
                "bio": "Professor of Physics at UC Berkeley with 12 years of experience. Expert in quantum mechanics and mathematical physics. Known for innovative teaching methods and research in quantum computing.",
                "rating": 4.8,
                "experience": 12,
                "education": "PhD Physics - UC Berkeley, MS Physics - Caltech",
                "hourly_rate": 70,
                "total_sessions": 289,
                "total_students": 112,
                "availability": "Available Mon-Fri 10AM-4PM PST",
                "languages": ["English", "Mandarin"],
                "certifications": ["American Physical Society Fellow", "Quantum Computing Research Award"],
                "sample_videos": ["Quantum Mechanics Basics", "Thermodynamics Applications"],
                "specializations": ["Quantum Computing", "Solid State Physics", "Mathematical Physics"]
            },
            {
                "id": "tutor5",
                "name": "Dr. James Wilson",
                "expertise": ["Mechanical Engineering", "Fluid Dynamics", "Heat Transfer", "Materials Science"],
                "subjects": ["Engineering", "Mechanical Engineering", "Materials Science"],
                "keywords": ["mechanical engineering", "fluid dynamics", "heat transfer", "materials science", "thermodynamics", "mechanics"],
                "bio": "PhD in Mechanical Engineering with 10 years of industry and academic experience. Expert in fluid dynamics and materials science with practical engineering applications.",
                "rating": 4.7,
                "experience": 10,
                "education": "PhD Mechanical Engineering - Stanford, MS Engineering - MIT",
                "hourly_rate": 68,
                "total_sessions": 203,
                "total_students": 78,
                "availability": "Available Tue-Sat 9AM-5PM EST",
                "languages": ["English"],
                "certifications": ["Professional Engineer (PE)", "ASME Member"],
                "sample_videos": ["Fluid Dynamics Principles", "Materials Testing"],
                "specializations": ["Aerospace Engineering", "Automotive Design", "Manufacturing Processes"]
            },
            
            # COMPUTER SCIENCE & TECHNOLOGY
            {
                "id": "tutor6",
                "name": "Dr. Alex Rodriguez",
                "expertise": ["Algorithms", "Data Structures", "Machine Learning", "Software Engineering"],
                "subjects": ["Computer Science", "Programming", "Software Engineering"],
                "keywords": ["algorithms", "data structures", "machine learning", "python", "java", "programming", "software engineering"],
                "bio": "PhD in Computer Science from Stanford with 8 years of experience in both academia and tech industry. Expert in algorithms and machine learning with practical software development experience.",
                "rating": 4.9,
                "experience": 8,
                "education": "PhD Computer Science - Stanford, MS Computer Science - CMU",
                "hourly_rate": 75,
                "total_sessions": 267,
                "total_students": 95,
                "availability": "Available Mon-Thu 2PM-8PM PST",
                "languages": ["English", "Spanish"],
                "certifications": ["Google Cloud Professional", "AWS Solutions Architect"],
                "sample_videos": ["Algorithm Design Patterns", "Machine Learning Fundamentals"],
                "specializations": ["Deep Learning", "Cloud Computing", "Full-Stack Development"]
            },
            {
                "id": "tutor7",
                "name": "Dr. Priya Patel",
                "expertise": ["Cybersecurity", "Network Security", "Cryptography", "Information Systems"],
                "subjects": ["Computer Science", "Cybersecurity", "Information Technology"],
                "keywords": ["cybersecurity", "network security", "cryptography", "information systems", "ethical hacking", "security protocols"],
                "bio": "PhD in Cybersecurity with 6 years of experience in security research and consulting. Expert in cryptography and network security with real-world penetration testing experience.",
                "rating": 4.8,
                "experience": 6,
                "education": "PhD Cybersecurity - Georgia Tech, MS Information Security - Carnegie Mellon",
                "hourly_rate": 72,
                "total_sessions": 156,
                "total_students": 63,
                "availability": "Available Wed-Sun 12PM-6PM EST",
                "languages": ["English", "Hindi", "Gujarati"],
                "certifications": ["CISSP", "CEH (Certified Ethical Hacker)", "CISM"],
                "sample_videos": ["Network Security Fundamentals", "Cryptography Explained"],
                "specializations": ["Penetration Testing", "Digital Forensics", "Blockchain Security"]
            },
            
            # CHEMISTRY & BIOCHEMISTRY
            {
                "id": "tutor8",
                "name": "Dr. Emily Rodriguez",
                "expertise": ["Organic Chemistry", "Biochemistry", "Molecular Biology", "Chemical Analysis"],
                "subjects": ["Chemistry", "Biochemistry", "Organic Chemistry"],
                "keywords": ["organic chemistry", "biochemistry", "molecular biology", "chemical reactions", "lab techniques", "spectroscopy"],
                "bio": "PhD in Chemistry from Harvard with 6 years of research and teaching experience. Specializes in organic chemistry and biochemistry applications with extensive lab experience.",
                "rating": 4.7,
                "experience": 6,
                "education": "PhD Chemistry - Harvard, BS Chemistry - Yale",
                "hourly_rate": 60,
                "total_sessions": 178,
                "total_students": 71,
                "availability": "Available Mon-Fri 11AM-5PM EST",
                "languages": ["English", "Spanish"],
                "certifications": ["American Chemical Society Member", "Laboratory Safety Certification"],
                "sample_videos": ["Organic Synthesis Techniques", "Biochemical Pathways"],
                "specializations": ["Medicinal Chemistry", "Protein Structure", "Chemical Synthesis"]
            },
            {
                "id": "tutor9",
                "name": "Dr. Thomas Anderson",
                "expertise": ["Physical Chemistry", "Quantum Chemistry", "Thermodynamics", "Spectroscopy"],
                "subjects": ["Chemistry", "Physical Chemistry", "Chemical Physics"],
                "keywords": ["physical chemistry", "quantum chemistry", "thermodynamics", "spectroscopy", "chemical kinetics", "molecular dynamics"],
                "bio": "PhD in Physical Chemistry with 9 years of experience in computational chemistry and spectroscopy. Expert in quantum mechanical calculations and molecular modeling.",
                "rating": 4.6,
                "experience": 9,
                "education": "PhD Physical Chemistry - Caltech, MS Chemistry - University of Chicago",
                "hourly_rate": 63,
                "total_sessions": 145,
                "total_students": 58,
                "availability": "Available Tue-Sat 10AM-4PM PST",
                "languages": ["English"],
                "certifications": ["Computational Chemistry Specialist", "Spectroscopy Expert"],
                "sample_videos": ["Quantum Chemistry Basics", "Molecular Spectroscopy"],
                "specializations": ["Computational Chemistry", "Laser Spectroscopy", "Chemical Kinetics"]
            },
            
            # BIOLOGY & LIFE SCIENCES
            {
                "id": "tutor10",
                "name": "Dr. David Lee",
                "expertise": ["Molecular Biology", "Genetics", "Cell Biology", "Biotechnology"],
                "subjects": ["Biology", "Genetics", "Molecular Biology"],
                "keywords": ["molecular biology", "genetics", "cell biology", "biotechnology", "DNA", "RNA", "protein synthesis"],
                "bio": "PhD in Biology from Johns Hopkins with 8 years of research and teaching experience. Specializes in genetics and molecular biology with cutting-edge research in gene therapy.",
                "rating": 4.8,
                "experience": 8,
                "education": "PhD Biology - Johns Hopkins, BS Biology - Duke",
                "hourly_rate": 63,
                "total_sessions": 192,
                "total_students": 84,
                "availability": "Available Mon-Fri 9AM-3PM EST",
                "languages": ["English", "Korean"],
                "certifications": ["American Society for Cell Biology Member", "Biotechnology Research Award"],
                "sample_videos": ["DNA Replication Process", "Gene Expression Regulation"],
                "specializations": ["CRISPR Technology", "Stem Cell Research", "Cancer Biology"]
            },
            {
                "id": "tutor11",
                "name": "Dr. Rachel Green",
                "expertise": ["Ecology", "Environmental Science", "Conservation Biology", "Marine Biology"],
                "subjects": ["Biology", "Environmental Science", "Ecology"],
                "keywords": ["ecology", "environmental science", "conservation biology", "marine biology", "ecosystems", "biodiversity"],
                "bio": "PhD in Ecology with 7 years of field research and teaching experience. Expert in marine ecosystems and conservation biology with extensive fieldwork experience.",
                "rating": 4.7,
                "experience": 7,
                "education": "PhD Ecology - UC San Diego, MS Marine Biology - Woods Hole",
                "hourly_rate": 58,
                "total_sessions": 167,
                "total_students": 73,
                "availability": "Available Wed-Sun 10AM-6PM PST",
                "languages": ["English"],
                "certifications": ["Marine Biology Association Member", "Conservation Research Certification"],
                "sample_videos": ["Marine Ecosystem Dynamics", "Conservation Strategies"],
                "specializations": ["Coral Reef Ecology", "Climate Change Biology", "Wildlife Conservation"]
            },
            
            # ECONOMICS & BUSINESS
            {
                "id": "tutor12",
                "name": "Prof. Jennifer Wang",
                "expertise": ["Microeconomics", "Macroeconomics", "Econometrics", "Financial Economics"],
                "subjects": ["Economics", "Finance", "Business"],
                "keywords": ["microeconomics", "macroeconomics", "econometrics", "financial economics", "market analysis", "economic modeling"],
                "bio": "Professor of Economics at NYU with 11 years of experience in economic research and policy analysis. Expert in econometrics and financial markets with consulting experience.",
                "rating": 4.8,
                "experience": 11,
                "education": "PhD Economics - Harvard, MA Economics - London School of Economics",
                "hourly_rate": 68,
                "total_sessions": 234,
                "total_students": 98,
                "availability": "Available Mon-Thu 1PM-7PM EST",
                "languages": ["English", "Mandarin"],
                "certifications": ["American Economic Association Member", "CFA Charterholder"],
                "sample_videos": ["Market Equilibrium Analysis", "Econometric Methods"],
                "specializations": ["Behavioral Economics", "International Trade", "Development Economics"]
            },
            
            # PSYCHOLOGY & SOCIAL SCIENCES
            {
                "id": "tutor13",
                "name": "Dr. Mark Thompson",
                "expertise": ["Cognitive Psychology", "Research Methods", "Statistics in Psychology", "Behavioral Analysis"],
                "subjects": ["Psychology", "Social Sciences", "Research Methods"],
                "keywords": ["cognitive psychology", "research methods", "statistics", "behavioral analysis", "experimental design", "psychological testing"],
                "bio": "PhD in Psychology with 9 years of research and clinical experience. Expert in cognitive psychology and research methodology with published studies in top journals.",
                "rating": 4.7,
                "experience": 9,
                "education": "PhD Psychology - Stanford, MA Psychology - University of Michigan",
                "hourly_rate": 62,
                "total_sessions": 189,
                "total_students": 81,
                "availability": "Available Tue-Sat 11AM-5PM PST",
                "languages": ["English"],
                "certifications": ["Licensed Psychologist", "American Psychological Association Member"],
                "sample_videos": ["Cognitive Processes", "Research Design Principles"],
                "specializations": ["Memory and Learning", "Experimental Psychology", "Psychological Assessment"]
            },
            
            # LITERATURE & HUMANITIES
            {
                "id": "tutor14",
                "name": "Prof. Isabella Martinez",
                "expertise": ["English Literature", "Comparative Literature", "Creative Writing", "Literary Analysis"],
                "subjects": ["English", "Literature", "Writing"],
                "keywords": ["english literature", "comparative literature", "creative writing", "literary analysis", "poetry", "prose", "critical theory"],
                "bio": "Professor of English Literature with 13 years of teaching experience. Published author and expert in modern and contemporary literature with specialization in postcolonial studies.",
                "rating": 4.9,
                "experience": 13,
                "education": "PhD English Literature - Columbia, MA Literature - Oxford University",
                "hourly_rate": 58,
                "total_sessions": 312,
                "total_students": 127,
                "availability": "Available Mon-Fri 10AM-4PM EST",
                "languages": ["English", "Spanish", "French"],
                "certifications": ["Modern Language Association Member", "Published Author Award"],
                "sample_videos": ["Literary Analysis Techniques", "Creative Writing Workshop"],
                "specializations": ["Postcolonial Literature", "Contemporary Fiction", "Academic Writing"]
            }
        ]
        
        # Use real AI-powered recommendations
        print(f"🔍 Starting AI recommendation process for {subject} - {topic}")
        ai_analysis = await get_ai_powered_recommendations(student_data, all_tutors, subject, topic)
        print(f"🔍 AI analysis result: {ai_analysis is not None}")
        
        if ai_analysis and "recommendations" in ai_analysis:
            print(f"✅ Using real AI recommendations with {len(ai_analysis['recommendations'])} matches")
            # Process AI recommendations
            matched_tutors = []
            
            for rec in ai_analysis["recommendations"]:
                tutor_index = rec["tutor_index"] - 1  # Convert to 0-based index
                if 0 <= tutor_index < len(all_tutors):
                    tutor = all_tutors[tutor_index].copy()
                    tutor["match_score"] = rec["match_score"]
                    tutor["reasons"] = rec["reasons"]
                    tutor["teaching_approach"] = rec.get("teaching_approach", "")
                    matched_tutors.append(tutor)
        else:
            # Enhanced fallback matching for all topics
            matched_tutors = []
            for tutor in all_tutors:
                match_score = 0
                reasons = []
                
                # Subject match
                if any(subj.lower() in subject.lower() for subj in tutor["subjects"]):
                    match_score += 40
                    matching_subjects = [subj for subj in tutor["subjects"] if subj.lower() in subject.lower()]
                    reasons.append(f"Expert in {', '.join(matching_subjects)}")
                
                # Topic/keyword match
                if topic:
                    topic_lower = topic.lower()
                    if any(topic_lower in kw.lower() for kw in tutor["keywords"]):
                        match_score += 30
                        reasons.append(f"Specializes in {topic}")
                    elif any(topic_lower in exp.lower() for exp in tutor["expertise"]):
                        match_score += 25
                        reasons.append(f"Expert in {topic}")
                
                # Rating bonus
                if tutor["rating"] >= 4.8:
                    match_score += 15
                    reasons.append(f"Highly rated ({tutor['rating']}★)")
                elif tutor["rating"] >= 4.5:
                    match_score += 10
                
                # Experience bonus
                if tutor["experience"] >= 8:
                    match_score += 10
                    reasons.append(f"{tutor['experience']} years experience")
                
                if match_score >= 25:  # Only include reasonable matches
                    tutor_copy = tutor.copy()
                    tutor_copy["match_score"] = min(match_score, 100)
                    tutor_copy["reasons"] = reasons[:3]
                    matched_tutors.append(tutor_copy)
            
            # Sort by match score
            matched_tutors.sort(key=lambda x: x["match_score"], reverse=True)
        
        recommendations = {
            "tutors": matched_tutors[:8],  # Show more tutors
            "total_found": len(matched_tutors),
            "ai_powered": ai_analysis is not None,  # Indicator if real AI was used
            "ai_analysis": ai_analysis.get("learning_insights", "") if ai_analysis else "Using smart algorithmic matching",
            "search_criteria": {
                "subject": request.subject,
                "topic": request.topic
            },
            "matching_explanation": {
                "ai_used": ai_analysis is not None,
                "fallback_reason": "OpenAI API unavailable or rate limited" if ai_analysis is None else None,
                "scoring_factors": [
                    "Subject expertise match (40% weight)",
                    "Topic specialization (30% weight)", 
                    "Student performance alignment (25% weight)" if ai_analysis else "Experience & rating (25% weight)",
                    "Teaching style compatibility (15% weight)" if ai_analysis else "Interest alignment (10% weight)"
                ]
            }
        }
        
        return {"success": True, "data": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/learning-plan")
async def generate_learning_plan(request: LearningPlanRequest):
    """Generate personalized learning plan"""
    try:
        # Mock AI-generated learning plan
        learning_plan = {
            "student_id": request.student_id,
            "goals": request.goals,
            "timeline": request.timeline,
            "milestones": [
                {
                    "id": 1,
                    "title": "Master Calculus Fundamentals",
                    "description": "Complete basic calculus concepts",
                    "due_date": "2024-02-15",
                    "status": "pending"
                },
                {
                    "id": 2,
                    "title": "Complete AP Computer Science Prep",
                    "description": "Prepare for AP Computer Science exam",
                    "due_date": "2024-03-15",
                    "status": "pending"
                }
            ],
            "recommended_sessions": [
                {
                    "topic": "Calculus Integration",
                    "duration": 60,
                    "frequency": "weekly",
                    "tutor_type": "expert"
                }
            ],
            "resources": [
                {
                    "type": "video",
                    "title": "Calculus Made Easy",
                    "url": "https://example.com/calculus-video",
                    "duration": "2 hours"
                }
            ]
        }
        
        return {"success": True, "data": learning_plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-progress")
async def analyze_progress(request: ProgressAnalysisRequest):
    """Analyze student progress and provide insights"""
    try:
        # Mock progress analysis
        analysis = {
            "total_sessions": len(request.sessions),
            "total_hours": sum(session.get("duration", 0) for session in request.sessions) / 60,
            "average_rating": 4.7,
            "subjects": {
                "mathematics": {
                    "progress": 85,
                    "sessions": 12,
                    "improvement": "+15%"
                },
                "physics": {
                    "progress": 78,
                    "sessions": 8,
                    "improvement": "+12%"
                }
            },
            "recommendations": [
                "Focus on advanced physics concepts",
                "Practice more calculus problems"
            ],
            "next_steps": [
                "Schedule more sessions with Dr. Johnson",
                "Complete the recommended exercises"
            ]
        }
        
        return {"success": True, "data": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match-tutor-student")
async def match_tutor_student(request: RecommendationRequest):
    """Match tutor with student using AI"""
    try:
        # Mock AI matching
        matches = [
            {
                "tutor_id": "tutor1",
                "match_score": 95,
                "reasons": [
                    "Expertise matches your needs",
                    "High rating and reviews",
                    "Available at your preferred times"
                ]
            },
            {
                "tutor_id": "tutor2",
                "match_score": 88,
                "reasons": [
                    "Specializes in your subjects",
                    "Good availability",
                    "Competitive pricing"
                ]
            }
        ]
        
        return {"success": True, "data": {"matches": matches}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/career-guidance")
async def generate_career_guidance(request: CareerGuidanceRequest):
    """Generate personalized career guidance"""
    try:
        # Mock career guidance
        guidance = {
            "student_id": request.student_id,
            "assessment": {
                "strengths": ["Analytical thinking", "Problem solving", "Mathematics"],
                "interests": ["Technology", "Science", "Innovation"],
                "personality": "INTJ - Strategic and analytical"
            },
            "recommended_careers": [
                {
                    "name": "Software Engineer",
                    "match_score": 95,
                    "description": "Design and develop software applications",
                    "requirements": ["Computer Science degree", "Programming skills"],
                    "salary": "$85,000 - $150,000",
                    "growth": "High demand, 22% growth expected"
                },
                {
                    "name": "Data Scientist",
                    "match_score": 92,
                    "description": "Analyze complex data to drive business decisions",
                    "requirements": ["Statistics", "Programming", "Machine Learning"],
                    "salary": "$90,000 - $160,000",
                    "growth": "Very high demand, 31% growth expected"
                }
            ],
            "educational_path": {
                "high_school": ["AP Calculus", "AP Physics", "AP Computer Science"],
                "college": ["Computer Science", "Mathematics", "Physics"],
                "graduate": ["Master's in Data Science", "PhD in Computer Science"]
            },
            "action_plan": [
                "Take AP exams in relevant subjects",
                "Build a portfolio of projects",
                "Network with professionals in the field",
                "Apply for internships and research opportunities"
            ]
        }
        
        return {"success": True, "data": guidance}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 