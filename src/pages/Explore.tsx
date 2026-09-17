import { fetchWithAuth } from "../lib/api";
import React from "react";
import { useState, useMemo, useEffect } from "react"
import { Search, Filter, ArrowRight, X } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "../components/ui/button"


export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All")
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["All", "Web", "AI", "Backend", "Cloud", "Data", "Mobile", "DevOps"]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

  
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "")
  }, [searchParams])

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError('');
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (activeCategory !== 'All') queryParams.append('category', activeCategory);
        if (activeDifficulty !== 'All') queryParams.append('difficulty', activeDifficulty);
        
        const data = await fetchWithAuth('/api/projects?' + queryParams.toString());
        setProjects(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simple debounce
    const timeout = setTimeout(fetchProjects, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, activeCategory, activeDifficulty]);


  const filteredProjects = projects;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value) {
      setSearchParams({ q: e.target.value })
    } else {
      setSearchParams({})
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setActiveCategory("All")
    setActiveDifficulty("All")
    setSearchParams({})
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">What do you want to build?</h1>
          <p className="text-muted-foreground text-lg">Pick a project and start learning the skills required to build it.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-10 rounded-md border border-border bg-background px-3 py-1 text-sm pl-9 focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(""); setSearchParams({}) }}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button 
            variant={showFilters ? "default" : "outline"} 
            className="h-10 px-4"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8 p-6 border border-border rounded-xl bg-muted/20 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
              Clear All
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setActiveDifficulty(diff)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                      activeDifficulty === diff 
                        ? "bg-foreground text-background border-foreground" 
                        : "bg-background text-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeCategory === cat 
                ? "bg-foreground text-background border-foreground" 
                : "bg-background text-foreground border-border hover:border-foreground/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      
      {isLoading ? (
        <div className="py-24 text-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="py-24 text-center border border-destructive border-dashed rounded-xl bg-destructive/10">
          <h3 className="text-xl font-bold mb-2 text-destructive">Couldn't load projects</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button variant="outline" onClick={() => { setActiveCategory('All'); setActiveDifficulty('All'); setSearchQuery(''); }}>Retry</Button>
        </div>
      ) : filteredProjects.length === 0 ? (

        <div className="py-24 text-center border border-border border-dashed rounded-xl bg-muted/10">
          <h3 className="text-xl font-bold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-6">We couldn't find any projects matching your criteria.</p>
          <Button variant="outline" onClick={clearFilters}>Clear filters & search</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div key={proj.id} className="flex flex-col rounded-xl border border-border p-6 bg-background hover:shadow-sm transition-shadow">
              <h3 className="text-xl font-bold mb-3">{proj.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-3">{proj.description}</p>
              <div className="flex items-center gap-2 mb-4 text-xs font-medium text-foreground/80">
                <span>{proj.difficulty}</span>
                <span className="text-muted-foreground">&middot;</span>
                <span>{proj.estHours}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {proj.tags?.map(t => (
                  <span key={t} className="text-xs px-2 py-1 bg-muted rounded-md font-medium text-muted-foreground">{t}</span>
                ))}
              </div>
              <Button asChild variant="brand" className="w-full mt-auto">
                <Link to={`/project/${proj.id}`}>View Challenge <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
