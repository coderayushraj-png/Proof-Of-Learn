import { Project, Task } from '../types';

export class AiMentorService {
  async getAdvice(project: Project, task: Task | undefined, userMessage: string): Promise<string> {
    try {
      // Assuming a token might be needed if the AI endpoint was protected
      // For now it's open, but we can pass token if needed.
      const res = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage, context: { project, task } })
      });
      if (!res.ok) {
        throw new Error("Failed to fetch advice");
      }
      const data = await res.json();
      return data.message;
    } catch (e) {
      console.error(e);
      return "Sorry, I'm having trouble thinking right now. Please try again.";
    }
  }
}

export const aiMentorService = new AiMentorService();
