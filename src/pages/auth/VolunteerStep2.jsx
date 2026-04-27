import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, X } from 'lucide-react';
import { firebaseAuth } from '../../lib/firebase';
import { saveProfile } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function VolunteerStep2() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [causes, setCauses] = useState([]);
  const [qualifications, setQualifications] = useState('');
  const [experience, setExperience] = useState('No prior experience');
  const [city, setCity] = useState('');
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedSkills = ['Medical', 'Teaching', 'Logistics', 'Coding', 'Design', 'Legal', 'Cooking', 'Driving'];
  const availableCauses = ['Education', 'Healthcare', 'Environment', 'Women Empowerment', 'Child Welfare', 'Food Security', 'Disaster Relief', 'Animal Welfare'];

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const parsedSkill = skillInput.trim();
      if (parsedSkill && !skills.includes(parsedSkill)) {
        setSkills([...skills, parsedSkill]);
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const toggleCause = (cause) => {
    if (causes.includes(cause)) {
      setCauses(causes.filter((item) => item !== cause));
      return;
    }

    setCauses([...causes, cause]);
  };

  const toggleAvailability = (slot) => {
    if (availability.includes(slot)) {
      setAvailability(availability.filter((item) => item !== slot));
      return;
    }

    setAvailability([...availability, slot]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        setError('Session expired. Please complete Step 1 again.');
        navigate('/signup/volunteer/step1');
        return;
      }

      const draft = JSON.parse(sessionStorage.getItem('volunteerSignupDraft') || '{}');
      const token = await currentUser.getIdToken();

      await saveProfile({
        token,
        role: 'volunteer',
        fullName: draft.fullName || currentUser.displayName || '',
        skills,
        qualifications,
        experience,
        city,
        availability,
        causes,
      });

      login(
        {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: draft.fullName || currentUser.displayName || '',
        },
        'volunteer'
      );

      sessionStorage.removeItem('volunteerSignupDraft');
      navigate('/dashboard/volunteer');
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
        <h2 className="text-3xl font-serif text-ink text-center">Tell us about yourself</h2>
        <p className="text-muted text-sm mt-2 text-center">This helps NGOs find the right match for you</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-teal-light text-teal-dark rounded-full text-sm font-semibold">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-ink">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all"
            placeholder="Type a skill and press Enter"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {suggestedSkills.map((skill) => (
              <button
                type="button"
                key={skill}
                onClick={() => {
                  if (!skills.includes(skill)) {
                    setSkills([...skills, skill]);
                  }
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded"
              >
                +{skill}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Qualifications</label>
          <textarea
            rows="3"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all resize-none"
            placeholder="e.g. B.Tech Computer Science, First Aid Certified, NCC Cadet..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-2 mb-1">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all bg-white"
            >
              <option>No prior experience</option>
              <option>Less than 1 year</option>
              <option>1-3 years</option>
              <option>3-5 years</option>
              <option>5+ years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-2 mb-1">City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all"
                placeholder="Pune"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-2">Availability</label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-teal w-4 h-4"
                checked={availability.includes('Weekday mornings')}
                onChange={() => toggleAvailability('Weekday mornings')}
              />
              Weekday mornings
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-teal w-4 h-4"
                checked={availability.includes('Weekday evenings')}
                onChange={() => toggleAvailability('Weekday evenings')}
              />
              Weekday evenings
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-teal w-4 h-4"
                checked={availability.includes('Weekends')}
                onChange={() => toggleAvailability('Weekends')}
              />
              Weekends
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-teal w-4 h-4"
                checked={availability.includes('Full-time (short term)')}
                onChange={() => toggleAvailability('Full-time (short term)')}
              />
              Full-time (short term)
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-2">Causes you care about</label>
          <div className="flex flex-wrap gap-2">
            {availableCauses.map((cause) => (
              <button
                key={cause}
                type="button"
                onClick={() => toggleCause(cause)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  causes.includes(cause)
                    ? 'bg-teal text-white border-teal'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-teal'
                }`}
              >
                {cause}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="pt-4 flex items-center justify-between">
          <Link to="/signup/volunteer/step1" className="text-gray-500 hover:text-ink text-sm font-medium">Back</Link>
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-8 rounded-xl bg-teal text-white font-medium hover:bg-teal-dark transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create My Account'}
          </button>
        </div>
      </form>
    </>
  );
}
