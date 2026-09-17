import React from "react";
import { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "../../utils/cn"
import { Button } from "../ui/button"
import { Bell, Search, Hexagon, User, FolderKanban, Settings, LogOut, CheckCircle2, Info } from "lucide-react"
import { useAppContext } from "../../context/AppContext"
import { useAuth } from "../../context/AuthContext"


export function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { userState, markNotificationRead, markAllNotificationsRead } = useAppContext()
  
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Explore", path: "/explore" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Skills", path: "/skills" },
  ]

  const isLanding = location.pathname === "/"
  
  const unreadCount = userState.notifications.filter(n => !n.read).length

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
        <Link to={isLanding ? "/" : "/dashboard"} className="mr-8 flex items-center gap-2">
          <Hexagon className="h-6 w-6 text-brand" strokeWidth={2.5} />
          <span className="font-bold text-lg tracking-tight">Proof Of Learn</span>
        </Link>
        
        {!isLanding && (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "transition-colors hover:text-foreground",
                  location.pathname === item.path ? "text-foreground font-semibold" : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {!isLanding ? (
            <>
              <form onSubmit={handleSearch} className="hidden w-full max-w-sm lg:flex items-center space-x-2">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
                  />
                </div>
              </form>
              
              <div className="relative" ref={notifRef}>
                <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)}>
                  <div className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-brand border-2 border-background"></span>
                    )}
                  </div>
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-md border border-border bg-background shadow-lg overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllNotificationsRead} className="text-xs text-brand hover:underline font-medium">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {userState.notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                          You're all caught up.
                        </div>
                      ) : (
                        userState.notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            className={cn("p-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors", !notif.read && "bg-muted/20")}
                            onClick={() => markNotificationRead(notif.id)}
                          >
                            <div className="flex gap-3">
                              <div className="shrink-0 mt-0.5">
                                {notif.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Info className="h-4 w-4 text-brand" />}
                              </div>
                              <div>
                                <h4 className={cn("text-sm", !notif.read && "font-semibold")}>{notif.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                >
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </button>
                
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-background shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium">{user?.displayName || 'Builder'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
                    </div>
                    <div className="p-1">
                      <Link to="/portfolio" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-muted">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link to="/dashboard" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-muted">
                        <FolderKanban className="h-4 w-4" /> My Projects
                      </Link>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-muted text-left">
                        <Settings className="h-4 w-4" /> Settings
                      </button>
                    </div>
                    <div className="p-1 border-t border-border">
                      <button onClick={() => { setShowProfile(false); logout(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-muted text-left text-red-600">
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/explore">Explore</Link>
              </Button>
              <Button variant="brand" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
