import { db } from './src/db/index.ts';
import { projects, tasks, requirements, resources, skills } from './src/db/schema.ts';
import { allProjects } from './src/data/projects.ts';

async function seed() {
  console.log('Seeding projects...');
  for (const proj of allProjects) {
    await db.insert(projects).values({
      id: proj.id,
      title: proj.title,
      slug: proj.id,
      description: proj.description,
      category: proj.category,
      difficulty: proj.difficulty,
      estimatedMinutes: parseInt(proj.estHours) * 60 || 120,
      featured: proj.featured || false,
      tags: proj.tags || []
    }).onConflictDoNothing();

    if (proj.tasks) {
      for (let i = 0; i < proj.tasks.length; i++) {
        const t = proj.tasks[i];
        await db.insert(tasks).values({
          id: t.id,
          projectId: proj.id,
          title: t.title,
          description: t.objective,
          objective: t.objective,
          position: i,
          required: true
        }).onConflictDoNothing();
      }
    }
  }

  // Seed some skills
  const defaultSkills = [
    { name: 'Frontend', category: 'Development' },
    { name: 'Backend', category: 'Development' },
    { name: 'AI API', category: 'AI' },
    { name: 'REST', category: 'Architecture' },
    { name: 'State Management', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'WebSockets', category: 'Network' },
    { name: 'File System', category: 'Backend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'APIs', category: 'Development' },
    { name: 'Data Viz', category: 'Frontend' }
  ];

  for (const skill of defaultSkills) {
    await db.insert(skills).values(skill).onConflictDoNothing();
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(console.error);
