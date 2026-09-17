import { Link } from "react-router-dom"
import { ExternalLink, CheckCircle2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { useAppContext } from "../context/AppContext";
import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';


export function Portfolio() {
  const { userState } = useAppContext();

  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/me/portfolio')
      .then(data => {
        setCompletedProjects(data || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading portfolio...</p>
      </div>
    );
  }


  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Your Portfolio</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Projects you've completed are showcased here. Share this page with recruiters or friends.
        </p>
      </div>

      {completedProjects.length === 0 ? (
        <div className="text-center p-24 border border-border border-dashed rounded-xl bg-muted/10">
          <h3 className="text-xl font-bold mb-2">Your portfolio is empty</h3>
          <p className="text-muted-foreground mb-6">Complete your first project to add it to your portfolio.</p>
          <Button asChild variant="brand"><Link to="/explore">Start a Project</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(completedProjects || []).map((proj: any) => (
            <div key={proj.id} className="bg-background border border-border rounded-xl overflow-hidden shadow-sm flex flex-col group">
              <div className="h-48 bg-muted border-b border-border flex items-center justify-center p-6 relative overflow-hidden group-hover:bg-muted/80 transition-colors">
                <div className="text-center z-10">
                  <h3 className="text-2xl font-bold text-foreground/90">{proj.title}</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-2">{proj.category}</p>
                </div>
                {/* Decorative background element */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand/5 rounded-full blur-2xl" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-bold text-green-600 dark:text-green-500">Verified Completion</span>
                </div>
                <p className="text-muted-foreground mb-6 line-clamp-3">{proj.submission?.description || proj.description}</p>
                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  {(proj.submission?.technologies || proj.tags || []).map((t: string) => (
                    <span key={t} className="text-xs px-2.5 py-1 bg-muted rounded-md font-medium text-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {proj.submission?.githubUrl && (
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={proj.submission.githubUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-2" /> View Code</a>
                    </Button>
                  )}
                  {proj.submission?.demoUrl && (
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={proj.submission.demoUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-2" /> Live Demo</a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
