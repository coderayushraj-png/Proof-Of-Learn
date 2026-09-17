import { db } from './index.ts';
import { projects, tasks, requirements, resources, skills } from './schema.ts';

async function seed() {
  console.log("Seeding database...");
  
  const demoProjects = [
    {
      id: "proj-1",
      title: "Task Management API",
      slug: "task-management-api",
      description: "Build a RESTful API for managing tasks with user authentication.",
      category: "Backend",
      difficulty: "Beginner",
      estimatedMinutes: 120,
      featured: true,
      tags: ["Node.js", "Express", "REST"]
    },
    {
      id: "proj-2",
      title: "Real-time Chat App",
      slug: "real-time-chat-app",
      description: "Create a WebSocket-based chat application with chat rooms.",
      category: "Fullstack",
      difficulty: "Intermediate",
      estimatedMinutes: 240,
      featured: true,
      tags: ["React", "WebSockets", "Node.js"]
    }
  ];

  for (const proj of demoProjects) {
    await db.insert(projects).values(proj).onConflictDoNothing();
  }

  const demoTasks = [
    {
      id: "task-1-1",
      projectId: "proj-1",
      title: "Setup Project",
      description: "Initialize the Node.js project and install dependencies.",
      objective: "Create a basic Express server.",
      position: 1,
      required: true
    },
    {
      id: "task-1-2",
      projectId: "proj-1",
      title: "Create Endpoints",
      description: "Implement CRUD endpoints for tasks.",
      objective: "Build GET, POST, PUT, DELETE for /tasks.",
      position: 2,
      required: true
    }
  ];

  for (const t of demoTasks) {
    await db.insert(tasks).values(t).onConflictDoNothing();
  }

  console.log("Database seeded.");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
