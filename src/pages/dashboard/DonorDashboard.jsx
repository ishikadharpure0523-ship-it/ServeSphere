import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, DollarSign, Heart, LogOut, Globe, MapPin, TrendingUp, Users, Shield, Bell, User, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getFundRequests,
  createDonation,
  getDonations,
  getDonorStats
} from '../../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const NAV_ITEMS = [
  { id: 'browse', label: 'Browse Requests', Icon: Search },
  { id: 'donations', label: 'My Donations', Icon: DollarSign },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

// Mock fund requests for demo
const MOCK_FUND_REQUESTS = [
  {
    id: 'mock-fund-1',
    title: 'School Supplies for 100 Children',
    description: 'Help us provide notebooks, pens, and textbooks to underprivileged children in rural Maharashtra.',
    ngoName: 'Teach India Foundation',
    targetAmount: 50000,
    amountRaised: 32000,
    urgent: true,
    cause: 'Education',
  },
  {
    id: 'mock-fund-2',
    title: 'Medical Equipment for Rural Clinic',
    description: 'We need basic medical equipment including BP monitors, thermometers, and first aid supplies for our rural health clinic.',
    ngoName: 'Health For All',
    targetAmount: 75000,
    amountRaised: 45000,
    urgent: false,
    cause: 'Healthcare',
  },
  {
    id: 'mock-fund-3',
    title: 'Sapling Procurement for Monsoon Drive',
    description: 'Purchase 1000 saplings for our upcoming monsoon plantation drive across the city.',
    ngoName: 'Green Earth India',
    targetAmount: 25000,
    amountRaised: 18000,
    urgent: false,
    cause: 'Environment',
  },
  {
    id: 'mock-fund-4',
    title: 'Sewing Machines for Women Training',
    description: 'Help us buy 10 sewing machines to train women in tailoring and help them become financially independent.',
    ngoName: 'Shakti Foundation',
    targetAmount: 60000,
    amountRaised: 15000,
    urgent: true,
    cause: 'Women Empowerment',
  },
];

