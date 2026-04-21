import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, DollarSign, Package, AlertTriangle, FileText,
  Star, BarChart2, Settings, LogOut, Globe, MapPin, ChevronDown,
  ChevronUp, X, CheckCircle, Edit2, Trash2, Upload, Share2,
  Download, TrendingUp, Award, Bell, Shield, ChevronRight,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/* ── Variants ───────────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ── Mock data ──────────────────────────────────────────────── */
const NGO = { name: 'Smile Foundation', initials: 'SF', city: 'Mumbai', since: 'Jan 2023', trust: 87 };

const TRUST_BARS = [
  { label: 'Registration Documents', value: 80 },
  { label: 'Past Work Record',        value: 90 },
  { label: 'Financial Transparency',  value: 70 },
  { label: 'Volunteer Reviews',       value: 85 },
];

const RECENT_APPS = [
  { name: 'Riya M.',   skills: ['Medical', 'First Aid'], role: 'Medical Aid',  date: 'Today',     initials: 'RM', color: 'bg-teal' },
  { name: 'Arjun K.',  skills: ['Teaching'],             role: 'Tutor',        date: 'Yesterday', initials: 'AK', color: 'bg-amber' },
  { name: 'Priya S.',  skills: ['Logistics'],            role: 'Coordinator',  date: '2 days ago',initials: 'PS', color: 'bg-coral' },
];

const ACTIVE_POSTS = [
  { id: 1, title: 'Medical Aid Volunteer', skills: ['Medical', 'First Aid'], filled: 3, total: 5, status: 'Active' },
  { id: 2, title: 'Weekend Tutor',         skills: ['Teaching'],             filled: 2, total: 4, status: 'Active' },
  { id: 3, title: 'Logistics Coordinator', skills: ['Logistics', 'Driving'], filled: 1, total: 2, status: 'Closed' },
];

const FUND_REQUESTS = [
  { id: 1, title: 'Emergency Medicine Kit', category: 'Medical',   raised: 7500,  target: 20000, urgent: true,  deadline: '30 Jan' },
  { id: 2, title: 'School Supplies Drive',  category: 'Education', raised: 9200,  target: 15000, urgent: false, deadline: '15 Feb' },
  { id: 3, title: 'Food Distribution',      category: 'Food',      raised: 12000, target: 12000, urgent: false, deadline: '10 Jan' },
];

const RESOURCE_NEEDS = [
  { id: 1, type: 'Books',   qty: 50,  status: 'Open',      date: '10 Jan 2026' },
  { id: 2, type: 'Clothes', qty: 100, status: 'Fulfilled', date: '5 Jan 2026' },
  { id: 3, type: 'Medicine',qty: 20,  status: 'Open',      date: '12 Jan 2026' },
];

const PAST_ALERTS = [
  { date: '8 Jan 2026',  desc: 'Flood relief needed in Kurla — food and shelter volunteers required.', responded: 14, status: 'Resolved' },
  { date: '20 Dec 2025', desc: 'Medical emergency at camp — doctors and first-aid volunteers needed.', responded: 8,  status: 'Resolved' },
];

const RATE_VOLUNTEERS = [
  { name: 'Riya M.',  task: 'Medical Aid',  date: '15 Jan', initials: 'RM', color: 'bg-teal',  rated: false },
  { name: 'Arjun K.', task: 'Tutoring',     date: '10 Jan', initials: 'AK', color: 'bg-amber', rated: false },
  { name: 'Priya S.', task: 'Logistics',    date: '5 Jan',  initials: 'PS', color: 'bg-coral', rated: true  },
];

const PROJECTS = [
  { title: 'Project Shiksha: Slum Education Drive', range: 'Jan–Mar 2024', cause: 'Education', desc: 'Distributed 200 study kits and conducted weekend mentorship in Dharavi, Mumbai.', volunteers: 8, funds: '₹12,000', sdgs: [4, 10] },
  { title: 'Medical Camp: Malad East',              range: 'Nov 2023',     cause: 'Healthcare', desc: 'Free medical camp for 200+ patients. Medicines, diagnostics, and first-aid provided.', volunteers: 12, funds: '₹15,000', sdgs: [3] },
  { title: 'Tree Plantation Drive',                 range: 'Oct 2023',     cause: 'Environment', desc: '500 saplings planted at Sinhagad Road with school children.', volunteers: 20, funds: '₹5,000', sdgs: [13, 15] },
];

const IMPACT_VOLUNTEERS = [
  { initials: 'RM', name: 'Riya M.',  role: 'Medical Aid',  hours: 24, rating: 5, cert: true,  color: 'bg-teal' },
  { initials: 'AK', name: 'Arjun K.', role: 'Tutor',        hours: 18, rating: 4, cert: true,  color: 'bg-amber' },
  { initials: 'PS', name: 'Priya S.', role: 'Logistics',    hours: 12, rating: 5, cert: false, color: 'bg-coral' },
  { initials: 'NK', name: 'Nisha K.', role: 'Coordinator',  hours: 16, rating: 4, cert: true,  color: 'bg-teal' },
  { initials: 'RV', name: 'Rahul V.', role: 'First Aid',    hours: 10, rating: 5, cert: true,  color: 'bg-amber' },
  { initials: 'SM', name: 'Sneha M.', role: 'Teaching',     hours: 20, rating: 4, cert: false, color: 'bg-coral' },
];

