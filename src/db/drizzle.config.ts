import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

if (!connectionString && (!sqlHost || !sqlDbName || !user || !password)) {
  console.warn("Missing database credentials. This is expected if running in browser or during initial build.");
}

export default defineConfig(connectionString ? {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    url: connectionString
  },
  verbose: true,
} : {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    host: sqlHost || 'localhost',
    user: user || 'admin',
    password: password || 'pass',
    database: sqlDbName || 'db',
    ssl: false,
  },
  verbose: true,
});
