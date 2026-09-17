export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Concept {
  title: string;
  description: string;
  example?: string;
}

export interface Task {
  id: string;
  title: string;
  objective: string;
  why: string;
  instructions: string[];
  requirements: string[];
  criteria: string[];
  concepts: Concept[];
  hints: string[];
  initialCode?: string;
}

export type TestCategory = "Functional" | "API" | "Validation" | "UI" | "Security" | "Deployment";

export interface ProjectTest {
  id: string;
  description: string;
  category: TestCategory;
  expected: string;
  taskId?: string; // Links test to a specific task
}

export interface TestResult {
  testId: string;
  passed: boolean;
  received: string;
  errorMsg?: string;
}

export interface TestRun {
  id: string;
  timestamp: number;
  results: TestResult[];
  passedCount: number;
  totalCount: number;
}

export interface ProjectSubmission {
  githubUrl: string;
  demoUrl?: string;
  description: string;
  technologies: string[];
  features: string[];
  submittedAt: number;
  verified: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  difficulty: Difficulty;
  estHours: string;
  tags: string[];
  category: string;
  skills: string[];
  tasks: Task[];
  tests?: ProjectTest[];
  featured?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: "success" | "info" | "warning" | "error";
  createdAt: number;
}

export interface TaskAnalytics {
  timeSpent: number; // in minutes
  attempts: number;
  hintsUsed: number;
  completed: boolean;
}

export interface UserState {
  startedProjects: string[]; 
  completedTasks: Record<string, string[]>; // projectId -> array of task IDs
  taskAnalytics: Record<string, Record<string, TaskAnalytics>>; // projectId -> taskId -> analytics
  testHistory: Record<string, TestRun[]>; // projectId -> history of test runs
  submissions: Record<string, ProjectSubmission>; // projectId -> submission
  completedProjects: string[]; // Array of project IDs
  notifications: AppNotification[];
}
