<p align="center">
  <img src="./docs/header.png" alt="FiTrack" width="100%">
</p>

<p align="center">
  <strong>FiTrack Backend</strong>
</p>

<p align="center">
  Backend API for personal finance management with AI-powered insights
</p>

<p align="center">
  <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white" alt="NestJS"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
</p>

---

> **Note**: Services are currently offline due to hosting payment issues. The codebase remains functional and can be deployed on any VPS.

## Overview

FiTrack Backend is a RESTful API for personal finance management with AI-powered insights. Built with NestJS and TypeScript, it handles authentication, transaction processing, and integrates GPT-4o mini for financial analysis.

Developed as a bachelor's thesis at Astana IT University. API docs available at https://fitrack.kz/api/docs (when hosted).

## Features

### Authentication & Security
JWT-based authentication with role-based access control. Users can register and login securely, with support for two roles: admin (full access) and member (limited permissions for shared budgets). Password reset is handled through secure email tokens.

### Financial Management
Complete transaction tracking for income and expenses, with real-time net worth calculation based on assets and liabilities. Users can manage cash, investments, property, and track loans or credit cards. Custom categories enable flexible organization.

### AI-Powered Insights
Integration with GPT-4o mini provides personalized financial analysis through natural language queries. The system analyzes spending patterns over 7, 30, or 90-day periods and generates contextual recommendations based on actual transaction history.

### Automation
PDF bank statement parsing (currently supporting Kaspi Bank format) eliminates manual data entry by automatically extracting and categorizing transactions from uploaded statements.

## Architecture

FiTrack consists of three independent services: the NestJS backend API, a React frontend, and a Python microservice for PDF parsing.

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Frontend                          │
│                      (fitrack.kz:3000)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS/REST
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       NestJS Backend API                        │
│                      (fitrack.kz:3003)                          │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Auth   │  │Transaction│  │  Asset   │  │ Chatbot  │      │
│  │   JWT    │  │   CRUD    │  │Liability │  │ GPT-4o   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
└────────────────────┬───────────────────────┬────────────────────┘
                     │                       │
                     │                       │ HTTP
                     │                       │
                     │              ┌────────▼────────┐
                     │              │  PDF Parser     │
                     │              │  (FastAPI)      │
                     │              │  Port 8000      │
                     │              └────────┬────────┘
                     │                       │
                     ▼                       ▼
            ┌────────────────────────────────────┐
            │         PostgreSQL Database        │
            └────────────────────────────────────┘
```

The backend is organized into feature modules:

```
src/
├── auth/              - JWT authentication & authorization
├── user/              - User profiles and settings
├── transaction/       - Income/expense management
├── asset/             - Asset tracking
├── liability/         - Liability management
├── category/          - Transaction categories
├── family/            - Shared budget groups
├── chatbot/           - AI assistant (GPT-4o mini)
└── common/            - Guards, interceptors, utilities
```

### Database

PostgreSQL with TypeORM as the ORM layer. The schema includes seven core entities: User (authentication and profiles), Transaction (financial records), Asset and Liability (net worth calculation), Category (transaction organization), Family (shared budgets), and Reset_Token (password recovery).

![Entity Relationship Diagram](./docs/erd.png)

### PDF Parsing Service

Separate FastAPI microservice for bank statement processing. Accepts PDF uploads (Kaspi Bank format), extracts tables with pdfplumber, and writes directly to PostgreSQL. Runs independently on port 8000, isolated from the main backend.

## Built With

**Core Framework**  
[NestJS](https://nestjs.com/) - Progressive Node.js framework  
[TypeScript](https://www.typescriptlang.org/) - Language  
[Node.js](https://nodejs.org/) - Runtime

**Database & ORM**  
[PostgreSQL](https://www.postgresql.org/) - Relational database  
[TypeORM](https://typeorm.io/) - Object-relational mapping

**Authentication**  
[Passport](https://www.passportjs.org/) - Authentication middleware  
[passport-jwt](https://github.com/mikenicholson/passport-jwt) - JWT strategy

**AI & Machine Learning**  
[LangChain](https://www.langchain.com/) - LLM orchestration framework  
[OpenAI GPT-4o mini](https://platform.openai.com/docs/models/gpt-4o) - Language model

**Validation & Documentation**  
[class-validator](https://github.com/typestack/class-validator) - DTO validation  
[class-transformer](https://github.com/typestack/class-transformer) - Object transformation  
[Swagger/OpenAPI](https://swagger.io/) - API documentation

## Getting Started

### Prerequisites

- Node.js 16 or higher
- PostgreSQL 13 or higher
- OpenAI API key

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/fitrack_back.git
cd fitrack_back
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=fitrack

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d

# OpenAI
OPENAI_API_KEY=sk-your-key

# Server
PORT=3003
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Running the Application

Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3003`. Interactive API documentation can be accessed at `http://localhost:3003/api/docs`.

For production builds:

```bash
npm run build
npm run start:prod
```

## API Documentation

Full interactive documentation available at `/api/docs` using Swagger UI. All endpoints except authentication require a JWT Bearer token.

![API Documentation](./docs/swagger.png)

### Core Endpoints

**Authentication**: Register with `POST /auth/register`, login via `POST /auth/login`, and reset passwords through `POST /auth/reset-password`.

**Financial Data**: Standard REST operations on `/transaction`, `/asset`, `/liability`, and `/category` endpoints for managing all financial data.

**Collaboration**: Shared budget groups managed through `/family` endpoints.

**AI Assistant**: Natural language queries via `POST /chatbot/analyze`.

Authentication header format:
```bash
Authorization: Bearer <your_jwt_token>
```

## AI Chatbot

Integrates GPT-4o mini via LangChain for context-aware financial analysis. The system fetches user transactions, serializes them to JSON, and includes them in the prompt.

![Chatbot Interface](./docs/chatbot.png)

**Supported periods**: 7, 30, or 90 days (limited by model's context window)

### Example Usage

```bash
POST /chatbot/analyze
Authorization: Bearer <token>

{
  "useTransactions": true,
  "period": "30",
  "prompt": "What did I spend most on?"
}
```

Response:
```json
{
  "result": "Over the past 30 days, your largest expenses were in Food (32%), Transportation (21%), and Entertainment (15%)..."
}
```

## PDF Statement Parsing

Separate FastAPI service handles automatic transaction import from PDF bank statements. Currently supports Kaspi Bank format using pdfplumber for table extraction and writes directly to PostgreSQL on port 8000.

![PDF Upload](./docs/pdf-upload.png)

## Deployment

Originally deployed on ps.kz VPS with PM2 for process management, PostgreSQL database, Nginx reverse proxy, and Let's Encrypt SSL. Currently offline due to hosting payment but can be deployed on any standard VPS.

## Testing

```bash
npm run test          # unit tests
npm run test:e2e      # end-to-end tests
npm run test:cov      # coverage report
```

## Project Context

Bachelor's thesis project at Astana IT University (June 2025), Department of Computing and Data Science.

**Development**: Duman Boranbay
**Documentation**: Alisher Galymzhan, Damir Nygmetollauly  
**Supervisor**: Anar Rakhimzhanova

## License

Academic project - Astana IT University
