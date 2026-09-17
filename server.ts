import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

import authRoutes from "./src/api/auth.ts";
import projectRoutes from "./src/api/projects.ts";
import meRoutes from "./src/api/me.ts";
import adminRoutes from "./src/api/admin.ts";
import aiRoutes from "./src/api/ai.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/me", meRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/ai", aiRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
