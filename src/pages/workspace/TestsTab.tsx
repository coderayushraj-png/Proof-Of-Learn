import { useState, useEffect } from "react"
import { CheckCircle2, Play, AlertCircle, Clock, ChevronDown, ChevronUp, Bot, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Project, TestRun, TestResult, ProjectTest, TestCategory } from "../../types"
import { useAppContext } from "../../context/AppContext"
import { evaluationService } from "../../services/evaluationService"

export function TestsTab({ project }: { project: Project }) {
  const { userState, recordTestRun } = useAppContext()
  const completedTasks = userState.completedTasks[project.id] || []
  const testHistory = userState.testHistory[project.id] || []
  
  const [isRunning, setIsRunning] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [expandedTest, setExpandedTest] = useState<string | null>(null)

  const latestRun = testHistory.length > 0 ? testHistory[0] : null
  const projectTests = project.tests || []

  const handleRunAll = async () => {
    setIsRunning(true)
    setLoadingStep(1)
    
    // Simulate steps
    setTimeout(() => setLoadingStep(2), 500)
    setTimeout(() => setLoadingStep(3), 1200)
    setTimeout(() => setLoadingStep(4), 1800)
    
    const run = await evaluationService.runTests(project, completedTasks)
    recordTestRun(project.id, run)
    
    setIsRunning(false)
    setLoadingStep(0)
    setExpandedTest(null)
  }

  const handleAskMentor = (test: ProjectTest, result: TestResult) => {
    const detail = {
      action: "ask_mentor",
      context: "failed_test",
      testDescription: test.description,
      expected: test.expected,
      received: result.received,
      errorMsg: result.errorMsg
    };
    window.dispatchEvent(new CustomEvent("ai-mentor-event", { detail }));
  }

  // Group tests by category
  const categories = Array.from(new Set((projectTests || []).map(t => t.category)))

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-3xl pb-20">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Test Suite</h1>
          <p className="text-muted-foreground text-lg">
            {latestRun ? `${latestRun.passedCount} / ${latestRun.totalCount} tests passing` : 'Run tests to evaluate your progress.'}
          </p>
        </div>
        <Button onClick={handleRunAll} disabled={isRunning} size="lg" className="gap-2 shrink-0">
          {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          {isRunning ? "Evaluating..." : latestRun ? "Run Tests Again" : "Run Tests"}
        </Button>
      </div>

      {isRunning && (
        <div className="bg-card border border-border p-6 rounded-lg space-y-4 animate-in slide-in-from-top-4">
          <div className="text-sm font-medium flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Generating results...
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className={`flex items-center gap-2 ${loadingStep >= 1 ? 'text-foreground' : 'opacity-50'}`}>
              {loadingStep > 1 ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <div className="w-4 h-4" />}
              Preparing test environment...
            </div>
            <div className={`flex items-center gap-2 ${loadingStep >= 2 ? 'text-foreground' : 'opacity-50'}`}>
              {loadingStep > 2 ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <div className="w-4 h-4" />}
              Running API tests...
            </div>
            <div className={`flex items-center gap-2 ${loadingStep >= 3 ? 'text-foreground' : 'opacity-50'}`}>
              {loadingStep > 3 ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <div className="w-4 h-4" />}
              Checking requirements...
            </div>
          </div>
        </div>
      )}

      {!isRunning && latestRun && (
        <div className="space-y-8">
          <div className="flex flex-wrap gap-4 text-sm bg-muted/30 p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">Passed:</span>
              <span>{latestRun.passedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-red-500">Failed:</span>
              <span>{latestRun.totalCount - latestRun.passedCount}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground ml-auto">
              <Clock className="w-4 h-4" />
              {new Date(latestRun.timestamp).toLocaleTimeString()}
            </div>
          </div>

          {categories.map(category => {
            const categoryTests = projectTests.filter(t => t.category === category);
            if (categoryTests.length === 0) return null;
            
            return (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase pb-2 border-b border-border">{category}</h3>
                
                <div className="space-y-3">
                  {categoryTests.map(test => {
                    const result = latestRun.results.find(r => r.testId === test.id);
                    if (!result) return null;
                    
                    const isExpanded = expandedTest === test.id;
                    const passed = result.passed;
                    
                    return (
                      <div key={test.id} className={`bg-card border rounded-lg overflow-hidden transition-colors ${passed ? 'border-border hover:border-primary/50' : 'border-red-500/30 bg-red-500/5'}`}>
                        <button 
                          onClick={() => setExpandedTest(isExpanded ? null : test.id)}
                          className="w-full text-left px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {passed ? (
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            )}
                            <span className={`font-medium text-sm ${passed ? 'text-foreground' : 'text-red-500'}`}>
                              {test.description}
                            </span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-border/50 text-sm space-y-4">
                            <div className="grid grid-cols-[80px_1fr] gap-2">
                              <span className="text-muted-foreground">Status:</span>
                              <span className={`font-semibold ${passed ? 'text-primary' : 'text-red-500'}`}>{passed ? 'PASS' : 'FAIL'}</span>
                              
                              <span className="text-muted-foreground">Expected:</span>
                              <span className="font-mono text-xs bg-muted/50 p-1 rounded">{test.expected}</span>
                              
                              <span className="text-muted-foreground">Received:</span>
                              <span className="font-mono text-xs bg-muted/50 p-1 rounded">{result.received}</span>
                            </div>
                            
                            {!passed && result.errorMsg && (
                              <div className="bg-background border border-red-500/20 p-3 rounded-md">
                                <h4 className="font-semibold text-xs uppercase text-red-500 mb-1">What this means</h4>
                                <p className="text-muted-foreground text-sm mb-3">{result.errorMsg}</p>
                                <Button size="sm" variant="outline" className="w-full sm:w-auto gap-2" onClick={() => handleAskMentor(test, result)}>
                                  <Bot className="w-4 h-4" />
                                  Ask AI Mentor
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {testHistory.length > 1 && (
        <section className="pt-8 border-t border-border">
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-4">Test History</h2>
          <div className="space-y-2 text-sm">
            {(testHistory || []).slice(1, 4).map((run, i) => (
              <div key={run.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg opacity-80">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{new Date(run.timestamp).toLocaleDateString()} &middot; {new Date(run.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="font-medium">
                  {run.passedCount} / {run.totalCount} passed
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
