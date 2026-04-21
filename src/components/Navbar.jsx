import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, Menu, X, Heart, Users, Building, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'For NGOs',       href: '/for-ngos' },
    { label: 'For Volunteers', href: '/for-volunteers' },
    { label: 'For Donors',     href: '/for-donors' },
    { label: 'About',          href: '/about' },
  ];

  const isActive = (href) => location.pathname === href;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/10 backdrop-blur-md border-b border-white/20 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Globe className={`w-8 h-8 transition-transform group-hover:rotate-12 ${scrolled ? 'text-teal' : 'text-white'}`} />
            <span className={`font-serif text-2xl transition-colors ${scrolled ? 'text-teal' : 'text-white'}`}>ServeSphere</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className={`relative font-medium transition-colors group ${
                  isActive(href)
                    ? 'text-teal'
                    : scrolled
                    ? 'text-ink-2 hover:text-teal'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {label}
                {/* Active underline indicator */}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-teal rounded-full transition-all duration-300 ${
                  isActive(href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/signin" className={`px-5 py-2 rounded-full border font-medium transition-colors ${scrolled ? 'border-teal text-teal hover:bg-teal-light' : 'border-white text-white hover:bg-white/10'}`}>
              Sign In
            </Link>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-6 py-2 rounded-full bg-teal text-white hover:bg-teal-dark transition-colors font-medium"
              >
                Join Now
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border-l-4 border-teal overflow-hidden"
                  >
                    <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                      <span className="text-xs font-semibold text-muted uppercase tracking-wider pl-2">Join as...</span>
                    </div>
                    <div className="flex flex-col py-1">
                      <button 
                        onClick={() => { setDropdownOpen(false); navigate('/dashboard/volunteer'); }}
                        className="flex items-center justify-between px-4 py-3 hover:bg-teal-light/50 transition-colors group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-amber" />
                          <span className="font-medium text-ink">Volunteer</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber transition-colors" />
                      </button>
                      <button 
                        onClick={() => { setDropdownOpen(false); navigate('/dashboard/donor'); }}
                        className="flex items-center justify-between px-4 py-3 hover:bg-teal-light/50 transition-colors group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-coral" />
                          <span className="font-medium text-ink">Donor</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-coral transition-colors" />
                      </button>
                      <button 
                        onClick={() => { setDropdownOpen(false); navigate('/dashboard/ngo'); }}
                        className="flex items-center justify-between px-4 py-3 hover:bg-teal-light/50 transition-colors group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-teal" />
                          <span className="font-medium text-ink">NGO</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-teal transition-colors" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className={`md:hidden p-2 ${scrolled ? 'text-ink' : 'text-white'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer — full screen slide-down */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden fixed inset-0 z-40 bg-ink flex flex-col"
          >
            {/* Close button */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-ink-3">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Globe className="w-7 h-7 text-teal" />
                <span className="font-serif text-2xl text-teal">ServeSphere</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col px-6 py-8 gap-6 flex-grow">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-serif transition-colors flex items-center gap-3 ${
                    isActive(href) ? 'text-teal' : 'text-white hover:text-teal'
                  }`}
                >
                  {isActive(href) && <span className="w-1.5 h-6 bg-teal rounded-full shrink-0" />}
                  {label}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="px-6 pb-10 flex flex-col gap-3">
              <div className="h-px bg-ink-3 mb-2" />
              <Link
                to="/signin"
                className="w-full py-4 rounded-2xl border border-teal text-teal font-semibold text-center text-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/dashboard/volunteer'); }}
                className="w-full py-4 rounded-2xl bg-amber text-ink font-semibold text-lg"
              >
                Join as Volunteer
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/dashboard/donor'); }}
                  className="py-4 rounded-2xl bg-coral text-white font-semibold"
                >
                  Donor
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/dashboard/ngo'); }}
                  className="py-4 rounded-2xl bg-teal text-white font-semibold"
                >
                  NGO
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

