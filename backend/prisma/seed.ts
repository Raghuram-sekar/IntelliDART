import { PrismaClient, UserRole, SessionStatus, ReportType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Indian names for realistic data
const indianFirstNames = [
  'Arjun', 'Priya', 'Rajesh', 'Anjali', 'Amit', 'Meera', 'Vikram', 'Zara', 'Rohan', 'Aisha',
  'Aditya', 'Neha', 'Karan', 'Pooja', 'Siddharth', 'Kavya', 'Rahul', 'Divya', 'Aryan', 'Ishita',
  'Vivek', 'Tanvi', 'Krishna', 'Ananya', 'Dhruv', 'Riya', 'Arnav', 'Sneha', 'Ishaan', 'Mira',
  'Shaurya', 'Avni', 'Vedant', 'Kiara', 'Advait', 'Zara', 'Kartik', 'Anika', 'Rudra', 'Aaradhya',
  'Yash', 'Diya', 'Aarav', 'Myra', 'Vihaan', 'Aisha', 'Kabir', 'Ira', 'Ayaan', 'Zara'
];

const indianLastNames = [
  'Sharma', 'Kumar', 'Patel', 'Singh', 'Reddy', 'Verma', 'Gupta', 'Khan', 'Mehta', 'Joshi',
  'Chopra', 'Malhotra', 'Kapoor', 'Bhatt', 'Desai', 'Iyer', 'Nair', 'Menon', 'Pillai', 'Nayak',
  'Mishra', 'Tiwari', 'Yadav', 'Kaur', 'Gill', 'Dhillon', 'Saini', 'Chauhan', 'Tomar', 'Rathore',
  'Solanki', 'Parmar', 'Rana', 'Bisht', 'Negi', 'Rawat', 'Kandari', 'Bhandari', 'Thakur', 'Pandey'
];

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History', 'Geography',
  'Economics', 'Political Science', 'Psychology', 'Sociology', 'Philosophy', 'Literature', 'Art', 'Music',
  'Physical Education', 'Environmental Science', 'Statistics', 'Engineering', 'Medicine', 'Law', 'Business',
  'Finance', 'Marketing', 'Human Resources', 'Information Technology', 'Data Science', 'Artificial Intelligence',
  'Machine Learning', 'Cybersecurity', 'Web Development', 'Mobile Development', 'Game Development', 'UI/UX Design'
];

const topics = {
  'Mathematics': ['Algebra', 'Calculus', 'Geometry', 'Trigonometry', 'Statistics', 'Linear Algebra', 'Number Theory', 'Differential Equations'],
  'Physics': ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Quantum Physics', 'Relativity', 'Nuclear Physics', 'Wave Physics'],
  'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry', 'Analytical Chemistry', 'Polymer Chemistry'],
  'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Evolution', 'Microbiology', 'Immunology', 'Neurobiology', 'Plant Biology'],
  'Computer Science': ['Programming', 'Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems', 'Computer Networks', 'Software Engineering']
};

const learningStyles = ['Visual', 'Auditory', 'Kinesthetic', 'Analytical', 'Logical', 'Creative', 'Practical', 'Experimental'];
const expertiseLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const grades = [9, 10, 11, 12, 13]; // Including college level

const goals = [
  'IIT JEE Preparation', 'NEET Exam', 'AP Exams', 'SAT Preparation', 'GRE Preparation', 'Medical School',
  'Engineering Career', 'Research Career', 'Data Science', 'Software Engineering', 'Business Administration',
  'Law School', 'Arts and Design', 'Sports Career', 'Entrepreneurship', 'Government Services'
];

const interests = [
  'Programming', 'Robotics', 'AI/ML', 'Medicine', 'Research', 'Healthcare', 'Engineering', 'Problem Solving',
  'Innovation', 'Data Analysis', 'Technology', 'Mechanics', 'Design', 'Biology', 'Chemistry', 'Physics',
  'Mathematics', 'Literature', 'History', 'Art', 'Music', 'Sports', 'Business', 'Finance', 'Marketing'
];

