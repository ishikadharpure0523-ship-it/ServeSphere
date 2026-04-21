import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, ClipboardList, Award, Star, FolderOpen, Settings, LogOut,
  Globe, MapPin, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp,
  Download, Share2, Edit3, ExternalLink, Zap, Shield, Heart, Leaf,
} from 'lucide-react';

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

function TabFindNGOs() {
  const [search, setSearch]       = useState('');
  const [activeCause, setCause]   = useState('All');
  const [activeTime, setTime]     = useState('All');
  const [certOnly, setCertOnly]   = useState(false);

  const filtered = NGOS.filter((n) => {
    const matchSearch = n.name.toLowerCase().includes(search.toLowerCase()) || n.cause.toLowerCase().includes(search.toLowerCase());
    const matchCause  = activeCause === 'All' || n.cause === activeCause;
    return matchSearch && matchCause;
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink mb-1">Find NGOs</h1>
        <p className="text-muted text-sm">Discover verified organisations looking for volunteers like you.</p>
      </motion.div>

      {/* Search bar */}
      <motion.div variants={fadeUp} className="flex gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by NGO name or cause..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none text-sm bg-white"
          />
        </div>
        <button className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-muted text-sm font-medium hover:border-teal hover:text-teal transition-colors flex items-center gap-2">
          <Settings className="w-4 h-4" /> Filters
        </button>
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
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted font-medium uppercase tracking-wider w-24">Time</span>
          {TIMES.map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeTime === t ? 'bg-teal text-white' : 'bg-white border border-gray-200 text-muted hover:border-teal hover:text-teal'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted font-medium uppercase tracking-wider w-24">Certificate</span>
          <button
            onClick={() => setCertOnly(!certOnly)}
            className={`relative w-11 h-6 rounded-full transition-colors ${certOnly ? 'bg-teal' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${certOnly ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-sm text-muted">Certificate Available</span>
        </div>
      </motion.div>

      {/* NGO Cards */}
      <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
        {filtered.map(({ id, name, initials, cause, city, trust, desc, roles, banner }) => (
          <motion.div key={id} variants={fadeUp} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Banner */}
            <div className={`${banner} h-16 relative`}>
              <div className="absolute -bottom-5 left-5 w-12 h-12 rounded-full bg-white border-2 border-white shadow flex items-center justify-center font-bold text-ink text-sm">
                {initials}
              </div>
            </div>
            <div className="pt-8 px-5 pb-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif text-lg text-ink">{name}</h3>
                <span className="text-xs font-semibold text-teal bg-teal-light px-2.5 py-1 rounded-full">Trust: {trust}</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted bg-warm px-2.5 py-1 rounded-full">{cause}</span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <MapPin className="w-3 h-3" />{city}
                </span>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-3">{desc}</p>
              <p className="text-muted text-xs mb-4">{roles} open roles</p>
              <button className="w-full py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors">
                View Opportunities
              </button>
            </div>
          </motion.div>
        ))}
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
          onClick={() => navigate('/')}
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
   MAIN EXPORT
══════════════════════════════════════════════════════════════ */
const TAB_COMPONENTS = {
  'overview':     TabOverview,
  'find-ngos':    TabFindNGOs,
  'applications': TabApplications,
  'certificates': TabCertificates,
  'badges':       TabBadges,
  'portfolio':    TabPortfolio,
  'settings':     () => (
    <div className="flex flex-col items-center justify-center h-64 text-muted">
      <Settings className="w-12 h-12 mb-4 opacity-30" />
      <p className="font-serif text-xl text-ink mb-2">Settings</p>
      <p className="text-sm">Account settings coming soon.</p>
    </div>
  ),
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
