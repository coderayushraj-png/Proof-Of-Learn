import { Project } from "../types"

export const allProjects: Project[] = [
  {
    id: "ai-resume-analyzer",
    title: "AI Resume Analyzer",
    description: "Build a tool that parses resumes and provides AI-driven feedback.",
    fullDescription: "In this project, you will build a full-stack application that allows users to upload their resume text and receive constructive, AI-generated feedback. You'll learn how to safely wrap AI APIs on the backend, handle external requests, and build a responsive frontend to display structured data.",
    difficulty: "Intermediate",
    estHours: "12h",
    tags: ["React", "Node.js", "OpenAI", "REST API"],
    category: "AI Integration",
    skills: ["Frontend", "Backend", "AI API", "REST"],
    featured: true,
    
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

      {
        id: "task-01",
        title: "Setup and Architecture",
        objective: "Initialize the project structure and understand the data flow.",
        why: "A solid architectural foundation prevents messy code later. Setting up both frontend and backend correctly is crucial for full-stack apps.",
        instructions: ["Initialize the frontend repository.", "Initialize the backend repository."],
        requirements: ["Create package.json files", "Set up basic routing"],
        criteria: ["Frontend starts on port 3000", "Backend starts on port 8080"],
        concepts: [
          {
            title: "Client-Server Architecture",
            description: "A system where clients request resources and servers provide them. Your frontend is the client; your backend is the server."
          }
        ],
        hints: [
          "Use vite to initialize the frontend.",
          "Use express for a quick backend setup."
        ],
        initialCode: "// Initialize your server here\n"
      },
      {
        id: "task-02",
        title: "Frontend Upload Component",
        objective: "Build a UI for users to paste or upload their resume text.",
        why: "Users need a way to input data. Handling large text inputs properly ensures a good user experience.",
        instructions: ["Create a form with a textarea.", "Add a submit button.", "Handle loading states."],
        requirements: ["Textarea for input", "Submit button", "Display loading state when submitting"],
        criteria: ["Form prevents default submission", "State updates on typing", "Loading indicator is visible during fetch"],
        concepts: [
          {
            title: "Controlled Components",
            description: "React components where form data is handled by the component's state.",
            example: "const [text, setText] = useState(''); <textarea value={text} onChange={e => setText(e.target.value)} />"
          }
        ],
        hints: [
          "Use React's useState to manage the textarea input.",
          "Don't forget to use e.preventDefault() in your form submit handler."
        ],
        initialCode: "export function ResumeForm() {\n  return <form></form>\n}"
      },
      {
        id: "task-03",
        title: "Backend API Setup",
        objective: "Create a Node.js server with an endpoint to receive the resume text.",
        why: "The backend acts as a secure intermediary. We never want to put our AI API keys in the frontend where users can steal them.",
        instructions: ["Set up an Express server.", "Create a POST /api/analyze endpoint.", "Parse incoming JSON."],
        requirements: ["Express server running", "POST /api/analyze route exists", "Extract resume text from request body"],
        criteria: ["Server accepts POST requests to /api/analyze", "Returns 400 if text is missing"],
        concepts: [
          {
            title: "REST APIs",
            description: "An architectural style for APIs. POST is used to send data to the server to create/process a resource."
          }
        ],
        hints: [
          "Use express.json() middleware to parse the incoming body.",
          "Check req.body.text in your route handler."
        ],
        initialCode: "const express = require('express');\nconst app = express();\n"
      },
      {
        id: "task-04",
        title: "Connect the AI API",
        objective: "Create an API endpoint that accepts resume text and returns structured feedback generated by an AI model.",
        why: "Most modern applications don't run AI models directly in the browser. Your backend will act as a secure layer between the frontend and the AI service.",
        instructions: ["Install the AI SDK.", "Authenticate using environment variables.", "Send the text and return the response."],
        requirements: ["Create an API endpoint", "Accept resume text", "Validate the request", "Send the request to the AI service", "Return structured JSON", "Handle API errors"],
        criteria: ["Endpoint accepts POST requests", "Invalid requests return an appropriate status code", "AI response is returned as JSON", "API errors are handled", "API key is never exposed to the frontend"],
        concepts: [
          {
            title: "Environment Variables",
            description: "Environment variables allow applications to store configuration such as API keys outside the source code.",
            example: "process.env.GEMINI_API_KEY"
          },
          {
            title: "HTTP POST",
            description: "The HTTP method used to send data to a server to create or update a resource."
          }
        ],
        hints: [
          "Start by checking how your backend receives the request body.",
          "Your endpoint needs to extract the resume text from the incoming JSON.",
          "Think about how a POST request body is accessed in your backend framework."
        ],
        initialCode: "app.post('/api/analyze', async (req, res) => {\n  // Implementation here\n});"
      },
      {
        id: "task-05",
        title: "Test your integration",
        objective: "Ensure the frontend correctly calls the backend and displays the results.",
        why: "Integration testing confirms that different parts of your system work together seamlessly.",
        instructions: ["Update frontend to call your API.", "Parse the AI JSON response.", "Display feedback sections nicely."],
        requirements: ["Fetch from /api/analyze", "Handle network errors on frontend", "Render structured feedback"],
        criteria: ["Frontend successfully gets a response", "Error messages are shown to user if API fails"],
        concepts: [
          {
            title: "Fetch API",
            description: "The modern interface for making HTTP requests in the browser.",
            example: "fetch('/api/analyze', { method: 'POST', body: JSON.stringify({text}) })"
          }
        ],
        hints: [
          "Use fetch or axios in your frontend form submit handler.",
          "Remember to await the response.json()."
        ],
        initialCode: "const handleSubmit = async (e) => {\n  e.preventDefault();\n  // Add fetch here\n};"
      }
    ]
  },
  {
    id: "e-commerce-cart",
    title: "E-Commerce Shopping Cart",
    description: "Implement a robust shopping cart with state management and local storage.",
    fullDescription: "Learn advanced React state management by building a shopping cart that persists data, calculates totals, and manages inventory.",
    difficulty: "Advanced",
    estHours: "18h",
    tags: ["React", "Redux", "TypeScript"],
    category: "Frontend Architecture",
    skills: ["Frontend", "State Management", "React"],
    tasks: [
      {
        id: "ecc-01",
        title: "Setup State",
        objective: "Initialize state management",
        why: "", instructions: [], requirements: [], criteria: [], concepts: [], hints: []
      }
    ]
  },
  {
    id: "realtime-chat",
    title: "Real-time Chat App",
    description: "Build a multiplayer chat application using WebSockets.",
    fullDescription: "Dive into real-time networking by building a chat app with rooms, presence indicators, and message history.",
    difficulty: "Advanced",
    estHours: "24h",
    tags: ["React", "Node.js", "Socket.io"],
    category: "Real-time Systems",
    skills: ["Frontend", "Backend", "WebSockets"],
    tasks: []
  },
  {
    id: "personal-blog",
    title: "Static Blog Generator",
    description: "Create a blog platform that renders markdown to static HTML.",
    fullDescription: "Understand file system operations and build processes by creating your own static site generator.",
    difficulty: "Beginner",
    estHours: "8h",
    tags: ["Node.js", "Markdown", "HTML"],
    category: "Tooling",
    skills: ["Backend", "File System", "Node.js"],
    tasks: []
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    description: "Fetch and visualize weather data from public APIs.",
    fullDescription: "Practice working with external APIs, asynchronous JavaScript, and data visualization libraries.",
    difficulty: "Beginner",
    estHours: "6h",
    tags: ["JavaScript", "APIs", "CSS"],
    category: "Frontend Applications",
    skills: ["Frontend", "APIs", "Data Viz"],
    tasks: []
  }
];
