import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Mail, Lock, Eye, EyeOff, ChevronDown, Users, Heart, Building, ArrowRight } from 'lucide-react';

const ROLES = [
  { id: 'volunteer', label: 'Volunteer',  Icon: Users,    color: 'text-amber-dark', bg: 'bg-amber-light',  border: 'border-amber',   dashboard: '/dashboard/volunteer' },
  { id: 'donor',     label: 'Donor',      Icon: Heart,    color: 'text-coral',      bg: 'bg-coral-light',  border: 'border-coral',   dashboard: '/dashboard/donor' },
  { id: 'ngo',       label: 'NGO',        Icon: Building, color: 'text-teal',       bg: 'bg-teal-light',   border: 'border-teal',    dashboard: '/dashboard/ngo' },
];

export default function SignIn() {
  const navigate = useNavigate();
  const [role, setRole]           = useState(null);
  const [dropOpen, setDropOpen]   = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  const selected = ROLES.find(r => r.id === role);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) { setDropOpen(true); return; }
    navigate(selected.dashboard);
  };

  return (
    <div className="min-h-screen bg-sand flex font-sans">

      {/* ── Left panel — branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12 relative overflow-hidden">
        {/* Teal glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(29,158,117,0.25),transparent_60%)]" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <Globe className="w-8 h-8 text-teal" />
          <span className="font-serif text-2xl text-white">ServeSphere</span>
        </Link>

        {/* Centre quote */}
        <div className="relative z-10">
          <p className="font-serif text-4xl text-white leading-snug mb-6">
            Where service<br />
            finds its{' '}
            <span className="italic" style={{ color: '#5DCAA5' }}>sphere.</span>
          </p>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Connecting NGOs, volunteers, and donors through trust, transparency, and real-world impact.
          </p>

          {/* Role pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {ROLES.map(({ label, Icon, bg, color }) => (
              <div key={label} className={`flex items-center gap-2 ${bg} px-4 py-2 rounded-full`}>
                <Icon className={`w-4 h-4 ${color}`} />
                <span className={`text-xs font-semibold ${color}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stat */}
        <p className="text-white/30 text-xs relative z-10">
          12,400+ volunteers · 340+ NGOs · 17 SDGs
        </p>
      </div>

      {/* ── Right panel — form ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Globe className="w-7 h-7 text-teal" />
            <span className="font-serif text-xl text-teal">ServeSphere</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-serif text-3xl text-ink mb-1">Welcome back.</h1>
            <p className="text-muted text-sm mb-8">Sign in to continue your impact journey.</p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                  Sign in as
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropOpen(!dropOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors bg-white text-left ${
                      selected ? selected.border : 'border-gray-200 hover:border-teal/50'
                    }`}
                  >
                    {selected ? (
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${selected.bg} flex items-center justify-center`}>
                          <selected.Icon className={`w-4 h-4 ${selected.color}`} />
                        </div>
                        <span className="font-semibold text-ink">{selected.label}</span>
                      </div>
                    ) : (
                      <span className="text-muted">Choose your role...</span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-muted transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20"
                      >
                        {ROLES.map(({ id, label, Icon, color, bg, border }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => { setRole(id); setDropOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-sand transition-colors text-left ${role === id ? 'bg-sand' : ''}`}
                          >
                            <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                              <Icon className={`w-4 h-4 ${color}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-ink text-sm">{label}</p>
                              <p className="text-muted text-xs">
                                {id === 'volunteer' && 'Find NGOs, earn certificates, build your profile'}
                                {id === 'donor' && 'Track donations, see real impact, give with confidence'}
                                {id === 'ngo' && 'Post needs, manage volunteers, build trust'}
                              </p>
                            </div>
                            {role === id && <div className="ml-auto w-2 h-2 rounded-full bg-teal" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">Password</label>
                  <button type="button" className="text-xs text-teal hover:underline font-medium">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal focus:border-teal outline-none text-sm transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role warning */}
              <AnimatePresence>
                {!selected && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Please select your role above to continue.
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  selected
                    ? 'bg-teal text-white hover:bg-teal-dark shadow-lg shadow-teal/20'
                    : 'bg-gray-100 text-muted cursor-not-allowed'
                }`}
              >
                Sign In
                {selected && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-muted">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Join Now section */}
            <div className="bg-warm rounded-2xl p-5 border border-gray-100">
              <p className="text-sm font-semibold text-ink mb-4">New to ServeSphere? Join as:</p>
              <div className="space-y-2">
                {ROLES.map(({ id, label, Icon, color, bg, dashboard }) => (
                  <button
                    key={id}
                    onClick={() => navigate(dashboard)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 hover:border-teal/40 hover:shadow-sm transition-all text-left group"
                  >
                    <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <span className="font-semibold text-ink text-sm flex-grow">{label}</span>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-teal transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-muted mt-6">
              By signing in you agree to our{' '}
              <Link to="/" className="text-teal hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/" className="text-teal hover:underline">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
