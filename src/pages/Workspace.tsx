import { fetchWithAuth } from "../lib/api";
import React from "react";
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Play, CheckCircle2, Circle, AlertCircle, ChevronRight, FileText, Beaker, Send, ChevronLeft, Search, Bot, HelpCircle, Code2, Save, ExternalLink, Menu, MessageSquare } from "lucide-react"
import { Button } from "../components/ui/button"
import { useAppContext } from "../context/AppContext"

import { Task, Project } from "../types"

// Import views
import { OverviewTab } from "./workspace/OverviewTab"
import { TaskTab } from "./workspace/TaskTab"
import { ResourcesTab } from "./workspace/ResourcesTab"
import { TestsTab } from "./workspace/TestsTab"
import { SubmissionTab } from "./workspace/SubmissionTab"
import { AiMentorPanel } from "./workspace/AiMentorPanel"

export function Workspace() {
  const { id: projectId } = useParams()
  const navigate = useNavigate()
  const { userState, completeTask } = useAppContext()
  
  const [activeTab, setActiveTab] = useState<"overview" | "task" | "resources" | "tests" | "submission">("overview")
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mentorOpen, setMentorOpen] = useState(false)
  
  
  const completedTasks = userState.completedTasks[projectId || ""] || [];
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(`/api/projects/${projectId}`)
      .then(data => {
        data.estHours = Math.round(data.estimatedMinutes / 60) + 'h';
        data.skills = data.tags || [];
        data.fullDescription = data.description;
        setProject(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [projectId]);

  useEffect(() => {
    if (project && !activeTaskId && project.tasks && project.tasks.length > 0) {
      const firstUncompleted = project.tasks.find(t => !completedTasks.includes(t.id));
      setActiveTaskId(firstUncompleted ? firstUncompleted.id : project.tasks[0].id);
    }
  }, [project, completedTasks, activeTaskId]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading workspace...</div>
  }

  if (!project) {
    return <div className="p-8 text-center text-red-500">Project not found</div>
  }


  const tasks = project.tasks || [];
  const activeTask = tasks.find(t => t.id === activeTaskId) || tasks[0]
  
  const progressPercent = tasks.length === 0 ? 0 : 
    Math.round((completedTasks.length / tasks.length) * 100)
    
  const currentMilestoneIndex = tasks.findIndex(t => !completedTasks.includes(t.id))
  const currentMilestone = currentMilestoneIndex >= 0 ? tasks[currentMilestoneIndex].title : "Complete"

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background relative">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="hidden md:flex w-8 h-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 md:gap-3">
            <h1 className="font-semibold truncate max-w-[150px] md:max-w-[250px]">{project.title}</h1>
            <div className="h-4 w-px bg-border hidden md:block"></div>
            <div className="items-center gap-2 text-sm hidden md:flex">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progressPercent}%</span>
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden ml-1">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
            <div className="h-4 w-px bg-border hidden lg:block"></div>
            <div className="text-sm hidden lg:block">
              <span className="text-muted-foreground">Milestone: </span>
              <span className="font-medium">{currentMilestone}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 text-sm">
          <div className="items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md hidden md:flex">
            <span className="text-muted-foreground text-xs">Difficulty</span>
            <span className="font-medium text-xs">{project.difficulty}</span>
          </div>
          <div className="items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md hidden md:flex">
            <span className="text-muted-foreground text-xs">Est Time</span>
            <span className="font-medium text-xs">{project.estHours}</span>
          </div>
          <Button variant="outline" size="sm" className="md:hidden gap-2" onClick={() => setMentorOpen(!mentorOpen)}>
            <MessageSquare className="w-4 h-4" />
            Mentor
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          absolute md:relative z-40 md:z-auto h-full w-64 border-r border-border bg-card/95 md:bg-card/50 backdrop-blur-md flex flex-col shrink-0
          transition-transform duration-300 md:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 flex flex-col gap-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 flex justify-between items-center">
              Project
              <Button variant="ghost" size="icon" className="md:hidden h-6 w-6" onClick={() => setSidebarOpen(false)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            
            <SidebarButton 
              active={activeTab === "overview"} 
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
              icon={<FileText className="w-4 h-4" />}
              label="Overview"
            />
            
            <SidebarButton 
              active={activeTab === "task"} 
              onClick={() => { setActiveTab("task"); setSidebarOpen(false); }}
              icon={<CheckCircle2 className="w-4 h-4" />}
              label="Tasks"
              badge={`${completedTasks.length} / ${tasks.length}`}
            />
            
            <SidebarButton 
              active={activeTab === "resources"} 
              onClick={() => { setActiveTab("resources"); setSidebarOpen(false); }}
              icon={<Search className="w-4 h-4" />}
              label="Resources"
            />
            
            <SidebarButton 
              active={activeTab === "tests"} 
              onClick={() => { setActiveTab("tests"); setSidebarOpen(false); }}
              icon={<Beaker className="w-4 h-4" />}
              label="Tests"
              badge={completedTasks.length === tasks.length ? "All passing" : "Pending"}
            />
            
            <SidebarButton 
              active={activeTab === "submission"} 
              onClick={() => { setActiveTab("submission"); setSidebarOpen(false); }}
              icon={<Send className="w-4 h-4" />}
              label="Submission"
              badge={completedTasks.length === tasks.length ? "Ready" : "Locked"}
              disabled={completedTasks.length !== tasks.length && activeTab !== "submission"}
            />
          </div>
          
          {/* Task list quick nav when in Task tab */}
          {activeTab === "task" && activeTask && (
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-4">Task List</div>
              <div className="flex flex-col gap-1 relative before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-border ml-2">
                {tasks.map((task, index) => {
                  const isCompleted = completedTasks.includes(task.id)
                  const isActive = activeTaskId === task.id
                  const isLocked = !isCompleted && index > 0 && !completedTasks.includes(tasks[index - 1].id)
                  
                  return (
                    <button
                      key={task.id}
                      onClick={() => {
                        if (!isLocked) {
                          setActiveTaskId(task.id);
                          setActiveTab("task");
                          if (window.innerWidth < 768) setSidebarOpen(false);
                        }
                      }}
                      disabled={isLocked}
                      className={`
                        relative flex items-center gap-3 py-2 pl-6 pr-2 text-sm text-left rounded-md transition-colors
                        ${isActive ? 'bg-primary/10 text-primary font-medium' : ''}
                        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}
                        ${!isActive && !isLocked ? 'text-muted-foreground' : ''}
                      `}
                    >
                      <div className={`
                        absolute left-[-5px] w-[11px] h-[11px] rounded-full border-2 
                        ${isCompleted ? 'bg-primary border-primary' : isActive ? 'bg-background border-primary' : 'bg-background border-muted-foreground'}
                        z-10
                      `} />
                      <span className="truncate flex-1">{String(index + 1).padStart(2, '0')} {task.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Overlay for sidebar */}
        {sidebarOpen && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-background h-full">
          <div className="flex-1 p-4 md:p-6 lg:p-10 max-w-4xl mx-auto w-full">
            {activeTab === "overview" && <OverviewTab project={project} />}
            {activeTab === "task" && (
              <TaskTab 
                project={project} 
                task={activeTask} 
                onComplete={() => {
                  completeTask(project.id, activeTask.id)
                  // Find next task
                  const currentIndex = tasks.findIndex(t => t.id === activeTask.id)
                  if (currentIndex < tasks.length - 1) {
                    setActiveTaskId(tasks[currentIndex + 1].id)
                    window.scrollTo(0,0)
                  } else {
                    setActiveTab("submission")
                  }
                }}
              />
            )}
            {activeTab === "resources" && <ResourcesTab />}
            {activeTab === "tests" && <TestsTab project={project} />}
            {activeTab === "submission" && <SubmissionTab project={project} />}
          </div>
        </main>

        {/* AI Mentor Panel */}
        <aside className={`
          absolute md:relative z-40 md:z-auto right-0 h-full w-full sm:w-[350px] border-l border-border bg-card/95 md:bg-card/30 backdrop-blur-md flex flex-col shrink-0
          transition-transform duration-300 md:transform-none
          ${mentorOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <div className="md:hidden flex items-center justify-between p-3 border-b border-border bg-card shrink-0">
            <span className="font-semibold text-sm flex items-center gap-2"><Bot className="w-4 h-4 text-primary" /> AI Mentor</span>
            <Button variant="ghost" size="sm" onClick={() => setMentorOpen(false)}>Close</Button>
          </div>
          <div className="flex-1 overflow-hidden h-full">
            <AiMentorPanel project={project} task={activeTask} />
          </div>
        </aside>
      </div>
    </div>
  )
}

function SidebarButton({ active, onClick, icon, label, badge, disabled = false }: { 
  active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: string, disabled?: boolean 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors w-full
        ${active ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && <span className="text-xs bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground">{badge}</span>}
    </button>
  )
}
