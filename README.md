# Proof of Learn

## Project Overview

**Proof of Learn** is an interactive, project-based educational platform designed to help software developers build practical skills through hands-on engineering challenges. Rather than passively watching tutorials, users engage directly with realistic, full-stack projects—writing code, fulfilling technical requirements, running automated tests, and receiving context-aware AI mentorship in real-time.

The platform bridges the gap between theoretical knowledge and applied engineering by simulating a true developer workspace and tracking verifiable progress.

## Key Features

- **Project-Based Curriculum:** A diverse, curated catalog of projects ranging from beginner-friendly static sites to advanced "AI Resume Analyzers" and "Real-time Chat Apps".
- **Integrated Workspace:** A comprehensive in-browser learning environment featuring a milestone tracker, code reference panel, and task progression system.
- **Automated Validation:** Instant feedback on submissions through automated testing, criteria validation, and milestone tracking.
- **Context-Aware AI Mentor:** Integrated AI assistance powered by Google Gemini. The mentor is designed to provide helpful nudges, explain complex concepts, and help debug issues without simply giving away the final solution.
- **Dynamic Portfolios & Proof of Work:** Users automatically build a verifiable portfolio showcasing their completed projects, utilized technologies, and mastery of specific software concepts, which serves as a powerful artifact for career advancement.

## Tech Stack

**Frontend**
- **React 19 & Vite:** Fast, modern UI rendering and rapid build tooling.
- **Tailwind CSS:** Highly responsive and accessible component styling.
- **Lucide React:** Clean, consistent iconography.
- **React Router:** Client-side routing for seamless workspace navigation.

**Backend & Database**
- **Node.js & Express:** Lightweight, scalable API layer.
- **PostgreSQL & Drizzle ORM:** Strongly-typed relational database management, ensuring robust data integrity and fast queries.
- **Firebase Auth:** Secure user authentication and session management.

**AI Integration**
- **Google GenAI (Gemini):** Powers the intelligent AI Mentor panel for personalized, conversational learning assistance and dynamic code review.

## Architecture & Workflows

1. **Discovery:** Users browse the `Explore` dashboard to find projects categorized by tech stack, difficulty, and domain (e.g., Frontend Architecture, Backend APIs, AI Integration).
2. **Execution:** Upon starting a project, users enter the `Workspace`—a multi-tab environment dividing the overarching project into achievable, sequential milestones (Tasks).
3. **Assistance & Validation:** Throughout the development lifecycle, users can chat with the AI Mentor for conceptual guidance and run tests in the `Tests` tab to ensure their code meets all functional requirements.
4. **Completion:** Successfully validating all criteria marks the task as complete. Finishing all tasks adds the project to the user's personal `Portfolio`.



## Project Structure

```text
Proof-Of-Learn/
├── src/
│   ├── api/          # Express backend routes (auth, me, projects, admin, ai)
│   ├── components/   # Reusable UI components (shadcn/ui, layout)
│   ├── context/      # React context providers (App state, Firebase Auth)
│   ├── db/           # Drizzle ORM schema, config, and seed scripts
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Integrations (Firebase client/admin wrappers, api helpers)
│   ├── middleware/   # Express middleware (authentication)
│   ├── pages/        # React routing pages (Workspace, Explore, Dashboard, etc)
│   ├── services/     # Frontend logic abstractions (evaluation, AI integration)
│   ├── types/        # Shared TypeScript interfaces
│   ├── utils/        # Generic utilities (e.g. tailwind class merger)
│   ├── App.tsx       # Main React component & router
│   ├── index.css     # Global Tailwind stylesheet
│   └── main.tsx      # Vite entry point
├── docs/             # Audit logs and architectural decisions
├── public/           # Static assets
├── server.ts         # Express server entry point
├── vite.config.ts    # Frontend build configuration
└── package.json      # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL Database
- Firebase Project (for Authentication)
- Google Gemini API Key

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory and configure your secrets (refer to `.env.example` if available). You will need:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/proofoflearn
   GEMINI_API_KEY=your_gemini_api_key
   # Firebase client and admin credentials
   ```

3. **Database Migration & Seeding:**
   Push the schema to your PostgreSQL database:
   ```bash
   npm run db:push
   ```

4. **Run the Development Server:**
   Start the full-stack development environment:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Building for Production

To create an optimized, production-ready build of both the React frontend and the Express backend:

```bash
npm run build
```

This generates the static frontend assets and bundles the backend server into a single `dist/server.cjs` file. Start the production server using:

```bash
npm run start
```
