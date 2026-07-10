# IntelliDART STEM Tutor Marketplace
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

## Overview
IntelliDART is a multi-tenant tutor marketplace connecting STEM students with tutors. It features JWT-based role authentication, a Prisma ORM schema managing 7 relational models on an AWS RDS PostgreSQL database, and integrated WebRTC peer-to-peer video streaming and Stripe API payment gateways.

## System Architecture
```mermaid
graph LR
    Client[React Client] <-->|WebRTC Video & Auth| Server[Node.js / Express API]
    Server <-->|Prisma ORM| RDS[AWS RDS PostgreSQL]
    Server -->|Stripe Checkout| Stripe[Stripe API]
    Server <-->|Recommendations| AIService[FastAPI Python Microservice]
```

## Features
- Role-based authorization (Student, Tutor, Admin) using JWT.
- Database schemas managed with Prisma ORM (7 relational tables: users, students, tutors, sessions, reports, knowledge_graphs, career_milestones).
- Session booking workflows with Stripe checkout simulation.
- Peer-to-peer live tutoring sessions using WebRTC.

## Tech Stack
- React.js with Material-UI and Redux state management
- Node.js & Express.js backend with TypeScript
- PostgreSQL database on AWS RDS via Prisma ORM
- FastAPI Python microservice for mock AI recommendations

## Getting Started
To configure and run the project locally, clone the repository and execute the setup instructions:

```bash
git clone https://github.com/Raghuram-sekar/IntelliDART.git
cd IntelliDART

# Execute local setup commands:
cd backend && npm install
cd ../frontend && npm install
npm run dev
```
