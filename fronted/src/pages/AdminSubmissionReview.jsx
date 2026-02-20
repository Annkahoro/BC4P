import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import AdminLayout from '../components/AdminLayout';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit3,
  Calendar,
  MapPin,
  User as UserIcon,
  MessageSquare,
  FileText,
  Download,
  Trash2,
  Image as ImageIcon,
  Video,
  Volume2,
  ExternalLink,
} from 'lucide-react';

const AdminSubmissionReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { url, type }

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/submissions/${id}`);
        setSub(data);
        setAdminNotes(data?.adminNotes || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await api.put(`/submissions/${id}/status`, { status, adminNotes });
      setSub(prev => ({ ...prev, status, adminNotes }));
      showToast(`Status updated to ${status}`, 'success');
    } catch {
      showToast('Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this submission? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/submissions/${id}`);
      showToast('Submission deleted permanently', 'success');
      navigate('/admin/submissions');
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="p-20 text-center text-primary font-bold animate-pulse">Loading submission…</div>
    </AdminLayout>
  );
  if (!sub) return (
    <AdminLayout>
      <div className="p-20 text-center text-red-500">Submission not found</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/admin/submissions')}
          className="flex items-center gap-2 text-gray-500 hover:text-secondary font-bold mb-8 uppercase tracking-widest text-xs transition-colors"
        >
          <ArrowLeft size={16} /> All Submissions
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {sub.pillar} — {sub.category}
                </span>
                <StatusBadge status={sub.status} />
              </div>
              <h1 className="text-3xl font-black text-secondary tracking-tight mb-4">{sub.title}</h1>
              <div className="flex flex-wrap gap-3 text-xs font-bold text-gray-500">
                <Pill icon={<UserIcon size={12} />}>{sub.user?.name} · {sub.user?.phone}</Pill>
                {sub.user?.clan && <Pill icon={<UserIcon size={12} />}>{sub.user.clan}</Pill>}
                <Pill icon={<MapPin size={12} />}>
                  {[sub.location?.specificArea, sub.location?.subCounty, sub.location?.county].filter(Boolean).join(', ') || '—'}
                </Pill>
                <Pill icon={<Calendar size={12} />}>{new Date(sub.createdAt).toLocaleDateString('en-KE', { dateStyle: 'long' })}</Pill>
              </div>
            </div>

            {/* Narrative */}
            <Section title="Narrative Content">
              {sub.description
                ? <div className="prose max-w-none text-secondary/80 leading-loose font-medium text-sm" dangerouslySetInnerHTML={{ __html: sub.description }} />
                : <p className="text-gray-400 italic text-sm">No narrative provided.</p>
              }
            </Section>

            {/* Media */}
            <Section title={`Media & Evidence (${sub.files?.length || 0} file${sub.files?.length !== 1 ? 's' : ''})`}>
              {sub.files?.length > 0 ? (
                <div className="space-y-4">
                  {sub.files.map((file, i) => (
                    <MediaCard
                      key={i}
                      file={file}
                      onExpand={() => setLightbox(file)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm">No media attached.</p>
              )}
            </Section>

            {/* Technical context */}
            <Section title="Technical Context">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <MetaItem label="Practice Active?" value={sub.metadata?.isPracticeActive} />
                <MetaItem label="Estimated Age" value={sub.metadata?.estimatedAgeOfPractice} />
                <MetaItem label="Source" value={sub.metadata?.sourceOfInformation} />
                <MetaItem label="Sensitivity" value={sub.metadata?.sensitivityLevel} />
                <MetaItem label="Ancestral Land" value={sub.isLinkedToAncestralLand ? 'Yes' : 'No'} />
                <MetaItem label="Tags" value={sub.tags?.join(', ')} />
              </div>
            </Section>
          </div>

          {/* ── Sidebar: Actions ── */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
              <h3 className="text-sm font-black text-secondary mb-5 flex items-center gap-2">
                <MessageSquare size={16} className="text-primary" /> Admin Actions
              </h3>

              <div className="mb-5">
                <label className="label mb-2">Admin Notes</label>
                <textarea
                  rows={4}
                  className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-primary outline-none text-sm transition-all resize-none"
                  placeholder="Internal notes or revision instructions…"
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleStatusUpdate('Approved')}
                  disabled={updating || sub.status === 'Approved'}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate('Revision Requested')}
                  disabled={updating}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Edit3 size={14} /> Request Revision
                </button>
                <button
                  onClick={() => handleStatusUpdate('Rejected')}
                  disabled={updating}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-red-100"
                >
                  <Trash2 size={14} /> {deleting ? 'Deleting…' : 'Delete Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl font-black opacity-60 hover:opacity-100"
            onClick={() => setLightbox(null)}
          >✕</button>
          <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
            {lightbox.fileType === 'image' && (
              <img src={lightbox.url} alt={lightbox.caption} className="w-full max-h-[85vh] object-contain rounded-2xl" />
            )}
            {lightbox.fileType === 'video' && (
              <video src={lightbox.url} controls autoPlay className="w-full max-h-[85vh] rounded-2xl" />
            )}
            {lightbox.fileType === 'audio' && (
              <div className="bg-secondary rounded-2xl p-10 text-center">
                <Volume2 size={48} className="text-primary mx-auto mb-4" />
                <p className="text-white font-bold mb-4">{lightbox.caption || 'Audio File'}</p>
                <audio src={lightbox.url} controls className="w-full" />
              </div>
            )}
            {lightbox.caption && (
              <p className="text-white/60 text-sm text-center mt-3 italic">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

/* ── Media Card ── */
const MediaCard = ({ file, onExpand }) => {
  const isImage = file.fileType === 'image';
  const isVideo = file.fileType === 'video';
  const isAudio = file.fileType === 'audio';
  const isDoc   = !isImage && !isVideo && !isAudio;
  
  // Helper to get display name
  const displayName = file.originalName || file.caption || file.fileType || 'File';

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
      {/* Preview */}
      {isImage && (
        <div className="relative group cursor-pointer" onClick={onExpand}>
          <img src={file.url} alt={displayName} className="w-full max-h-72 object-cover" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ExternalLink size={32} className="text-white" />
          </div>
        </div>
      )}
      {isVideo && (
        <video src={file.url} controls className="w-full max-h-72 bg-black" />
      )}
      {isAudio && (
        <div className="px-6 pt-6 pb-2 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Volume2 size={24} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
             <p className="font-bold text-secondary text-sm truncate" title={displayName}>{displayName}</p>
             <audio src={file.url} controls className="w-full mt-2" />
          </div>
        </div>
      )}
      {isDoc && (
        <div className="px-6 pt-6 pb-2 flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
            <FileText size={24} className="text-secondary" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-secondary text-sm truncate" title={displayName}>{displayName}</p>
            <p className="text-xs text-gray-400 uppercase">{file.fileType}</p>
          </div>
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 italic truncate max-w-xs">{file.caption || ''}</p>
        <div className="flex gap-2 shrink-0">
          {(isImage || isVideo || isAudio) && (
            <button
              onClick={onExpand}
              className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-secondary px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ExternalLink size={12} /> Expand
            </button>
          )}
          <a
            href={file.url}
            download
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-white bg-primary hover:bg-primary-dark px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download size={12} /> Download
          </a>
        </div>
      </div>
    </div>
  );
};

/* ── Helpers ── */
const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> {title}
    </h3>
    {children}
  </div>
);

const Pill = ({ icon, children }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
    <span className="text-primary">{icon}</span>
    {children}
  </div>
);

const MetaItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-secondary">{value || '—'}</p>
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
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

export default AdminSubmissionReview;
