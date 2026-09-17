const fs = require('fs');

let content = fs.readFileSync('src/pages/workspace/AiMentorPanel.tsx', 'utf8');

content = content.replace(
  'import React, { useState, useRef, useEffect } from "react"',
  'import React, { useState, useRef, useEffect } from "react"\nimport { aiMentorService } from "../../services/AiMentorService"'
);

const oldMockCode = `    // Mock AI Mentor Service
    setTimeout(() => {
      let responseText = ""
      const lowerText = text.toLowerCase()
      
      if (lowerText.includes("failed a test")) {
        responseText = \`I see you failed a test. Let's analyze it.\\n\\nThe test expected one thing but received something else. Often this happens when your API is returning the wrong status code or format. Check your endpoint implementation and ensure you're sending the exact expected payload.\`
      } else if (lowerText.includes("hint") && task) {
        responseText = \`Instead of giving you the answer directly, let's look at the requirements.\\n\\nYou need to: *$\{task.requirements[0] || 'complete the objective'}*.\\n\\nWhat is the first step you think you should take to achieve that?\`
      } else if ((lowerText.includes("debug") || lowerText.includes("error")) && task) {
        responseText = \`Let's debug it together. What does the error message say exactly? \\n\\nAlso, check if you've correctly implemented the acceptance criteria: *$\{task.criteria[0] || 'verify inputs'}*.\`
      } else if (lowerText.includes("explain") && task) {
        responseText = task.concepts.length > 0 
          ? \`Sure. One of the core concepts here is **$\{task.concepts[0].title}**.\\n\\n$\{task.concepts[0].description}\\n\\nDoes that make sense in the context of what you're trying to build?\`
          : \`This task is mostly about applying what you've learned. The main objective is to $\{task.objective.toLowerCase()}.\`
      } else if (task) {
        responseText = \`That's an interesting approach. Remember, the goal of this task is to:\\n\\n> $\{task.objective}\\n\\nHow does your idea align with that?\`
      } else {
        responseText = \`I'm here to help you with your project. Tell me what you're stuck on.\`
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "mentor",
        content: responseText
      }])
      setIsTyping(false)
    }, 1200)`;

const newCode = `    aiMentorService.getAdvice(project, task, text).then(responseText => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "mentor",
        content: responseText
      }])
      setIsTyping(false)
    });`;

if (content.includes('// Mock AI Mentor Service')) {
    content = content.replace(oldMockCode, newCode);
    fs.writeFileSync('src/pages/workspace/AiMentorPanel.tsx', content);
} else {
    console.log("Mock code not found to replace.");
}

