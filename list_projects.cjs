const { db } = require('./src/db/index.ts');
const { projects } = require('./src/db/schema.ts');

async function test() {
  const result = await db.select().from(projects);
  console.log(result.map(p => p.id));
}
test();
