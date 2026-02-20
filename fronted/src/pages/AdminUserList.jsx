import React, { useEffect, useState } from 'react';
import api from '../api/api';
import AdminLayout from '../components/AdminLayout';
import { 
  Users, 
  MapPin, 
  Phone, 
  Calendar,
  Grid,
  Trash2
} from 'lucide-react';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, confirm } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (user) => {
    const isConfirmed = await confirm(`CRITICAL ACTION: Permanently delete ${user.name} and ALL their data? This cannot be undone.`);
    if (!isConfirmed) return;
    
    try {
      await api.delete(`/admin/users/${user._id}`);
      setUsers(users.filter(u => u._id !== user._id));
      showToast(`${user.name} and all data deleted`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Deletion failed', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-12">
            <h1 className="text-4xl font-black text-secondary tracking-tighter uppercase mb-2 flex items-center gap-4">
                <Users className="text-primary" /> Contributor Network
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">Master Registry of active documented agents</p>
        </header>

        {loading ? (
          <div className="p-20 text-center text-primary font-bold animate-pulse">Querying User Node...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all group">
                <div className="flex items-center gap-4 mb-6">
                    {user.profilePicture ? (
                        <img 
                            src={user.profilePicture} 
                            alt={user.name} 
                            className="w-16 h-16 rounded-2xl object-cover border border-gray-200 group-hover:border-primary transition-colors"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Users size={32} />
                        </div>
                    )}
                    <div>
                        <h3 className="text-xl font-black text-secondary uppercase leading-none">{user.name}</h3>
                        <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">{user.role}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <InfoRow icon={<Phone size={14} />} label="Mobile" value={user.phone} />
                    <InfoRow icon={<MapPin size={14} />} label="Operational Zone" value={`${user.location?.county}, ${user.location?.subCounty}`} />
                    <InfoRow icon={<Users size={14} />} label="Clan Linkage" value={user.clan || '—'} />
                    <InfoRow icon={<Calendar size={14} />} label="Registry Date" value={new Date(user.createdAt).toLocaleDateString()} />
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => window.location.href = `/admin/submissions?user=${user._id}`}
                            className="flex-1 py-3 bg-gray-50 hover:bg-primary/10 text-gray-400 hover:text-primary font-black uppercase text-[10px] tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Grid size={14} /> Activity
                        </button>
                        <button 
                            onClick={() => handleDeleteUser(user)}
                            className="px-4 py-3 bg-red-50 hover:bg-red-500 text-red-300 hover:text-white rounded-xl transition-all"
                            title="Delete Contributor"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-sm font-bold text-secondary leading-none">{value}</p>
        </div>
    </div>
);

export default AdminUserList;
