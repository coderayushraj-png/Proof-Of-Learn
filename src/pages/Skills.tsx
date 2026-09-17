import { Link } from "react-router-dom"
import { Code, Database, Globe, Cpu, Server, Terminal, Smartphone } from "lucide-react"
import { Button } from "../components/ui/button"
import { useAppContext } from "../context/AppContext";
import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';


export function Skills() {
  const { userState } = useAppContext()
  
  // Calculate skills based on started and completed projects
  
  const [skillProgress, setSkillProgress] = useState<Record<string, { total: number, completed: number }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/me/skills')
      .then(data => {
        setSkillProgress(data || {});
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
        <p className="text-muted-foreground">Loading skills...</p>
      </div>
    );
  }


  
  // Format into array for rendering, filtering out 0 progress if we want, but let's show all
  const skillsList = Object.entries(skillProgress)
    .map(([name, data]: [string, any]) => ({
      name,
      progress: Math.min(100, Math.round((data.completed / data.total) * 100)) || 0,
      level: data.completed === 0 ? "Beginner" : data.completed < data.total / 2 ? "Intermediate" : "Advanced",
      icon: getSkillIcon(name)
    }))
    .sort((a, b) => b.progress - a.progress)

  function getSkillIcon(skillName: string) {
    const name = skillName.toLowerCase()
    if (name.includes("frontend") || name.includes("react")) return <Globe className="w-5 h-5 text-blue-500" />
    if (name.includes("backend") || name.includes("node")) return <Server className="w-5 h-5 text-green-500" />
    if (name.includes("data") || name.includes("sql")) return <Database className="w-5 h-5 text-purple-500" />
    if (name.includes("ai")) return <Cpu className="w-5 h-5 text-brand" />
    if (name.includes("mobile")) return <Smartphone className="w-5 h-5 text-pink-500" />
    if (name.includes("devops") || name.includes("docker")) return <Terminal className="w-5 h-5 text-orange-500" />
    return <Code className="w-5 h-5 text-muted-foreground" />
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Your Skill Tree</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Track your technical growth. Complete more projects to level up your skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(skillsList || []).map((skill) => (
          <div key={skill.name} className="bg-background border border-border p-6 rounded-xl hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center shrink-0">
                {skill.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg">{skill.name}</h3>
                <p className="text-sm text-muted-foreground">{skill.level}</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <span>Mastery</span>
                <span>{skill.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-foreground h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${skill.progress}%` }} 
                />
              </div>
            </div>
            
            {skill.progress === 0 && (
              <Button asChild variant="outline" size="sm" className="w-full mt-6">
                <Link to={`/explore?q=${skill.name}`}>Find Projects</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
