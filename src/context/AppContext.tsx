import React, { createContext, useContext, ReactNode } from "react";
import { UserState, AppNotification } from "../types";
import { fetchWithAuth } from '../lib/api';
import { useAuth } from './AuthContext';

interface AppContextType {
  userState: UserState;
  startProject: (projectId: string) => void;
  completeTask: (projectId: string, taskId: string) => void;
  recordTestRun: (projectId: string, testRun: any) => void;
  submitProject: (projectId: string, submission: any) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  addToast: (title: string, message?: string, type?: AppNotification['type']) => void;
  toasts: AppNotification[];
  dismissToast: (id: string) => void;
}

const defaultState: UserState = {
  startedProjects: [],
  completedTasks: {},
  taskAnalytics: {},
  testHistory: {},
  submissions: {},
  completedProjects: [],
  notifications: [
    {
      id: "welcome-1",
      title: "Welcome to Proof Of Learn",
      message: "Start building your first project to unlock new skills.",
      read: false,
      type: "info",
      createdAt: Date.now(),
    }
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = React.useState<UserState>(defaultState);
  const { user } = useAuth();
  
  React.useEffect(() => {
    if (user) {
      fetchWithAuth('/api/me/sync').then(data => {
        if (data) {
          setUserState(prev => ({
            ...prev,
            ...data
          }));
        }
      }).catch(console.error);
    } else {
      setUserState(defaultState);
    }
  }, [user]);
  const [toasts, setToasts] = React.useState<AppNotification[]>([]);

  const addToast = (title: string, message?: string, type: AppNotification['type'] = "success") => {
    const newToast: AppNotification = {
      id: Date.now().toString() + Math.random().toString(),
      title,
      message: message || "",
      read: true,
      type,
      createdAt: Date.now()
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const notify = (title: string, message: string, type: AppNotification['type'] = "info") => {
    const newNotification: AppNotification = {
      id: Date.now().toString() + Math.random().toString(),
      title,
      message,
      read: false,
      type,
      createdAt: Date.now()
    };
    setUserState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications]
    }));
  };

  const startProject = async (projectId: string) => {
    if (user) {
      try {
        await fetchWithAuth(`/api/me/projects/${projectId}/start`, { method: 'POST' });
      } catch (e) {
        console.error(e);
      }
    }
    setUserState(prev => {
      if (prev.startedProjects.includes(projectId)) return prev;
      return {
        ...prev,
        startedProjects: [...prev.startedProjects, projectId],
        completedTasks: { ...prev.completedTasks, [projectId]: [] }
      };
    });
    addToast("Project Started", "Added to your workspace.");
    notify("New Project", "You started a new project. Good luck!", "info");
  };

  const completeTask = async (projectId: string, taskId: string) => {
    if (user) {
      try {
        await fetchWithAuth(`/api/me/tasks/${taskId}/complete`, { method: 'POST' });
      } catch (e) {
        console.error(e);
      }
    }
    setUserState(prev => {
      const projectTasks = prev.completedTasks[projectId] || [];
      if (projectTasks.includes(taskId)) return prev;
      
      const newTasks = [...projectTasks, taskId];
      let newCompletedProjects = [...prev.completedProjects];
      
      // Project completion is now handled via submission
      
      return {
        ...prev,
        completedTasks: {
          ...prev.completedTasks,
          [projectId]: newTasks
        },
        completedProjects: newCompletedProjects
      };
    });
    
    addToast("Task Completed", "Progress updated successfully.", "success");
  };

  const markNotificationRead = (notificationId: string) => {
    setUserState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    }));
  };

  const markAllNotificationsRead = () => {
    setUserState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  
  const recordTestRun = async (projectId: string, testRun: any) => {
    if (user) {
      try {
        await fetchWithAuth(`/api/me/projects/${projectId}/tests`, {
          method: 'POST',
          body: JSON.stringify(testRun)
        });
      } catch (e) {
        console.error(e);
      }
    }
    setUserState(prev => {
      const history = prev.testHistory[projectId] || [];
      return {
        ...prev,
        testHistory: {
          ...prev.testHistory,
          [projectId]: [testRun, ...history]
        }
      };
    });
  };

  const submitProject = async (projectId: string, submission: any) => {
    if (user) {
      try {
        await fetchWithAuth(`/api/me/projects/${projectId}/submit`, {
          method: 'POST',
          body: JSON.stringify(submission)
        });
      } catch (e) {
        console.error(e);
      }
    }
    setUserState(prev => {
      let newCompletedProjects = [...prev.completedProjects];
      
      // Project is fully completed and verified upon submission
      if (submission.verified && !newCompletedProjects.includes(projectId)) {
        newCompletedProjects.push(projectId);
        notify("Project Verified!", `You successfully completed and verified the project.`, "success");
      }
      
      return {
        ...prev,
        submissions: {
          ...prev.submissions,
          [projectId]: submission
        },
        completedProjects: newCompletedProjects
      };
    });
  };

  return (
    <AppContext.Provider value={{
      userState, startProject, completeTask, recordTestRun, submitProject, markNotificationRead, markAllNotificationsRead, addToast, toasts, dismissToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
