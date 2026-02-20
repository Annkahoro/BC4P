import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../context/ToastContext';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Calendar, 
  MapPin, 
  Tag
} from 'lucide-react';

const AdminSubmissionList = () => {
  const [searchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    pillar: searchParams.get('pillar') || '', 
    status: searchParams.get('status') || '', 
    county: searchParams.get('county') || '',
    user: searchParams.get('user') || '' 
  });
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/submissions?${params}`);
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    try {
      await api.delete(`/submissions/${id}`);
      setSubmissions(submissions.filter(s => s._id !== id));
      showToast('Submission removed from registry', 'success');
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-secondary tracking-tighter uppercase mb-2">Submission Registry</h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">Comprehensive database of all documented data nodes</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <FilterSelect 
              value={filters.pillar} 
              onChange={e => setFilters({...filters, pillar: e.target.value})}
              options={['Cultural', 'Social', 'Economic', 'Environmental', 'Technical']} 
              placeholder="All Pillars"
            />
            <FilterSelect 
              value={filters.status} 
              onChange={e => setFilters({...filters, status: e.target.value})}
              options={['Pending', 'Approved', 'Rejected', 'Revision Requested']} 
              placeholder="All Statuses"
            />
          </div>
        </header>

        {loading ? (
          <div className="p-20 text-center text-primary font-bold animate-pulse">Synchronizing Data Streams...</div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                    <th className="px-8 py-5">Documentation Entry</th>
                    <th className="px-8 py-5">Origin/Location</th>
                    <th className="px-8 py-5">Pillar Category</th>
                    <th className="px-8 py-5">Verification</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {submissions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="font-black text-secondary group-hover:text-primary transition-colors uppercase tracking-tight">{sub.title}</div>
                        <div className="text-xs text-secondary/60 flex items-center gap-2 mt-1 font-bold italic truncate max-w-xs">{sub.user?.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <Calendar size={10} /> {new Date(sub.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-secondary flex items-center gap-2 italic">
                            <MapPin size={12} className="text-primary" /> {sub.location?.subCounty}, {sub.location?.county}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{sub.location?.specificArea || 'General Area'}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getPillarColor(sub.pillar)}`}>
                          {sub.pillar}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter flex items-center gap-1">
                            <Tag size={10} /> {sub.category}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => navigate(`/admin/submissions/${sub._id}`)}
                                className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 rounded-lg"
                                title="Review Evidence"
                            >
                                <Eye size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(sub._id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-lg"
                                title="Delete Entry"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-gray-400 italic">No submissions found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const FilterSelect = ({ value, onChange, options, placeholder }) => (
  <select 
    value={value} 
    onChange={onChange}
    className="bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl outline-none focus:border-primary transition-all text-secondary"
  >
    <option value="">{placeholder}</option>
    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  </select>
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

export default AdminSubmissionList;
