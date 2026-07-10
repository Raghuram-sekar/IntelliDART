import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const tutorData = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@intellidart.com",
    expertise: ["Linear Algebra", "Calculus", "Advanced Mathematics", "Statistics"],
    subjects: ["Mathematics", "Statistics", "Calculus"],
    keywords: ["linear algebra", "matrices", "vector spaces", "eigenvalues", "calculus", "derivatives", "integrals"],
    bio: "PhD in Mathematics from MIT with 8 years of teaching experience. Specializes in making complex mathematical concepts accessible to students. Published researcher in linear algebra applications.",
    rating: 4.9,
    experience: 8,
    education: "PhD Mathematics - MIT, MS Applied Mathematics - Stanford",
    hourlyRate: 65,
    sampleVideos: ["https://example.com/sarah-linear-algebra", "https://example.com/sarah-calculus-intro"]
  },
  {
    name: "Prof. Michael Chen",
    email: "michael.chen@intellidart.com",
    expertise: ["Physics", "Quantum Mechanics", "Thermodynamics", "Mathematical Physics"],
    subjects: ["Physics", "Mathematics", "Engineering Physics"],
    keywords: ["quantum mechanics", "thermodynamics", "wave functions", "statistical mechanics", "mathematical physics"],
    bio: "Professor of Physics at UC Berkeley with 12 years of experience. Expert in quantum mechanics and mathematical physics. Known for innovative teaching methods.",
    rating: 4.8,
    experience: 12,
    education: "PhD Physics - UC Berkeley, MS Physics - Caltech",
    hourlyRate: 70,
    sampleVideos: ["https://example.com/michael-quantum", "https://example.com/michael-thermo"]
  },
  {
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@intellidart.com",
    expertise: ["Organic Chemistry", "Biochemistry", "Molecular Biology", "Chemical Analysis"],
    subjects: ["Chemistry", "Biology", "Biochemistry"],
    keywords: ["organic chemistry", "biochemistry", "molecular biology", "chemical reactions", "lab techniques"],
    bio: "PhD in Chemistry from Harvard with 6 years of research and teaching experience. Specializes in organic chemistry and biochemistry applications.",
    rating: 4.7,
    experience: 6,
    education: "PhD Chemistry - Harvard, BS Chemistry - Yale",
    hourlyRate: 60,
    sampleVideos: ["https://example.com/emily-organic", "https://example.com/emily-biochem"]
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@intellidart.com",
    expertise: ["Computer Science", "Algorithms", "Data Structures", "Machine Learning"],
    subjects: ["Computer Science", "Programming", "Mathematics"],
    keywords: ["algorithms", "data structures", "machine learning", "python", "java", "programming"],
    bio: "PhD in Computer Science from Stanford with 10 years of industry and academic experience. Expert in algorithms and machine learning applications.",
    rating: 4.9,
    experience: 10,
    education: "PhD Computer Science - Stanford, MS Computer Science - CMU",
    hourlyRate: 75,
    sampleVideos: ["https://example.com/james-algorithms", "https://example.com/james-ml"]
  },
  {
    name: "Dr. Lisa Thompson",
    email: "lisa.thompson@intellidart.com",
    expertise: ["Calculus", "Differential Equations", "Real Analysis", "Mathematical Modeling"],
    subjects: ["Mathematics", "Applied Mathematics", "Engineering Mathematics"],
    keywords: ["calculus", "differential equations", "real analysis", "mathematical modeling", "derivatives", "integrals"],
    bio: "PhD in Applied Mathematics with 7 years of teaching experience. Specializes in calculus and differential equations with real-world applications.",
    rating: 4.8,
    experience: 7,
    education: "PhD Applied Mathematics - Princeton, MS Mathematics - MIT",
    hourlyRate: 62,
    sampleVideos: ["https://example.com/lisa-calculus", "https://example.com/lisa-diffeq"]
  },
  {
    name: "Dr. Robert Kumar",
    email: "robert.kumar@intellidart.com",
    expertise: ["Linear Algebra", "Abstract Algebra", "Number Theory", "Discrete Mathematics"],
    subjects: ["Mathematics", "Discrete Mathematics", "Abstract Algebra"],
    keywords: ["linear algebra", "abstract algebra", "number theory", "discrete math", "group theory", "ring theory"],
    bio: "PhD in Pure Mathematics with 9 years of teaching experience. Expert in linear algebra and abstract mathematical structures. Passionate about mathematical proofs.",
    rating: 4.7,
    experience: 9,
    education: "PhD Pure Mathematics - University of Chicago, MS Mathematics - Northwestern",
    hourlyRate: 58,
    sampleVideos: ["https://example.com/robert-linear", "https://example.com/robert-abstract"]
  },
  {
    name: "Dr. Maria Garcia",
    email: "maria.garcia@intellidart.com",
    expertise: ["Statistics", "Data Science", "Probability Theory", "Statistical Modeling"],
    subjects: ["Statistics", "Mathematics", "Data Science"],
    keywords: ["statistics", "data science", "probability", "statistical modeling", "hypothesis testing", "regression"],
    bio: "PhD in Statistics with 5 years of experience in both academia and industry. Expert in statistical modeling and data analysis applications.",
    rating: 4.6,
    experience: 5,
    education: "PhD Statistics - UC Berkeley, MS Statistics - Stanford",
    hourlyRate: 55,
    sampleVideos: ["https://example.com/maria-stats", "https://example.com/maria-data"]
  },
  {
    name: "Dr. David Lee",
    email: "david.lee@intellidart.com",
    expertise: ["Biology", "Genetics", "Molecular Biology", "Biotechnology"],
    subjects: ["Biology", "Genetics", "Life Sciences"],
    keywords: ["biology", "genetics", "molecular biology", "biotechnology", "DNA", "cell biology"],
    bio: "PhD in Biology from Johns Hopkins with 8 years of research and teaching experience. Specializes in genetics and molecular biology applications.",
    rating: 4.8,
    experience: 8,
    education: "PhD Biology - Johns Hopkins, BS Biology - Duke",
    hourlyRate: 63,
    sampleVideos: ["https://example.com/david-biology", "https://example.com/david-genetics"]
  }
];

async function seedTutors() {
  console.log('🌱 Seeding tutor data...');

  for (const tutor of tutorData) {
    try {
      // Create user account for tutor
      const hashedPassword = await bcrypt.hash('tutor123', 10);
      
      const user = await prisma.user.create({
        data: {
          name: tutor.name,
          email: tutor.email,
          password: hashedPassword,
          role: UserRole.TUTOR,
        }
      });

      // Create tutor profile
      await prisma.tutor.create({
        data: {
          userId: user.id,
          expertise: tutor.expertise,
          subjects: tutor.subjects,
          keywords: tutor.keywords,
          bio: tutor.bio,
          rating: tutor.rating,
          experience: tutor.experience,
          education: tutor.education,
          hourlyRate: tutor.hourlyRate,
          sampleVideos: tutor.sampleVideos,
          isAvailable: true,
          totalSessions: Math.floor(Math.random() * 100) + 20, // Random sessions between 20-120
          totalStudents: Math.floor(Math.random() * 50) + 10,  // Random students between 10-60
        }
      });

      console.log(`✅ Created tutor: ${tutor.name}`);
    } catch (error) {
      console.log(`⚠️  Tutor ${tutor.name} might already exist, skipping...`);
    }
  }

  console.log('🎉 Tutor seeding completed!');
}

async function main() {
  await seedTutors();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
