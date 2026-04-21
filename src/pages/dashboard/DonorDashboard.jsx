import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, DollarSign, Package, BarChart2, Settings, LogOut,
  Globe, MapPin, ChevronDown, ChevronUp, X, CheckCircle,
  TrendingUp, Heart, Users, Shield, AlertCircle, FileText,
} from 'lucide-react';

/* ── Animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ── Mock data ──────────────────────────────────────────────── */
const DONOR = {
  name: 'Sunita Mehta',
  initials: 'SM',
  city: 'Bangalore, Karnataka',
  badge: 'Trusted Donor',
  impactScore: 74,
};

const STATS = [
  { label: 'Total Donated',      value: '₹4,500',  Icon: DollarSign, bg: 'bg-coral-light',  color: 'text-coral' },
  { label: 'NGOs Supported',     value: '3',        Icon: Heart,      bg: 'bg-teal-light',   color: 'text-teal' },
  { label: 'Resources Donated',  value: '2 times',  Icon: Package,    bg: 'bg-amber-light',  color: 'text-amber-dark' },
  { label: 'Impact Score',       value: '74',       Icon: TrendingUp, bg: 'bg-coral-light',  color: 'text-coral' },
];

const RECENT_DONATIONS = [
  { ngo: 'Smile Foundation', initials: 'SF', color: 'bg-teal',      amount: '₹500',   date: '10 Jan 2026', utilized: 100, status: 'Utilized' },
  { ngo: 'Green Earth',      initials: 'GE', color: 'bg-teal-dark', amount: '₹1,000', date: '5 Jan 2026',  utilized: 60,  status: 'In Progress' },
  { ngo: 'Teach India',      initials: 'TI', color: 'bg-amber',     amount: '₹3,000', date: '1 Jan 2026',  utilized: 80,  status: 'In Progress' },
];

const NGO_UPDATES = [
  { ngo: 'Smile Foundation', date: '15 Jan 2026', text: 'Medical camp completed successfully. 200+ patients treated. Bills and photos uploaded.', hasPhoto: true },
  { ngo: 'Green Earth',      date: '12 Jan 2026', text: '500 saplings planted at Sinhagad Road. Volunteers and school children participated.', hasPhoto: true },
  { ngo: 'Teach India',      date: '8 Jan 2026',  text: 'Books distributed to 38 students in Hadapsar. New batch starting next month.', hasPhoto: false },
];

const BROWSE_NGOS = [
  { id: 1, name: 'Asha Foundation',   initials: 'AF', cause: 'Education',         city: 'Mumbai',    trust: 91, desc: 'Quality education for underprivileged children across Maharashtra.', requests: 2, urgent: true,  banner: 'bg-teal',
    fundRequests: [
      { title: 'School Supplies Drive', needed: 15000, raised: 9200, urgent: true },
      { title: 'Teacher Training Fund', needed: 8000,  raised: 3100, urgent: false },
    ],
  },
  { id: 2, name: 'Green Earth India', initials: 'GE', cause: 'Environment',       city: 'Pune',      trust: 87, desc: 'Tree plantation drives, waste management, and climate awareness.', requests: 1, urgent: false, banner: 'bg-teal-dark',
    fundRequests: [
      { title: 'Sapling Procurement',   needed: 5000,  raised: 2800, urgent: false },
    ],
  },
  { id: 3, name: 'Heal India',        initials: 'HI', cause: 'Healthcare',        city: 'Delhi',     trust: 94, desc: 'Free medical camps and health awareness in rural areas.', requests: 3, urgent: true,  banner: 'bg-coral',
    fundRequests: [
      { title: 'Emergency Medicine Kit', needed: 20000, raised: 7500, urgent: true },
      { title: 'Mobile Clinic Fuel',     needed: 3000,  raised: 1200, urgent: false },
      { title: 'Diagnostic Equipment',   needed: 50000, raised: 12000, urgent: false },
    ],
  },
  { id: 4, name: 'Shakti NGO',        initials: 'SN', cause: 'Women Empowerment', city: 'Bangalore', trust: 89, desc: 'Skill development and legal aid for marginalised women.', requests: 2, urgent: false, banner: 'bg-amber',
    fundRequests: [
      { title: 'Sewing Machine Purchase', needed: 12000, raised: 8000, urgent: false },
      { title: 'Legal Aid Fund',          needed: 6000,  raised: 1500, urgent: false },
    ],
  },
];

