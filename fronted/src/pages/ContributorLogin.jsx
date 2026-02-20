import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ContributorLogin = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { phone });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Invalid phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-secondary mb-2 text-center">Contributor Login</h2>
        <p className="text-gray-500 mb-8 text-center font-medium">Enter your phone number to access your account.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 italic">Phone Number</label>
            <input 
              type="tel" required
              value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-all text-lg tracking-widest"
              placeholder="0712345678"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 text-xl rounded-xl shadow-lg transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col space-y-4 text-center">
            <Link to="/" className="text-secondary font-semibold hover:text-primary underline transition-colors">
                Need to register? Create an account
            </Link>
            <Link to="/admin" className="text-gray-400 text-sm hover:text-secondary uppercase tracking-widest font-bold">
                Admin Access
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ContributorLogin;
