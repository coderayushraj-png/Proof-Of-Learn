import { useState, useRef, useEffect } from "react"
import { Bot, Send, User, Sparkles, BookOpen, Bug, CheckSquare } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Project, Task } from "../../types"

interface Message {
  id: string
  role: "user" | "mentor"
  content: string
}

const QUICK_ACTIONS = [
  { icon: <Sparkles className="w-4 h-4" />, label: "Give me a hint", prompt: "I'm stuck. Can you give me a hint for this task?" },
  { icon: <BookOpen className="w-4 h-4" />, label: "Explain concept", prompt: "Can you explain the main concepts needed for this task?" },
  { icon: <Bug className="w-4 h-4" />, label: "Help debug", prompt: "I'm running into an error. Can you help me debug?" },
  { icon: <CheckSquare className="w-4 h-4" />, label: "Review approach", prompt: "Can you review my general approach to this problem?" },
]

export function AiMentorPanel({ project, task }: { project: Project, task?: Task }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "mentor",
      content: `Hi! I'm your AI Mentor for **${project.title}**. ${task ? `I see you're working on "${task.title}". ` : ""}How can I help you?`
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Listen for global events
  useEffect(() => {
    const handleAiMentorEvent = (e: any) => {
      const detail = e.detail;
      if (detail.action === "ask_mentor" && detail.context === "failed_test") {
        const prompt = `I failed a test: "${detail.testDescription}".\nExpected: ${detail.expected}\nReceived: ${detail.received}\n${detail.errorMsg ? `Error: ${detail.errorMsg}` : ''}\n\nCan you help me fix this?`;
        handleSend(prompt, true);
      }
    };

    window.addEventListener("ai-mentor-event", handleAiMentorEvent);
    return () => window.removeEventListener("ai-mentor-event", handleAiMentorEvent);
  }, []);

  // Reset chat context when task changes
  useEffect(() => {
    if (task) {
      setMessages(prev => {
        // Only add context message if not already the latest
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.content.includes(`Moved to **${task.title}**`)) return prev;
        
        return [...prev, {
          id: `init-${task.id}-${Date.now()}`,
          role: "mentor",
          content: `Moved to **${task.title}**. What's the plan?`
        }]
      })
    }
  }, [task?.id])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (text: string, force = false) => {
    if (!text.trim() && !force) return
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text
    }
    
    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    // Mock AI Mentor Service
    setTimeout(() => {
      let responseText = ""
      const lowerText = text.toLowerCase()
      
      if (lowerText.includes("failed a test")) {
        responseText = `I see you failed a test. Let's analyze it.\n\nThe test expected one thing but received something else. Often this happens when your API is returning the wrong status code or format. Check your endpoint implementation and ensure you're sending the exact expected payload.`
      } else if (lowerText.includes("hint") && task) {
        responseText = `Instead of giving you the answer directly, let's look at the requirements.\n\nYou need to: *${task.requirements[0] || 'complete the objective'}*.\n\nWhat is the first step you think you should take to achieve that?`
      } else if ((lowerText.includes("debug") || lowerText.includes("error")) && task) {
        responseText = `Let's debug it together. What does the error message say exactly? \n\nAlso, check if you've correctly implemented the acceptance criteria: *${task.criteria[0] || 'verify inputs'}*.`
      } else if (lowerText.includes("explain") && task) {
        responseText = task.concepts.length > 0 
          ? `Sure. One of the core concepts here is **${task.concepts[0].title}**.\n\n${task.concepts[0].description}\n\nDoes that make sense in the context of what you're trying to build?`
          : `This task is mostly about applying what you've learned. The main objective is to ${task.objective.toLowerCase()}.`
      } else if (task) {
        responseText = `That's an interesting approach. Remember, the goal of this task is to:\n\n> ${task.objective}\n\nHow does your idea align with that?`
      } else {
        responseText = `I'm here to help you with your project. Tell me what you're stuck on.`
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "mentor",
        content: responseText
      }])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="flex flex-col h-full bg-background border-l border-border relative">
      {/* Mentor Header */}
      <div className="p-4 border-b border-border bg-card flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">AI Mentor</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
            {task ? "Task Context Active" : "Project Context Active"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "user" ? "bg-muted" : "bg-primary/10"
            }`}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
            </div>
            <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className="text-xs text-muted-foreground font-medium">
                {msg.role === "user" ? "You" : "Mentor"}
              </div>
              <div className={`p-3 rounded-lg text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-muted rounded-tl-none border border-border/50"
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="p-3 rounded-lg bg-muted rounded-tl-none border border-border/50 flex items-center gap-1.5 h-[42px]">
              <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card shrink-0 space-y-3">
        {/* Quick Actions */}
        {messages.length < 3 && task && (
          <div className="flex flex-wrap gap-2 mb-2">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => handleSend(action.prompt)}
                className="flex items-center gap-1.5 text-xs bg-background border border-border px-2 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}
        
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(inputValue)
          }}
          className="relative"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your mentor..."
            className="w-full bg-background border border-border rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 top-1 bottom-1 h-auto text-muted-foreground hover:text-foreground"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