const MY_DONATIONS_TABLE = [
  { ngo: 'Smile Foundation', amount: '₹500',      type: 'Money',        date: '10 Jan', utilized: 100, proof: true,
    proofData: { narrative: 'Funds used to purchase medicines and first-aid supplies for the medical camp in Dharavi. 200+ patients treated.', sdgs: [3, 10], bills: ['Medicine Invoice', 'Transport Receipt'], photos: 3 } },
  { ngo: 'Green Earth',      amount: '₹1,000',    type: 'Money',        date: '5 Jan',  utilized: 60,  proof: true,
    proofData: { narrative: 'Saplings purchased and planted. Remaining funds allocated for next plantation drive in February.', sdgs: [13, 15], bills: ['Nursery Invoice'], photos: 2 } },
  { ngo: 'Teach India',      amount: 'Books (12)', type: 'Resource',    date: '1 Jan',  utilized: 100, proof: true,
    proofData: { narrative: '12 textbooks distributed to Class 8 students in Hadapsar. Students acknowledged receipt.', sdgs: [4], bills: ['Distribution List'], photos: 4 } },
];

const RESOURCE_TYPES = ['Books', 'Food', 'Clothes', 'Medicine', 'Equipment', 'Other'];

const MY_RESOURCES = [
  { type: 'Books',    qty: 12, ngo: 'Teach India',      date: '1 Jan 2026',  status: 'Delivered' },
  { type: 'Clothes',  qty: 20, ngo: 'Smile Foundation', date: '15 Dec 2025', status: 'Delivered' },
];

const IMPACT_NGOS = [
  { ngo: 'Smile Foundation', donated: '₹500',   trail: [
    { step: 'Donated',           date: '10 Jan', desc: 'You donated ₹500 via ServeSphere.' },
    { step: 'Received by NGO',   date: '10 Jan', desc: 'Smile Foundation confirmed receipt.' },
    { step: 'Procurement',       date: '12 Jan', desc: 'Medicines purchased from Apollo Pharmacy.' },
    { step: 'Utilised',          date: '14 Jan', desc: 'Distributed at Dharavi medical camp.' },
    { step: 'Report Uploaded',   date: '15 Jan', desc: 'Photos and bills uploaded by NGO.' },
    { step: 'Verified ✓',        date: '16 Jan', desc: 'ServeSphere team verified the report.' },
  ]},
  { ngo: 'Green Earth', donated: '₹1,000', trail: [
    { step: 'Donated',           date: '5 Jan',  desc: 'You donated ₹1,000 via ServeSphere.' },
    { step: 'Received by NGO',   date: '5 Jan',  desc: 'Green Earth confirmed receipt.' },
    { step: 'Procurement',       date: '8 Jan',  desc: '500 saplings ordered from nursery.' },
    { step: 'Utilised',          date: '10 Jan', desc: 'Plantation drive completed at Sinhagad Road.' },
    { step: 'Report Uploaded',   date: '12 Jan', desc: 'Photos uploaded. Bills pending.' },
    { step: 'Verified ✓',        date: null,     desc: 'Awaiting ServeSphere verification.' },
  ]},
  { ngo: 'Teach India', donated: 'Books (12)', trail: [
    { step: 'Donated',           date: '1 Jan',  desc: 'You donated 12 textbooks.' },
    { step: 'Received by NGO',   date: '2 Jan',  desc: 'Teach India collected books from your address.' },
    { step: 'Procurement',       date: '2 Jan',  desc: 'Books sorted and labelled for students.' },
    { step: 'Utilised',          date: '5 Jan',  desc: 'Distributed to 12 students in Hadapsar.' },
    { step: 'Report Uploaded',   date: '6 Jan',  desc: 'Distribution list and photos uploaded.' },
    { step: 'Verified ✓',        date: '7 Jan',  desc: 'Verified by ServeSphere.' },
  ]},
];

