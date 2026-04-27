import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseAuth } from '../../lib/firebase';

export default function NGOStep1() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const credentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(credentials.user, { displayName: orgName });

      sessionStorage.setItem('ngoSignupDraft', JSON.stringify({ orgName, email }));
      navigate('/signup/ngo/step2');
    } catch (_submitError) {
      setError('Unable to create account. Use a different email or check Firebase config.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center flex-col items-center mb-6">
        <div className="flex gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-teal"></div>
          <div className="w-2 h-2 rounded-full border border-gray-300"></div>
        </div>
        <p className="text-sm font-medium text-teal mb-1">Step 1 of 2</p>
        <h2 className="text-3xl font-serif text-ink text-center">Create your NGO account</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Organization Name</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all"
              placeholder="Hope Foundation"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all"
              placeholder="ngo@example.org"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="pt-4 space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-teal text-white font-medium hover:bg-teal-dark transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Next'}
          </button>
          <div className="text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/signin" className="text-teal font-medium hover:underline">Sign In</Link>
          </div>
        </div>
      </form>
    </>
  );
}
