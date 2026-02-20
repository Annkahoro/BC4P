import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext';
import { REGISTRATION_COUNTY, MURANGA_SUB_COUNTIES, CLAN_DATA, TOWN_SPECIALIZATIONS } from '../utils/constants';
// ── LOGO IMAGE ──────────────────────────────────────────────────────────────
// To change the logo: replace 'LOGO.jpeg' in src/assets/ with your new file
// then update the filename here if it differs.
import LOGO from '../assets/LOGO.jpeg';
// ─────────────────────────────────────────────────────────────────────────────
import {
  ArrowRight,
  MapPin,
  Leaf,
  Users,
  Globe,
  Cpu,
  DollarSign,
  ChevronDown
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Authentic Kenyan / Gikuyu image set
   All photos are sourced from Unsplash and
   represent African/Kenyan people & landscapes.
   ────────────────────────────────────────────── */
const PILLAR_DATA = [
  {
    id: 'cultural',
    label: 'Section 01 — Cultural',
    title: 'Cultural Heritage',
    icon: Globe,
    accent: '#e67e22',
    description: `Document the oral traditions, elder wisdom, ceremonies, arts, and belief systems
      that form the living cultural fabric of the Gīkūyū people. Every story, proverb,
      and ritual you capture becomes part of a permanent, searchable heritage archive.`,
    whatYouCapture: [
      'Origin stories & clan genealogies',
      'Language proverbs & oral traditions',
      'Traditional medicine & healing arts',
      'Rites of passage & ceremonies',
      'Arts, craftsmanship & performance',
      'Beliefs, values & moral codes',
    ],
    // ── PILLAR 1 IMAGE (Cultural) ─────────────────────────────────────────────
    // To change: replace the URL below with any image URL, or a local path like:
    // image: '/images/cultural.jpg'   (put the file in the fronted/public/images/ folder)
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&auto=format&fit=crop&q=80',
    // ─────────────────────────────────────────────────────────────────────────
  },
  {
    id: 'social',
    label: 'Section 02 — Social',
    title: 'Social Wellness',
    icon: Users,
    accent: '#2980b9',
    description: `Map the invisible social infrastructure that keeps communities together —
      leadership structures, kinship networks, education channels, and systems of
      collective care. These living relationships underpin everything we build.`,
    whatYouCapture: [
      'Family & clan kinship structures',
      'Community leadership systems',
      'Traditional education channels',
      'Conflict resolution methods',
      'Social health & wellness practices',
      'Festivals, feasts & communal events',
    ],
    // ── PILLAR 2 IMAGE (Social) ──────────────────────────────────────────────
    // To change: replace the URL below with any image URL or local path
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&auto=format&fit=crop&q=80',
    // ─────────────────────────────────────────────────────────────────────────
  },
  {
    id: 'economic',
    label: 'Section 03 — Economic',
    title: 'Economic Prosperity',
    icon: DollarSign,
    accent: '#6c5ce7',
    description: `Record the indigenous commercial systems — agro-trade networks, cooperative
      structures, heritage tourism sites, and local industries — that define the
      economic identity of the corridor and enable sovereign financial futures.`,
    whatYouCapture: [
      'Traditional markets & trade agreements',
      'Agro-produce & farming systems',
      'Heritage tourism sites & routes',
      'Local industries & crafts',
      'Savings & barter traditions',
      'Cooperative & communal economics',
    ],
    // ── PILLAR 3 IMAGE (Economic) ────────────────────────────────────────────
    // To change: replace the URL below with any image URL or local path
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=900&auto=format&fit=crop&q=80',
    // ─────────────────────────────────────────────────────────────────────────
  },
  {
    id: 'environmental',
    label: 'Section 04 — Environmental',
    title: 'Environmental Stewardship',
    icon: Leaf,
    accent: '#27ae60',
    description: `Preserve indigenous knowledge about the land — sacred sites, water management
      systems, soil practices, and relationships with native flora & fauna across the
      12,731-acre Gīkūyū ancestral corridor.`,
    whatYouCapture: [
      'Sacred groves & land boundaries',
      'Water sources & management',
      'Indigenous flora & fauna knowledge',
      'Soil health & farming calendars',
      'Climate indicators & reading nature',
      'Ancestral land use agreements',
    ],
    // ── PILLAR 4 IMAGE (Environmental) ──────────────────────────────────────
    // To change: replace the URL below with any image URL or local path
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=900&auto=format&fit=crop&q=80',
    // ─────────────────────────────────────────────────────────────────────────
  },
  {
    id: 'technical',
    label: 'Section 05 — Technical',
    title: 'Technical Innovation',
    icon: Cpu,
    accent: '#8e44ad',
    description: `Archive the technical ingenuity embedded in traditional construction,
      tool-making, food processing, and water engineering — systems refined over
      centuries and now ready to be integrated with modern technology.`,
    whatYouCapture: [
      'Traditional construction techniques',
      'Indigenous tool making',
      'Food processing & preservation',
      'Water engineering & irrigation',
      'Navigation & land surveying',
      'Material science & metallurgy',
    ],
    // ── PILLAR 5 IMAGE (Technical) ──────────────────────────────────────────
    // To change: replace the URL below with any image URL or local path
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80',
    // ─────────────────────────────────────────────────────────────────────────
  },
];

/* ─── Registration Form ─── */
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: { county: '', subCounty: '', specificArea: '' },
    profilePicture: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const setLoc = (field, value) =>
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, profilePicture: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('location', JSON.stringify(formData.location));
    data.append('clan', formData.clan || ''); // Add clan to FormData
    if (formData.profilePicture) {
      data.append('profilePicture', formData.profilePicture);
    }

    try {
      const res = await api.post(
        '/auth/register',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <Field label="Full Name">
        <input
          type="text" required
          value={formData.name} onChange={e => set('name', e.target.value)}
          className="input-field" placeholder="e.g. Wanjiku Kamau"
        />
      </Field>

      <Field label="Phone Number">
        <input
          type="tel" required
          value={formData.phone} onChange={e => set('phone', e.target.value)}
          className="input-field" placeholder="07XXXXXXXX"
        />
      </Field>

      <Field label="Profile Picture (Optional)">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        {/* County — locked to Murang'a only */}
        <Field label="County">
          <select
            required
            value={formData.location.county}
            onChange={e => setLoc('county', e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">Select County</option>
            <option value={REGISTRATION_COUNTY}>{REGISTRATION_COUNTY}</option>
          </select>
        </Field>

        {/* Sub-County — all Murang'a sub-counties */}
        <Field label="Town Hub">
          <select
            required
            value={formData.location.subCounty}
            onChange={e => setLoc('subCounty', e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">Select Agro-Industrial Town</option>
            {MURANGA_SUB_COUNTIES.map(sc => (
              <option key={sc} value={sc}>{sc}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Town Specialization Display */}
      {formData.location.subCounty && TOWN_SPECIALIZATIONS[formData.location.subCounty] && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex gap-3 items-center">
            <div className="bg-primary/20 w-8 h-8 rounded-full flex items-center justify-center text-primary">
                <Leaf size={14} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-gray-400">Town Specialization</p>
                <p className="text-secondary font-bold text-xs">{TOWN_SPECIALIZATIONS[formData.location.subCounty]}</p>
            </div>
        </div>
      )}

      {/* Clan Selection */}
      <Field label="Clan (Mĩhĩrĩga)">
        <select
          required
          value={formData.clan || ''}
          onChange={e => set('clan', e.target.value)}
          className="input-field cursor-pointer"
        >
          <option value="">Select Your Clan</option>
          {CLAN_DATA.map(c => (
             <option key={c.clan} value={c.clan}>{c.daughter} — {c.clan}</option>
          ))}
        </select>
      </Field>

      {/* Clan Specialization Display */}
      {formData.clan && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 flex gap-3 items-center">
            <div className="bg-accent/20 w-8 h-8 rounded-full flex items-center justify-center text-accent">
                <Users size={14} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-gray-400">Clan Role</p>
                <p className="text-secondary font-bold text-xs">
                    {CLAN_DATA.find(c => c.clan === formData.clan)?.specialization}
                </p>
            </div>
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl text-base tracking-wide transition-colors mt-2"
      >
        {loading ? 'Creating your node…' : 'Join the Corridor →'}
      </button>

      <p className="text-center text-sm text-gray-500 pt-1">
        Already registered?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};

const Field = ({ label, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
      {label}
    </label>
    {children}
  </div>
);

/* ─── Main Page ─── */
const LandingPage = () => {
  const scrollTo = id =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-white text-secondary overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="min-h-screen bg-secondary flex flex-col items-center justify-center text-center px-6 relative">
        {/* Subtle Kenyan flag‐stripe bar at top */}
        <div className="absolute top-0 left-0 right-0 flex h-1.5">
          <div className="flex-1 bg-secondary-dark" />
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-primary" />
          <div className="flex-1 bg-accent" />
        </div>

        <img
          src={LOGO}
          alt="BC4P Logo"
          className="w-40 h-40 rounded-full border-4 border-primary shadow-2xl mb-8 object-cover"
        />

        <span className="inline-block bg-primary/20 text-primary text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          Build Community for Posterity
        </span>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 max-w-3xl">
          Preserving the{' '}
          <span className="text-primary">Gīkūyū</span>{' '}
          Heritage for the Next Generation
        </h1>

        <p className="text-lg text-gray-400 max-w-xl mb-10 font-medium leading-relaxed">
          A digital platform to document, preserve and govern cultural, social,
          economic, environmental and technical knowledge across the 12,731‑acre
          ancestral corridor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#register"
            onClick={e => { e.preventDefault(); scrollTo('register'); }}
            className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            Start Documenting <ArrowRight size={18} />
          </a>
          <a
            href="#pillars"
            onClick={e => { e.preventDefault(); scrollTo('pillars'); }}
            className="bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
          >
            Explore the 5 Pillars
          </a>
        </div>

        <button
          onClick={() => scrollTo('pillars')}
          className="absolute bottom-10 text-gray-500 animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown size={30} />
        </button>
      </section>

      {/* ── STATS BAR ── */}
      <div className="bg-primary py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white px-6">
          {[
            ['12,731', 'Acres of Ancestral Land'],
            ['5', 'Documentation Pillars'],
            ['47', 'Sub-Counties Covered'],
            ['∞', 'Stories to Preserve'],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-4xl font-black">{num}</div>
              <div className="text-sm text-green-100 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PILLARS ── */}
      <section id="pillars" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-primary text-xs font-black uppercase tracking-widest">
              What You Will Document
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-secondary mt-2 leading-tight">
              The 5 Pillars of Knowledge
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl text-base font-medium">
              Every contribution you make is categorised under one of five core pillars.
              Here is exactly what each one covers.
            </p>
          </div>

          <div className="space-y-24">
            {PILLAR_DATA.map((pillar, i) => {
              const Icon = pillar.icon;
              const isEven = i % 2 === 0;
              return (
                <div
                  key={pillar.id}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                >
                  {/* Image */}
                  <div className="lg:w-1/2 w-full">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover rounded-3xl shadow-xl border border-gray-100"
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback if image fails */}
                    <div
                      className="w-full aspect-[4/3] rounded-3xl border border-gray-200 bg-gray-100 items-center justify-center text-gray-400 text-sm font-medium hidden"
                    >
                      {pillar.title} Image
                    </div>
                  </div>

                  {/* Text */}
                  <div className="lg:w-1/2 w-full space-y-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${pillar.accent}18` }}
                      >
                        <Icon size={24} color={pillar.accent} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                        {pillar.label}
                      </span>
                    </div>

                    <h3 className="text-4xl font-black text-secondary leading-tight">
                      {pillar.title}
                    </h3>

                    <p className="text-gray-600 text-base leading-relaxed font-medium">
                      {pillar.description}
                    </p>

                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                        What you will capture
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {pillar.whatYouCapture.map(item => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-secondary font-medium"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                              style={{ backgroundColor: pillar.accent }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REGISTER ── */}
      <section id="register" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: value prop */}
            <div className="space-y-8">
              <div>
                <span className="text-primary text-xs font-black uppercase tracking-widest">
                  Join the Corridor
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-secondary mt-2 leading-tight">
                  Become a Contributor
                </h2>
                <p className="text-gray-500 mt-4 max-w-md text-base font-medium leading-relaxed">
                  Registration is free. Your contributions directly enrich the BC4P data
                  archive and help shape the governance of ancestral land for future generations.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <MapPin size={20} className="text-primary" />, text: 'Document data from your home area' },
                  { icon: <Leaf size={20} className="text-primary" />, text: 'Contribute to ancestral land governance' },
                  { icon: <Users size={20} className="text-primary" />, text: 'Connect with a community of scholars' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl font-medium text-secondary">
                    <div className="shrink-0">{icon}</div>
                    {text}
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-400 font-medium">
                Already have an account?{' '}
                <Link to="/admin" className="text-accent font-bold hover:underline">Admin Access →</Link>
              </p>
            </div>

            {/* Right: form */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-black text-secondary mb-1">Create Your Account</h3>
              <p className="text-gray-400 text-sm font-medium mb-6">Contributor Registration</p>
              <RegistrationForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-secondary py-8 text-center text-gray-500 text-sm border-t border-white/5">
        <p className="font-medium">
          © {new Date().getFullYear()} BC4P — Build Community for Posterity. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