const educationLevels = [
  'PhD in Physics, IIT Delhi', 'M.Tech in Computer Science, IIT Bombay', 'PhD in Chemistry, IISc Bangalore',
  'M.Tech in Mathematics, IIT Kanpur', 'PhD in Electrical Engineering, IIT Madras', 'PhD in Biology, IISc',
  'M.Tech in Data Science, IIT Hyderabad', 'PhD in Computer Science, IIT Kharagpur', 'M.Tech in AI, IIT Roorkee',
  'PhD in Mathematics, TIFR Mumbai', 'M.Tech in Biotechnology, IIT Guwahati', 'PhD in Economics, Delhi School of Economics'
];

const bios = [
  'Expert in advanced mathematics and physics with extensive teaching experience. Specializes in making complex concepts accessible to students.',
  'Senior software engineer turned educator. Expert in programming fundamentals and competitive coding.',
  'Research scientist with expertise in organic chemistry and molecular biology. Passionate about making science engaging.',
  'Data scientist and mathematics educator. Expert in statistics and machine learning applications.',
  'Electrical engineer with deep knowledge of physics and engineering principles. Excellent at practical applications.',
  'Biotechnology researcher with strong background in molecular biology and genetic engineering.',
  'AI/ML specialist with expertise in deep learning and neural networks. Experienced in industry applications.',
  'Economics professor with focus on development economics and policy analysis.',
  'Literature professor specializing in modern Indian literature and comparative studies.',
  'History professor with expertise in ancient civilizations and cultural studies.'
];

interface TutorData {
  name: string;
  email: string;
  expertise: string[];
  subjects: string[];
  rating: number;
  hourlyRate: number;
  experience: number;
  education: string;
  bio: string;
  keywords: string[];
}

