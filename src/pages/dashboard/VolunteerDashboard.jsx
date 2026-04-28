import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, ClipboardList, Award, Star, FolderOpen, Settings, LogOut,
  Globe, MapPin, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp,
  Download, Share2, Edit3, ExternalLink, Zap, Shield, Heart, Leaf, User, Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getOpportunities, 
  createApplication, 
  getApplications,
  getCertificates,
  getVolunteerStats
} from '../../lib/api';

/* ── Shared fade-up variant ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ── Mock data ──────────────────────────────────────────────── */
const VOLUNTEER = {
  name: 'Arjun Kulkarni',
  initials: 'AK',
  city: 'Pune, Maharashtra',
  level: 'Level 3',
  badge: 'Rising Star',
  trustScore: 82,
  skills: ['Teaching', 'First Aid', 'Logistics', 'Photography', 'Event Mgmt'],
  summary: 'Passionate about education and community health. I have been volunteering since 2021 across NGOs in Pune and Mumbai, focusing on underprivileged children and rural healthcare outreach.',
};

const STATS = [
  { label: 'Tasks Completed', value: '12',    icon: CheckCircle, color: 'text-teal',  bg: 'bg-teal-light' },
  { label: 'Hours Contributed', value: '48',  icon: Clock,       color: 'text-amber-dark', bg: 'bg-amber-light' },
  { label: 'Trust Score',      value: '82/100', icon: Shield,    color: 'text-teal',  bg: 'bg-teal-light' },
  { label: 'Certificates',     value: '4',    icon: Award,       color: 'text-coral', bg: 'bg-coral-light' },
];

const APPLICATIONS = [
  { id: 1, ngo: 'Smile Foundation', initials: 'SF', color: 'bg-teal',  task: 'Medical Aid Camp',  location: 'Mumbai', status: 'Accepted', appliedOn: '12 Jan 2026' },
  { id: 2, ngo: 'Green Earth',      initials: 'GE', color: 'bg-teal-dark', task: 'Tree Plantation Drive', location: 'Pune', status: 'Pending',  appliedOn: '8 Jan 2026' },
  { id: 3, ngo: 'Teach India',      initials: 'TI', color: 'bg-amber', task: 'Weekend Tutoring',   location: 'Pune', status: 'Rejected', appliedOn: '3 Jan 2026' },
];

const FEEDBACK = [
  { ngo: 'Smile Foundation', rating: 5, text: 'Arjun was incredibly dedicated during the medical camp. Showed up early, stayed late, and kept the team motivated throughout.', date: '15 Jan 2026' },
  { ngo: 'Teach India',      rating: 4, text: 'Great tutor — the students loved his sessions. Would love to have him back for the next batch.', date: '5 Jan 2026' },
];

const NGOS = [
  { id: 1, name: 'Asha Foundation',   initials: 'AF', cause: 'Education',          city: 'Mumbai',    trust: 91, desc: 'Providing quality education to underprivileged children across Maharashtra.', roles: 3, banner: 'bg-teal' },
  { id: 2, name: 'Green Earth India', initials: 'GE', cause: 'Environment',        city: 'Pune',      trust: 87, desc: 'Tree plantation drives, waste management, and climate awareness campaigns.', roles: 2, banner: 'bg-teal-dark' },
  { id: 3, name: 'Heal India',        initials: 'HI', cause: 'Healthcare',         city: 'Delhi',     trust: 94, desc: 'Free medical camps and health awareness in rural and semi-urban areas.', roles: 5, banner: 'bg-coral' },
  { id: 4, name: 'Shakti NGO',        initials: 'SN', cause: 'Women Empowerment',  city: 'Bangalore', trust: 89, desc: 'Skill development and legal aid for women in marginalised communities.', roles: 4, banner: 'bg-amber' },
];

