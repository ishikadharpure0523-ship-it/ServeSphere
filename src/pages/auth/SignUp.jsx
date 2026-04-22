import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Mail, Lock, Eye, EyeOff, User, ChevronDown, Users, Heart, Building, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { id: 'volunteer', label: 'Volunteer',  Icon: Users,    color: 'text-amber-dark', bg: 'bg-amber-light',  border: 'border-amber',   dashboard: '/dashboard/volunteer' },
  { id: 'donor',     label: 'Donor',      Icon: Heart,    color: 'text-coral',      bg: 'bg-coral-light',  border: 'border-coral',   dashboard: '/dashboard/donor' },
  { id: 'ngo',       label: 'NGO',        Icon: Building, color: 'text-teal',       bg: 'bg-teal-light',   border: 'border-teal',    dashboard: '/dashboard/ngo' },
];

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState(null);
  const [dropOpen, setDropOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const selected = ROLES.find(r => r.id === role);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!selected) {
      newErrors.role = 'Please select your role';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      if (!selected) setDropOpen(true);
      return;
    }
    
    // Mock registration - in real app, this would call an API
    const userData = {
      email: formData.email,
      name: formData.name,
    };
    
    login(userData, selected.id);
    navigate(selected.dashboard);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    if (strength <= 2) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 66, label: 'Medium', color: 'bg-amber' };
    return { strength: 100, label: 'Strong', color: 'bg-teal' };
  };

  const passwordStrength = getPasswordStrength();

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
            Start your<br />
            impact{' '}
            <span className="italic" style={{ color: '#5DCAA5' }}>journey.</span>
          </p>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            Join thousands of volunteers, donors, and NGOs creating real change across India.
          </p>

          {/* Benefits */}
          <div className="space-y-3 mt-8">
            {[
              'Verified NGOs and opportunities',
              'Track your impact in real-time',
              'Earn certificates and badges',
              'Connect with like-minded people',
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-teal shrink-0" />
                <span className="text-white/80 text-sm">{benefit}</span>
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
            <h1 className="font-serif text-3xl text-ink mb-1">Create Account</h1>
            <p className="text-muted text-sm mb-8">Join ServeSphere and start making an impact today.</p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                  Join as
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropOpen(!dropOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors bg-white text-left ${
                      selected ? selected.border : errors.role ? 'border-red-500' : 'border-gray-200 hover:border-teal/50'
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
                        {ROLES.map(({ id, label, Icon, color, bg }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => { setRole(id); setDropOpen(false); setErrors(prev => ({ ...prev, role: '' })); }}
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
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-teal focus:border-teal outline-none text-sm transition-all`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-teal focus:border-teal outline-none text-sm transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-teal focus:border-teal outline-none text-sm transition-all`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted">Password strength:</span>
                      <span className={`font-semibold ${
                        passwordStrength.label === 'Weak' ? 'text-red-500' :
                        passwordStrength.label === 'Medium' ? 'text-amber' : 'text-teal'
                      }`}>{passwordStrength.label}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-teal focus:border-teal outline-none text-sm transition-all`}
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => { setAgreedToTerms(e.target.checked); setErrors(prev => ({ ...prev, terms: '' })); }}
                    className="mt-1 w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
                  />
                  <span className="text-xs text-muted leading-relaxed">
                    I agree to the{' '}
                    <Link to="/" className="text-teal hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/" className="text-teal hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-all shadow-lg shadow-teal/20 flex items-center justify-center gap-2"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Sign in link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted">
                Already have an account?{' '}
                <Link to="/signin" className="text-teal font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
