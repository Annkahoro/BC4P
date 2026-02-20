import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PlusCircle, FileText, CheckCircle, Clock } from 'lucide-react';

const ContributorDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await api.get('/submissions/my');
        setSubmissions(data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const pillars = [
    { name: 'Cultural', color: 'bg-orange-500', icon: '🏛️' },
    { name: 'Social', color: 'bg-blue-500', icon: '🤝' },
    { name: 'Economic', color: 'bg-green-600', icon: '💰' },
    { name: 'Environmental', color: 'bg-emerald-500', icon: '🌿' },
    { name: 'Technical', color: 'bg-purple-500', icon: '⚙️' },
  ];

  /* ── Delete Logic ── */
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await api.delete(`/submissions/${id}`);
        setSubmissions(prev => prev.filter(sub => sub._id !== id));
        showToast('Submission deleted successfully', 'success');
      } catch (err) {
        showToast('Failed to delete submission', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-secondary mb-2">My Documentations</h1>
        <div className="flex items-center gap-4 text-gray-500 font-medium">
            <p>Capture and manage your heritage data contributions.</p>
            {userInfo?.clan && (
                <span className="bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest pt-1.5">
                    {userInfo.clan} Clan
                </span>
            )}
        </div>
      </header>

      {/* Action Cards */}
      <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
        <PlusCircle className="text-primary" /> Start New Submission
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
        {pillars.map((pillar) => (
          <Link 
            key={pillar.name}
            to={`/submit/${pillar.name}`}
            className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 text-center"
          >
            <div className={`w-16 h-16 ${pillar.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
              {pillar.icon}
            </div>
            <h3 className="font-bold text-secondary">{pillar.name}</h3>
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-secondary">Submission History</h2>
          <span className="bg-primary/10 text-primary text-xs font-black px-2 py-1 rounded-full uppercase tracking-widest">
            {submissions.length} Total
          </span>
        </div>
        
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-medium">Loading your submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-20 text-center">
            <div className="text-gray-300 text-5xl mb-4 italic">No data found</div>
            <p className="text-gray-400">You haven't made any submissions yet. Choose a pillar above to start.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Pillar</th>
                  <th className="px-6 py-4">Town Hub</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-secondary group-hover:text-primary transition-colors">{sub.title}</div>
                      <div className="text-xs text-gray-400">{sub.category}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 capitalize">
                        {sub.pillar}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-500">
                        {sub.location?.subCounty || '—'}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {sub.status === 'Approved' ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">
                            <CheckCircle size={14} /> Approved
                          </span>
                        ) : sub.status === 'Pending' ? (
                          <span className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg">
                            <Clock size={14} /> Pending
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{sub.status}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-400 font-mono">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                            {/* Edit */}
                              <button 
                                  onClick={() => navigate(`/submit/${sub.pillar}`, { state: { submission: sub, editMode: true } })}
                                  className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                  title={sub.status === 'Approved' ? "Edit (Resets to Pending)" : "Edit Submission"}
                              >
                                  <div className="p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
                              </button>
                            {/* Delete */}
                            <button 
                                onClick={() => handleDelete(sub._id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Submission"
                            >
                                <div className="p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></div>
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributorDashboard;
