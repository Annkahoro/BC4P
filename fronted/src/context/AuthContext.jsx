import React, { createContext, useState, useEffect, useContext } from 'react';

import { AlertTriangle, LogIn } from 'lucide-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')) 
      : null
  );
  const [isSessionInvalid, setIsSessionInvalid] = useState(false);

  useEffect(() => {
    const handleInvalidSession = () => {
      setIsSessionInvalid(true);
    };

    window.addEventListener('auth:session-invalid', handleInvalidSession);
    return () => window.removeEventListener('auth:session-invalid', handleInvalidSession);
  }, []);

  const login = (data) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setIsSessionInvalid(false);
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    setIsSessionInvalid(false);
  };

  const handleReLogin = () => {
    logout();
    window.location.href = '/admin';
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
      
      {/* Session Invalidation Modal */}
      {isSessionInvalid && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-lg w-full border border-white/20 animate-in zoom-in-95 duration-500 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
            
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 transform group-hover:rotate-12 transition-transform duration-500">
              <AlertTriangle size={48} />
            </div>

            <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter mb-4">Security Protocol</h2>
            <p className="text-gray-500 font-bold mb-10 leading-relaxed">
              Your session has been terminated because the <span className="text-secondary underline decoration-red-500 decoration-2 underline-offset-4">account password was updated</span> in Render. 
              <br/><br/>
              To protect your data, please re-authenticate with your new credentials.
            </p>

            <button 
              onClick={handleReLogin}
              className="w-full py-5 bg-secondary hover:bg-secondary-light text-white font-black uppercase text-sm tracking-[0.2em] rounded-2xl shadow-2xl shadow-secondary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <LogIn size={20} />
              Re-Authenticate Now
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
