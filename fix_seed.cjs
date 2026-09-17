const fs = require('fs');
let seed = fs.readFileSync('src/db/seed.ts', 'utf8');
let dataStr = fs.readFileSync('src/data/projects.ts', 'utf8');

// The file exports `export const projects = [...]`
dataStr = dataStr.replace('export const projects =', 'const dataProjects =');
let script = dataStr + `

async function seedNew() {
  console.log("Seeding database...");
  const { db } = require('./index.ts');
  const { projects, tasks, requirements, resources, skills } = require('./schema.ts');

  for (const proj of dataProjects) {
    const dbProj = {
      id: proj.id,
      title: proj.title,
      slug: proj.id,
      description: proj.description,
      category: proj.category,
      difficulty: proj.difficulty,
      estimatedMinutes: parseInt(proj.estHours) * 60 || 120,
      featured: proj.id === 'ai-resume-analyzer',
      tags: proj.tags
    };
    await db.insert(projects).values(dbProj).onConflictDoNothing();

    if (proj.tasks) {
      let position = 1;
      for (const t of proj.tasks) {
        const dbTask = {
          id: t.id,
          projectId: proj.id,
          title: t.title,
          description: t.objective || '',
          objective: t.objective || '',
          position: position++,
          required: true
        };
        await db.insert(tasks).values(dbTask).onConflictDoNothing();
      }
    }
  }
  console.log("Database seeded.");
  process.exit(0);
}
seedNew().catch(err => { console.error(err); process.exit(1); });
`;

fs.writeFileSync('src/db/seed_new.ts', script);