const ALL_SDGS = [
  { num: 1,  label: 'No Poverty',            color: '#E5243B' },
  { num: 2,  label: 'Zero Hunger',           color: '#DDA63A' },
  { num: 3,  label: 'Good Health',           color: '#4C9F38' },
  { num: 4,  label: 'Quality Education',     color: '#C5192D' },
  { num: 5,  label: 'Gender Equality',       color: '#FF3A21' },
  { num: 6,  label: 'Clean Water',           color: '#26BDE2' },
  { num: 7,  label: 'Clean Energy',          color: '#FCC30B' },
  { num: 8,  label: 'Decent Work',           color: '#A21942' },
  { num: 9,  label: 'Industry',              color: '#FD6925' },
  { num: 10, label: 'Reduced Inequalities',  color: '#DD1367' },
  { num: 11, label: 'Sustainable Cities',    color: '#FD9D24' },
  { num: 12, label: 'Responsible Consumption', color: '#BF8B2E' },
  { num: 13, label: 'Climate Action',        color: '#3F7E44' },
  { num: 14, label: 'Life Below Water',      color: '#0A97D9' },
  { num: 15, label: 'Life on Land',          color: '#56C02B' },
  { num: 16, label: 'Peace & Justice',       color: '#00689D' },
  { num: 17, label: 'Partnerships',          color: '#19486A' },
];
const DONOR_SDGS = [3, 4, 10, 13, 15];

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',          Icon: Home },
  { id: 'browse',     label: 'Browse NGOs',       Icon: Search },
  { id: 'donations',  label: 'My Donations',      Icon: DollarSign },
  { id: 'resources',  label: 'Resource Donations', Icon: Package },
  { id: 'impact',     label: 'Impact Tracker',    Icon: BarChart2 },
  { id: 'settings',   label: 'Settings',          Icon: Settings },
];

/* ── Helpers ────────────────────────────────────────────────── */
function UtilBadge({ pct }) {
  if (pct === 100) return <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal bg-teal-light px-2.5 py-1 rounded-full">Fully Utilized ✓</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-dark bg-amber-light px-2.5 py-1 rounded-full">In Progress</span>;
}

