import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/auth/admin-login', formData);
      login(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-3xl">
        <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
                <Lock className="w-12 h-12 text-primary" />
            </div>
        </div>
        <h2 className="text-3xl font-black text-secondary mb-1 text-center uppercase tracking-tighter">Admin Portal</h2>
        <p className="text-gray-500 mb-8 text-center font-medium">Authorized personnel access only.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" required
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-4 rounded-xl bg-gray-100 focus:bg-white border-2 border-transparent focus:border-primary outline-none transition-all font-semibold"
              placeholder="admin@bc4p.com"
            />
          </div>
          <div className="relative">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Secure Password</label>
            <input 
              type={showPassword ? 'text' : 'password'} required
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-5 py-4 rounded-xl bg-gray-100 focus:bg-white border-2 border-transparent focus:border-primary outline-none transition-all font-semibold"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-gray-400 hover:text-primary transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 text-xl rounded-xl shadow-lg transition-colors"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
