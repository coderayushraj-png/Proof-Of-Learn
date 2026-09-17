import { Project, Task } from '../types';

export interface MentorContext {
  project: Project;
  currentTask: Task;
  studentProgress: number;
  completedTasks: string[];
  testResults: any[];
  conversationHistory: any[];
}

export interface MentorResponse {
  message: string;
  suggestedActions: string[];
  hintLevel: 'subtle' | 'direct' | 'solution';
}

export class AiMentorService {
  /**
   * Generates a response from the AI Mentor based on the student's current context.
   * This is a service abstraction ready to be connected to an actual AI provider (e.g., Gemini).
   */
  async getAdvice(context: MentorContext, userMessage: string): Promise<MentorResponse> {
    // TODO: Connect to AI Provider (e.g. Gemini)
    // For now, return a placeholder response
    
    return {
      message: "I am your AI Mentor. I can see you're working on " + context.project.title + ". How can I help you?",
      suggestedActions: ["Help me understand the objective", "Give me a subtle hint"],
      hintLevel: 'subtle'
    };
  }
}

export const aiMentorService = new AiMentorService();