const APP_TABLE = [
  { ngo: 'Smile Foundation', role: 'Medical Aid',    date: '12 Jan', status: 'Accepted', detail: { desc: 'Free medical camp for 200+ patients in Dharavi. Volunteers assist doctors with patient flow, record-keeping, and first aid.', coordinator: 'Dr. Meena Rao · meena@smilefoundation.org', timeline: '20–22 Jan 2026' } },
  { ngo: 'Green Earth',      role: 'Tree Planting',  date: '8 Jan',  status: 'Pending',  detail: { desc: 'Weekend plantation drive at Sinhagad Road. Plant 500 saplings with local school children.', coordinator: 'Rahul Patil · rahul@greenearth.in', timeline: '25 Jan 2026' } },
  { ngo: 'Teach India',      role: 'Tutor',          date: '3 Jan',  status: 'Rejected', detail: { desc: 'Weekend tutoring for Class 8–10 students in Hadapsar. Subjects: Maths and Science.', coordinator: 'Priya Sharma · priya@teachindia.org', timeline: 'Batch closed' } },
];

const CERTS = [
  { id: 1, volunteer: 'Arjun Kulkarni', ngo: 'Smile Foundation', task: 'Medical Aid Camp',      date: '22 Jan 2026', code: 'SS-2026-AK-0847' },
  { id: 2, volunteer: 'Arjun Kulkarni', ngo: 'Teach India',      task: 'Weekend Tutoring',      date: '10 Dec 2025', code: 'SS-2025-AK-0612' },
  { id: 3, volunteer: 'Arjun Kulkarni', ngo: 'Asha Foundation',  task: 'Book Distribution',     date: '5 Nov 2025',  code: 'SS-2025-AK-0501' },
  { id: 4, volunteer: 'Arjun Kulkarni', ngo: 'Green Earth',      task: 'Tree Plantation Drive', date: '2 Oct 2025',  code: 'SS-2025-AK-0388' },
];

const EARNED_BADGES = [
  { icon: Leaf,         name: 'First Step',   desc: 'Completed first task',       date: 'Oct 2025', color: 'bg-teal',       ring: 'ring-teal/40' },
  { icon: Zap,          name: 'Consistent',   desc: '5 tasks completed',          date: 'Nov 2025', color: 'bg-amber',      ring: 'ring-amber/40' },
  { icon: Heart,        name: 'Healer',       desc: '3 medical tasks completed',  date: 'Jan 2026', color: 'bg-coral',      ring: 'ring-coral/40' },
  { icon: Star,         name: 'Rising Star',  desc: 'Trust score above 80',       date: 'Jan 2026', color: 'bg-teal-dark',  ring: 'ring-teal-dark/40' },
];

const LOCKED_BADGES = [
  { icon: Award,  name: 'Top Volunteer',      desc: 'Complete 20 tasks',      progress: 12, total: 20 },
  { icon: Globe,  name: 'Impact Maker',       desc: '100+ hours contributed', progress: 48, total: 100 },
  { icon: Shield, name: 'Diamond Volunteer',  desc: 'Trust score 95+',        progress: 82, total: 95 },
];

const TIMELINE = [
  { ngo: 'Smile Foundation', role: 'Medical Aid Volunteer', date: 'Jan 2026', hours: 16 },
  { ngo: 'Teach India',      role: 'Weekend Tutor',         date: 'Dec 2025', hours: 12 },
  { ngo: 'Asha Foundation',  role: 'Book Distribution',     date: 'Nov 2025', hours: 8 },
  { ngo: 'Green Earth',      role: 'Tree Plantation',       date: 'Oct 2025', hours: 12 },
];

const SDG_TILES = [
  { num: 3,  label: 'Good Health',       color: '#4C9F38', active: true },
  { num: 4,  label: 'Quality Education', color: '#C5192D', active: true },
  { num: 10, label: 'Reduced Inequalities', color: '#DD1367', active: true },
  { num: 13, label: 'Climate Action',    color: '#3F7E44', active: true },
  { num: 1,  label: 'No Poverty',        color: '#E5243B', active: false },
  { num: 2,  label: 'Zero Hunger',       color: '#DDA63A', active: false },
];

const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',          Icon: Home },
  { id: 'find-ngos',     label: 'Find NGOs',         Icon: Search },
  { id: 'applications',  label: 'My Applications',   Icon: ClipboardList },
  { id: 'certificates',  label: 'My Certificates',   Icon: Award },
  { id: 'badges',        label: 'Badges & Milestones', Icon: Star },
  { id: 'portfolio',     label: 'My Portfolio',      Icon: FolderOpen },
  { id: 'settings',      label: 'Settings',          Icon: Settings },
];

