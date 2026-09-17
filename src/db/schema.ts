import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  boolean,
  primaryKey,
  jsonb
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatarUrl: text('avatar_url'),
  role: text('role').default('STUDENT').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  difficulty: text('difficulty').notNull(),
  estimatedMinutes: integer('estimated_minutes').notNull(),
  featured: boolean('featured').default(false).notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  objective: text('objective').notNull(),
  position: integer('position').notNull(),
  required: boolean('required').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const requirements = pgTable('requirements', {
  id: serial('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  taskId: text('task_id').references(() => tasks.id),
  description: text('description').notNull(),
  category: text('category').notNull(),
  required: boolean('required').default(true).notNull(),
});

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  taskId: text('task_id').references(() => tasks.id),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  url: text('url').notNull(),
  estimatedMinutes: integer('estimated_minutes'),
});

export const userProjects = pgTable('user_projects', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  status: text('status').default('IN_PROGRESS').notNull(),
  progress: integer('progress').default(0).notNull(),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

export const userTasks = pgTable('user_tasks', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  taskId: text('task_id').references(() => tasks.id).notNull(),
  status: text('status').default('IN_PROGRESS').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  hintsUsed: integer('hints_used').default(0).notNull(),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

export const testRuns = pgTable('test_runs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  passedCount: integer('passed_count').notNull(),
  totalCount: integer('total_count').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const testResults = pgTable('test_results', {
  id: serial('id').primaryKey(),
  testRunId: text('test_run_id').references(() => testRuns.id).notNull(),
  testId: text('test_id').notNull(),
  status: text('status').notNull(),
  expected: text('expected'),
  received: text('received'),
  errorMsg: text('error_msg'),
});

export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  projectId: text('project_id').references(() => projects.id).notNull(),
  githubUrl: text('github_url').notNull(),
  demoUrl: text('demo_url'),
  description: text('description'),
  technologies: jsonb('technologies').$type<string[]>().default([]),
  status: text('status').default('VERIFIED').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow(),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  category: text('category').notNull(),
});

export const userSkills = pgTable('user_skills', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  skillId: integer('skill_id').references(() => skills.id).notNull(),
  projectCount: integer('project_count').default(1).notNull(),
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  userProjects: many(userProjects),
  userTasks: many(userTasks),
  submissions: many(submissions),
  testRuns: many(testRuns),
  userSkills: many(userSkills),
  notifications: many(notifications),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
  requirements: many(requirements),
  resources: many(resources),
  userProjects: many(userProjects),
  testRuns: many(testRuns),
  submissions: many(submissions),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  requirements: many(requirements),
  resources: many(resources),
  userTasks: many(userTasks),
}));

export const userProjectsRelations = relations(userProjects, ({ one }) => ({
  user: one(users, {
    fields: [userProjects.userId],
    references: [users.uid],
  }),
  project: one(projects, {
    fields: [userProjects.projectId],
    references: [projects.id],
  }),
}));
