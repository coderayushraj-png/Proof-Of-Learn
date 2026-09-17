import { fetchWithAuth } from "../lib/api";
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ArrowLeft, Clock, BarChart, Code, CheckCircle2, ChevronRight, Play } from "lucide-react"

import { useAppContext } from "../context/AppContext"

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userState, startProject } = useAppContext()
  
  
  const [project, setProject] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await fetchWithAuth(`/api/projects/${id}`);
        
        // Ensure estHours is mapped correctly for the frontend
        data.estHours = Math.round(data.estimatedMinutes / 60) + 'h';
        // Skills are missing in db schema directly on project, fallback or use tags
        data.skills = data.tags || []; 
        data.fullDescription = data.description; // We don't have a separate fullDescription in DB
        
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading project details...</p>
      </div>
    )
  }

  
  if (!project) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-24 text-center border my-12 border-border border-dashed rounded-xl bg-muted/10">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <p className="text-muted-foreground mb-8">We couldn't load this project.</p>
        {error && <p className="text-red-500 mb-8">{error}</p>}
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/explore">Go Back</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isStarted = userState.startedProjects.includes(project.id)
  
  const handleStart = () => {
    if (!isStarted) {
      startProject(project.id)
    }
    navigate(`/workspace/${project.id}`)
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 md:px-8 py-12">
      <Link to="/explore" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
      </Link>
      
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">{project.title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {project.fullDescription}
        </p>
      </div>

      <div className="flex flex-wrap gap-6 mb-12 p-6 bg-muted/30 border border-border rounded-xl">
        <div className="flex items-center gap-2">
          <BarChart className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difficulty</div>
            <div className="font-medium">{project.difficulty}</div>
          </div>
        </div>
        <div className="w-[1px] h-10 bg-border hidden sm:block" />
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Est. Time</div>
            <div className="font-medium">{project.estHours}</div>
          </div>
        </div>
        <div className="w-[1px] h-10 bg-border hidden sm:block" />
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tech</div>
            <div className="flex flex-wrap gap-1.5 mt-1 max-w-[200px]">
              {project.tags?.map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 bg-background border border-border rounded uppercase font-bold text-foreground/80 whitespace-nowrap">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none mb-12">
        <h3 className="text-2xl font-bold mb-4">What you'll learn</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {project.skills?.map(item => (
            <div key={item} className="flex items-center gap-3 bg-background border border-border p-3 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <span className="font-medium text-sm">{item}</span>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-bold mb-6">Milestones</h3>
        <div className="space-y-4 mb-12">
          {project.tasks?.map((step, i) => (
            <div key={step.id} className="flex gap-4 p-4 border border-border rounded-xl bg-background">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground shrink-0">
                0{i + 1}
              </div>
              <div>
                <h4 className="font-bold text-lg">{step.title}</h4>
                <p className="text-muted-foreground text-sm">{step.objective}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-md border-t border-border p-4 z-50 flex justify-center">
        <div className="max-w-screen-md w-full flex justify-between items-center gap-4">
          <div className="hidden sm:block">
            <div className="font-bold">{project.title}</div>
            <div className="text-sm text-muted-foreground">Ready to {isStarted ? "continue" : "start"} building?</div>
          </div>
          <Button size="lg" variant={isStarted ? "default" : "brand"} className="w-full sm:w-auto px-10" onClick={handleStart}>
            {isStarted ? (
              <>Continue Building <Play className="ml-2 w-4 h-4 fill-current" /></>
            ) : (
              <>Start Building <ChevronRight className="ml-2 w-5 h-5" /></>
            )}
          </Button>
        </div>
      </div>
      <div className="h-20" />
    </div>
  )
}
