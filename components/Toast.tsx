"use client";

import { useState, createContext, useContext, useCallback, useEffect } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  addToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { addToast: () => {} };
  }
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          maxWidth: "380px",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            style={{
              padding: "1rem 1.25rem",
              background: toast.type === "error" ? "var(--error)" : toast.type === "success" ? "var(--dark)" : "var(--accent)",
              color: "#fff",
              fontSize: "var(--small)",
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              animation: "slideInRight 0.3s var(--ease)",
              cursor: "pointer",
            }}
            onClick={() => dismiss(toast.id)}
          >
            <span>{toast.message}</span>
            <span
              aria-label="Dismiss"
              style={{ fontSize: "1.25rem", lineHeight: 1, opacity: 0.7 }}
            >
              ×
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
