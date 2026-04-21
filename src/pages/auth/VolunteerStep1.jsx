import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function VolunteerStep1() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/signup/volunteer/step2');
  };

  return (
    <>
      <div className="flex justify-center flex-col items-center mb-6">
        <div className="flex gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-teal"></div>
          <div className="w-2 h-2 rounded-full border border-gray-300"></div>
        </div>
        <p className="text-sm font-medium text-teal mb-1">Step 1 of 2</p>
        <h2 className="text-3xl font-serif text-ink text-center">Create your volunteer account</h2>
        <p className="text-muted text-sm mt-2">Start your journey of impact</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" required className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all" placeholder="John Doe" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" required className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all" placeholder="john@example.com" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type={showPass ? "text" : "password"} required className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all" placeholder="••••••••" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type={showPass ? "text" : "password"} required className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E0] focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all" placeholder="••••••••" />
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <button type="submit" className="w-full py-3 rounded-xl bg-teal text-white font-medium hover:bg-teal-dark transition-colors flex justify-center items-center gap-2">
            Next <span className="text-xl leading-none">→</span>
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