/* ── Status badge helper ────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    Accepted: 'bg-teal-light text-teal-dark',
    Pending:  'bg-amber-light text-amber-dark',
    Rejected: 'bg-red-100 text-red-600',
  };
  const icons = { Accepted: '✅', Pending: '⏳', Rejected: '❌' };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
      {icons[status]} {status}
    </span>
  );
}

/* ── Trust Score Ring ───────────────────────────────────────── */
function TrustRing({ score, size = 80 }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E1F5EE" strokeWidth={size * 0.1} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#1D9E75" strokeWidth={size * 0.1} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="text-center">
        <p className="font-serif text-teal leading-none" style={{ fontSize: size * 0.22 }}>{score}</p>
        <p className="text-muted leading-none" style={{ fontSize: size * 0.13 }}>/100</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 1 — OVERVIEW
══════════════════════════════════════════════════════════════ */
function TabOverview() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      {/* Top bar */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl text-ink">Good morning, {VOLUNTEER.name.split(' ')[0]} 👋</h1>
          <p className="text-muted text-sm mt-1">Here's what's happening with your volunteer journey.</p>
        </div>
        <p className="text-muted text-sm font-medium">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} variants={fadeUp} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="font-serif text-2xl text-ink">{value}</p>
            <p className="text-muted text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Two-column section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Applications */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-ink mb-5">Active Applications</h2>
          <div className="space-y-4">
            {APPLICATIONS.map(({ id, ngo, initials, color, task, location, status }) => (
              <div key={id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-sand transition-colors">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {initials}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-ink text-sm truncate">{ngo}</p>
                  <p className="text-muted text-xs truncate">{task}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-muted" />
                    <span className="text-muted text-xs">{location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge status={status} />
                  <button className="text-teal text-xs font-medium hover:underline">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Feedback */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-ink mb-5">Recent Feedback from NGOs</h2>
          <div className="space-y-4">
            {FEEDBACK.map(({ ngo, rating, text, date }) => (
              <div key={ngo} className="border-l-4 border-teal pl-4 py-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-ink text-sm">{ngo}</p>
                  <p className="text-muted text-xs">{date}</p>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-amber fill-amber' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <p className="text-muted text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 2 — FIND NGOs
══════════════════════════════════════════════════════════════ */
const CAUSES = ['All', 'Education', 'Healthcare', 'Environment', 'Women Empowerment'];
const TIMES  = ['All', '1 day', '1 week', '1 month', 'Ongoing'];

// Mock opportunities for demo
const MOCK_OPPORTUNITIES = [
  {
    id: 'mock-1',
    title: 'Weekend Teaching Program',
    description: 'Help underprivileged children with Math and Science on weekends. Make a real difference in their education.',
    ngoName: 'Teach India Foundation',
    city: 'Mumbai',
    cause: 'Education',
    duration: '2 months',
    volunteersNeeded: 10,
    volunteersApplied: 3,
    status: 'open',
    certificateOffered: true,
    skills: ['Teaching', 'Communication'],
  },
  {
    id: 'mock-2',
    title: 'Medical Camp Assistant',
    description: 'Assist doctors and nurses in organizing free medical camps in rural areas. Help with patient registration and basic first aid.',
    ngoName: 'Health For All',
    city: 'Pune',
    cause: 'Healthcare',
    duration: '1 week',
    volunteersNeeded: 15,
    volunteersApplied: 8,
    status: 'open',
    certificateOffered: true,
    skills: ['First Aid', 'Communication'],
  },
  {
    id: 'mock-3',
    title: 'Tree Plantation Drive',
    description: 'Join us in planting 500 saplings across the city. Help combat climate change and make our city greener.',
    ngoName: 'Green Earth India',
    city: 'Delhi',
    cause: 'Environment',
    duration: '1 day',
    volunteersNeeded: 20,
    volunteersApplied: 15,
    status: 'open',
    certificateOffered: false,
    skills: ['Physical Fitness'],
  },
  {
    id: 'mock-4',
    title: 'Women Empowerment Workshop',
    description: 'Help organize and conduct skill development workshops for women in rural areas. Teach basic computer skills and financial literacy.',
    ngoName: 'Shakti Foundation',
    city: 'Bangalore',
    cause: 'Women Empowerment',
    duration: '1 month',
    volunteersNeeded: 8,
    volunteersApplied: 2,
    status: 'open',
    certificateOffered: true,
    skills: ['Teaching', 'Computer Skills'],
  },
];

function TabFindNGOs() {
  const [search, setSearch] = useState('');
  const [activeCause, setCause] = useState('All');
  const [activeTime, setTime] = useState('All');
  const [certOnly, setCertOnly] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, [activeCause]);

  const fetchOpportunities = async () => {
    try {
      const filters = {};
      if (activeCause !== 'All') filters.cause = activeCause;
      if (certOnly) filters.certificateOffered = true;
      
      const response = await getOpportunities(filters);
      // Combine real opportunities with mock ones
      const realOpps = response.data.opportunities || [];
      setOpportunities([...MOCK_OPPORTUNITIES, ...realOpps]);
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
      // If API fails, at least show mock data
      setOpportunities(MOCK_OPPORTUNITIES);
    } finally {
      setLoading(false);
    }
  };

  const filtered = opportunities.filter((opp) => {
    const matchSearch = opp.title.toLowerCase().includes(search.toLowerCase()) || 
                       opp.description.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  if (loading) {
    return <div className="text-center py-12">Loading opportunities...</div>;
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink mb-1">Find Opportunities</h1>
        <p className="text-muted text-sm">Discover verified opportunities from NGOs looking for volunteers like you.</p>
      </motion.div>

      {/* Search bar */}
      <motion.div variants={fadeUp} className="flex gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none text-sm bg-white"
          />
        </div>
      </motion.div>

      {/* Filter chips */}
      <motion.div variants={fadeUp} className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted font-medium uppercase tracking-wider w-24">Cause</span>
          {CAUSES.map((c) => (
            <button
              key={c}
              onClick={() => setCause(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeCause === c ? 'bg-teal text-white' : 'bg-white border border-gray-200 text-muted hover:border-teal hover:text-teal'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted font-medium uppercase tracking-wider w-24">Certificate</span>
          <button
            onClick={() => {
              setCertOnly(!certOnly);
              fetchOpportunities();
            }}
            className={`relative w-11 h-6 rounded-full transition-colors ${certOnly ? 'bg-teal' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${certOnly ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-sm text-muted">Certificate Available</span>
        </div>
      </motion.div>

      {/* Opportunity Cards */}
      {filtered.length === 0 ? (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Search className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="font-serif text-xl text-ink mb-2">No opportunities found</h3>
          <p className="text-muted">Try adjusting your filters or check back later.</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
          {filtered.map((opp) => (
            <motion.div key={opp.id} variants={fadeUp} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <h3 className="font-serif text-lg text-ink mb-1">{opp.title}</h3>
                    <p className="text-sm text-muted">{opp.ngoName}</p>
                  </div>
                  {opp.certificateOffered && (
                    <Award className="w-5 h-5 text-amber shrink-0" title="Certificate offered" />
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {opp.city}
                  </span>
                  <span className="px-2 py-1 bg-teal-light text-teal-dark rounded-full font-semibold">
                    {opp.cause}
                  </span>
                </div>
                
                <p className="text-muted text-sm mb-4 line-clamp-3">{opp.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-muted">
                    <span className="font-semibold text-ink">{opp.volunteersApplied || 0}</span> / {opp.volunteersNeeded} applied
                  </div>
                  <button 
                    onClick={() => setSelectedOpp(opp)}
                    className="px-4 py-2 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedOpp && (
          <ApplyModal 
            opportunity={selectedOpp}
            onClose={() => setSelectedOpp(null)}
            onSuccess={() => {
              setSelectedOpp(null);
              alert('Application submitted successfully!');
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Apply Modal ────────────────────────────────────────────── */
function ApplyModal({ opportunity, onClose, onSuccess }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if it's a mock opportunity
      if (opportunity.id.startsWith('mock-')) {
        // Simulate success for mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Application submitted successfully! (Demo mode - this is mock data)');
        onSuccess();
        return;
      }

      // Real API call for actual opportunities
      await createApplication({
        opportunityId: opportunity.id,
        message,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-serif text-2xl text-ink">Apply to Opportunity</h2>
          <p className="text-muted text-sm mt-1">{opportunity.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Why do you want to volunteer?</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the NGO why you're interested and what you can contribute..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-muted font-semibold hover:bg-sand transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 3 — MY APPLICATIONS
══════════════════════════════════════════════════════════════ */
function TabApplications() {
  const [expanded, setExpanded] = useState(null);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink mb-1">My Applications</h1>
        <p className="text-muted text-sm">Track every application you have submitted.</p>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-sand border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-muted">
          <span className="col-span-2">NGO / Role</span>
          <span>Applied On</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {APP_TABLE.map((row, i) => (
          <div key={i}>
            {/* Row */}
            <div
              className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-50 hover:bg-sand/50 transition-colors cursor-pointer items-center"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="col-span-2">
                <p className="font-semibold text-ink text-sm">{row.ngo}</p>
                <p className="text-muted text-xs">{row.role}</p>
              </div>
              <p className="text-muted text-sm">{row.date}</p>
              <StatusBadge status={row.status} />
              <div className="flex items-center gap-2">
                {row.status === 'Rejected' ? (
                  <button className="text-xs font-semibold text-coral hover:underline">Re-apply</button>
                ) : (
                  <button className="text-xs font-semibold text-teal hover:underline">View</button>
                )}
                {expanded === i ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </div>
            </div>

            {/* Expanded detail panel */}
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-5 bg-teal-light/30 border-b border-gray-100 grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Task Description</p>
                      <p className="text-sm text-ink-3 leading-relaxed">{row.detail.desc}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Coordinator</p>
                      <p className="text-sm text-ink-3">{row.detail.coordinator}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Timeline</p>
                      <p className="text-sm text-ink-3">{row.detail.timeline}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 4 — MY CERTIFICATES
══════════════════════════════════════════════════════════════ */
function CertCard({ cert }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-teal/20 overflow-hidden hover:shadow-md transition-shadow">
      {/* Certificate visual */}
      <div className="p-6 relative">
        {/* Ornamental corners */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-teal/30 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-teal/30 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-teal/30 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-teal/30 rounded-br-lg" />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <Globe className="w-32 h-32 text-teal" />
        </div>

        <div className="text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center">
              <span className="text-white text-xs font-bold">SS</span>
            </div>
            <span className="font-serif text-teal text-base">ServeSphere</span>
          </div>
          <p className="text-xs text-muted uppercase tracking-widest mb-1">Certificate of Contribution</p>
          <p className="font-serif text-xl text-ink mb-0.5">{cert.volunteer}</p>
          <p className="text-muted text-xs mb-3">has successfully completed</p>
          <div className="bg-teal-light rounded-lg px-4 py-2 mb-3">
            <p className="font-semibold text-teal-dark text-sm">{cert.task}</p>
            <p className="text-xs text-muted mt-0.5">{cert.ngo} · {cert.date}</p>
          </div>
          <p className="text-xs font-mono text-teal/60">{cert.code}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 px-5 py-3 flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-teal text-teal text-xs font-semibold hover:bg-teal-light transition-colors">
          <Download className="w-3.5 h-3.5" /> Download PDF
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-amber text-amber-dark text-xs font-semibold hover:bg-amber-light transition-colors">
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </div>
    </div>
  );
}

function TabCertificates() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink mb-1">My Certificates</h1>
        <p className="text-muted text-sm">Every completed task earns you a verified certificate.</p>
      </motion.div>
      <motion.div variants={stagger} className="grid md:grid-cols-2 gap-6">
        {CERTS.map((cert) => (
          <motion.div key={cert.id} variants={fadeUp}>
            <CertCard cert={cert} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 5 — BADGES & MILESTONES
══════════════════════════════════════════════════════════════ */
function TabBadges() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-10">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink mb-1">Badges &amp; Milestones</h1>
        <p className="text-muted text-sm">Every milestone unlocks a badge. Every badge tells a story.</p>
      </motion.div>

      {/* Earned */}
      <motion.div variants={fadeUp}>
        <h2 className="font-serif text-xl text-ink mb-5">Earned Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {EARNED_BADGES.map(({ icon: Icon, name, desc, date, color, ring }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-16 h-16 rounded-full ${color} ring-4 ${ring} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="font-semibold text-ink text-sm mb-1">{name}</p>
              <p className="text-muted text-xs mb-2 leading-relaxed">{desc}</p>
              <span className="flex items-center gap-1 text-xs text-teal font-medium">
                <CheckCircle className="w-3 h-3" /> {date}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Locked */}
      <motion.div variants={fadeUp}>
        <h2 className="font-serif text-xl text-ink mb-5">Locked Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {LOCKED_BADGES.map(({ icon: Icon, name, desc, progress, total }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center text-center opacity-60 hover:opacity-80 transition-opacity"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-gray-400" />
              </div>
              <p className="font-semibold text-ink text-sm mb-1">{name}</p>
              <p className="text-muted text-xs mb-4 leading-relaxed">{desc}</p>
              {/* Progress bar */}
              <div className="w-full">
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>{progress}</span>
                  <span>{total}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-teal rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(progress / total) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-muted mt-1">{Math.round((progress / total) * 100)}% complete</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 6 — MY PORTFOLIO
══════════════════════════════════════════════════════════════ */
function TabPortfolio() {
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState(VOLUNTEER.summary);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-1">My Portfolio</h1>
          <p className="text-muted text-sm">Your shareable impact profile.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors">
            <ExternalLink className="w-4 h-4" /> Share Portfolio Link
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-muted text-sm font-semibold hover:border-teal hover:text-teal transition-colors">
            <Download className="w-4 h-4" /> Download as PDF
          </button>
        </div>
      </motion.div>

      {/* Profile header card */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar + trust ring */}
          <div className="relative">
            <TrustRing score={VOLUNTEER.trustScore} size={96} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-amber flex items-center justify-center text-ink font-bold text-xl">
                {VOLUNTEER.initials}
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <h2 className="font-serif text-2xl text-ink">{VOLUNTEER.name}</h2>
            <p className="text-muted text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" /> {VOLUNTEER.city}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {VOLUNTEER.skills.map((s) => (
                <span key={s} className="text-xs font-semibold text-teal bg-teal-light px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Trust Score</p>
            <p className="font-serif text-3xl text-teal">{VOLUNTEER.trustScore}</p>
            <p className="text-xs text-muted">/100</p>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">About Me</p>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-1 text-xs text-teal hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> {editing ? 'Save' : 'Edit'}
            </button>
          </div>
          {editing ? (
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full text-sm text-ink-3 leading-relaxed border border-teal/30 rounded-xl p-3 focus:ring-2 focus:ring-teal outline-none resize-none"
            />
          ) : (
            <p className="text-sm text-ink-3 leading-relaxed">{summary}</p>
          )}
        </div>
      </motion.div>

      {/* Contribution timeline */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-6">Contribution Timeline</h2>
        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-teal/20" />
          <div className="space-y-6">
            {TIMELINE.map(({ ngo, role, date, hours }, i) => (
              <motion.div
                key={i}
                className="relative flex items-start gap-4"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-teal border-2 border-white shadow-sm" />
                <div className="flex-grow bg-sand rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink text-sm">{ngo}</p>
                    <span className="text-xs text-muted">{date}</span>
                  </div>
                  <p className="text-muted text-xs mt-0.5">{role}</p>
                  <p className="text-teal text-xs font-medium mt-1">{hours} hours contributed</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Certificates thumbnails */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">Certificates</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CERTS.map((cert) => (
            <div key={cert.id} className="bg-teal-light/40 rounded-xl p-4 border border-teal/10 text-center hover:bg-teal-light transition-colors cursor-pointer">
              <Award className="w-8 h-8 text-teal mx-auto mb-2" />
              <p className="text-xs font-semibold text-ink leading-tight">{cert.task}</p>
              <p className="text-xs text-muted mt-1">{cert.ngo}</p>
              <p className="text-xs text-teal mt-1">{cert.date}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* SDG tiles */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">SDG Impact</h2>
        <div className="flex flex-wrap gap-3">
          {SDG_TILES.map(({ num, label, color, active }) => (
            <div
              key={num}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity ${active ? 'opacity-100' : 'opacity-30'}`}
              style={{ backgroundColor: color, color: '#fff' }}
            >
              <span className="font-bold">SDG {num}</span>
              <span className="opacity-80 text-xs">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4">Greyed-out SDGs are not yet contributed to.</p>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════════ */
function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-30 transition-all duration-300"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100 min-h-[64px]">
        <Globe className="w-7 h-7 text-teal shrink-0" />
        {!collapsed && <span className="font-serif text-xl text-teal truncate">ServeSphere</span>}
      </div>

      {/* Volunteer profile */}
      {!collapsed && (
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center text-ink font-bold shrink-0">
              {VOLUNTEER.initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-ink text-sm truncate">{VOLUNTEER.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs text-muted">{VOLUNTEER.level}</span>
                <span className="text-muted text-xs">·</span>
                <span className="text-xs text-amber-dark font-medium">{VOLUNTEER.badge}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-teal-light px-3 py-1.5 rounded-full w-fit">
            <Shield className="w-3.5 h-3.5 text-teal" />
            <span className="text-xs font-semibold text-teal">Trust Score: {VOLUNTEER.trustScore}</span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-grow py-3 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative group
                ${isActive
                  ? 'text-teal bg-teal-light border-l-[3px] border-teal'
                  : 'text-muted hover:text-ink hover:bg-sand border-l-[3px] border-transparent'
                }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-teal' : 'text-muted group-hover:text-ink'}`} />
              {!collapsed && <span className="truncate">{label}</span>}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-ink text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle + Sign out */}
      <div className="border-t border-gray-100 py-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-muted hover:text-ink transition-colors"
        >
          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${collapsed ? '-rotate-90' : 'rotate-90'}`} />
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-red-500 transition-colors group"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:text-red-500" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 7 — SETTINGS
══════════════════════════════════════════════════════════════ */
function TabSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || 'Arjun Kulkarni',
    email: user?.email || 'arjun@example.com',
    phone: '+91 98765 43210',
    city: 'Pune, Maharashtra',
    bio: 'Passionate about education and community health. I have been volunteering since 2021.',
    skills: ['Teaching', 'First Aid', 'Logistics'],
  });
  const [notifications, setNotifications] = useState({
    emailNewOpportunities: true,
    emailApplicationStatus: true,
    emailNGOUpdates: false,
    pushNewOpportunities: true,
    pushMessages: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Mock save - in real app would call API
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      navigate('/');
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink mb-1">Settings</h1>
        <p className="text-muted text-sm">Manage your account preferences and settings.</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <motion.div variants={fadeUp} className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-2 sticky top-6">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy', icon: Shield },
              { id: 'account', label: 'Account', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === id
                    ? 'bg-teal-light text-teal'
                    : 'text-muted hover:bg-sand hover:text-ink'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div variants={fadeUp} className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <AnimatePresence mode="wait">
              {activeSection === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-serif text-2xl text-ink mb-1">Profile Information</h2>
                    <p className="text-muted text-sm">Update your personal details and profile.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Bio</label>
                      <textarea
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none resize-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors"
                  >
                    {saved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </motion.div>
              )}

              {activeSection === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-serif text-2xl text-ink mb-1">Notification Preferences</h2>
                    <p className="text-muted text-sm">Choose how you want to be notified.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-ink mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'emailNewOpportunities', label: 'New volunteer opportunities', desc: 'Get notified when NGOs post new opportunities matching your skills' },
                          { key: 'emailApplicationStatus', label: 'Application status updates', desc: 'Receive updates when NGOs review your applications' },
                          { key: 'emailNGOUpdates', label: 'NGO updates and reports', desc: 'Get updates from NGOs you have worked with' },
                        ].map(({ key, label, desc }) => (
                          <label key={key} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:bg-sand transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key]}
                              onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                              className="mt-1 w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
                            />
                            <div>
                              <p className="font-medium text-ink text-sm">{label}</p>
                              <p className="text-muted text-xs mt-0.5">{desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-ink mb-4">Push Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'pushNewOpportunities', label: 'New opportunities', desc: 'Instant alerts for new volunteer roles' },
                          { key: 'pushMessages', label: 'Messages', desc: 'Get notified when NGOs message you' },
                        ].map(({ key, label, desc }) => (
                          <label key={key} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:bg-sand transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key]}
                              onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                              className="mt-1 w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
                            />
                            <div>
                              <p className="font-medium text-ink text-sm">{label}</p>
                              <p className="text-muted text-xs mt-0.5">{desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors"
                  >
                    {saved ? '✓ Saved!' : 'Save Preferences'}
                  </button>
                </motion.div>
              )}

              {activeSection === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-serif text-2xl text-ink mb-1">Privacy Settings</h2>
                    <p className="text-muted text-sm">Control who can see your information.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-3">Profile Visibility</label>
                      <div className="space-y-2">
                        {[
                          { value: 'public', label: 'Public', desc: 'Anyone can view your profile' },
                          { value: 'ngos', label: 'NGOs Only', desc: 'Only verified NGOs can view your profile' },
                          { value: 'private', label: 'Private', desc: 'Only you can view your profile' },
                        ].map(({ value, label, desc }) => (
                          <label key={value} className="flex items-start gap-3 p-4 rounded-xl border-2 transition-colors cursor-pointer hover:bg-sand"
                            style={{ borderColor: privacy.profileVisibility === value ? '#1D9E75' : '#E5E7EB' }}>
                            <input
                              type="radio"
                              name="visibility"
                              value={value}
                              checked={privacy.profileVisibility === value}
                              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                              className="mt-1 w-4 h-4 text-teal border-gray-300 focus:ring-teal"
                            />
                            <div>
                              <p className="font-medium text-ink text-sm">{label}</p>
                              <p className="text-muted text-xs mt-0.5">{desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="font-semibold text-ink mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-sand transition-colors cursor-pointer">
                          <div>
                            <p className="font-medium text-ink text-sm">Show email on profile</p>
                            <p className="text-muted text-xs mt-0.5">NGOs can see your email address</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacy.showEmail}
                            onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                            className="w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-sand transition-colors cursor-pointer">
                          <div>
                            <p className="font-medium text-ink text-sm">Show phone on profile</p>
                            <p className="text-muted text-xs mt-0.5">NGOs can see your phone number</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacy.showPhone}
                            onChange={(e) => setPrivacy({ ...privacy, showPhone: e.target.checked })}
                            className="w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors"
                  >
                    {saved ? '✓ Saved!' : 'Save Settings'}
                  </button>
                </motion.div>
              )}

              {activeSection === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-serif text-2xl text-ink mb-1">Account Settings</h2>
                    <p className="text-muted text-sm">Manage your account security and preferences.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-gray-100">
                      <h3 className="font-semibold text-ink mb-2">Change Password</h3>
                      <p className="text-muted text-sm mb-4">Update your password to keep your account secure.</p>
                      <button className="px-4 py-2 rounded-lg border border-teal text-teal text-sm font-semibold hover:bg-teal-light transition-colors">
                        Change Password
                      </button>
                    </div>

                    <div className="p-4 rounded-xl border border-gray-100">
                      <h3 className="font-semibold text-ink mb-2">Two-Factor Authentication</h3>
                      <p className="text-muted text-sm mb-4">Add an extra layer of security to your account.</p>
                      <button className="px-4 py-2 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="p-4 rounded-xl border border-gray-100">
                      <h3 className="font-semibold text-ink mb-2">Download Your Data</h3>
                      <p className="text-muted text-sm mb-4">Get a copy of all your volunteer data and certificates.</p>
                      <button className="px-4 py-2 rounded-lg border border-gray-300 text-ink text-sm font-semibold hover:bg-sand transition-colors">
                        Request Data Export
                      </button>
                    </div>

                    <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50">
                      <h3 className="font-semibold text-red-600 mb-2">Delete Account</h3>
                      <p className="text-red-600 text-sm mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                      >
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════ */
const TAB_COMPONENTS = {
  'overview':     TabOverview,
  'find-ngos':    TabFindNGOs,
  'applications': TabApplications,
  'certificates': TabCertificates,
  'badges':       TabBadges,
  'portfolio':    TabPortfolio,
  'settings':     TabSettings,
};

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  const ActiveTab = TAB_COMPONENTS[activeTab] || TabOverview;

  return (
    <div className="min-h-screen bg-sand font-sans flex">
      <Sidebar
        active={activeTab}
        setActive={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main content */}
      <main
        className="flex-grow min-h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        <div className="max-w-5xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveTab />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
