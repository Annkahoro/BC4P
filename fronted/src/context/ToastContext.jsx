import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

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
  const [confirmData, setConfirmData] = useState(null); // { message, resolve }
  const resolverRef = useRef();

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmData({ message });
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirmResponse = (value) => {
    if (resolverRef.current) {
      resolverRef.current(value);
      resolverRef.current = null;
    }
    setConfirmData(null);
  };

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            {...toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl p-8 max-w-md w-full border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-secondary uppercase tracking-tight mb-2">Confirm Action</h3>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">{confirmData.message}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => handleConfirmResponse(false)}
                className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 font-black uppercase text-xs tracking-widest rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleConfirmResponse(true)}
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-xl shadow-lg shadow-red-500/20 transition-all"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
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
