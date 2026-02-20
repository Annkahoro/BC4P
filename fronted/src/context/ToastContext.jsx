import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            {...toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    warning: <AlertCircle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const colors = {
    success: 'border-green-500/20 bg-green-50/80',
    error: 'border-red-500/20 bg-red-50/80',
    warning: 'border-amber-500/20 bg-amber-50/80',
    info: 'border-blue-500/20 bg-blue-50/80',
  };

  return (
    <div 
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-right-8 duration-300 ${colors[type] || colors.info}`}
    >
      <div className="shrink-0 mt-0.5">{icons[type] || icons.info}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-secondary leading-tight">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="shrink-0 text-gray-400 hover:text-secondary transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};
