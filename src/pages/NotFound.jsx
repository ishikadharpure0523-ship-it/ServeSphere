import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* 404 Illustration */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <svg
              className="w-64 h-64 mx-auto"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Circle background */}
              <circle cx="100" cy="100" r="80" fill="#E1F5EE" />
              
              {/* 404 Text */}
              <text
                x="100"
                y="120"
                fontSize="60"
                fontWeight="bold"
                fill="#1D9E75"
                textAnchor="middle"
                fontFamily="serif"
              >
                404
              </text>
              
              {/* Sad face */}
              <circle cx="75" cy="80" r="4" fill="#1D9E75" />
              <circle cx="125" cy="80" r="4" fill="#1D9E75" />
              <path
                d="M 70 140 Q 100 130 130 140"
                stroke="#1D9E75"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4">
            Page Not Found
          </h1>
          <p className="text-muted text-lg mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors shadow-lg shadow-teal/20"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          
          <Link
            to="/about"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-teal text-teal font-semibold hover:bg-teal-light transition-colors"
          >
            <Search className="w-5 h-5" />
            Learn About Us
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-muted mb-4">Or explore these pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/for-ngos" className="text-teal hover:underline">
              For NGOs
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/for-volunteers" className="text-teal hover:underline">
              For Volunteers
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/for-donors" className="text-teal hover:underline">
              For Donors
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/contact" className="text-teal hover:underline">
              Contact Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/blog" className="text-teal hover:underline">
              Blog
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
