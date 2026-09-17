import { Link } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
import { ArrowRight, Code2, Cpu, CheckCircle2, Layout, Database } from "lucide-react"

export function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="px-4 py-24 md:py-32 max-w-screen-xl mx-auto w-full flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary max-w-3xl mb-6 leading-tight">
          Stop learning to build.<br />
          <span className="text-brand">Start building to learn.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Build real-world projects, learn the technology you need, get unstuck with an AI mentor, and turn your work into a portfolio that proves what you can do.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" variant="brand" className="text-base px-8" asChild>
            <Link to="/explore">Explore Projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8">
            See How It Works
          </Button>
        </div>
        
        {/* Mockup Preview */}
        <div className="mt-16 w-full max-w-5xl rounded-xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col">
          <div className="h-12 border-b border-border flex items-center px-4 gap-2 bg-muted/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="mx-auto bg-background border border-border rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center gap-2">
              <Code2 className="w-3 h-3" />
              Proof Of Learn Workspace
            </div>
          </div>
          <div className="flex h-[400px]">
            <div className="w-64 border-r border-border p-4 hidden md:block bg-muted/10">
              <div className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Tasks</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-green-500" /> 01 Setup</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-green-500" /> 02 Frontend UI</div>
                <div className="flex items-center gap-2 text-sm font-medium text-primary bg-muted p-1.5 rounded-md"><div className="w-1.5 h-1.5 rounded-full bg-brand ml-1 mr-0.5" /> 03 API Integration</div>
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col items-start text-left bg-background">
              <div className="text-sm font-medium text-brand mb-2">Current Task</div>
              <h3 className="text-2xl font-bold mb-4">Connect the AI API</h3>
              <div className="bg-muted/50 w-full rounded-lg p-4 font-mono text-sm text-foreground/80 border border-border mb-4">
                <span className="text-brand">const</span> response = <span className="text-brand">await</span> fetch(<span className="text-green-600">"/api/analyze"</span>, &#123;<br/>
                &nbsp;&nbsp;method: <span className="text-green-600">"POST"</span>,<br/>
                &nbsp;&nbsp;body: JSON.stringify(&#123; text: resumeText &#125;)<br/>
                &#125;);
              </div>
            </div>
            <div className="w-80 border-l border-border hidden lg:flex flex-col bg-muted/10">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand" />
                <span className="text-sm font-medium">AI Mentor</span>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-end gap-3">
                <div className="bg-muted p-3 rounded-lg text-sm text-foreground border border-border rounded-bl-none self-start max-w-[85%]">
                  Let's debug it step by step. First, check whether your API key is being loaded correctly from your environment variables.
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs h-7">Give me a hint</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">A structured approach to learning through building real products.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
            <div className="hidden md:block absolute top-6 left-0 w-full h-[1px] bg-border -z-10" />
            
            {[
              { num: "01", title: "Pick a challenge", desc: "Select a real-world project based on what you want to build." },
              { num: "02", title: "Learn what you need", desc: "We provide exactly the concepts required for the current task." },
              { num: "03", title: "Build & get unstuck", desc: "Write code in your environment. An AI mentor guides you when stuck." },
              { num: "04", title: "Ship & showcase", desc: "Pass the automated tests, deploy it, and add it to your portfolio." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center font-bold text-lg shadow-sm">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 max-w-screen-xl mx-auto px-4 md:px-8 w-full">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Challenges</h2>
            <p className="text-muted-foreground">Practical projects designed to build your skills.</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/explore">View all challenges <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Build a REST API",
              desc: "Create a robust backend API with authentication, pagination, and database integration.",
              diff: "Beginner", time: "4-6 hours", icon: Database, tags: ["Node.js", "Express", "SQL"]
            },
            {
              title: "Create an AI Resume Analyzer",
              desc: "Turn a resume into structured data and generate improvement suggestions using an AI API.",
              diff: "Intermediate", time: "6-8 hours", icon: Cpu, tags: ["React", "API", "AI", "JSON"]
            },
            {
              title: "Build a Real-Time Weather Dashboard",
              desc: "Fetch and visualize complex real-time weather data with beautiful interactive charts.",
              diff: "Intermediate", time: "5-7 hours", icon: Layout, tags: ["React", "APIs", "D3"]
            }
          ].map((proj, i) => (
            <Link key={i} to="/explore" className="group block h-full">
              <div className="flex flex-col h-full rounded-xl border border-border p-6 transition-all hover:shadow-md hover:border-foreground/20 bg-background">
                <div className="mb-4 text-muted-foreground">
                  <proj.icon className="w-8 h-8 stroke-1 text-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-brand transition-colors">{proj.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-3">{proj.desc}</p>
                <div className="flex items-center gap-2 mb-4 text-xs font-medium text-muted-foreground">
                  <span>{proj.diff}</span>
                  <span>&middot;</span>
                  <span>{proj.time}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {(proj.tags || []).map(t => (
                    <span key={t} className="text-xs px-2 py-1 bg-muted rounded-md font-medium text-foreground/70">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Button variant="outline" asChild className="w-full mt-6 sm:hidden">
          <Link to="/explore">View all challenges</Link>
        </Button>
      </section>
    </div>
  )
}