/* ══════════════════════════════════════════════════════════════
   TAB 1 — BROWSE FUND REQUESTS
══════════════════════════════════════════════════════════════ */
function TabBrowse() {
  const [search, setSearch] = useState('');
  const [fundRequests, setFundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [amount, setAmount] = useState('');
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    fetchFundRequests();
  }, []);

  const fetchFundRequests = async () => {
    try {
      const response = await getFundRequests({ status: 'active' });
      // Combine real fund requests with mock ones
      const realRequests = response.data.fundRequests || [];
      setFundRequests([...MOCK_FUND_REQUESTS, ...realRequests]);
    } catch (error) {
      console.error('Failed to fetch fund requests:', error);
      // If API fails, at least show mock data
      setFundRequests(MOCK_FUND_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!amount || !selectedRequest) return;
    
    setDonating(true);
    try {
      // Check if it's a mock fund request
      if (selectedRequest.id.startsWith('mock-')) {
        // Simulate success for mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Donation of ₹${amount} successful! Thank you for your contribution. (Demo mode - this is mock data)`);
        setSelectedRequest(null);
        setAmount('');
        // Don't refetch for mock data as it won't be in the database
        return;
      }

      // Real API call for actual fund requests
      await createDonation({
        fundRequestId: selectedRequest.id,
        amount: parseFloat(amount),
      });
      alert('Donation successful! Thank you for your contribution.');
      setSelectedRequest(null);
      setAmount('');
      fetchFundRequests();
      
      // Trigger a refresh of the donations tab if it's active
      window.dispatchEvent(new CustomEvent('donation-created'));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to process donation');
    } finally {
      setDonating(false);
    }
  };

  const filtered = fundRequests.filter((req) =>
    req.ngoName?.toLowerCase().includes(search.toLowerCase()) ||
    req.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Loading fund requests...</div>;
  }

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={fadeUp}>
          <h1 className="font-serif text-3xl text-ink mb-1">Browse Fund Requests</h1>
          <p className="text-muted text-sm">Support verified NGOs and make a difference.</p>
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeUp}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by NGO name or request..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none text-sm bg-white"
            />
          </div>
        </motion.div>

        {/* Fund Request Cards */}
        {filtered.length === 0 ? (
          <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Heart className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="font-serif text-xl text-ink mb-2">No fund requests found</h3>
            <p className="text-muted">Check back later for new opportunities to donate.</p>
          </motion.div>
        ) : (
          <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
            {filtered.map((req) => (
              <motion.div key={req.id} variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-serif text-lg text-ink mb-1">{req.title}</h3>
                    <p className="text-sm text-muted">{req.ngoName}</p>
                  </div>
                  {req.urgent && (
                    <span className="text-xs font-semibold text-white bg-red-500 px-2.5 py-1 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                
                <p className="text-muted text-sm mb-4 line-clamp-2">{req.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted mb-2">
                    <span>₹{(req.amountRaised || 0).toLocaleString('en-IN')} raised</span>
                    <span>₹{req.targetAmount.toLocaleString('en-IN')} goal</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-coral rounded-full transition-all"
                      style={{ width: `${Math.min(((req.amountRaised || 0) / req.targetAmount) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="w-full py-2.5 rounded-xl bg-coral text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Donate Now
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Donation Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-serif text-2xl text-ink">Make a Donation</h2>
                <p className="text-muted text-sm mt-1">{selectedRequest.title}</p>
                <p className="text-xs text-muted mt-1">by {selectedRequest.ngoName}</p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Donation Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-coral focus:border-coral outline-none"
                  />
                  <div className="flex gap-2 mt-3">
                    {[100, 500, 1000, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt.toString())}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-muted hover:border-coral hover:text-coral transition-colors"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-sand rounded-xl p-4">
                  <p className="text-xs text-muted mb-2">Progress</p>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-ink">₹{(selectedRequest.amountRaised || 0).toLocaleString('en-IN')}</span>
                    <span className="text-muted">of ₹{selectedRequest.targetAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-coral rounded-full"
                      style={{ width: `${Math.min(((selectedRequest.amountRaised || 0) / selectedRequest.targetAmount) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-muted font-semibold hover:bg-sand transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDonate}
                    disabled={!amount || donating}
                    className="flex-1 px-6 py-3 rounded-xl bg-coral text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {donating ? 'Processing...' : 'Donate'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 2 — MY DONATIONS
══════════════════════════════════════════════════════════════ */
function TabMyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await getDonations();
      setDonations(response.data.donations || []);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch on mount
    fetchDonations();
    
    // Listen for donation events
    const handleDonationCreated = () => {
      fetchDonations();
    };
    
    window.addEventListener('donation-created', handleDonationCreated);
    
    return () => {
      window.removeEventListener('donation-created', handleDonationCreated);
    };
  }, []);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-1">My Donations</h1>
          <p className="text-muted text-sm">Track your contributions and impact.</p>
        </div>
        <button
          onClick={fetchDonations}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-gray-200 text-muted hover:border-coral hover:text-coral transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">Loading donations...</div>
      ) : donations.length === 0 ? (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Heart className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="font-serif text-xl text-ink mb-2">No donations yet</h3>
          <p className="text-muted">Start making a difference by donating to fund requests.</p>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {donations.map((donation) => (
              <div key={donation.id} className="p-6 hover:bg-sand/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-ink">{donation.fundRequestTitle}</h3>
                    <p className="text-sm text-muted">{donation.ngoName}</p>
                  </div>
                  <span className="text-lg font-bold text-coral">₹{donation.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span>{new Date(donation.createdAt).toLocaleDateString('en-IN')}</span>
                  <span className={`px-2 py-1 rounded-full font-semibold ${
                    donation.paymentStatus === 'completed' ? 'bg-teal-light text-teal-dark' :
                    'bg-amber-light text-amber-dark'
                  }`}>
                    {donation.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function DonorDashboard() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const TAB_COMPONENTS = {
    browse: TabBrowse,
    donations: TabMyDonations,
    settings: () => <div className="text-center py-12 text-muted">Settings coming soon...</div>,
  };

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="min-h-screen bg-sand flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-coral" />
            <span className="font-serif text-xl text-ink">ServeSphere</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-coral-light flex items-center justify-center">
              <User className="w-6 h-6 text-coral" />
            </div>
            <div>
              <p className="font-semibold text-ink text-sm">{profile?.name || user?.email}</p>
              <p className="text-xs text-muted">Donor</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors ${
                activeTab === id
                  ? 'bg-coral-light text-coral font-semibold'
                  : 'text-muted hover:bg-sand'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:bg-sand transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
