import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate form submission
      console.log('Form submitted:', formData);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal via-teal-dark to-ink text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Get in Touch</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="space-y-8"
            >
              <div>
                <h2 className="font-serif text-3xl text-ink mb-4">Let's Connect</h2>
                <p className="text-muted leading-relaxed">
                  Whether you're an NGO looking to expand your reach, a volunteer ready to make a difference, 
                  or a donor wanting to create impact — we're here to help.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink mb-1">Email</h3>
                    <p className="text-muted">support@servesphere.org</p>
                    <p className="text-muted">partnerships@servesphere.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-light flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-amber-dark" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink mb-1">Phone</h3>
                    <p className="text-muted">+91 22 1234 5678</p>
                    <p className="text-muted text-sm">Mon-Fri, 9am-6pm IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-coral-light flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink mb-1">Office</h3>
                    <p className="text-muted">123 Impact Street</p>
                    <p className="text-muted">Mumbai, Maharashtra 400001</p>
                    <p className="text-muted">India</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-ink mb-3">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <a href="/about" className="block text-teal hover:underline">About ServeSphere</a>
                  <a href="/for-ngos" className="block text-teal hover:underline">For NGOs</a>
                  <a href="/for-volunteers" className="block text-teal hover:underline">For Volunteers</a>
                  <a href="/for-donors" className="block text-teal hover:underline">For Donors</a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-teal-light flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-teal" />
                  </div>
                  <h3 className="font-serif text-2xl text-ink mb-2">Message Sent!</h3>
                  <p className="text-muted">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-ink mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-ink mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-ink mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.subject ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all`}
                      placeholder="How can we help?"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-ink mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.message ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-teal focus:border-teal outline-none transition-all resize-none`}
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal/20"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>

                  <p className="text-xs text-muted text-center">
                    * Required fields
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
