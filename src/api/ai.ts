import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });

router.post('/mentor', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    // For MVP, if no real API key, return a mock, otherwise call Gemini
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
      const lowerText = prompt.toLowerCase();
      let responseText = "";
      if (lowerText.includes("failed a test")) {
        responseText = "I see you failed a test. Let's analyze it.\\n\\nThe test expected one thing but received something else. Check your endpoint implementation.";
      } else if (lowerText.includes("hint") && context?.task) {
        responseText = `Instead of giving you the answer directly, let's look at the requirements.\\n\\nYou need to: *${context.task.requirements[0] || 'complete the objective'}*.\\n\\nWhat is the first step you think you should take to achieve that?`;
      } else if ((lowerText.includes("debug") || lowerText.includes("error")) && context?.task) {
        responseText = `Let's debug it together. What does the error message say exactly? \\n\\nAlso, check if you've correctly implemented the acceptance criteria: *${context.task.criteria[0] || 'verify inputs'}*.`;
      } else if (lowerText.includes("explain") && context?.task) {
        responseText = context.task.concepts?.length > 0 
          ? `Sure. One of the core concepts here is **${context.task.concepts[0].title}**.\\n\\n${context.task.concepts[0].description}\\n\\nDoes that make sense in the context of what you're trying to build?`
          : `This task is mostly about applying what you've learned. The main objective is to ${context.task.objective.toLowerCase()}.`;
      } else if (context?.task) {
        responseText = `That's an interesting approach. Remember, the goal of this task is to:\\n\\n> ${context.task.objective}\\n\\nHow does your idea align with that?`;
      } else {
        responseText = `I'm here to help you with your project. Tell me what you're stuck on.`;
      }
      return res.json({ message: responseText });
    }

    // Call Gemini
    const systemInstruction = `You are a helpful programming mentor. 
Context: You are helping a student with the project "${context?.project?.title}". 
Current Task: "${context?.task?.title}".
Objective: "${context?.task?.objective}".
Do not give the code solution directly. Guide them by asking questions and pointing them to the requirements.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction
      }
    });

    res.json({ message: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'AI Mentor failed', message: error.message });
  }
});

export default router;
