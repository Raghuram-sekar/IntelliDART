# 💡 IntelliDART: STEM Online Tutor Marketplace & Career Guidance Platform
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📋 Table of Contents
- [Project Overview](#🎯-project-overview)
- [What This Project Does](#🚀-what-this-project-does)
- [Key Innovation](#🔬-key-innovation)
- [Performance Highlights](#📊-performance-highlights)
- [Architecture](#🏗️-architecture)
- [Tech Stack](#🧱-tech-stack)
- [Quick Start](#💻-quick-start)

---

## 🎯 Project Overview
IntelliDART is a multi-tenant tutor marketplace connecting STEM students with tutors. It features JWT-based role authentication, a Prisma ORM schema managing 7 relational models on an AWS RDS PostgreSQL database, and integrated WebRTC peer-to-peer video streaming and Stripe API payment gateways.

---

## 🚀 What This Project Does
* **The Challenge:** Lack of standardized online platforms connecting STEM students with vetted tutors while providing automated career tracking and real-time interactive classrooms.
* **Our Solution:** A scalable multi-tenant tutoring platform with robust database schemas, secure payment flows, and peer-to-peer WebRTC video classrooms.

---

## 🔬 Key Innovation
| Feature | Traditional Approach ❌ | IntelliDART Solution ✅ | Benefit |
|---------|------------------------|-------------------------|---------|
| **Data Schema** | Single-table collections without strict type checks | **Prisma ORM schema with 7 relational models** | Type-safe queries, migration control |
| **Classroom** | Redirection to Zoom/Meet links | **Embedded WebRTC WebRTC peer-to-peer connections** | Native classroom experience without external accounts |
| **Career Progress** | Manual text diaries or logs | **CareerMilestone & KnowledgeGraph models** | Structured learning and skill-gap tracking |

---

## 📊 Performance Highlights
- ✅ **7 relational models** deployed on AWS RDS.
- ✅ **JWT role onboarding** separating student, tutor, and admin interfaces.
- ✅ **Stripe API integration** simulating instant bookings and credit holding.

---

## 🏗️ Architecture
```mermaid
graph LR
    Client[React Client] <-->|WebRTC Video & Auth| Server[Node.js / Express API]
    Server <-->|Prisma ORM| RDS[AWS RDS PostgreSQL]
    Server -->|Stripe Checkout| Stripe[Stripe API]
    Server <-->|Recommendations| AIService[FastAPI Python Microservice]
```

---

## 🧱 Tech Stack
- React.js with Material-UI and Redux state management
- Node.js & Express.js backend with TypeScript
- PostgreSQL database on AWS RDS via Prisma ORM
- FastAPI Python microservice for mock AI recommendations

---

## 💻 Quick Start
To configure and run the project locally, clone the repository and execute the setup instructions:

```bash
git clone https://github.com/Raghuram-sekar/IntelliDART.git
cd IntelliDART

# Execute local setup commands:
cd backend && npm install
cd ../frontend && npm install
npm run dev
```
