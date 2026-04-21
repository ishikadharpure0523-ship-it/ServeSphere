import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, GitBranch, Link2, Hash, Camera, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink text-sand border-t-4 border-teal pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <Globe className="w-8 h-8 text-teal" />
              <span className="font-serif text-3xl text-white">ServeSphere</span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-6 leading-relaxed text-sm">
              Where service meets sphere — connecting NGOs, volunteers, and donors through trust, transparency, and real-world impact.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: GitBranch, label: 'GitHub' },
                { Icon: Link2,     label: 'LinkedIn' },
                { Icon: Hash,      label: 'Twitter' },
                { Icon: Camera,    label: 'Instagram' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-ink-2 flex items-center justify-center text-gray-400 hover:text-teal hover:bg-ink-3 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-serif text-lg mb-5 text-white">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about"        className="text-gray-400 hover:text-teal transition-colors">About Us</Link></li>
              <li><Link to="/"             className="text-gray-400 hover:text-teal transition-colors">How It Works</Link></li>
              <li><Link to="/"             className="text-gray-400 hover:text-teal transition-colors">Trust &amp; Safety</Link></li>
              <li><Link to="/"             className="text-gray-400 hover:text-teal transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* For NGOs */}
          <div>
            <h4 className="font-serif text-lg mb-5 text-white">For NGOs</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/for-ngos"          className="text-gray-400 hover:text-teal transition-colors">Overview</Link></li>
              <li><Link to="/dashboard/ngo"  className="text-gray-400 hover:text-teal transition-colors">Register NGO</Link></li>
              <li><Link to="/"                  className="text-gray-400 hover:text-teal transition-colors">Resource Center</Link></li>
              <li><Link to="/"                  className="text-gray-400 hover:text-teal transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* For Volunteers + Resources */}
          <div>
            <h4 className="font-serif text-lg mb-5 text-white">For Volunteers</h4>
            <ul className="space-y-3 text-sm mb-8">
              <li><Link to="/for-volunteers"          className="text-gray-400 hover:text-amber transition-colors">Overview</Link></li>
              <li><Link to="/dashboard/volunteer"  className="text-gray-400 hover:text-amber transition-colors">Join as Volunteer</Link></li>
              <li><Link to="/for-donors"              className="text-gray-400 hover:text-coral transition-colors">For Donors</Link></li>
            </ul>
            <h4 className="font-serif text-lg mb-5 text-white">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-ink-3 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-400 flex items-center gap-2 text-sm">
            Built for impact. Built for India.
            <Heart className="w-4 h-4 text-coral fill-coral" />
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>&copy; {new Date().getFullYear()} ServeSphere</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
