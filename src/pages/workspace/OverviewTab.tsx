import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Project } from "../../types"
import { useAppContext } from "../../context/AppContext"

export function OverviewTab({ project }: { project: Project }) {
  const { userState } = useAppContext()
  const completedTasks = userState.completedTasks[project.id] || []
  
  const tasksCompleted = completedTasks.length
  const totalTasks = project.tasks.length
  
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <section>
        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">What you're building</h2>
        <p className="text-xl leading-relaxed">
          {project.fullDescription || project.description}
        </p>
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-muted rounded-md text-sm font-medium border border-border">
                {tag}
              </span>
            ))}
          </div>
        </section>
        
        <section>
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Project Health</h2>
          <div className="bg-card border border-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tasks</span>
              <span className="text-sm text-muted-foreground">{tasksCompleted} / {totalTasks} complete</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tests</span>
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Submission</span>
              <span className="text-sm text-muted-foreground">
                {tasksCompleted === totalTasks ? "Ready" : "Not submitted"}
              </span>
            </div>
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Project Milestones</h2>
        <div className="space-y-3">
          {project.tasks?.map((task, index) => {
            const isCompleted = completedTasks.includes(task.id)
            const isNext = !isCompleted && (index === 0 || completedTasks.includes(project.tasks[index - 1].id))
            
            return (
              <div 
                key={task.id} 
                className={`flex items-center p-4 rounded-lg border ${
                  isCompleted ? 'bg-muted/30 border-transparent text-muted-foreground' : 
                  isNext ? 'bg-card border-primary/50 shadow-sm' : 
                  'bg-background border-border opacity-60'
                }`}
              >
                <div className="w-8 flex-shrink-0 text-sm font-mono">{String(index + 1).padStart(2, '0')}</div>
                <div className="flex-1 font-medium">{task.title}</div>
                <div>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : 
                   isNext ? <ArrowRight className="w-5 h-5 text-primary" /> : null}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