const FUND_UTIL = [
  { title: 'Medical Camp: Malad East', raised: 15000, target: 15000, breakdown: [{ label: 'Medicines', pct: 60, color: '#1D9E75' }, { label: 'Doctors', pct: 25, color: '#3B82F6' }, { label: 'Transport', pct: 15, color: '#F59E0B' }], status: 'Utilized' },
  { title: 'School Supplies Drive',    raised: 9200,  target: 15000, breakdown: [{ label: 'Books', pct: 55, color: '#1D9E75' }, { label: 'Stationery', pct: 30, color: '#3B82F6' }, { label: 'Remaining', pct: 15, color: '#E5E7EB' }], status: 'In Progress' },
];

const ALL_SDGS = [
  { num: 1, label: 'No Poverty', color: '#E5243B' }, { num: 2, label: 'Zero Hunger', color: '#DDA63A' },
  { num: 3, label: 'Good Health', color: '#4C9F38' }, { num: 4, label: 'Quality Education', color: '#C5192D' },
  { num: 5, label: 'Gender Equality', color: '#FF3A21' }, { num: 6, label: 'Clean Water', color: '#26BDE2' },
  { num: 7, label: 'Clean Energy', color: '#FCC30B' }, { num: 8, label: 'Decent Work', color: '#A21942' },
  { num: 9, label: 'Industry', color: '#FD6925' }, { num: 10, label: 'Reduced Inequalities', color: '#DD1367' },
  { num: 11, label: 'Sustainable Cities', color: '#FD9D24' }, { num: 12, label: 'Responsible Consumption', color: '#BF8B2E' },
  { num: 13, label: 'Climate Action', color: '#3F7E44' }, { num: 14, label: 'Life Below Water', color: '#0A97D9' },
  { num: 15, label: 'Life on Land', color: '#56C02B' }, { num: 16, label: 'Peace & Justice', color: '#00689D' },
  { num: 17, label: 'Partnerships', color: '#19486A' },
];
const NGO_SDGS = [3, 4, 10, 13, 15];

const DONORS = [
  { initials: 'SM', name: 'Sunita M.', amount: '₹5,000', date: 'Jan 2026', note: 'Keep up the amazing work!' },
  { initials: '??', name: 'Anonymous', amount: '₹2,000', date: 'Dec 2025', note: 'For the children.' },
  { initials: 'RK', name: 'Rahul K.',  amount: '₹1,500', date: 'Dec 2025', note: 'Proud to support you.' },
  { initials: 'PD', name: 'Priya D.',  amount: '₹3,000', date: 'Nov 2025', note: 'Every rupee counts!' },
];

const CHART_VOLUNTEERS = [
  { month: 'Aug', count: 8 }, { month: 'Sep', count: 12 }, { month: 'Oct', count: 20 },
  { month: 'Nov', count: 15 }, { month: 'Dec', count: 18 }, { month: 'Jan', count: 24 },
];
const CHART_FUNDS = [
  { month: 'Aug', amount: 5000 }, { month: 'Sep', amount: 8000 }, { month: 'Oct', amount: 12000 },
  { month: 'Nov', amount: 9000 }, { month: 'Dec', amount: 15000 }, { month: 'Jan', amount: 18000 },
];
const CHART_CAUSES = [
  { name: 'Education', value: 35, color: '#C5192D' }, { name: 'Healthcare', value: 30, color: '#4C9F38' },
  { name: 'Environment', value: 20, color: '#3F7E44' }, { name: 'Food', value: 15, color: '#DDA63A' },
];
const CHART_SKILLS = [
  { skill: 'Medical', count: 18 }, { skill: 'Teaching', count: 14 }, { skill: 'Logistics', count: 10 },
  { skill: 'First Aid', count: 9 }, { skill: 'Coding', count: 5 },
];

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',             Icon: Home },
  { id: 'post-vol',  label: 'Post Volunteer Need',  Icon: Users },
  { id: 'post-fund', label: 'Post Fund Request',    Icon: DollarSign },
  { id: 'post-res',  label: 'Post Resource Need',   Icon: Package },
  { id: 'alert',     label: 'Emergency Alert',      Icon: AlertTriangle, red: true },
  { id: 'uploads',   label: 'Transparency Uploads', Icon: FileText },
  { id: 'rate',      label: 'Rate Volunteers',      Icon: Star },
  { id: 'impact',    label: 'Our Impact',           Icon: Globe },
  { id: 'analytics', label: 'Analytics',            Icon: BarChart2 },
  { id: 'settings',  label: 'Settings',             Icon: Settings },
];

/* ── Helpers ────────────────────────────────────────────────── */
function ProgressBar({ pct, color = 'bg-teal', height = 'h-2' }) {
  return (
    <div className={`${height} bg-gray-100 rounded-full overflow-hidden`}>
      <motion.div className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut' }} />
    </div>
  );
}

function TrustRing({ score = 87, size = 96 }) {
  const r = size * 0.38; const circ = 2 * Math.PI * r; const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E1F5EE" strokeWidth={size*0.1} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1D9E75" strokeWidth={size*0.1}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }} />
      </svg>
      <div className="text-center">
        <p className="font-serif text-teal leading-none" style={{ fontSize: size * 0.22 }}>{score}</p>
        <p className="text-muted leading-none" style={{ fontSize: size * 0.13 }}>/100</p>
      </div>
    </div>
  );
}

