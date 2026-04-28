import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, ClipboardList, DollarSign, Settings, LogOut, Globe,
  Plus, MapPin, CheckCircle, Clock, XCircle, ChevronDown, Edit3,
  Eye, TrendingUp, Award, Shield, Bell, Search, Filter, Calendar,
  FileText, Upload, Download, Share2, Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getNGOStats, 
  getOpportunities, 
  getApplications, 
  getFundRequests,
  getDonations,
  createOpportunity,
  createFundRequest,
  updateApplication,
  updateProfile
} from '../../lib/api';

/* ── Animation Variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', Icon: Home },
  { id: 'opportunities', label: 'Opportunities', Icon: ClipboardList },
  { id: 'applications', label: 'Applications', Icon: Users },
  { id: 'fundraising', label: 'Fundraising', Icon: DollarSign },
  { id: 'reports', label: 'Reports & Impact', Icon: FileText },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

/* ══════════════════════════════════════════════════════════════
   TAB 1 — OVERVIEW
══════════════════════════════════════════════════════════════ */
function TabOverview({ onShowCreateOpportunity, onShowCreateFundRequest }) {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getNGOStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const STATS = [
    { label: 'Active Opportunities', value: stats?.opportunities || 0, icon: ClipboardList, color: 'text-teal', bg: 'bg-teal-light' },
    { label: 'Total Applications', value: stats?.applications || 0, icon: Users, color: 'text-amber-dark', bg: 'bg-amber-light' },
    { label: 'Active Volunteers', value: stats?.volunteers || 0, icon: CheckCircle, color: 'text-teal', bg: 'bg-teal-light' },
    { label: 'Funds Raised', value: `₹${(stats?.totalDonations || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-coral', bg: 'bg-coral-light' },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl text-ink">Welcome back, {profile?.organizationName || profile?.name} 👋</h1>
          <p className="text-muted text-sm mt-1">Here's your organization's impact dashboard.</p>
        </div>
        <div className="flex items-center gap-2 bg-teal-light px-4 py-2 rounded-full">
          <Shield className="w-4 h-4 text-teal" />
          <span className="text-sm font-semibold text-teal">Trust Score: {stats?.trustScore || 0}</span>
        </div>
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

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-ink mb-5">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button 
            onClick={onShowCreateOpportunity}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-teal text-left hover:bg-teal-light transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-ink text-sm">Post Opportunity</p>
              <p className="text-muted text-xs">Find volunteers</p>
            </div>
          </button>
          <button 
            onClick={onShowCreateFundRequest}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-coral text-left hover:bg-coral-light transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-ink text-sm">Create Fund Request</p>
              <p className="text-muted text-xs">Raise funds</p>
            </div>
          </button>
          <button 
            onClick={() => alert('Impact report upload coming soon!')}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-amber text-left hover:bg-amber-light transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-ink text-sm">Upload Impact Report</p>
              <p className="text-muted text-xs">Show transparency</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Verification Status */}
      {profile?.verificationStatus !== 'verified' && (
        <motion.div variants={fadeUp} className="bg-amber-light border-l-4 border-amber rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-ink mb-1">Verification Pending</h3>
              <p className="text-muted text-sm mb-3">
                Complete your verification to unlock full platform features and build trust with volunteers and donors.
              </p>
              <button 
                onClick={() => setShowVerificationModal(true)}
                className="px-4 py-2 rounded-lg bg-amber text-white text-sm font-semibold hover:bg-amber-dark transition-colors"
              >
                Complete Verification
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Verification Modal */}
      <AnimatePresence>
        {showVerificationModal && (
          <VerificationModal 
            onClose={() => setShowVerificationModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Verification Modal ─────────────────────────────────────── */
function VerificationModal({ onClose }) {
  const { profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    registrationNumber: profile?.registrationNumber || '',
    address: profile?.address || '',
    website: profile?.website || '',
    contactPerson: profile?.contactPerson || '',
    contactPhone: profile?.contactPhone || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Update profile with verification details
      await updateProfile({
        ...formData,
        verificationStatus: 'verified', // Auto-verify for demo
      });
      
      // Refresh profile to get updated data
      if (refreshProfile) {
        await refreshProfile();
      }
      
      alert('Verification submitted successfully! Your account is now verified.');
      onClose();
      window.location.reload(); // Refresh to show updated status
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit verification');
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
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-serif text-2xl text-ink">Complete Verification</h2>
          <p className="text-muted text-sm mt-1">Provide your organization details to get verified</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Registration Number *</label>
            <input
              type="text"
              required
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              placeholder="e.g., NGO/2024/12345"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber focus:border-amber outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Organization Address *</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full registered address"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber focus:border-amber outline-none resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yourorganization.org"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber focus:border-amber outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Contact Person *</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber focus:border-amber outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Contact Phone *</label>
            <input
              type="tel"
              required
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              placeholder="+91 XXXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber focus:border-amber outline-none"
            />
          </div>

          <div className="bg-amber-light rounded-xl p-4">
            <p className="text-sm text-ink">
              <strong>Note:</strong> For demo purposes, your account will be verified immediately upon submission. 
              In production, this would require manual review by administrators.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
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
              className="flex-1 px-6 py-3 rounded-xl bg-amber text-white font-semibold hover:bg-amber-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Verification'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 2 — OPPORTUNITIES
══════════════════════════════════════════════════════════════ */
// Mock opportunities for demo
const MOCK_OPPORTUNITIES = [
  {
    id: 'mock-1',
    title: 'Weekend Teaching Program',
    description: 'Help underprivileged children with Math and Science on weekends. Make a real difference in their education.',
    city: 'Mumbai',
    cause: 'Education',
    duration: '2 months',
    volunteersNeeded: 10,
    volunteersApplied: 3,
    status: 'open',
    certificateOffered: true,
    skills: ['Teaching', 'Communication'],
    isMock: true,
  },
  {
    id: 'mock-2',
    title: 'Medical Camp Assistant',
    description: 'Assist doctors and nurses in organizing free medical camps in rural areas. Help with patient registration and basic first aid.',
    city: 'Pune',
    cause: 'Healthcare',
    duration: '1 week',
    volunteersNeeded: 15,
    volunteersApplied: 8,
    status: 'open',
    certificateOffered: true,
    skills: ['First Aid', 'Communication'],
    isMock: true,
  },
  {
    id: 'mock-3',
    title: 'Tree Plantation Drive',
    description: 'Join us in planting 500 saplings across the city. Help combat climate change and make our city greener.',
    city: 'Delhi',
    cause: 'Environment',
    duration: '1 day',
    volunteersNeeded: 20,
    volunteersApplied: 15,
    status: 'open',
    certificateOffered: false,
    skills: ['Physical Fitness'],
    isMock: true,
  },
];

function TabOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchOpportunities();
    
    // Listen for event to show create modal
    const handleShowCreate = () => setShowCreateModal(true);
    window.addEventListener('show-create-opportunity', handleShowCreate);
    
    return () => {
      window.removeEventListener('show-create-opportunity', handleShowCreate);
    };
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await getOpportunities();
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

  if (loading) {
    return <div className="text-center py-12">Loading opportunities...</div>;
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-1">Volunteer Opportunities</h1>
          <p className="text-muted text-sm">Manage your volunteer postings and requirements.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Post New Opportunity
        </button>
      </motion.div>

      {opportunities.length === 0 ? (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <ClipboardList className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="font-serif text-xl text-ink mb-2">No opportunities yet</h3>
          <p className="text-muted mb-6">Start by posting your first volunteer opportunity.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors"
          >
            Post Opportunity
          </button>
        </motion.div>
      ) : (
        <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
          {opportunities.map((opp) => (
            <motion.div key={opp.id} variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-grow">
                  <h3 className="font-serif text-lg text-ink mb-1">{opp.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {opp.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {opp.duration}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  opp.status === 'open' ? 'bg-teal-light text-teal-dark' :
                  opp.status === 'closed' ? 'bg-gray-100 text-gray-600' :
                  'bg-amber-light text-amber-dark'
                }`}>
                  {opp.status}
                </span>
              </div>
              
              <p className="text-muted text-sm mb-4 line-clamp-2">{opp.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm">
                  <span className="font-semibold text-ink">{opp.volunteersApplied || 0}</span>
                  <span className="text-muted"> / {opp.volunteersNeeded} applied</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg border border-gray-200 hover:bg-sand transition-colors">
                    <Edit3 className="w-4 h-4 text-muted" />
                  </button>
                  <button className="p-2 rounded-lg border border-gray-200 hover:bg-sand transition-colors">
                    <Eye className="w-4 h-4 text-muted" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Opportunity Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateOpportunityModal 
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchOpportunities();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Create Opportunity Modal ───────────────────────────────── */
function CreateOpportunityModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cause: 'Education',
    city: '',
    duration: '',
    volunteersNeeded: 1,
    skills: '',
    certificateOffered: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createOpportunity({
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create opportunity');
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
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-serif text-2xl text-ink">Post New Opportunity</h2>
          <p className="text-muted text-sm mt-1">Fill in the details to attract volunteers</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Opportunity Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Weekend Tutoring for Underprivileged Children"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the opportunity, responsibilities, and impact..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Cause *</label>
              <select
                value={formData.cause}
                onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
              >
                <option>Education</option>
                <option>Healthcare</option>
                <option>Environment</option>
                <option>Women Empowerment</option>
                <option>Animal Welfare</option>
                <option>Disaster Relief</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Mumbai"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Duration *</label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 2 weekends, 1 month"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Volunteers Needed *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.volunteersNeeded}
                onChange={(e) => setFormData({ ...formData, volunteersNeeded: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Required Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g., Teaching, Communication, Patience"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="certificate"
              checked={formData.certificateOffered}
              onChange={(e) => setFormData({ ...formData, certificateOffered: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-teal focus:ring-teal"
            />
            <label htmlFor="certificate" className="text-sm text-ink">
              Offer certificate upon completion
            </label>
          </div>

          <div className="flex gap-3 pt-4">
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
              {loading ? 'Creating...' : 'Post Opportunity'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 3 — APPLICATIONS
══════════════════════════════════════════════════════════════ */
function TabApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getApplications();
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await updateApplication(appId, { status });
      fetchApplications();
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  };

  const filteredApps = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  if (loading) {
    return <div className="text-center py-12">Loading applications...</div>;
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-ink mb-1">Volunteer Applications</h1>
        <p className="text-muted text-sm">Review and manage volunteer applications.</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex gap-2">
        {['all', 'pending', 'accepted', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === status
                ? 'bg-teal text-white'
                : 'bg-white border border-gray-200 text-muted hover:border-teal hover:text-teal'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </motion.div>

      {filteredApps.length === 0 ? (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Users className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="font-serif text-xl text-ink mb-2">No applications</h3>
          <p className="text-muted">Applications will appear here when volunteers apply.</p>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredApps.map((app) => (
              <div key={app.id} className="p-6 hover:bg-sand/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-ink">{app.volunteerName}</h3>
                    <p className="text-sm text-muted">{app.opportunityTitle}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === 'accepted' ? 'bg-teal-light text-teal-dark' :
                    app.status === 'pending' ? 'bg-amber-light text-amber-dark' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {app.status}
                  </span>
                </div>
                
                {app.message && (
                  <p className="text-sm text-muted mb-4 p-3 bg-sand rounded-lg">{app.message}</p>
                )}
                
                {app.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'accepted')}
                      className="px-4 py-2 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'rejected')}
                      className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 4 — FUNDRAISING
══════════════════════════════════════════════════════════════ */
function TabFundraising() {
  const [fundRequests, setFundRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Listen for event to show create modal
    const handleShowCreate = () => setShowCreateModal(true);
    window.addEventListener('show-create-fund-request', handleShowCreate);
    
    return () => {
      window.removeEventListener('show-create-fund-request', handleShowCreate);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [fundsRes, donationsRes] = await Promise.all([
        getFundRequests(),
        getDonations()
      ]);
      setFundRequests(fundsRes.data.fundRequests || []);
      setDonations(donationsRes.data.donations || []);
    } catch (error) {
      console.error('Failed to fetch fundraising data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading fundraising data...</div>;
  }

  const totalRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-ink mb-1">Fundraising</h1>
            <p className="text-muted text-sm">Manage fund requests and track donations.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-coral text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Create Fund Request
          </button>
        </motion.div>

        {/* Total raised */}
        <motion.div variants={fadeUp} className="bg-gradient-to-br from-coral to-coral/80 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Funds Raised</p>
              <p className="font-serif text-4xl">₹{totalRaised.toLocaleString('en-IN')}</p>
              <p className="text-white/80 text-sm mt-2">{donations.length} donations received</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-10 h-10" />
            </div>
          </div>
        </motion.div>

        {/* Fund requests */}
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-ink mb-5">Active Fund Requests</h2>
          {fundRequests.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-muted mx-auto mb-3" />
              <p className="text-muted mb-4">No active fund requests</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-xl bg-coral text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Create Your First Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {fundRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-gray-100 hover:bg-sand transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-ink">{req.title}</h3>
                      <p className="text-sm text-muted">{req.cause}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-light text-teal-dark">
                      {req.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">Progress</span>
                      <span className="font-semibold text-ink">
                        ₹{(req.amountRaised || req.raisedAmount || 0).toLocaleString('en-IN')} / ₹{req.targetAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-coral rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(((req.amountRaised || req.raisedAmount || 0) / req.targetAmount) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted line-clamp-2">{req.description}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Create Fund Request Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateFundRequestModal 
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Create Fund Request Modal ──────────────────────────────── */
function CreateFundRequestModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    cause: 'Education',
    urgent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createFundRequest({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create fund request');
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
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-serif text-2xl text-ink">Create Fund Request</h2>
          <p className="text-muted text-sm mt-1">Request funds from donors for your cause</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Request Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., School Supplies for 100 Children"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what the funds will be used for..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Target Amount (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="50000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Cause *</label>
              <select
                value={formData.cause}
                onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none"
              >
                <option>Education</option>
                <option>Healthcare</option>
                <option>Environment</option>
                <option>Women Empowerment</option>
                <option>Animal Welfare</option>
                <option>Disaster Relief</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="urgent"
              checked={formData.urgent}
              onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-coral focus:ring-coral"
            />
            <label htmlFor="urgent" className="text-sm text-ink">
              Mark as urgent (will be highlighted to donors)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
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
              className="flex-1 px-6 py-3 rounded-xl bg-coral text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════════ */
function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { logout, profile } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-30 transition-all duration-300"
      style={{ width: collapsed ? 64 : 240 }}
    >
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100 min-h-[64px]">
        <Globe className="w-7 h-7 text-teal shrink-0" />
        {!collapsed && <span className="font-serif text-xl text-teal truncate">ServeSphere</span>}
      </div>

      {!collapsed && profile && (
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-bold shrink-0">
              {(profile.organizationName || profile.name || 'N').substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-ink text-sm truncate">{profile.organizationName || profile.name}</p>
              <p className="text-xs text-muted">NGO Account</p>
            </div>
          </div>
          {profile.verificationStatus === 'verified' && (
            <div className="flex items-center gap-2 bg-teal-light px-3 py-1.5 rounded-full w-fit">
              <CheckCircle className="w-3.5 h-3.5 text-teal" />
              <span className="text-xs font-semibold text-teal">Verified</span>
            </div>
          )}
        </div>
      )}

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
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-ink text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

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
   MAIN EXPORT
══════════════════════════════════════════════════════════════ */
const TAB_COMPONENTS = {
  'overview': TabOverview,
  'opportunities': TabOpportunities,
  'applications': TabApplications,
  'fundraising': TabFundraising,
  'reports': () => <div className="text-center py-12 text-muted">Reports coming soon...</div>,
  'settings': () => <div className="text-center py-12 text-muted">Settings coming soon...</div>,
};

export default function NGODashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  // Handlers for quick actions
  const handleShowCreateOpportunity = () => {
    setActiveTab('opportunities');
    // Trigger the create modal after a short delay to allow tab switch
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('show-create-opportunity'));
    }, 100);
  };

  const handleShowCreateFundRequest = () => {
    setActiveTab('fundraising');
    // Trigger the create modal after a short delay to allow tab switch
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('show-create-fund-request'));
    }, 100);
  };

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
              {activeTab === 'overview' ? (
                <TabOverview 
                  onShowCreateOpportunity={handleShowCreateOpportunity}
                  onShowCreateFundRequest={handleShowCreateFundRequest}
                />
              ) : (
                <ActiveTab />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
