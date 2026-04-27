import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveProfile } from '../../lib/api';
import { firebaseAuth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

export default function DonorStep2() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [donationType, setDonationType] = useState('One-time');
  const [budgetRange, setBudgetRange] = useState('INR 1,000 - 5,000');
  const [causes, setCauses] = useState([]);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const causeOptions = ['Education', 'Healthcare', 'Women Empowerment', 'Child Welfare', 'Disaster Relief', 'Animal Welfare'];

  const toggleCause = (cause) => {
    if (causes.includes(cause)) {
      setCauses(causes.filter((item) => item !== cause));
      return;
    }

    setCauses([...causes, cause]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        setError('Session expired. Please complete Step 1 again.');
        navigate('/signup/donor/step1');
        return;
      }

      const draft = JSON.parse(sessionStorage.getItem('donorSignupDraft') || '{}');
      const token = await currentUser.getIdToken();

      await saveProfile({
        token,
        role: 'donor',
        fullName: draft.fullName || currentUser.displayName || '',
        donationType,
        budgetRange,
        causes,
        city,
      });

      login(
        {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: draft.fullName || currentUser.displayName || '',
        },
        'donor'
      );

      sessionStorage.removeItem('donorSignupDraft');
      navigate('/dashboard/donor');
    } catch (_submitError) {
      setError('Unable to complete signup. Check backend and Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center flex-col items-center mb-6">
        <div className="flex gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-coral"></div>
          <div className="w-2 h-2 rounded-full bg-coral"></div>
        </div>
        <p className="text-sm font-medium text-coral mb-1">Step 2 of 2</p>
        <h2 className="text-3xl font-serif text-ink text-center">Set your giving profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Donation Type</label>
          <select
            value={donationType}
            onChange={(e) => setDonationType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-coral focus:border-coral outline-none transition-all bg-white"
          >
            <option>One-time</option>
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>As-needed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Typical Budget</label>
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-coral focus:border-coral outline-none transition-all bg-white"
          >
            <option>INR 1,000 - 5,000</option>
            <option>INR 5,000 - 20,000</option>
            <option>INR 20,000 - 50,000</option>
            <option>INR 50,000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-2">Causes you support</label>
          <div className="flex flex-wrap gap-2">
            {causeOptions.map((cause) => (
              <button
                key={cause}
                type="button"
                onClick={() => toggleCause(cause)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  causes.includes(cause)
                    ? 'bg-coral text-white border-coral'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-coral'
                }`}
              >
                {cause}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-coral focus:border-coral outline-none transition-all"
            placeholder="Mumbai"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="pt-4 flex items-center justify-between">
          <Link to="/signup/donor/step1" className="text-gray-500 hover:text-ink text-sm font-medium">Back</Link>
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-8 rounded-xl bg-coral text-white font-medium hover:opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Donor Account'}
          </button>
        </div>
      </form>
    </>
  );
}
