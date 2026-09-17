import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppProvider } from "./context/AppContext"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Login } from "./pages/Login"
import { SignUp } from "./pages/SignUp"
import { ForgotPassword } from "./pages/ForgotPassword"
import { AppLayout } from "./components/layout/AppLayout"
import { Landing } from "./pages/Landing"
import { Dashboard } from "./pages/Dashboard"
import { Explore } from "./pages/Explore"
import { ProjectDetails } from "./pages/ProjectDetails"
import { Workspace } from "./pages/Workspace"
import { Portfolio } from "./pages/Portfolio"
import { Skills } from "./pages/Skills"
import { ToastContainer } from "./components/ui/toast"

export default function App() {
  return (
    <AuthProvider><AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
            <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
          </Route>
          {/* Workspace doesn't use the standard AppLayout to maximize space */}
          <Route path="/workspace/:id" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider></AuthProvider>
  )
}
