import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  FileText, 
  Plus, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PILLARS, MURANGA_SUB_COUNTIES, CLAN_DATA, TOWN_SPECIALIZATIONS } from '../utils/constants';

const SubmissionWorkspace = () => {
  const { pillar } = useParams();
  const navigate = useNavigate();
  const locationState = useLocation().state;
  const { userInfo } = useAuth();
  const { showToast } = useToast();
  const userLocation = userInfo?.location || {};

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: {
      county: userLocation.county || "Murang'a",
      subCounty: userLocation.subCounty || '',
      specificArea: ''
    },
    metadata: {
      isPracticeActive: 'Yes',
      estimatedAgeOfPractice: '',
      sourceOfInformation: '',
      sensitivityLevel: 'Public'
    },
    isLinkedToAncestralLand: false,
    tags: ''
  });

  const [files, setFiles] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);

  // Pre-fill if editing
  useEffect(() => {
    if (locationState?.editMode && locationState?.submission) {
        const sub = locationState.submission;
        setEditMode(true);
        setSubmissionId(sub._id);
        setFormData({
            title: sub.title || '',
            category: sub.category || '',
            description: sub.description || '',
            location: {
                county: sub.location?.county || "Murang'a",
                subCounty: sub.location?.subCounty || '',
                specificArea: sub.location?.specificArea || ''
            },
            metadata: {
                sourceOfInformation: sub.metadata?.sourceOfInformation || '',
                estimatedAgeOfPractice: sub.metadata?.estimatedAgeOfPractice || '',
                isPracticeActive: sub.metadata?.isPracticeActive || 'Yes',
                sensitivityLevel: sub.metadata?.sensitivityLevel || 'Public'
            },
            isLinkedToAncestralLand: sub.isLinkedToAncestralLand || false,
            tags: sub.tags ? sub.tags.join(', ') : ''
        });
    }
  }, [locationState]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
    setCaptions([...captions, ...selectedFiles.map(() => '')]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setCaptions(captions.filter((_, i) => i !== index));
  };

  const handleCaptionChange = (index, value) => {
    const newCaptions = [...captions];
    newCaptions[index] = value;
    setCaptions(newCaptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('pillar', pillar);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('location', JSON.stringify(formData.location));
    data.append('metadata', JSON.stringify(formData.metadata));
    data.append('isLinkedToAncestralLand', formData.isLinkedToAncestralLand);
    data.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())));

    files.forEach((file, i) => {
      data.append('files', file);
      data.append('captions', captions[i]);
    });

    try {
      if (editMode && submissionId) {
          await api.put(`/submissions/${submissionId}`, data, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
      } else {
          await api.post('/submissions', data, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
      }
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Submission failed:', err.response?.data || err.message);
      showToast(`Submission failed: ${err.response?.data?.message || 'Check your data'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-black text-secondary mb-2 uppercase tracking-tighter">SUBMISSION RECEIVED</h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.3em]">Redirecting to Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-secondary font-bold mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> BACK TO DASHBOARD
        </button>

        <header className="mb-10 px-2">
          <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block border border-primary/20">
            {pillar} Workspace
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-secondary tracking-tighter uppercase leading-tight">Structured Documentation</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 italic">Capture every detail for posterity</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION A: BASIC INFO */}
          <Section num="A" title="Basic Entry Information">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="label">Entry Title</label>
                <input 
                  type="text" required
                  className="input" placeholder="e.g. Traditional Gīkūyū Wedding Rituals"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="label">Category</label>
                <select 
                  className="input" required
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {PILLARS[pillar]?.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              {/* Location — pre-filled from registration, only specific area is editable */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Registered Location</p>
                <p className="font-bold text-secondary">
                  {userLocation.subCounty || '—'}, {userLocation.county || "Murang'a"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Automatically linked from your account</p>
                
                {/* Dynamic Town Specialization */}
                {userLocation.subCounty && TOWN_SPECIALIZATIONS[userLocation.subCounty] && (
                  <div className="mt-3 pt-3 border-t border-primary/10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Town Specialization</p>
                    <p className="font-bold text-secondary text-xs">{TOWN_SPECIALIZATIONS[userLocation.subCounty]}</p>
                  </div>
                )}
                
                {/* Clan Info */}
                {userInfo?.clan && (
                  <div className="mt-3 pt-3 border-t border-primary/10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Your Clan (Mĩhĩrĩga)</p>
                    <p className="font-bold text-secondary text-xs">{userInfo.clan}</p>
                    <p className="text-[10px] text-gray-500 italic">
                      {CLAN_DATA.find(c => c.clan === userInfo.clan)?.specialization}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Specific Area / Village / Ward <span className="text-gray-400 font-normal">(optional)</span></label>
                <input 
                  type="text" className="input"
                  placeholder="e.g. Gacharage Village, Kandara"
                  value={formData.location.specificArea}
                  onChange={e => setFormData({...formData, location: {...formData.location, specificArea: e.target.value}})}
                />
              </div>
            </div>
          </Section>

          {/* SECTION B: NARRATIVE */}
          <Section num="B" title="Narrative Documentation">
            <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-100">
                <ReactQuill 
                    theme="snow"
                    value={formData.description}
                    onChange={val => setFormData({...formData, description: val})}
                    className="h-64 mb-12"
                    placeholder="Provide a detailed narrative of the practice, ritual or traditional knowledge..."
                />
            </div>
          </Section>

          {/* SECTION C: MEDIA */}
          <Section num="C" title="Evidence & Media Captures">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center bg-white group hover:border-primary transition-colors cursor-pointer relative">
                    <input 
                        type="file" multiple 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="text-gray-300 group-hover:text-primary mb-4" size={48} />
                    <p className="text-sm font-bold text-gray-500">Drop files here or click to upload</p>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase font-black">Images, Video, Audio, Documents</p>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {files.map((file, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-primary">
                                {file.type.startsWith('image/') ? <ImageIcon /> : file.type.startsWith('video/') ? <Video /> : file.type.startsWith('audio/') ? <Mic /> : <FileText />}
                            </div>
                            <div className="flex-grow">
                                <p className="text-xs font-black text-secondary truncate w-40">{file.name}</p>
                                <input 
                                    type="text" placeholder="Add caption..."
                                    className="text-[10px] w-full mt-1 border-b border-gray-100 focus:border-primary outline-none py-1"
                                    value={captions[i]} onChange={e => handleCaptionChange(i, e.target.value)}
                                />
                            </div>
                            <button onClick={() => removeFile(i)} className="text-gray-300 hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </Section>

          {/* SECTION D & E */}
          <div className="grid md:grid-cols-2 gap-8">
            <Section num="D" title="Context Metadata">
                <div className="space-y-6">
                    <div>
                        <label className="label">Is this practice still active?</label>
                        <select 
                            className="input"
                            value={formData.metadata.isPracticeActive}
                            onChange={e => setFormData({...formData, metadata: {...formData.metadata, isPracticeActive: e.target.value}})}
                        >
                            <option>Yes</option>
                            <option>No</option>
                            <option>Rarely</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Estimated Age of Practice</label>
                        <input 
                            type="text" className="input" placeholder="e.g. Pre-colonial, 50+ years"
                            value={formData.metadata.estimatedAgeOfPractice}
                            onChange={e => setFormData({...formData, metadata: {...formData.metadata, estimatedAgeOfPractice: e.target.value}})}
                        />
                    </div>
                </div>
            </Section>

            <Section num="E" title="Heritage Connection">
                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <label className="flex items-center gap-4 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="w-6 h-6 rounded-lg text-primary focus:ring-primary shrink-0"
                            checked={formData.isLinkedToAncestralLand}
                            onChange={e => setFormData({...formData, isLinkedToAncestralLand: e.target.checked})}
                        />
                        <div className="flex-grow">
                            <p className="font-black text-secondary uppercase text-sm">Linked to Ancestral Land</p>
                            <p className="text-xs text-secondary/60">Is this data specific to our gīthaka (ancestral land)?</p>
                        </div>
                    </label>
                </div>
                <div className="mt-6">
                    <label className="label">Metadata Tags (Comma separated)</label>
                    <input 
                        type="text" className="input" placeholder="ritual, medicine, elders..."
                        value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})}
                    />
                </div>
            </Section>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 md:py-6 text-lg md:text-xl rounded-2xl shadow-xl transition-all active:scale-95 shadow-primary/20"
          >
            {loading ? 'Transmitting Data Pulse...' : 'COMPLETE SUBMISSION'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Section = ({ num, title, children }) => (
    <div className="relative">
        <div className="absolute -left-12 top-0 text-3xl font-black text-gray-100 italic hidden lg:block">{num}</div>
        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[40px] border border-gray-100/50 shadow-sm overflow-hidden">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-[10px]">{num}</span>
                {title}
            </h3>
            {children}
        </div>
    </div>
);

export default SubmissionWorkspace;
