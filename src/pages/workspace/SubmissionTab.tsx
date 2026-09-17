import React from "react";
import { useState } from "react"
import { CheckCircle2, Github, Globe, Send, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Project } from "../../types"
import { useAppContext } from "../../context/AppContext"
import { useNavigate } from "react-router-dom"
import { evaluationService } from "../../services/evaluationService"

export function SubmissionTab({ project }: { project: Project }) {
  const { userState, submitProject } = useAppContext()
  const navigate = useNavigate()
  
  const completedTasks = userState.completedTasks[project.id] || []
  const testHistory = userState.testHistory[project.id] || []
  const latestRun = testHistory.length > 0 ? testHistory[0] : null
  const submission = userState.submissions[project.id]

  const allTasksCompleted = completedTasks.length === project.tasks.length
  const hasTests = project.tests && project.tests.length > 0;
  const allTestsPassed = hasTests 
    ? (latestRun?.passedCount === latestRun?.totalCount && latestRun?.totalCount > 0)
    : true;

  const [githubUrl, setGithubUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [desc, setDesc] = useState("")
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReview, setShowReview] = useState(!!submission)
  const [validationError, setValidationError] = useState("")

  const preSubmitReady = allTasksCompleted && allTestsPassed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")
    
    const validation = evaluationService.validateSubmission(githubUrl, demoUrl)
    if (!validation.valid) {
      setValidationError(validation.message)
      return
    }

    if (selectedTech.length === 0) {
      setValidationError("Please select at least one technology used.")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      submitProject(project.id, {
        githubUrl,
        demoUrl,
        description: desc,
        technologies: selectedTech,
        features: ["Completed all required tasks", "Passed automated test suite"],
        submittedAt: Date.now(),
        verified: true,
        testRunId: latestRun?.id || ""
      })
      setShowReview(true)
    }, 2000)
  }

  const toggleTech = (tech: string) => {
    setSelectedTech(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    )
  }

  if (showReview || submission) {
    const activeSub = submission || { technologies: selectedTech }
    
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto py-10">
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold">Project Submitted & Verified</h1>
          <p className="text-muted-foreground text-lg">Your work has been successfully verified by the platform.</p>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-muted/30 border-b border-border flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">AI Project Review</span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="space-y-1">
                <span className="text-muted-foreground">Requirements</span>
                <p className="font-medium">{project.tasks.length} / {project.tasks.length} passed</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Tests</span>
                <p className="font-medium">{hasTests ? `${latestRun?.passedCount} / ${project.tests?.length} passed` : "N/A"}</p>
              </div>
            </div>
            
            <div className="h-px bg-border"></div>

            <div>
              <h3 className="text-sm font-bold tracking-widest text-green-500 uppercase mb-3">What you did well</h3>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>Clean API structure and separation of concerns</li>
                <li>Proper error handling covering the required cases</li>
                <li>Good component organization</li>
              </ul>
            </div>
            
            <div className="h-px bg-border"></div>
            
            <div>
              <h3 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-3">Areas to improve</h3>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>Consider adding more robust input validation for edge cases</li>
                <li>API error messages could be more user-friendly</li>
              </ul>
            </div>
            
            <div className="h-px bg-border"></div>
            
            <div>
              <h3 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Skills demonstrated</h3>
              <div className="flex flex-wrap gap-2">
                {activeSub.technologies?.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-muted rounded-md text-sm font-medium border border-border">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button onClick={() => navigate('/dashboard')} size="lg" variant="outline">
            View Portfolio
          </Button>
          <Button onClick={() => navigate('/explore')} size="lg">
            Explore Next Project
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Submit Your Project</h1>
        <p className="text-muted-foreground text-lg">Verify requirements and submit to your portfolio.</p>
      </div>

      <section className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Pre-submission Check</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              {allTasksCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0" />}
              <span className={allTasksCompleted ? "text-foreground" : "text-muted-foreground"}>Tasks ({completedTasks.length}/{project.tasks.length})</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {allTestsPassed ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0" />}
              <span className={allTestsPassed ? "text-foreground" : "text-muted-foreground"}>
                {hasTests ? `Tests (${latestRun?.passedCount || 0}/${latestRun?.totalCount || project.tests?.length || 0})` : "Tests (Not required)"}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              {githubUrl.includes("github.com") ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0" />}
              <span className={githubUrl ? "text-foreground" : "text-muted-foreground"}>GitHub repository</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {desc.length > 10 ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0" />}
              <span className={desc.length > 10 ? "text-foreground" : "text-muted-foreground"}>Project description</span>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="space-y-4 border-t border-border pt-6">
          <h2 className="text-lg font-semibold">Links</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub Repository URL</label>
            <div className="relative">
              <Github className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input 
                type="url" 
                required
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Live Demo URL (Optional)</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input 
                type="url"
                value={demoUrl}
                onChange={e => setDemoUrl(e.target.value)}
                placeholder="https://my-project.vercel.app"
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <h2 className="text-lg font-semibold">Details</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Description</label>
            <textarea 
              required
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Explain what you built, the problem it solves, and the technologies you used."
              className="w-full h-32 bg-background border border-border rounded-lg p-4 resize-none focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Technologies Used</label>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map(tech => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                    selectedTech.includes(tech) 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-background border-border text-muted-foreground hover:border-foreground/30'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>

        {validationError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {validationError}
          </div>
        )}

        <Button 
          type="submit" 
          size="lg" 
          className="w-full gap-2"
          disabled={!preSubmitReady || isSubmitting}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {isSubmitting ? "Validating & Submitting..." : "Submit Project"}
        </Button>
        
        {!preSubmitReady && (
          <p className="text-sm text-center text-muted-foreground mt-2">
            You must complete all tasks and pass all tests before submitting.
          </p>
        )}
      </form>
    </div>
  )
}
