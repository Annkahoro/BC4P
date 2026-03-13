import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import AdminLayout from '../components/AdminLayout';
import { 
  Globe, 
  DollarSign, 
  Users, 
  Cpu, 
  Leaf, 
  MapPin, 
  Palette,
  ArrowRight,
  Loader2
} from 'lucide-react';

const PILLARS_CONFIG = [
  { name: 'Political', icon: Globe, color: 'text-orange-600', bg: 'bg-orange-100', accent: 'border-orange-200' },
  { name: 'Economic', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100', accent: 'border-emerald-200' },
  { name: 'Social', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', accent: 'border-blue-200' },
  { name: 'Technological', icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-100', accent: 'border-purple-200' },
  { name: 'Environmental', icon: Leaf, color: 'text-green-600', bg: 'bg-green-100', accent: 'border-green-200' },
  { name: 'Legal', icon: MapPin, color: 'text-red-600', bg: 'bg-red-100', accent: 'border-red-200' },
  { name: 'Culture', icon: Palette, color: 'text-yellow-600', bg: 'bg-yellow-100', accent: 'border-yellow-200' },
];

const AdminPillarOverview = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        // Convert byPillar array to object for easy lookup
        const pillarStats = data.byPillar?.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}) || {};
        setStats(pillarStats);
      } catch (err) {
        console.error('Error fetching pillar stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-primary mr-2" size={32} />
        <span className="text-2xl font-black text-secondary uppercase tracking-tighter">Syncing Pillar Intelligence...</span>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tighter uppercase mb-2">Pillar Overview</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">High-level intelligence across all documentation streams</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PILLARS_CONFIG.map((pillar) => {
            const Icon = pillar.icon;
            const count = stats[pillar.name] || 0;
            
            return (
              <div 
                key={pillar.name}
                onClick={() => navigate(`/admin/submissions?pillar=${pillar.name}`)}
                className={`group cursor-pointer bg-white p-8 rounded-[40px] border-2 ${pillar.accent} hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden`}
              >
                <div className={`w-14 h-14 ${pillar.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={pillar.color} size={28} />
                </div>
                
                <h3 className="text-xl font-black text-secondary mb-1 uppercase tracking-tight">{pillar.name}</h3>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-4xl font-black text-secondary">{count}</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nodes</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </div>

                {/* Decorative Background Element */}
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${pillar.bg} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPillarOverview;
