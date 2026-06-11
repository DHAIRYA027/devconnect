import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

// App-wide toast notifications. Call showToast("message") anywhere;
// toasts stack bottom-right and auto-dismiss.
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const showToast = useCallback((message, type = "info") => {
    nextId.current += 1;
    const id = nextId.current;
    // Keep at most 3 on screen so they never pile up.
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-viewport" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