function ProgressBar({ pct, color = 'bg-teal' }) {
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 1 — OVERVIEW
══════════════════════════════════════════════════════════════ */
function TabOverview() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink">Good morning, {DONOR.name.split(' ')[0]} 👋</h1>
        <p className="text-muted text-sm mt-1">Here's your donation impact summary.</p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, Icon, bg, color }) => (
          <motion.div key={label} variants={fadeUp} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="font-serif text-2xl text-ink">{value}</p>
            <p className="text-muted text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-ink mb-5">Recent Donations</h2>
          <div className="space-y-4">
            {RECENT_DONATIONS.map(({ ngo, initials, color, amount, date, utilized, status }) => (
              <div key={ngo} className="flex items-start gap-3 p-3 rounded-xl hover:bg-sand transition-colors">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {initials}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-ink text-sm">{ngo}</p>
                  <p className="text-muted text-xs">{amount} · {date}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted mb-1">
                      <span>{utilized}% utilized</span>
                      <UtilBadge pct={utilized} />
                    </div>
                    <ProgressBar pct={utilized} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* NGO Updates Feed */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-ink mb-5">NGO Updates Feed</h2>
          <div className="space-y-4">
            {NGO_UPDATES.map(({ ngo, date, text, hasPhoto }) => (
              <div key={ngo + date} className="border-l-4 border-coral pl-4 py-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-ink text-sm">{ngo}</p>
                  <p className="text-muted text-xs">{date}</p>
                </div>
                <p className="text-muted text-sm leading-relaxed mb-2">{text}</p>
                {hasPhoto && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-teal-light border border-teal/20" />
                    <div className="w-12 h-12 rounded-lg bg-teal-light border border-teal/20" />
                  </div>
                )}
                <button className="text-coral text-xs font-medium hover:underline">View Full Update</button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 2 — BROWSE NGOs (with donation drawer)
══════════════════════════════════════════════════════════════ */
function TabBrowse() {
  const [search, setSearch] = useState('');
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donationType, setDonationType] = useState('urgent');
  const [amount, setAmount] = useState('');

  const filtered = BROWSE_NGOS.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase()) || n.cause.toLowerCase().includes(search.toLowerCase())
  );

  const handleDonate = () => {
    alert(`Donated ₹${amount} to ${selectedNGO.name}`);
    setSelectedNGO(null);
    setAmount('');
  };

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={fadeUp}>
          <h1 className="font-serif text-3xl text-ink mb-1">Browse NGOs</h1>
          <p className="text-muted text-sm">Find verified NGOs and support their causes.</p>
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeUp}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by NGO name or cause..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none text-sm bg-white"
            />
          </div>
        </motion.div>

        {/* NGO Cards */}
        <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
          {filtered.map((ngo) => (
            <motion.div key={ngo.id} variants={fadeUp} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className={`${ngo.banner} h-16 relative`}>
                <div className="absolute -bottom-5 left-5 w-12 h-12 rounded-full bg-white border-2 border-white shadow flex items-center justify-center font-bold text-ink text-sm">
                  {ngo.initials}
                </div>
                {ngo.urgent && (
                  <span className="absolute top-3 right-3 text-xs font-semibold text-white bg-red-500 px-2.5 py-1 rounded-full flex items-center gap-1">
                    🔴 Urgent
                  </span>
                )}
              </div>
              <div className="pt-8 px-5 pb-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-lg text-ink">{ngo.name}</h3>
                  <span className="text-xs font-semibold text-teal bg-teal-light px-2.5 py-1 rounded-full">Trust: {ngo.trust}</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted bg-warm px-2.5 py-1 rounded-full">{ngo.cause}</span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <MapPin className="w-3 h-3" />{ngo.city}
                  </span>
                </div>
                <p className="text-muted text-sm leading-relaxed mb-3">{ngo.desc}</p>
                <p className="text-muted text-xs mb-4">{ngo.requests} active fund requests</p>
                <button
                  onClick={() => setSelectedNGO(ngo)}
                  className="w-full py-2.5 rounded-xl bg-coral text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Donate
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Donation Drawer */}
      <AnimatePresence>
        {selectedNGO && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSelectedNGO(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h2 className="font-serif text-xl text-ink">{selectedNGO.name}</h2>
                  <span className="text-xs font-semibold text-teal bg-teal-light px-2.5 py-1 rounded-full inline-block mt-1">
                    Trust: {selectedNGO.trust}
                  </span>
                </div>
                <button onClick={() => setSelectedNGO(null)} className="text-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Fund requests */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Active Fund Requests</p>
                  <div className="space-y-3">
                    {selectedNGO.fundRequests.map((req, i) => (
                      <label
                        key={i}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedRequest === i ? 'border-coral bg-coral-light' : 'border-gray-100 hover:border-coral/30'}`}
                      >
                        <input
                          type="radio"
                          name="request"
                          checked={selectedRequest === i}
                          onChange={() => setSelectedRequest(i)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-ink text-sm">{req.title}</p>
                          {req.urgent && <span className="text-xs font-semibold text-red-500">🔴 Urgent</span>}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted mb-2">
                          <span>₹{req.raised.toLocaleString('en-IN')} raised</span>
                          <span>₹{req.needed.toLocaleString('en-IN')} needed</span>
                        </div>
                        <ProgressBar pct={(req.raised / req.needed) * 100} color="bg-teal" />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Donate to */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Donate To</p>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${donationType === 'urgent' ? 'border-coral bg-coral-light' : 'border-gray-100'}`}>
                      <input type="radio" name="type" value="urgent" checked={donationType === 'urgent'} onChange={(e) => setDonationType(e.target.value)} className="w-4 h-4 text-coral" />
                      <span className="text-sm font-medium text-ink">🔴 Urgent Request</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${donationType === 'general' ? 'border-coral bg-coral-light' : 'border-gray-100'}`}>
                      <input type="radio" name="type" value="general" checked={donationType === 'general'} onChange={(e) => setDonationType(e.target.value)} className="w-4 h-4 text-coral" />
                      <span className="text-sm font-medium text-ink">🟡 General Fund</span>
                    </label>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Amount</p>
                  <div className="relative mb-3">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none text-sm"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[100, 500, 1000, 5000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAmount(amt.toString())}
                        className="px-4 py-2 rounded-full text-xs font-semibold border border-gray-200 text-muted hover:border-coral hover:text-coral transition-colors"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleDonate}
                    disabled={!amount}
                    className="w-full py-3 rounded-xl bg-coral text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Donate Now
                  </button>
                  <button onClick={() => setSelectedNGO(null)} className="w-full text-center text-sm text-muted hover:text-ink">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 3 — MY DONATIONS (with proof drawer)
══════════════════════════════════════════════════════════════ */
function TabMyDonations() {
  const [proofItem, setProofItem] = useState(null);

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={fadeUp}>
          <h1 className="font-serif text-3xl text-ink mb-1">My Donations</h1>
          <p className="text-muted text-sm">Every rupee tracked. Every impact verified.</p>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-6 gap-3 px-6 py-3 bg-sand border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-muted">
            <span className="col-span-2">NGO</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Utilized</span>
            <span>Proof</span>
          </div>

          {MY_DONATIONS_TABLE.map((row, i) => (
            <div key={i} className="grid grid-cols-6 gap-3 px-6 py-4 border-b border-gray-50 hover:bg-sand/50 transition-colors items-center">
              <div className="col-span-2">
                <p className="font-semibold text-ink text-sm">{row.ngo}</p>
                <span className="text-xs text-muted bg-warm px-2 py-0.5 rounded-full">{row.type}</span>
              </div>
              <p className="text-ink text-sm font-medium">{row.amount}</p>
              <p className="text-muted text-sm">{row.date}</p>
              <div>
                {row.utilized === 100
                  ? <span className="text-xs font-semibold text-teal">100% ✅</span>
                  : <span className="text-xs font-semibold text-amber-dark">{row.utilized}% ⏳</span>
                }
              </div>
              <button
                onClick={() => setProofItem(row)}
                className="text-xs font-semibold text-coral hover:underline"
              >
                View
              </button>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Proof Drawer */}
      <AnimatePresence>
        {proofItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setProofItem(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h2 className="font-serif text-xl text-ink">{proofItem.ngo}</h2>
                  <p className="text-muted text-sm">{proofItem.amount} · {proofItem.date}</p>
                </div>
                <button onClick={() => setProofItem(null)} className="text-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Photos */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Photos Uploaded by NGO</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(proofItem.proofData.photos)].map((_, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-teal-light border border-teal/20 flex items-center justify-center">
                        <span className="text-teal text-xs font-medium">Photo {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bills */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Bills &amp; Receipts</p>
                  <div className="space-y-2">
                    {proofItem.proofData.bills.map((bill) => (
                      <div key={bill} className="flex items-center gap-3 p-3 rounded-xl bg-sand border border-gray-100">
                        <FileText className="w-4 h-4 text-muted shrink-0" />
                        <span className="text-sm text-ink">{bill}</span>
                        <button className="ml-auto text-xs text-coral font-medium hover:underline">View</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Narrative */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">NGO Update</p>
                  <p className="text-sm text-ink-3 leading-relaxed bg-sand rounded-xl p-4 border border-gray-100">
                    {proofItem.proofData.narrative}
                  </p>
                </div>

                {/* SDG tags */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">SDGs Contributed To</p>
                  <div className="flex flex-wrap gap-2">
                    {proofItem.proofData.sdgs.map((num) => {
                      const sdg = ALL_SDGS.find((s) => s.num === num);
                      return (
                        <span key={num} className="text-xs font-semibold text-white px-3 py-1 rounded-full" style={{ backgroundColor: sdg.color }}>
                          SDG {num} · {sdg.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 4 — RESOURCE DONATIONS
══════════════════════════════════════════════════════════════ */
function TabResources() {
  const [resType, setResType]     = useState('Books');
  const [qty, setQty]             = useState('');
  const [desc, setDesc]           = useState('');
  const [ngoSearch, setNgoSearch] = useState('');
  const [pickup, setPickup]       = useState('pickup');
  const [location, setLocation]   = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Resource donation posted: ${qty} ${resType}`);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink mb-1">Resource Donations</h1>
        <p className="text-muted text-sm">Donate books, food, clothes, or equipment to NGOs that need them.</p>
      </motion.div>

      {/* Form */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-6">Post a Resource Donation</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Resource type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Resource Type</label>
              <select
                value={resType}
                onChange={(e) => setResType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none text-sm bg-white"
              >
                {RESOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Quantity</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="e.g. 12"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Describe the items — condition, size, etc."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none text-sm resize-none"
            />
          </div>

          {/* Preferred NGO */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Preferred NGO</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                value={ngoSearch}
                onChange={(e) => setNgoSearch(e.target.value)}
                placeholder="Search registered NGOs..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none text-sm"
              />
            </div>
            {ngoSearch && (
              <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {BROWSE_NGOS.filter((n) => n.name.toLowerCase().includes(ngoSearch.toLowerCase())).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNgoSearch(n.name)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-sand transition-colors border-b border-gray-50 last:border-0"
                  >
                    <span className="font-medium text-ink">{n.name}</span>
                    <span className="text-muted ml-2 text-xs">{n.city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pickup / Drop-off */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Logistics</label>
            <div className="flex gap-3">
              {[{ val: 'pickup', label: 'NGO Pickup' }, { val: 'dropoff', label: 'I will Drop Off' }].map(({ val, label }) => (
                <label key={val} className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer flex-1 transition-colors ${pickup === val ? 'border-coral bg-coral-light' : 'border-gray-100'}`}>
                  <input type="radio" name="logistics" value={val} checked={pickup === val} onChange={() => setPickup(val)} className="w-4 h-4 text-coral" />
                  <span className="text-sm font-medium text-ink">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Your Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Koramangala, Bangalore"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none text-sm"
            />
          </div>

          <button type="submit" className="w-full py-3 rounded-xl bg-coral text-white font-semibold hover:opacity-90 transition-opacity">
            Post Resource Donation
          </button>
        </form>
      </motion.div>

      {/* My resource donations */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">My Resource Donations</h2>
        <div className="space-y-3">
          {MY_RESOURCES.map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-sand border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-amber-light flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-amber-dark" />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-ink text-sm">{r.type} × {r.qty}</p>
                <p className="text-muted text-xs">{r.ngo} · {r.date}</p>
              </div>
              <span className="text-xs font-semibold text-teal bg-teal-light px-3 py-1 rounded-full">{r.status} ✓</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 5 — IMPACT TRACKER
══════════════════════════════════════════════════════════════ */
const TRAIL_STEP_COLORS = ['bg-teal', 'bg-teal', 'bg-teal', 'bg-teal', 'bg-teal', 'bg-teal-dark'];

function DonationTrail({ trail }) {
  return (
    <div className="relative pl-6 py-2">
      <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-teal/20" />
      <div className="space-y-5">
        {trail.map(({ step, date, desc }, i) => (
          <motion.div
            key={i}
            className="relative flex items-start gap-4"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.1 }}
          >
            <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${date ? 'bg-teal' : 'bg-gray-300'} border-2 border-white shadow-sm shrink-0`} />
            <div className={`flex-grow rounded-xl px-4 py-3 ${date ? 'bg-teal-light/40' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-0.5">
                <p className={`font-semibold text-sm ${date ? 'text-teal-dark' : 'text-muted'}`}>{step}</p>
                {date && <span className="text-xs text-muted">{date}</span>}
              </div>
              <p className="text-muted text-xs leading-relaxed">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TabImpact() {
  const [expanded, setExpanded] = useState(null);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink mb-1">Impact Tracker</h1>
        <p className="text-muted text-sm">See exactly where every rupee went.</p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl p-8 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Total Donated',   value: '₹4,500' },
            { label: 'NGOs Helped',     value: '3' },
            { label: 'Lives Impacted',  value: '250+' },
            { label: 'SDGs Contributed', value: '5' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-serif text-3xl md:text-4xl mb-1">{value}</p>
              <p className="text-white/70 text-xs uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Fund utilization accordion */}
      <motion.div variants={fadeUp} className="space-y-3">
        <h2 className="font-serif text-xl text-ink">Fund Utilization Timeline</h2>
        {IMPACT_NGOS.map(({ ngo, donated, trail }, i) => (
          <div key={ngo} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-sand/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-light flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-teal" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-ink text-sm">{ngo}</p>
                  <p className="text-muted text-xs">{donated} donated</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-teal bg-teal-light px-3 py-1 rounded-full">
                  {trail[trail.length - 1].date ? '✓ Verified' : 'In Progress'}
                </span>
                {expanded === i ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </div>
            </button>

            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-gray-50">
                    <DonationTrail trail={trail} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>

      {/* SDG Impact Grid */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">SDG Impact</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {ALL_SDGS.map(({ num, label, color }) => {
            const active = DONOR_SDGS.includes(num);
            return (
              <motion.div
                key={num}
                whileHover={active ? { scale: 1.05 } : {}}
                className={`rounded-xl p-3 text-center transition-all ${active ? 'shadow-md' : 'opacity-25 grayscale'}`}
                style={{ backgroundColor: active ? color : '#ccc' }}
              >
                <p className="font-bold text-white text-sm">{num}</p>
                <p className="text-white/80 text-xs mt-0.5 leading-tight">{label}</p>
              </motion.div>
            );
          })}
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

      {/* Donor profile */}
      {!collapsed && (
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white font-bold shrink-0">
              {DONOR.initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-ink text-sm truncate">{DONOR.name}</p>
              <p className="text-xs text-coral font-medium mt-0.5">{DONOR.badge}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-coral-light px-3 py-1.5 rounded-full w-fit">
            <TrendingUp className="w-3.5 h-3.5 text-coral" />
            <span className="text-xs font-semibold text-coral">Impact Score: {DONOR.impactScore}</span>
          </div>
        </div>
      )}

      {/* Nav */}
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
                  ? 'text-coral bg-coral-light border-l-[3px] border-coral'
                  : 'text-muted hover:text-ink hover:bg-sand border-l-[3px] border-transparent'
                }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-coral' : 'text-muted group-hover:text-ink'}`} />
              {!collapsed && <span className="truncate">{label}</span>}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-ink text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
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
  overview:  TabOverview,
  browse:    TabBrowse,
  donations: TabMyDonations,
  resources: TabResources,
  impact:    TabImpact,
  settings: () => (
    <div className="flex flex-col items-center justify-center h-64 text-muted">
      <Settings className="w-12 h-12 mb-4 opacity-30" />
      <p className="font-serif text-xl text-ink mb-2">Settings</p>
      <p className="text-sm">Account settings coming soon.</p>
    </div>
  ),
};

export default function DonorDashboard() {
  const [activeTab, setActiveTab]   = useState('overview');
  const [collapsed, setCollapsed]   = useState(false);

  const ActiveTab = TAB_COMPONENTS[activeTab] || TabOverview;

  return (
    <div className="min-h-screen bg-sand font-sans flex">
      <Sidebar
        active={activeTab}
        setActive={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
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
