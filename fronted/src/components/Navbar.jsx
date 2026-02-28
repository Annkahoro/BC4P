import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LOGO from '../assets/LOGO.jpeg';
import { Menu, X, LogOut, LayoutDashboard, UserPlus, LogIn } from 'lucide-react';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navToRegister = () => {
    setIsOpen(false);
    if (window.location.pathname === '/') {
      document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={LOGO} alt="BC4P Logo" className="h-12 w-auto rounded-md shadow-sm" />
              <span className="text-2xl font-bold text-secondary hidden md:block">BC4P</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {userInfo ? (
              <>
                <div className="flex items-center gap-3">
                    {userInfo.profilePicture ? (
                        <img 
                            src={userInfo.profilePicture} 
                            alt={userInfo.name} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {userInfo.name.charAt(0)}
                        </div>
                    )}
                    <span className="text-gray-700 text-sm">Welcome, <span className="font-bold">{userInfo.name.split(' ')[0]}</span></span>
                </div>
                
                <Link 
                  to={userInfo.role === 'Contributor' ? '/dashboard' : '/admin/dashboard'} 
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 font-bold transition-colors text-xs uppercase tracking-widest px-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-secondary hover:text-primary font-black uppercase text-xs tracking-widest">Login</Link>
                <button 
                  onClick={navToRegister}
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 text-secondary hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] border-t border-gray-100' : 'max-h-0'}`}>
        <div className="px-4 py-6 space-y-4 bg-white">
          {userInfo ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                 {userInfo.profilePicture ? (
                    <img src={userInfo.profilePicture} alt="" className="w-12 h-12 rounded-full border border-gray-200" />
                 ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">{userInfo.name.charAt(0)}</div>
                 )}
                 <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Account Logged In</p>
                    <p className="font-black text-secondary">{userInfo.name}</p>
                 </div>
              </div>
              <Link 
                to={userInfo.role === 'Contributor' ? '/dashboard' : '/admin/dashboard'} 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full bg-primary text-white font-bold py-4 px-6 rounded-2xl text-center shadow-lg shadow-primary/20"
              >
                <LayoutDashboard size={20} />
                Go to Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full border-2 border-red-50 text-red-500 font-bold py-4 px-6 rounded-2xl justify-center hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                Sign Out from Portal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-gray-50 text-secondary font-black py-4 rounded-2xl uppercase text-xs tracking-widest border border-gray-100"
              >
                <LogIn size={18} />
                Login
              </Link>
              <button 
                onClick={navToRegister}
                className="flex items-center justify-center gap-2 bg-primary text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
              >
                <UserPlus size={18} />
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