interface StudentData {
  name: string;
  email: string;
  grade: number;
  subjects: string[];
  goals: string[];
  interests: string[];
  learningStyle: string;
  targetScore: number;
  currentLevel: string;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomName(): string {
  const firstName = getRandomElement(indianFirstNames);
  const lastName = getRandomElement(indianLastNames);
  return `${firstName} ${lastName}`;
}

function generateRandomEmail(name: string, counter: number = 0): string {
  const domains = ['intellidart.com', 'gmail.com', 'yahoo.com', 'outlook.com'];
  const domain = getRandomElement(domains);
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  const suffix = counter > 0 ? `.${counter}` : '';
  return `${cleanName}${suffix}@${domain}`;
}

async function main() {
  console.log('🌱 Seeding database with massive realistic data...');

  // Clear existing data
  await prisma.report.deleteMany();
  await prisma.session.deleteMany();
  await prisma.student.deleteMany();
  await prisma.tutor.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.STUDENT,
    }
  });

  await prisma.student.create({
    data: {
      userId: testUser.id,
      grade: 11,
      subjects: ['Mathematics', 'Physics'],
      goals: ['IIT JEE Preparation'],
      interests: ['Engineering'],
      learningStyle: 'Visual',
      targetScore: 90,
      currentLevel: 'Intermediate',
      totalSessions: 10,
      averageRating: 4.5,
      studyHours: 50,
    }
  });

  // Generate 50+ Tutors
  console.log('👨‍🏫 Creating 50+ tutors...');
  const tutors: TutorData[] = [];
  const createdTutors: any[] = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < 55; i++) {
    const name = generateRandomName();
    let email = generateRandomEmail(name);
    let counter = 1;
    
    // Ensure unique email
    while (usedEmails.has(email)) {
      email = generateRandomEmail(name, counter);
      counter++;
    }
    usedEmails.add(email);
    
    const expertise = getRandomElements(subjects, Math.floor(Math.random() * 3) + 2);
    const subjectsList = getRandomElements(topics[expertise[0]] || topics['Mathematics'], Math.floor(Math.random() * 4) + 2) as string[];
    const rating = (Math.random() * 2) + 3.5; // 3.5 to 5.5
    const hourlyRate = Math.floor(Math.random() * 1000) + 500; // 500 to 1500
    const experience = Math.floor(Math.random() * 15) + 2; // 2 to 17 years
    const education = getRandomElement(educationLevels);
    const bio = getRandomElement(bios);
    const keywords = expertise.map(subject => subject.toLowerCase());

    tutors.push({
      name,
      email,
      expertise,
      subjects: subjectsList,
      rating,
      hourlyRate,
      experience,
      education,
      bio,
      keywords
    });
  }

  for (const tutorData of tutors) {
    const user = await prisma.user.create({
      data: {
        name: tutorData.name,
        email: tutorData.email,
        password: await bcrypt.hash('password123', 10),
        role: UserRole.TUTOR,
      }
    });

    const tutor = await prisma.tutor.create({
      data: {
        userId: user.id,
        expertise: tutorData.expertise,
        subjects: tutorData.subjects,
        rating: tutorData.rating,
        hourlyRate: tutorData.hourlyRate,
        experience: tutorData.experience,
        education: tutorData.education,
        bio: tutorData.bio,
        keywords: tutorData.keywords,
        isAvailable: Math.random() > 0.1, // 90% available
        totalSessions: Math.floor(Math.random() * 300) + 50,
        totalStudents: Math.floor(Math.random() * 100) + 10,
      }
    });
    createdTutors.push(tutor);
  }

  // Generate 200+ Students
  console.log('👨‍🎓 Creating 200+ students...');
  const students: StudentData[] = [];
  const createdStudents: any[] = [];

  for (let i = 0; i < 220; i++) {
    const name = generateRandomName();
    let email = generateRandomEmail(name);
    let counter = 1;
    
    // Ensure unique email
    while (usedEmails.has(email)) {
      email = generateRandomEmail(name, counter);
      counter++;
    }
    usedEmails.add(email);
    
    const grade = getRandomElement(grades);
    const studentSubjects = getRandomElements(subjects, Math.floor(Math.random() * 4) + 2);
    const studentGoals = getRandomElements(goals, Math.floor(Math.random() * 3) + 1);
    const studentInterests = getRandomElements(interests, Math.floor(Math.random() * 4) + 2);
    const learningStyle = getRandomElement(learningStyles);
    const targetScore = Math.floor(Math.random() * 30) + 70; // 70 to 100
    const currentLevel = getRandomElement(expertiseLevels);

    students.push({
      name,
      email,
      grade,
      subjects: studentSubjects,
      goals: studentGoals,
      interests: studentInterests,
      learningStyle,
      targetScore,
      currentLevel
    });
  }

  for (const studentData of students) {
    const user = await prisma.user.create({
      data: {
        name: studentData.name,
        email: studentData.email,
        password: await bcrypt.hash('password123', 10),
        role: UserRole.STUDENT,
      }
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        grade: studentData.grade,
        subjects: studentData.subjects,
        goals: studentData.goals,
        interests: studentData.interests,
        learningStyle: studentData.learningStyle,
        targetScore: studentData.targetScore,
        currentLevel: studentData.currentLevel,
        totalSessions: Math.floor(Math.random() * 50) + 5,
        averageRating: (Math.random() * 2) + 3.5,
        studyHours: Math.floor(Math.random() * 200) + 20,
      }
    });
    createdStudents.push(student);
  }

  // Generate 500+ Sessions
  console.log('📚 Creating 500+ sessions...');
  const sessionData: any[] = [];

  for (let i = 0; i < 550; i++) {
    const student = getRandomElement(createdStudents);
    const tutor = getRandomElement(createdTutors);
    const subject = getRandomElement(subjects);
    const topic = getRandomElement(topics[subject] || topics['Mathematics']) as string;
    const duration = Math.floor(Math.random() * 60) + 30; // 30 to 90 minutes
    const rating = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const score = Math.floor(Math.random() * 40) + 60; // 60 to 100
    const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);

    const notes = `Session on ${topic} in ${subject}. Student showed ${rating >= 4 ? 'excellent' : rating >= 3 ? 'good' : 'needs improvement'} understanding.`;
    const studentFeedback = `Great session on ${topic}! ${rating >= 4 ? 'Very helpful and clear explanations.' : 'Need more practice with this topic.'}`;
    const tutorFeedback = `Student is ${rating >= 4 ? 'making excellent progress' : rating >= 3 ? 'showing steady improvement' : 'needs additional support'}.`;

    sessionData.push({
      studentId: student.id,
      tutorId: tutor.id,
      subject,
      topic,
      duration,
      rating,
      notes,
      studentFeedback,
      tutorFeedback,
      score,
      date
    });
  }

  for (const sessionDataItem of sessionData) {
    await prisma.session.create({
      data: {
        studentId: sessionDataItem.studentId,
        tutorId: sessionDataItem.tutorId,
        subject: sessionDataItem.subject,
        topic: sessionDataItem.topic,
        duration: sessionDataItem.duration,
        status: SessionStatus.COMPLETED,
        rating: sessionDataItem.rating,
        notes: sessionDataItem.notes,
        studentFeedback: sessionDataItem.studentFeedback,
        tutorFeedback: sessionDataItem.tutorFeedback,
        score: sessionDataItem.score,
        scheduledTime: sessionDataItem.date,
        completedAt: sessionDataItem.date,
      }
    });
  }

  // Generate 100+ Reports
  console.log('📊 Creating 100+ reports...');
  const reports: any[] = [];

  for (let i = 0; i < 120; i++) {
    const student = getRandomElement(createdStudents);
    const reportTypes = [ReportType.PROGRESS, ReportType.CAREER_GUIDANCE, ReportType.LEARNING_PLAN];
    const reportType = getRandomElement(reportTypes);
    
    let content;
    if (reportType === ReportType.PROGRESS) {
      content = {
        summary: `${student.user?.name} shows ${getRandomElement(['excellent', 'good', 'steady'])} progress in ${getRandomElement(subjects)}.`,
        strengths: getRandomElements(['Strong problem-solving abilities', 'Good grasp of fundamental concepts', 'Consistent performance', 'Excellent analytical skills', 'Strong mathematical intuition'], 3),
        areas: getRandomElements(['Needs more practice with complex topics', 'Focus on time management in exams', 'Improve conceptual understanding', 'Work on problem-solving techniques'], 2),
        recommendations: getRandomElements(['Practice daily', 'Take mock tests regularly', 'Review fundamental concepts weekly', 'Join study groups', 'Use online resources'], 3),
        nextSteps: getRandomElements(['Advanced topics', 'Competition preparation', 'Exam readiness', 'Skill development'], 2),
        score: Math.floor(Math.random() * 40) + 60,
        trend: getRandomElement(['improving', 'steady', 'needs attention'])
      };
    } else if (reportType === ReportType.CAREER_GUIDANCE) {
      content = {
        summary: `${student.user?.name} demonstrates strong aptitude for ${getRandomElement(['medical sciences', 'engineering', 'computer science', 'research', 'business'])}.`,
        strengths: getRandomElements(['Strong foundation in core subjects', 'Excellent analytical thinking', 'Consistent high performance', 'Good problem-solving skills'], 3),
        careerPaths: getRandomElements(['Medical Doctor', 'Research Scientist', 'Software Engineer', 'Data Scientist', 'Business Analyst', 'Teacher'], 3),
        recommendations: getRandomElements(['Focus on exam preparation', 'Join relevant programs', 'Develop practical skills', 'Network with professionals'], 3),
        timeline: getRandomElements(['Complete education', 'Clear entrance exams', 'Professional certification', 'Industry experience'], 3),
        confidence: Math.floor(Math.random() * 30) + 70
      };
    } else {
      content = {
        summary: `${student.user?.name} shows ${getRandomElement(['analytical', 'visual', 'practical'])} learning style.`,
        learningStyle: getRandomElement(learningStyles),
        strengths: getRandomElements(['Logical thinking', 'Problem-solving skills', 'Systematic approach', 'Creative thinking'], 3),
        recommendations: getRandomElements(['Use step-by-step problem solving', 'Practice with structured exercises', 'Focus on conceptual understanding', 'Use visual aids'], 3),
        tools: getRandomElements(['Khan Academy', 'Online simulations', 'Practice problem sets', 'Study apps', 'Video tutorials'], 3),
        progress: getRandomElement(['steady', 'improving', 'needs focus'])
      };
    }

    reports.push({
      studentId: student.id,
      reportType,
      content
    });
  }

  for (const reportData of reports) {
    await prisma.report.create({
      data: {
        studentId: reportData.studentId,
        reportType: reportData.reportType,
        content: reportData.content,
      }
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${tutors.length} tutors and ${students.length} students`);
  console.log(`📚 Created ${sessionData.length} sessions and ${reports.length} reports`);
  console.log('🔑 Test login credentials:');
  console.log('   Email: test@example.com');
  console.log('   Password: password123');
  console.log('   All other users also use password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 