import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LOGO from '../assets/LOGO.jpeg';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={LOGO} alt="BC4P Logo" className="h-12 w-auto rounded-md shadow-sm" />
              <span className="text-2xl font-bold text-secondary hidden md:block">BC4P</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {userInfo ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                    {userInfo.profilePicture ? (
                        <img 
                            src={userInfo.profilePicture} 
                            alt={userInfo.name} 
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {userInfo.name.charAt(0)}
                        </div>
                    )}
                    <span className="text-gray-700 text-sm">Welcome, <span className="font-bold">{userInfo.name.split(' ')[0]}</span></span>
                </div>
                
                <Link 
                  to={userInfo.role === 'Contributor' ? '/dashboard' : '/admin/dashboard'} 
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 font-bold transition-colors text-xs uppercase tracking-wider"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary font-medium">Login</Link>
                <button 
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/');
                      setTimeout(() => {
                        document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                      }, 500);
                    }
                  }}
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
