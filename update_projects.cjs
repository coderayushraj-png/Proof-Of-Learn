const fs = require('fs');

const content = fs.readFileSync('src/data/projects.ts', 'utf8');

const testsString = `
    tests: [
      { id: "test-01", description: "GET /api/health returns 200", category: "API", expected: "HTTP 200 OK", taskId: "task-01" },
      { id: "test-02", description: "POST /api/analyze accepts valid JSON", category: "API", expected: "HTTP 200 OK with JSON response", taskId: "task-03" },
      { id: "test-03", description: "POST /api/analyze rejects missing text", category: "Validation", expected: "HTTP 400 Bad Request", taskId: "task-03" },
      { id: "test-04", description: "AI service returns structured JSON", category: "Functional", expected: "Response contains 'feedback' key", taskId: "task-04" },
      { id: "test-05", description: "API key is not exposed to frontend", category: "Security", expected: "No API keys in client bundle", taskId: "task-04" },
      { id: "test-06", description: "Form displays loading state during request", category: "UI", expected: "Spinner visible when fetching", taskId: "task-02" },
      { id: "test-07", description: "Frontend renders feedback structure", category: "UI", expected: "Feedback sections rendered in DOM", taskId: "task-05" },
      { id: "test-08", description: "Invalid AI response is handled gracefully", category: "Functional", expected: "Error message displayed to user", taskId: "task-05" }
    ],
    tasks: [
`;

const updatedContent = content.replace('tasks: [', testsString);

fs.writeFileSync('src/data/projects.ts', updatedContent);
