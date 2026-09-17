const fs = require('fs');
let readme = fs.readFileSync('README.md', 'utf8');

readme = readme.replace('- **Tailwind CSS & Framer Motion:** Highly responsive, beautifully animated, and accessible component styling.', '- **Tailwind CSS:** Highly responsive and accessible component styling.');

const structure = `

## Project Structure

\`\`\`text
Proof-Of-Learn/
├── src/
│   ├── api/          # Express backend routes (auth, me, projects, admin, ai)
│   ├── components/   # Reusable UI components (shadcn/ui, layout)
│   ├── context/      # React context providers (App state, Firebase Auth)
│   ├── db/           # Drizzle ORM schema, config, and seed scripts
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Integrations (Firebase client/admin wrappers, api helpers)
│   ├── middleware/   # Express middleware (authentication)
│   ├── pages/        # React routing pages (Workspace, Explore, Dashboard, etc)
│   ├── services/     # Frontend logic abstractions (evaluation, AI integration)
│   ├── types/        # Shared TypeScript interfaces
│   ├── utils/        # Generic utilities (e.g. tailwind class merger)
│   ├── App.tsx       # Main React component & router
│   ├── index.css     # Global Tailwind stylesheet
│   └── main.tsx      # Vite entry point
├── docs/             # Audit logs and architectural decisions
├── public/           # Static assets
├── server.ts         # Express server entry point
├── vite.config.ts    # Frontend build configuration
└── package.json      # Dependencies and scripts
\`\`\`
`;

readme = readme.replace('## Getting Started', structure + '\n## Getting Started');

fs.writeFileSync('README.md', readme);
