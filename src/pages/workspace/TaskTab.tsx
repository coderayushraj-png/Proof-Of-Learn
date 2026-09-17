import { useState, useEffect } from "react"
import { CheckCircle2, FileCode, Play, AlertCircle, ChevronDown, ChevronUp, Lightbulb, BookOpen } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Project, Task, Concept } from "../../types"

export function TaskTab({ project, task, onComplete }: { project: Project, task: Task, onComplete: () => void }) {
  const [code, setCode] = useState(task?.initialCode || "")
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<{ passed: boolean, message: string }[] | null>(null)
  
  const [hintLevel, setHintLevel] = useState(0)
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null)

  // Reset states when task changes
  useEffect(() => {
    setCode(task?.initialCode || "")
    setTestResults(null)
    setHintLevel(0)
    setExpandedConcept(null)
  }, [task?.id])

  const handleRunTests = () => {
    setIsTesting(true)
    setTestResults(null)
    
    // Simulate test execution delay
    setTimeout(() => {
      // Mock validation logic based on code length/content just for demo
      const hasCode = code.length > 20
      const passed = hasCode
      
      setTestResults((task?.criteria || []).map((c, i) => ({
        passed: passed || i === 0, // Mock: maybe pass first one, fail others if not enough code
        message: c
      })))
      
      setIsTesting(false)
    }, 1500)
  }
  
  const allTestsPassed = testResults?.every(r => r.passed) ?? false

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Header Info */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{task?.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Instructions */}
        <div className="lg:col-span-2 space-y-10">
          
          <section>
            <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-3">Objective</h2>
            <p className="text-lg">{task?.objective}</p>
          </section>

          <section>
            <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-3">Why you're doing this</h2>
            <p className="text-muted-foreground leading-relaxed">{task?.why}</p>
          </section>

          <section>
            <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Requirements</h2>
            <ul className="space-y-2">
              {(task?.requirements || []).map((req, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-foreground/90">{req}</span>
                </li>
              ))}
            </ul>
          </section>
          
          {/* Acceptance Criteria */}
          <section className="bg-muted/30 border border-border p-5 rounded-lg">
            <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Acceptance Criteria</h2>
            <ul className="space-y-3">
              {(task.criteria || []).map((criteria, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 border border-border rounded flex items-center justify-center shrink-0 bg-background mt-0.5">
                    {testResults && testResults[i]?.passed && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <span className="text-sm text-muted-foreground leading-snug">{criteria}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Editor Area */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Your Implementation</h2>
            <div className="border border-border rounded-lg overflow-hidden bg-zinc-950 flex flex-col">
              <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                <FileCode className="w-4 h-4 text-zinc-400 mr-2" />
                <span className="text-xs font-mono text-zinc-400">workspace.ts</span>
              </div>
              <textarea 
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full h-64 bg-transparent text-zinc-300 p-4 font-mono text-sm resize-y focus:outline-none placeholder:text-zinc-700"
                placeholder="// Write your code here..."
                spellCheck={false}
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button variant="outline" size="sm">Save Draft</Button>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleRunTests} 
                  disabled={isTesting}
                  className="gap-2"
                >
                  {isTesting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Submit Task
                    </>
                  )}
                </Button>
              </div>
            </div>
          </section>

          {/* Test Results Banner */}
          {testResults && (
            <div className={`p-4 rounded-lg border ${allTestsPassed ? 'bg-primary/10 border-primary/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className="flex items-start gap-3">
                {allTestsPassed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-semibold mb-2 ${allTestsPassed ? 'text-primary' : 'text-red-500'}`}>
                    {allTestsPassed ? 'Validation Passed!' : 'Validation Failed'}
                  </h3>
                  <div className="space-y-1 mb-4">
                    {testResults.map((r, i) => (
                      <div key={i} className="text-sm flex items-center gap-2">
                        <span className={r.passed ? 'text-primary' : 'text-red-500'}>
                          {r.passed ? '✓' : '✕'}
                        </span>
                        <span className="text-muted-foreground">{r.message}</span>
                      </div>
                    ))}
                  </div>
                  
                  {allTestsPassed ? (
                    <Button onClick={onComplete} className="w-full sm:w-auto">
                      Complete Task & Continue
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full sm:w-auto text-red-500 border-red-500 hover:bg-red-500/10 hover:text-red-500">
                      Review with AI Mentor
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Context & Help */}
        <div className="space-y-8">
          
          {/* Before You Build (Concepts) */}
          {task?.concepts && task.concepts.length > 0 && (
            <section className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Before You Build
                </h2>
              </div>
              <div className="divide-y divide-border">
                {(task.concepts || []).map((concept, i) => (
                  <div key={i} className="p-0">
                    <button 
                      onClick={() => setExpandedConcept(expandedConcept === concept.title ? null : concept.title)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                    >
                      <span className="font-medium text-sm">{concept.title}</span>
                      {expandedConcept === concept.title ? 
                        <ChevronUp className="w-4 h-4 text-muted-foreground" /> : 
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      }
                    </button>
                    {expandedConcept === concept.title && (
                      <div className="p-4 pt-0 text-sm text-muted-foreground bg-muted/20 pb-5">
                        <p className="mb-3">{concept.description}</p>
                        {concept.example && (
                          <div className="bg-zinc-950 p-3 rounded text-zinc-300 font-mono text-xs overflow-x-auto border border-zinc-800">
                            {concept.example}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Progressive Hints */}
          {task?.hints && task.hints.length > 0 && (
            <section className="bg-card border border-border rounded-lg p-5 space-y-4">
              <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Stuck?
              </h2>
              
              {hintLevel > 0 && (
                <div className="space-y-4">
                  {(task.hints || []).slice(0, hintLevel).map((hint, i) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-md border border-border text-sm">
                      <span className="font-semibold text-xs uppercase text-muted-foreground block mb-1">Hint {i + 1}</span>
                      {hint}
                    </div>
                  ))}
                </div>
              )}
              
              {hintLevel < task.hints.length ? (
                <Button 
                  variant="outline" 
                  className="w-full text-sm" 
                  onClick={() => setHintLevel(h => h + 1)}
                >
                  Need a hint?
                </Button>
              ) : (
                <div className="text-xs text-center text-muted-foreground pt-2">
                  No more hints available. Try asking the AI Mentor!
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  )
}
