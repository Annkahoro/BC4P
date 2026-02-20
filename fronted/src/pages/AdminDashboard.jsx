```javascript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AdminLayout from '../components/AdminLayout';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Layers, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, subsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/submissions')
        ]);
        setStats(statsRes.data);
        setSubmissions(subsRes.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bc4p_submissions.csv');
      document.body.appendChild(link);
      link.click();
      showToast('Data report exported successfully', 'success');
    } catch (err) {
      showToast('Export failed', 'error');
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="p-20 text-center text-primary font-bold animate-pulse text-2xl">Initializing Admin Command Center...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 transition-all">
          <div>
            <h1 className="text-4xl font-black text-secondary tracking-tighter uppercase">Command Center</h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Real-time Data Intelligence & Governance</p>
          </div>
          <button 
            onClick={handleExport}
            className="bg-secondary hover:bg-secondary-light text-white font-bold flex items-center gap-2 py-3 px-6 rounded-xl shadow-xl transition-colors text-sm"
          >
            <Download size={16} /> Export Data Report
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<FileText className="text-blue-500" />} label="Total Submissions" value={stats?.totalSubmissions || 0} />
          <StatCard icon={<AlertCircle className="text-amber-500" />} label="Pending Review" value={stats?.pendingReview || 0} />
          <StatCard icon={<CheckCircle className="text-green-500" />} label="Approved Data" value={stats?.approved || 0} />
          <StatCard icon={<Layers className="text-purple-500" />} label="Active Pillars" value={stats?.byPillar?.length || 0} />
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3">
              <BarChart3 className="text-primary" /> Incoming Data Stream
            </h2>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase">Live</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-8 py-5">Submission</th>
                  <th className="px-8 py-5">Contributor</th>
                  <th className="px-8 py-5">Pillar</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="font-black text-secondary group-hover:text-primary transition-colors uppercase tracking-tight">{sub.title}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                        <span className="font-bold">{sub.category}</span>
                        <span>•</span>
                        <span className="italic font-medium">{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-secondary">{sub.user?.name}</div>
                      <div className="text-xs font-mono text-gray-400">{sub.user?.phone}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getPillarColor(sub.pillar)}`}>
                        {sub.pillar}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => navigate(`/admin/submissions/${sub._id}`)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 rounded-lg"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group border-b-4 border-b-transparent hover:border-b-primary">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-3xl font-black text-secondary">{value}</span>
    </div>
    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-amber-100 text-amber-700',
    'Approved': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700',
    'Revision Requested': 'bg-blue-100 text-blue-700'
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const getPillarColor = (pillar) => {
  const colors = {
    'Cultural': 'bg-orange-100 text-orange-600',
    'Social': 'bg-blue-100 text-blue-600',
    'Economic': 'bg-emerald-100 text-emerald-600',
    'Environmental': 'bg-green-100 text-green-600',
    'Technical': 'bg-purple-100 text-purple-600',
  };
  return colors[pillar] || 'bg-gray-100 text-gray-600';
};

export default AdminDashboard;