const CAUSE_COLORS = { Education: 'bg-amber-light text-amber-dark', Healthcare: 'bg-teal-light text-teal-dark', Environment: 'bg-green-100 text-green-700', Food: 'bg-orange-100 text-orange-700', Other: 'bg-gray-100 text-muted' };

/* ══ TAB 1 — OVERVIEW ══════════════════════════════════════════ */
function TabOverview() {
  const [appStatus, setAppStatus] = useState({});
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink mb-1">Good morning, {NGO.name} 👋</h1>
        <p className="text-muted text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Volunteer Roles', value: '5',       Icon: Users,      bg: 'bg-teal-light',  color: 'text-teal' },
          { label: 'Applications Received',  value: '23',      Icon: Bell,       bg: 'bg-amber-light', color: 'text-amber-dark' },
          { label: 'Funds Raised',           value: '₹42,000', Icon: DollarSign, bg: 'bg-teal-light',  color: 'text-teal' },
          { label: 'Trust Score',            value: '87/100',  Icon: Shield,     bg: 'bg-teal-light',  color: 'text-teal' },
        ].map(({ label, value, Icon, bg, color }) => (
          <motion.div key={label} variants={fadeUp} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="font-serif text-2xl text-ink">{value}</p>
            <p className="text-muted text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust score breakdown */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">Trust Score Breakdown</h2>
        <div className="space-y-4">
          {TRUST_BARS.map(({ label, value }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-ink font-medium">{label}</span>
                <span className="text-teal font-semibold">{value}%</span>
              </div>
              <ProgressBar pct={value} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent applications */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-serif text-xl text-ink">Recent Applications</h2>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-sand text-xs font-semibold uppercase tracking-wider text-muted">
            <span className="col-span-2">Volunteer</span><span>Role Applied</span><span>Date</span><span>Action</span>
          </div>
          {RECENT_APPS.map((app, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-sand/50 transition-colors">
              <div className="col-span-2 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${app.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>{app.initials}</div>
                <div>
                  <p className="font-semibold text-ink text-sm">{app.name}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {app.skills.map(s => <span key={s} className="text-xs bg-teal-light text-teal-dark px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                </div>
              </div>
              <p className="text-muted text-sm">{app.role}</p>
              <p className="text-muted text-sm">{app.date}</p>
              <div className="flex gap-2">
                {appStatus[i] === 'accepted' ? <span className="text-xs font-semibold text-teal">✓ Accepted</span>
                 : appStatus[i] === 'declined' ? <span className="text-xs font-semibold text-red-500">✗ Declined</span>
                 : <>
                    <button onClick={() => setAppStatus(s => ({...s, [i]: 'accepted'}))} className="px-3 py-1.5 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-teal-dark transition-colors">Accept</button>
                    <button onClick={() => setAppStatus(s => ({...s, [i]: 'declined'}))} className="px-3 py-1.5 rounded-lg border border-red-400 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors">Decline</button>
                  </>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ TAB 2 — POST VOLUNTEER NEED ═══════════════════════════════ */
const SUGGESTED_SKILLS = ['Medical', 'Teaching', 'Logistics', 'Coding', 'Driving', 'Legal', 'First Aid', 'Photography'];
function TabPostVol() {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [cert, setCert] = useState(false);
  const [causes, setCauses] = useState([]);
  const CAUSES = ['Education', 'Healthcare', 'Environment', 'Food', 'Women Empowerment', 'Disaster Relief'];

  const addSkill = (s) => { if (s && !skills.includes(s)) setSkills(p => [...p, s]); setSkillInput(''); };
  const toggleCause = (c) => setCauses(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}><h1 className="font-serif text-3xl text-ink mb-1">Post Volunteer Need</h1><p className="text-muted text-sm">Find the right volunteers for your next project.</p></motion.div>

      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Role Title</label>
          <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm" placeholder="e.g. Medical Aid Volunteer" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Description</label>
          <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm resize-none" placeholder="Describe the role, responsibilities, and expectations..." /></div>

        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Skills Required</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map(s => <span key={s} className="flex items-center gap-1 bg-teal text-white text-xs px-3 py-1 rounded-full font-medium">{s}<button onClick={() => setSkills(p => p.filter(x => x !== s))}><X className="w-3 h-3" /></button></span>)}
          </div>
          <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm" placeholder="Type a skill and press Enter..." />
          <div className="flex flex-wrap gap-2 mt-2">
            {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).map(s => (
              <button key={s} onClick={() => addSkill(s)} className="text-xs px-3 py-1 rounded-full border border-gray-200 text-muted hover:border-teal hover:text-teal transition-colors">{s}</button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Location</label>
            <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm" placeholder="e.g. Dharavi, Mumbai" /></div></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Duration</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm bg-white">
              {['1 day', '1 week', '1 month', 'Ongoing'].map(d => <option key={d}>{d}</option>)}</select></div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Slots Available</label>
            <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm" placeholder="e.g. 5" /></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Certificate Offered</label>
            <div className="flex items-center gap-3 mt-3">
              <button onClick={() => setCert(!cert)} className={`relative w-11 h-6 rounded-full transition-colors ${cert ? 'bg-teal' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${cert ? 'translate-x-5' : ''}`} /></button>
              <span className="text-sm text-muted">{cert ? 'Yes — certificate will be issued' : 'No certificate'}</span>
            </div></div>
        </div>

        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Cause Category</label>
          <div className="flex flex-wrap gap-2">
            {CAUSES.map(c => <button key={c} onClick={() => toggleCause(c)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${causes.includes(c) ? 'bg-teal text-white' : 'border border-gray-200 text-muted hover:border-teal hover:text-teal'}`}>{c}</button>)}
          </div></div>

        <button className="w-full py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors">Post Opportunity</button>
      </motion.div>

      {/* Active posts */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">Active Volunteer Posts</h2>
        <div className="space-y-3">
          {ACTIVE_POSTS.map(post => (
            <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl bg-sand border border-gray-100">
              <div className="flex-grow">
                <p className="font-semibold text-ink text-sm">{post.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {post.skills.map(s => <span key={s} className="text-xs bg-teal-light text-teal-dark px-2 py-0.5 rounded-full">{s}</span>)}
                </div>
              </div>
              <span className="text-xs text-muted font-medium">{post.filled}/{post.total} filled</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${post.status === 'Active' ? 'bg-teal-light text-teal-dark' : 'bg-gray-100 text-muted'}`}>{post.status}</span>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg hover:bg-teal-light text-muted hover:text-teal transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ TAB 3 — POST FUND REQUEST ═════════════════════════════════ */
function TabPostFund() {
  const [priority, setPriority] = useState('normal');
  const [dragOver, setDragOver] = useState(false);
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}><h1 className="font-serif text-3xl text-ink mb-1">Post Fund Request</h1><p className="text-muted text-sm">Create a transparent fund request for donors to support.</p></motion.div>
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Title</label>
          <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm" placeholder="e.g. Emergency Medicine Kit" /></div>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Category</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm bg-white">
              {['Medical', 'Education', 'Food', 'Infrastructure', 'Other'].map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Amount Required (₹)</label>
            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">₹</span>
              <input type="number" className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm" placeholder="20000" /></div></div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Deadline</label>
            <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm" /></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Priority</label>
            <div className="flex gap-3 mt-1">
              {[{ val: 'urgent', label: '🔴 Urgent' }, { val: 'normal', label: '🟡 Normal' }].map(({ val, label }) => (
                <label key={val} className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer flex-1 transition-colors ${priority === val ? 'border-teal bg-teal-light' : 'border-gray-100'}`}>
                  <input type="radio" name="priority" value={val} checked={priority === val} onChange={() => setPriority(val)} className="w-4 h-4 text-teal" />
                  <span className="text-sm font-medium text-ink">{label}</span>
                </label>
              ))}</div></div>
        </div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Description</label>
          <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm resize-none" placeholder="Explain how the funds will be used..." /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Supporting Document</label>
          <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? 'border-teal bg-teal-light/30' : 'border-gray-200 hover:border-teal/50'}`}>
            <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
            <p className="text-sm text-muted">Click to upload or drag & drop</p>
            <p className="text-xs text-muted mt-1">PDF, DOC up to 10MB</p>
          </div></div>
        <button className="w-full py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors">Submit Fund Request</button>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">Active Fund Requests</h2>
        <div className="space-y-4">
          {FUND_REQUESTS.map(req => (
            <div key={req.id} className="p-4 rounded-xl bg-sand border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-ink text-sm">{req.title}</p>
                <div className="flex items-center gap-2">
                  {req.urgent && <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">🔴 Urgent</span>}
                  <span className="text-xs text-muted">Due {req.deadline}</span>
                  <button className="p-1 rounded hover:bg-teal-light text-muted hover:text-teal transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted mb-1.5">
                <span>₹{req.raised.toLocaleString('en-IN')} raised</span>
                <span>₹{req.target.toLocaleString('en-IN')} target</span>
              </div>
              <ProgressBar pct={(req.raised / req.target) * 100} />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ TAB 4 — POST RESOURCE NEED ════════════════════════════════ */
function TabPostRes() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}><h1 className="font-serif text-3xl text-ink mb-1">Post Resource Need</h1><p className="text-muted text-sm">Request physical resources from donors.</p></motion.div>
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Resource Type</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm bg-white">
              {['Books', 'Food', 'Clothes', 'Medicine', 'Equipment', 'Other'].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Quantity Needed</label>
            <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm" placeholder="e.g. 50" /></div>
        </div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Description</label>
          <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm resize-none" placeholder="Describe the items needed..." /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Location for Delivery / Pickup</label>
          <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm" placeholder="e.g. Dharavi, Mumbai" /></div></div>
        <button className="w-full py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors">Post Resource Need</button>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">Active Resource Needs</h2>
        <div className="space-y-3">
          {RESOURCE_NEEDS.map(r => (
            <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl bg-sand border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-amber-light flex items-center justify-center shrink-0"><Package className="w-5 h-5 text-amber-dark" /></div>
              <div className="flex-grow">
                <p className="font-semibold text-ink text-sm">{r.type} × {r.qty}</p>
                <p className="text-muted text-xs">{r.date}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${r.status === 'Open' ? 'bg-teal-light text-teal-dark' : 'bg-gray-100 text-muted'}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ TAB 5 — EMERGENCY ALERT ════════════════════════════════════ */
function TabAlert() {
  const [helpTypes, setHelpTypes] = useState([]);
  const HELP = ['Medical', 'Rescue', 'Food', 'Shelter', 'Other'];
  const toggle = (h) => setHelpTypes(p => p.includes(h) ? p.filter(x => x !== h) : [...p, h]);
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}><h1 className="font-serif text-3xl text-ink mb-1">Emergency Alert</h1></motion.div>
      <motion.div variants={fadeUp} className="bg-white rounded-xl border-2 border-red-200 p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h2 className="font-serif text-xl text-red-600 font-bold">🚨 Send Emergency Alert</h2>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <Bell className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-amber-800 text-sm font-medium">Use only for genuine emergencies. This will notify ALL nearby verified volunteers immediately.</p>
        </div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Describe the Emergency</label>
          <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 outline-none text-sm resize-none" placeholder="Describe the emergency situation clearly..." /></div>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Location</label>
            <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 outline-none text-sm" placeholder="Emergency location" /></div></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Volunteers Needed</label>
            <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 outline-none text-sm" placeholder="e.g. 10" /></div>
        </div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Type of Help Needed</label>
          <div className="flex flex-wrap gap-2">
            {HELP.map(h => <button key={h} onClick={() => toggle(h)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${helpTypes.includes(h) ? 'bg-red-500 text-white' : 'border border-gray-200 text-muted hover:border-red-400 hover:text-red-500'}`}>{h}</button>)}
          </div></div>
        <button className="w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors text-base">🚨 Send Emergency Alert</button>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">Past Alerts</h2>
        <div className="space-y-3">
          {PAST_ALERTS.map((a, i) => (
            <div key={i} className="p-4 rounded-xl bg-sand border border-gray-100">
              <div className="flex items-start justify-between mb-1">
                <p className="font-semibold text-ink text-sm">{a.desc}</p>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ml-3 ${a.status === 'Resolved' ? 'bg-teal-light text-teal-dark' : 'bg-red-100 text-red-600'}`}>{a.status}</span>
              </div>
              <p className="text-muted text-xs">{a.date} · {a.responded} volunteers responded</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ TAB 6 — TRANSPARENCY UPLOADS ══════════════════════════════ */
function UploadZone({ label, hint, accept }) {
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const handleFiles = (fl) => setFiles(p => [...p, ...Array.from(fl)]);
  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-ink mb-2">{label}</p>
      <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => ref.current.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${drag ? 'border-teal bg-teal-light/20' : 'border-gray-200 hover:border-teal/50'}`}>
        <input ref={ref} type="file" multiple accept={accept} className="hidden" onChange={e => handleFiles(e.target.files)} />
        <Upload className="w-7 h-7 text-muted mx-auto mb-2" />
        <p className="text-sm text-muted">Click to upload or drag & drop</p>
        <p className="text-xs text-muted mt-1">{hint}</p>
      </div>
      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-teal-light px-3 py-1.5 rounded-lg text-xs text-teal-dark font-medium">
              <CheckCircle className="w-3.5 h-3.5" />{f.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const PUBLISHED = [
  { date: '15 Jan 2026', type: 'Photo',   file: 'medical_camp_photos.zip', },
  { date: '10 Jan 2026', type: 'Report',  file: 'q4_impact_report.pdf', },
  { date: '5 Jan 2026',  type: 'Expense', file: 'medicine_bills_jan.pdf', },
];

function TabUploads() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}><h1 className="font-serif text-3xl text-ink mb-1">Transparency Uploads</h1><p className="text-muted text-sm">Upload proof of your work — visible to donors and volunteers.</p></motion.div>
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <UploadZone label="📷 Photos" hint="JPG, PNG up to 10MB each" accept="image/*" />
        <UploadZone label="📄 Reports / Documents" hint="PDF, DOC up to 20MB" accept=".pdf,.doc,.docx" />
        <UploadZone label="🧾 Expense Proofs" hint="PDF, JPG, PNG up to 10MB" accept=".pdf,image/*" />
        <button className="w-full py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors">Save & Publish Updates</button>
      </motion.div>
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">Published Updates</h2>
        <div className="space-y-3">
          {PUBLISHED.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-sand border border-gray-100">
              <FileText className="w-5 h-5 text-teal shrink-0" />
              <div className="flex-grow">
                <p className="font-semibold text-ink text-sm">{p.file}</p>
                <p className="text-muted text-xs">{p.type} · {p.date}</p>
              </div>
              <span className="text-xs font-semibold text-teal bg-teal-light px-3 py-1 rounded-full">Published ✓</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ TAB 7 — RATE VOLUNTEERS ════════════════════════════════════ */
function TabRate() {
  const [expanded, setExpanded] = useState(null);
  const [ratings, setRatings] = useState({});
  const [hover, setHover] = useState({});
  const [rated, setRated] = useState({});

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}><h1 className="font-serif text-3xl text-ink mb-1">Rate Volunteers</h1><p className="text-muted text-sm">Rate volunteers who completed tasks with your NGO.</p></motion.div>
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-sand border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-muted">
          <span className="col-span-2">Volunteer</span><span>Task</span><span>Date</span><span>Action</span>
        </div>
        {RATE_VOLUNTEERS.map((v, i) => (
          <div key={i}>
            <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-50 hover:bg-sand/50 transition-colors items-center">
              <div className="col-span-2 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${v.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>{v.initials}</div>
                <p className="font-semibold text-ink text-sm">{v.name}</p>
              </div>
              <p className="text-muted text-sm">{v.task}</p>
              <p className="text-muted text-sm">{v.date}</p>
              <div>
                {v.rated || rated[i]
                  ? <span className="text-xs font-semibold text-teal">✅ Rated</span>
                  : <button onClick={() => setExpanded(expanded === i ? null : i)} className="text-xs font-semibold text-teal hover:underline flex items-center gap-1">
                      Rate Now {expanded === i ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>}
              </div>
            </div>
            <AnimatePresence>
              {expanded === i && !rated[i] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-6 py-5 bg-teal-light/20 border-b border-gray-100 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Star Rating</p>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onMouseEnter={() => setHover(h => ({...h, [i]: s}))} onMouseLeave={() => setHover(h => ({...h, [i]: 0}))}
                            onClick={() => setRatings(r => ({...r, [i]: s}))}
                            className="transition-transform hover:scale-110">
                            <Star className={`w-7 h-7 ${s <= (hover[i] || ratings[i] || 0) ? 'text-amber fill-amber' : 'text-gray-200 fill-gray-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div><label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Feedback</label>
                      <textarea rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal outline-none text-sm resize-none" placeholder="Write your feedback..." /></div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-teal rounded" />
                        <span className="text-sm text-ink">Issue Certificate — auto-generates a verified certificate for this volunteer</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-teal rounded" />
                        <span className="text-sm text-ink">Award Badge — sends a milestone badge to this volunteer</span>
                      </label>
                    </div>
                    <button onClick={() => { setRated(r => ({...r, [i]: true})); setExpanded(null); }}
                      className="px-6 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors">Submit Rating</button>
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

/* ══ TAB 8 — OUR IMPACT ════════════════════════════════════════ */
function TabImpact() {
  const [expanded, setExpanded] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-10 pb-24">

      {/* Hero card */}
      <motion.div variants={fadeUp} className="rounded-2xl p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1D9E75 0%,#0F6E56 100%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-grow">
            <h2 className="font-serif text-4xl text-white mb-1">{NGO.name}</h2>
            <p className="text-white/60 text-sm mb-5">Member since {NGO.since}</p>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <CheckCircle className="w-4 h-4" /> ✓ Verified Organisation
            </span>
            <div className="flex flex-wrap gap-3">
              {['👥 48 Volunteers Worked With', '💰 ₹1,24,000 Funds Raised', '🚀 12 Projects Completed'].map(s => (
                <span key={s} className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium border border-white/20">{s}</span>
              ))}
            </div>
          </div>
          <div className="relative shrink-0">
            <TrustRing score={87} size={120} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="font-serif text-white text-xl font-bold">SF</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 1 — Project Timeline */}
      <motion.div variants={fadeUp}>
        <h2 className="font-serif text-2xl text-ink mb-6">What we've done</h2>
        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-teal/20" />
          <div className="space-y-6">
            {PROJECTS.map((p, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-6 top-5 w-4 h-4 rounded-full bg-teal border-2 border-white shadow-sm" />
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg text-ink">{p.title}</h3>
                    <span className="text-xs text-muted shrink-0 ml-3">{p.range}</span>
                  </div>
                  <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 ${CAUSE_COLORS[p.cause] || 'bg-gray-100 text-muted'}`}>{p.cause}</span>
                  <p className="text-muted text-sm leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1 text-xs font-medium bg-sand px-3 py-1.5 rounded-lg"><Users className="w-3.5 h-3.5 text-teal" /> {p.volunteers} volunteers</span>
                    <span className="flex items-center gap-1 text-xs font-medium bg-sand px-3 py-1.5 rounded-lg"><DollarSign className="w-3.5 h-3.5 text-teal" /> {p.funds} utilized</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {p.sdgs.map(n => { const s = ALL_SDGS.find(x => x.num === n); return <div key={n} className="w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s?.color }}>{n}</div>; })}
                    </div>
                    <button onClick={() => setExpanded(expanded === i ? null : i)} className="text-teal text-sm font-medium flex items-center gap-1 hover:underline ml-2">
                      View Full Report <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <AnimatePresence>
                    {expanded === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Photos & Documents</p>
                          <div className="grid grid-cols-4 gap-2">
                            {[...Array(4)].map((_, j) => (
                              <div key={j} onClick={() => setLightbox({ project: p.title, idx: j })}
                                className="aspect-square rounded-lg bg-teal-light border border-teal/20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                                <span className="text-teal text-xs font-medium">Photo {j+1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Section 2 — Volunteer Impact */}
      <motion.div variants={fadeUp}>
        <h2 className="font-serif text-2xl text-ink mb-6">People who made it happen</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {IMPACT_VOLUNTEERS.map((v, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${v.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>{v.initials}</div>
                <div><p className="font-semibold text-ink text-sm">{v.name}</p><p className="text-muted text-xs">{v.role}</p></div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">{v.hours} hours</span>
                <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-3 h-3 ${j < v.rating ? 'text-amber fill-amber' : 'text-gray-200 fill-gray-200'}`} />)}</div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${v.cert ? 'bg-teal-light text-teal-dark' : 'bg-amber-light text-amber-dark'}`}>
                {v.cert ? '✓ Certificate Issued' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-teal-light rounded-xl px-5 py-3 text-teal-dark font-semibold text-sm">
          Total: {IMPACT_VOLUNTEERS.reduce((a, v) => a + v.hours, 0)} volunteer hours contributed
        </div>
      </motion.div>

      {/* Section 3 — Fund Utilization */}
      <motion.div variants={fadeUp}>
        <h2 className="font-serif text-2xl text-ink mb-6">Where every rupee went</h2>
        <div className="space-y-4">
          {FUND_UTIL.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-ink">{f.title}</h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${f.status === 'Utilized' ? 'bg-teal-light text-teal-dark' : 'bg-amber-light text-amber-dark'}`}>
                  {f.status === 'Utilized' ? 'Fully Utilized ✓' : 'In Progress'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted mb-1.5">
                <span>₹{f.raised.toLocaleString('en-IN')} raised</span><span>₹{f.target.toLocaleString('en-IN')} target</span>
              </div>
              <ProgressBar pct={(f.raised / f.target) * 100} height="h-2" />
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Utilization Breakdown</p>
                <div className="flex h-3 rounded-full overflow-hidden mb-2">
                  {f.breakdown.map(b => <div key={b.label} style={{ width: `${b.pct}%`, backgroundColor: b.color }} title={`${b.label}: ${b.pct}%`} />)}
                </div>
                <div className="flex flex-wrap gap-3">
                  {f.breakdown.map(b => <span key={b.label} className="flex items-center gap-1 text-xs text-muted"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: b.color }} />{b.label} ({b.pct}%)</span>)}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {[...Array(2)].map((_, j) => (
                  <div key={j} onClick={() => setLightbox({ project: f.title, idx: j })}
                    className="w-14 h-14 rounded-lg bg-teal-light border border-teal/20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-teal text-xs">Proof {j+1}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 4 — SDG Impact */}
      <motion.div variants={fadeUp}>
        <h2 className="font-serif text-2xl text-ink mb-6">Our contribution to global goals</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2 mb-5">
          {ALL_SDGS.map(({ num, label, color }) => {
            const active = NGO_SDGS.includes(num);
            return (
              <motion.div key={num} whileHover={active ? { scale: 1.08 } : {}}
                className={`rounded-xl p-2 text-center transition-all ${active ? 'shadow-md' : 'opacity-25 grayscale'}`}
                style={{ backgroundColor: active ? color : '#ccc' }}>
                <p className="font-bold text-white text-sm">{num}</p>
                <p className="text-white/80 text-xs leading-tight hidden sm:block">{label}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="space-y-1">
          {NGO_SDGS.map(n => { const s = ALL_SDGS.find(x => x.num === n); return (
            <p key={n} className="text-sm text-muted flex items-center gap-2">
              <span className="w-5 h-5 rounded-sm flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: s?.color }}>{n}</span>
              SDG {n} — {s?.label}
            </p>
          );})}
        </div>
      </motion.div>

      {/* Section 5 — Donor Acknowledgements */}
      <motion.div variants={fadeUp}>
        <h2 className="font-serif text-2xl text-ink mb-6">Those who believed in us</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {DONORS.map((d, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 min-w-[200px] shrink-0">
              <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white font-bold text-sm mb-3">{d.initials}</div>
              <p className="font-semibold text-ink text-sm">{d.name}</p>
              <p className="text-coral font-bold text-sm">{d.amount}</p>
              <p className="text-muted text-xs mb-2">{d.date}</p>
              <p className="text-muted text-xs italic">"{d.note}"</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 6 — Media Gallery */}
      <motion.div variants={fadeUp}>
        <h2 className="font-serif text-2xl text-ink mb-6">Moments from the field</h2>
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} onClick={() => setLightbox({ project: PROJECTS[i % 3].title, idx: i })}
              className="break-inside-avoid rounded-xl bg-teal-light border border-teal/20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              style={{ height: i % 3 === 0 ? 160 : i % 3 === 1 ? 120 : 140 }}>
              <span className="text-teal text-sm font-medium">Photo {i+1}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
              <div className="w-full h-48 bg-teal-light rounded-xl flex items-center justify-center mb-4">
                <span className="text-teal font-medium">Photo {lightbox.idx + 1}</span>
              </div>
              <p className="font-semibold text-ink">{lightbox.project}</p>
              <button onClick={() => setLightbox(null)} className="mt-4 text-sm text-muted hover:text-ink">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="bg-teal rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-serif text-xl text-white">Share your impact with the world</p>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white text-teal px-5 py-2.5 rounded-xl font-bold hover:bg-teal-light transition-colors text-sm">
            <Share2 className="w-4 h-4" /> Copy Public Profile Link
          </button>
          <button className="flex items-center gap-2 bg-teal-dark text-white px-5 py-2.5 rounded-xl font-bold hover:bg-ink transition-colors text-sm border border-white/20">
            <Download className="w-4 h-4" /> Download Impact Report PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══ TAB 9 — ANALYTICS ═════════════════════════════════════════ */
function TabAnalytics() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}><h1 className="font-serif text-3xl text-ink mb-1">Analytics</h1><p className="text-muted text-sm">Track your growth and performance over time.</p></motion.div>

      {/* Key metrics */}
      <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Trust Score', value: '84', Icon: Shield, bg: 'bg-teal-light', color: 'text-teal' },
          { label: 'Top Cause', value: 'Education', Icon: Award, bg: 'bg-amber-light', color: 'text-amber-dark' },
          { label: 'Best Fund Request', value: 'Medicine Kit', Icon: TrendingUp, bg: 'bg-coral-light', color: 'text-coral' },
          { label: 'Certificates Issued', value: '38', Icon: Star, bg: 'bg-teal-light', color: 'text-teal' },
        ].map(({ label, value, Icon, bg, color }) => (
          <motion.div key={label} variants={fadeUp} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <p className="font-serif text-xl text-ink">{value}</p>
            <p className="text-muted text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Volunteers over time */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-serif text-lg text-ink mb-5">Volunteers Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={CHART_VOLUNTEERS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6B5F' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6B5F' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E1F5EE', fontSize: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#1D9E75" strokeWidth={2.5} dot={{ fill: '#1D9E75', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Funds raised over time */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-serif text-lg text-ink mb-5">Funds Raised Over Time (₹)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_FUNDS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6B5F' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6B5F' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E1F5EE', fontSize: 12 }} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Raised']} />
              <Bar dataKey="amount" fill="#1D9E75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Applications by cause */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-serif text-lg text-ink mb-5">Applications by Cause</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={CHART_CAUSES} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {CHART_CAUSES.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {CHART_CAUSES.map(c => (
                <div key={c.name} className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  {c.name} ({c.value}%)
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top skills */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-serif text-lg text-ink mb-5">Top Volunteer Skills Applied</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_SKILLS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6B6B5F' }} />
              <YAxis type="category" dataKey="skill" tick={{ fontSize: 11, fill: '#6B6B5F' }} width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E1F5EE', fontSize: 12 }} />
              <Bar dataKey="count" fill="#5DCAA5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══ SIDEBAR ════════════════════════════════════════════════════ */
function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  return (
    <aside className="fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-30 transition-all duration-300" style={{ width: collapsed ? 64 : 240 }}>
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100 min-h-[64px]">
        <Globe className="w-7 h-7 text-teal shrink-0" />
        {!collapsed && <span className="font-serif text-xl text-teal truncate">ServeSphere</span>}
      </div>
      {!collapsed && (
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-bold shrink-0">{NGO.initials}</div>
            <div className="min-w-0">
              <p className="font-semibold text-ink text-sm truncate">{NGO.name}</p>
              <span className="text-xs font-semibold text-teal bg-teal-light px-2 py-0.5 rounded-full">Verified ✓</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-teal-light px-3 py-1.5 rounded-full w-fit">
            <Shield className="w-3.5 h-3.5 text-teal" />
            <span className="text-xs font-semibold text-teal">Trust: {NGO.trust}/100</span>
          </div>
        </div>
      )}
      <nav className="flex-grow py-3 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, Icon, red }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => setActive(id)} title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative group
                ${isActive ? (red ? 'text-red-500 bg-red-50 border-l-[3px] border-red-500' : 'text-teal bg-teal-light border-l-[3px] border-teal')
                  : red ? 'text-red-400 hover:text-red-500 hover:bg-red-50 border-l-[3px] border-transparent'
                  : 'text-muted hover:text-ink hover:bg-sand border-l-[3px] border-transparent'}`}>
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? (red ? 'text-red-500' : 'text-teal') : red ? 'text-red-400' : 'text-muted group-hover:text-ink'}`} />
              {!collapsed && <span className="truncate">{label}</span>}
              {collapsed && <span className="absolute left-full ml-2 px-2 py-1 bg-ink text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">{label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 py-3">
        <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-muted hover:text-ink transition-colors">
          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${collapsed ? '-rotate-90' : 'rotate-90'}`} />
          {!collapsed && <span>Collapse</span>}
        </button>
        <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-red-500 transition-colors group" title={collapsed ? 'Sign Out' : undefined}>
          <LogOut className="w-5 h-5 shrink-0 group-hover:text-red-500" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ══ MAIN EXPORT ════════════════════════════════════════════════ */
const TABS = {
  overview:  TabOverview,
  'post-vol':  TabPostVol,
  'post-fund': TabPostFund,
  'post-res':  TabPostRes,
  alert:     TabAlert,
  uploads:   TabUploads,
  rate:      TabRate,
  impact:    TabImpact,
  analytics: TabAnalytics,
  settings: () => (
    <div className="flex flex-col items-center justify-center h-64 text-muted">
      <Settings className="w-12 h-12 mb-4 opacity-30" />
      <p className="font-serif text-xl text-ink mb-2">Settings</p>
      <p className="text-sm">Account settings coming soon.</p>
    </div>
  ),
};

export default function NGODashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const ActiveTab = TABS[activeTab] || TabOverview;

  return (
    <div className="min-h-screen bg-sand font-sans flex">
      <Sidebar active={activeTab} setActive={setActiveTab} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-grow min-h-screen transition-all duration-300" style={{ marginLeft: collapsed ? 64 : 240 }}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <ActiveTab />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
