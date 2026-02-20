import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LOGO from '../assets/LOGO.jpeg';
import {
  LayoutDashboard,
  FileStack,
  Users,
  Download,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'All Data / Pillars',  icon: FileStack,       path: '/admin/submissions' },
  { label: 'Contributors', icon: Users,           path: '/admin/users' },
];

const AdminLayout = ({ children }) => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-secondary text-white flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <img src={LOGO} alt="BC4P" className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
          <div>
            <p className="text-sm font-black text-white">BC4P Admin</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Command Center</p>
          </div>
        </div>

        {/* User badge */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 bg-primary/10 rounded-xl px-3 py-2">
            {userInfo?.profilePicture ? (
              <img 
                src={userInfo.profilePicture} 
                alt={userInfo.name} 
                className="w-8 h-8 rounded-full object-cover border border-primary shrink-0"
              />
            ) : (
              <ShieldCheck size={20} className="text-primary shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{userInfo?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{userInfo?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
            const active = pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  active
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 pb-6 space-y-1 border-t border-white/10 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
