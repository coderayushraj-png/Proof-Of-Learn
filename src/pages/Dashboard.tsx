import { Link } from "react-router-dom"
import { ArrowRight, Code, Trophy, LayoutDashboard, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../lib/api";


import React from 'react';

export function Dashboard() {
  const { userState } = useAppContext();
  const { user } = useAuth();

  const [allProjects, setAllProjects] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchWithAuth('/api/projects')
      .then(data => {
        setAllProjects(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  
  const startedProjectsDetails = (userState.startedProjects || []).map(id => {
    const project = allProjects.find(p => p.id === id)
    const completedTasks = userState.completedTasks[id] || []
    return {
      ...project,
      progress: project ? Math.min(100, Math.round((completedTasks.length / (project.tasks?.length || project.taskCount || Math.max(completedTasks.length, 1))) * 100)) : 0,
      completedTasks,
      isCompleted: userState.completedProjects.includes(id)
    }
  }).filter(p => p.id && !p.isCompleted) // Only show in-progress

  const recentlyCompleted = (userState.completedProjects || []).map(id => {
    const project = allProjects.find(p => p.id === id)
    const submission = userState.submissions[id]
    return { ...project, submission }
  }).filter(p => p.id)

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, {user?.displayName || 'Builder'}</h1>
          <p className="text-muted-foreground text-lg">Pick up where you left off or start a new challenge.</p>
        </div>
        <Button asChild>
          <Link to="/explore">Explore Projects</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-background border border-border p-6 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{userState.startedProjects.length}</div>
            <div className="text-sm font-medium text-muted-foreground">Projects Started</div>
          </div>
        </div>
        <div className="bg-background border border-border p-6 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{userState.completedProjects.length}</div>
            <div className="text-sm font-medium text-muted-foreground">Projects Verified</div>
          </div>
        </div>
        <div className="bg-background border border-border p-6 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center shrink-0">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{Object.values(userState.completedTasks || {}).flat().length}</div>
            <div className="text-sm font-medium text-muted-foreground">Tasks Finished</div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Continue Building</h2>
        {startedProjectsDetails.length === 0 ? (
          <div className="text-center p-12 border border-border border-dashed rounded-xl bg-muted/10">
            <h3 className="text-lg font-bold mb-2">Your workspace is empty</h3>
            <p className="text-muted-foreground mb-6">Start a new project to see it here.</p>
            <Button asChild><Link to="/explore">Browse Projects</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {startedProjectsDetails.map((proj: any) => (
              <div key={proj.id} className="bg-background border border-border p-6 rounded-xl flex flex-col hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="font-bold text-xl line-clamp-1">{proj.title}</h3>
                  <span className="text-xs font-bold px-2 py-1 bg-muted rounded text-muted-foreground shrink-0">
                    {proj.completedTasks.length} / {proj.tasks?.length || proj.taskCount || 0} Tasks
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-2">{proj.description}</p>
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span>Progress</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(proj.progress, 100)}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last active recently
                  </span>
                  <Button asChild variant="default" size="sm">
                    <Link to={`/workspace/${proj.id}`}>Resume <ArrowRight className="ml-2 w-3 h-3" /></Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {recentlyCompleted.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Verified Projects (Portfolio)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentlyCompleted.map((proj: any) => (
              <div key={proj.id} className="bg-card border border-border p-6 rounded-xl flex flex-col">
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="font-bold text-xl line-clamp-1">{proj.title}</h3>
                  <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20 shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{proj.submission?.description || proj.description}</p>
                
                {proj.submission?.technologies && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(proj.submission?.technologies || []).map((tech: string) => (
                      <span key={tech} className="text-xs font-medium px-2 py-1 bg-muted rounded-md text-foreground/80 border border-border">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                  {proj.submission?.githubUrl && (
                    <a href={proj.submission.githubUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-primary transition-colors">
                      GitHub
                    </a>
                  )}
                  {proj.submission?.demoUrl && (
                    <a href={proj.submission.demoUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-primary transition-colors ml-4">
                      Live Demo
                    </a>
                  )}
                  <Button asChild variant="outline" size="sm" className="ml-auto">
                    <Link to={`/workspace/${proj.id}`}>View Workspace</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(allProjects || []).filter(p => !(userState.startedProjects || []).includes(p.id)).slice(0, 3).map(proj => (
            <Link key={proj.id} to={`/project/${proj.id}`} className="group bg-background border border-border p-6 rounded-xl hover:border-foreground/30 transition-colors">
              <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{proj.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{proj.description}</p>
              <div className="text-xs font-medium text-foreground/70 uppercase tracking-wider">{proj.difficulty} &middot; {proj.category}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
