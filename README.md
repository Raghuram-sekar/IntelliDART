# IntelliDART - Online Tutor Marketplace for STEM Students

## Overview
IntelliDART is an online tutor marketplace for STEM students, providing multi-tutor, multi-topic, and multi-fidelity on-demand tutoring, personalized pedagogy, and comprehensive GenAI educational reports.

## Features
- **Multi-tutor Marketplace**: Connect students with qualified STEM tutors
- **AI-Powered Matching**: Intelligent tutor-student matching based on expertise and goals
- **Personalized Learning**: AI-driven knowledge graphs and learning plans
- **Career Guidance**: Comprehensive career exploration and milestone tracking
- **GenAI Reports**: Automated progress reports and analytics
- **Video Integration**: Seamless video conferencing for tutoring sessions

## Technology Stack
- **Frontend**: React.js with TypeScript
- **Backend**: Node.js/Express with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: Python microservice with FastAPI
- **Authentication**: JWT with role-based access
- **Cloud**: AWS (EC2, S3, RDS)
- **Video**: WebRTC integration
- **Payments**: Stripe integration

## Project Structure
```
IntelliDART/
├── frontend/                 # React frontend application
├── backend/                  # Node.js/Express backend API
├── ai-service/              # Python FastAPI AI microservice
├── database/                # Database migrations and schema
├── docs/                    # Documentation
└── docker/                  # Docker configuration
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Docker (optional)

### Development Setup
1. Clone the repository
2. Install dependencies for each service
3. Set up environment variables
4. Run database migrations
5. Start development servers

See individual service READMEs for detailed setup instructions.

## Architecture
- **Frontend**: React SPA with TypeScript, Material-UI
- **Backend**: RESTful API with JWT authentication
- **AI Service**: Python microservice for recommendations and reports
- **Database**: PostgreSQL with Prisma ORM
- **Integrations**: Stripe payments, WebRTC video, OpenAI API

## Development Phases
- **Phase 1**: MVP with user onboarding and basic matching
- **Phase 2**: AI-driven recommendations and reporting
- **Phase 3**: Advanced career guidance and analytics

## Contributing
Please read our contributing guidelines and code of conduct.

## License
MIT License 