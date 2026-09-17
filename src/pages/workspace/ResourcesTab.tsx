import React from "react";
import { ExternalLink, BookText, Video, Github } from "lucide-react"

export function ResourcesTab() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-3xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Project Resources</h1>
        <p className="text-muted-foreground text-lg">Curated materials to help you complete this project.</p>
      </div>

      <section>
        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Official Documentation</h2>
        <div className="grid gap-3">
          <ResourceCard 
            icon={<BookText className="w-5 h-5" />}
            title="React Official Docs"
            desc="The best place to learn React fundamentals."
            type="Documentation"
          />
          <ResourceCard 
            icon={<BookText className="w-5 h-5" />}
            title="Express.js Guide"
            desc="Routing, middleware, and request handling in Express."
            type="Documentation"
          />
          <ResourceCard 
            icon={<BookText className="w-5 h-5" />}
            title="MDN: HTTP POST Methods"
            desc="Understanding how data is sent to servers."
            type="Reference"
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Guides & Tutorials</h2>
        <div className="grid gap-3">
          <ResourceCard 
            icon={<Video className="w-5 h-5" />}
            title="Handling Environment Variables in Node"
            desc="Securely storing and accessing your API keys."
            type="Video (12m)"
          />
          <ResourceCard 
            icon={<Github className="w-5 h-5" />}
            title="Example: Fetch API patterns"
            desc="Common patterns for fetching data in React."
            type="Code Repository"
          />
        </div>
      </section>
    </div>
  )
}

function ResourceCard({ icon, title, desc, type }: { icon: React.ReactNode, title: string, desc: string, type: string }) {
  return (
    <a href="#" className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-colors group">
      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold">{title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{type}</span>
        </div>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
    </a>
  )
}
