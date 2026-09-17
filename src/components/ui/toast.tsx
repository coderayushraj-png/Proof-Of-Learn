import { useAppContext } from "../../context/AppContext";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { cn } from "../../utils/cn";

export function ToastContainer() {
  const { toasts, dismissToast } = useAppContext();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 p-4 bg-background border border-border shadow-lg rounded-lg pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
            {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {toast.type === "error" && <XCircle className="w-5 h-5 text-red-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold">{toast.title}</h4>
            {toast.message && <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
