import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveProfile } from '../../lib/api';
import { firebaseAuth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

export default function NGOStep2() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [focusAreas, setFocusAreas] = useState([]);
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const focusOptions = ['Education', 'Healthcare', 'Environment', 'Women Empowerment', 'Food Security', 'Disaster Relief'];

  const toggleFocus = (focus) => {
    if (focusAreas.includes(focus)) {
      setFocusAreas(focusAreas.filter((item) => item !== focus));
      return;
    }

    setFocusAreas([...focusAreas, focus]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        setError('Session expired. Please complete Step 1 again.');
        navigate('/signup/ngo/step1');
        return;
      }

      const draft = JSON.parse(sessionStorage.getItem('ngoSignupDraft') || '{}');
      const token = await currentUser.getIdToken();

      await saveProfile({
        token,
        role: 'ngo',
        orgName: draft.orgName || currentUser.displayName || '',
        registrationNumber,
        focusAreas,
        city,
        about,
      });

      login(
        {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: draft.orgName || currentUser.displayName || '',
        },
        'ngo'
      );

      sessionStorage.removeItem('ngoSignupDraft');
      navigate('/dashboard/ngo');
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
          <div className="w-2 h-2 rounded-full bg-teal"></div>
          <div className="w-2 h-2 rounded-full bg-teal"></div>
        </div>
        <p className="text-sm font-medium text-teal mb-1">Step 2 of 2</p>
        <h2 className="text-3xl font-serif text-ink text-center">Tell us about your NGO</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Registration Number</label>
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all"
            placeholder="NGO/12345"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-2">Focus Areas</label>
          <div className="flex flex-wrap gap-2">
            {focusOptions.map((focus) => (
              <button
                key={focus}
                type="button"
                onClick={() => toggleFocus(focus)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  focusAreas.includes(focus)
                    ? 'bg-teal text-white border-teal'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-teal'
                }`}
              >
                {focus}
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
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all"
            placeholder="Pune"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">About Organization</label>
          <textarea
            rows="4"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all resize-none"
            placeholder="Short overview of mission, programs, and communities served"
          ></textarea>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="pt-4 flex items-center justify-between">
          <Link to="/signup/ngo/step1" className="text-gray-500 hover:text-ink text-sm font-medium">Back</Link>
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-8 rounded-xl bg-teal text-white font-medium hover:bg-teal-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create NGO Account'}
          </button>
        </div>
      </form>
    </>
  );
}
