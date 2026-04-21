import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Search, FileCheck, Star, ArrowRight, CheckCircle, Trophy, Zap, Heart, Users } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

/* ─── Mock Volunteer Profile Card ────────────────────────────── */
function VolunteerProfileCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-amber flex items-center justify-center text-ink font-bold text-xl">
          AK
        </div>
        <div>
          <p className="font-serif text-lg text-ink">Arjun Kulkarni</p>
          <p className="text-muted text-sm">Pune, Maharashtra</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center gap-1 text-xs font-semibold text-amber bg-amber-light px-3 py-1 rounded-full">
          <Zap className="w-3 h-3" /> Level 3
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-teal bg-teal-light px-3 py-1 rounded-full">
          <Star className="w-3 h-3" /> Rising Star
        </span>
      </div>

      <p className="text-xs text-muted uppercase tracking-wider mb-3">Certificates Earned</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {['Education', 'Health', 'Environment'].map((cert) => (
          <div key={cert} className="bg-teal-light rounded-lg p-2 text-center">
            <FileCheck className="w-5 h-5 text-teal mx-auto mb-1" />
            <p className="text-xs text-teal-dark font-medium">{cert}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted uppercase tracking-wider mb-2">Skills</p>
      <div className="flex flex-wrap gap-2">
        {['Teaching', 'First Aid', 'Logistics', 'Photography'].map((skill) => (
          <span key={skill} className="text-xs bg-warm text-ink-3 px-3 py-1 rounded-full border border-gray-200">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Mock Certificate ───────────────────────────────────────── */
function CertificatePreview() {
  return (
    <div className="bg-white rounded-2xl border-2 border-teal/30 p-8 max-w-md mx-auto shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal via-teal-mid to-teal-dark" />
      <div className="absolute bottom-0 right-0 opacity-5">
        <Award className="w-40 h-40 text-teal" />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center">
          <span className="text-white text-xs font-bold">SS</span>
        </div>
        <span className="font-serif text-teal text-lg">ServeSphere</span>
      </div>

      <p className="text-xs text-muted uppercase tracking-widest mb-2">Certificate of Contribution</p>
      <p className="font-serif text-2xl text-ink mb-1">Arjun Kulkarni</p>
      <p className="text-muted text-sm mb-4">has successfully completed</p>

      <div className="bg-teal-light rounded-xl p-4 mb-5">
        <p className="font-semibold text-teal-dark">Education Drive — Book Distribution</p>
        <p className="text-sm text-muted mt-1">Asha Foundation · Mumbai · 14 April 2026</p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Verified by</p>
          <p className="text-sm font-semibold text-ink">Asha Foundation</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Digital Signature</p>
          <p className="text-sm font-mono text-teal">SS-2026-AK-0847</p>
        </div>
      </div>
    </div>
  );
}

const badges = [
  { name: 'First Step', desc: 'Complete your first task', color: 'bg-teal-light text-teal-dark', Icon: CheckCircle },
  { name: 'Rising Star', desc: '5 tasks completed', color: 'bg-amber-light text-amber-dark', Icon: Star },
  { name: 'Impact Maker', desc: '20 tasks completed', color: 'bg-coral-light text-coral', Icon: Heart },
  { name: 'Community Hero', desc: '50 tasks completed', color: 'bg-teal text-white', Icon: Trophy },
  { name: 'Legend', desc: '100+ tasks completed', color: 'bg-ink text-white', Icon: Award },
  { name: 'Emergency Responder', desc: 'Responded to 3 alerts', color: 'bg-red-100 text-red-600', Icon: Zap },
];

const leaderboard = [
  { initials: 'PR', name: 'Priya Rajan', city: 'Mumbai', score: 98, badges: 12, color: 'bg-teal' },
  { initials: 'AK', name: 'Arjun Kulkarni', city: 'Pune', score: 94, badges: 9, color: 'bg-amber' },
  { initials: 'SM', name: 'Sneha Mishra', city: 'Delhi', score: 91, badges: 8, color: 'bg-coral' },
  { initials: 'RV', name: 'Rahul Verma', city: 'Bangalore', score: 88, badges: 7, color: 'bg-teal' },
  { initials: 'NK', name: 'Nisha Kapoor', city: 'Chennai', score: 85, badges: 6, color: 'bg-amber' },
];

export default function ForVolunteers() {
  return (
    <div className="font-sans text-ink">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-amber-light pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-dark bg-amber/20 px-4 py-2 rounded-full mb-6">
                For Volunteers
              </motion.span>
              <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-6">
                Do good.{' '}
                <span className="italic text-amber-dark">Get recognised.</span>
                <br />
                Build your impact profile.
              </motion.h1>
              <motion.p variants={fadeUp} className="text-muted text-lg leading-relaxed mb-8 max-w-lg">
                Your hours matter. Your work matters. ServeSphere makes sure the world knows it — with verified certificates, a trust score, and a profile that speaks for itself.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  to="/dashboard/volunteer"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-amber text-ink font-semibold hover:bg-amber-dark hover:text-white transition-colors shadow-lg shadow-amber/20"
                >
                  Start volunteering <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <VolunteerProfileCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW TO GET STARTED ───────────────────────────────────── */}
      <section className="bg-sand py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="font-serif text-4xl text-ink mb-4">
                Three steps to{' '}
                <span className="italic text-amber-dark">your first certificate.</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px border-t-2 border-dashed border-amber/40" />
              {[
                { num: '01', title: 'Sign up', desc: 'Create your profile in 2 minutes. Add your skills, location, and availability.' },
                { num: '02', title: 'Search NGOs', desc: 'Filter by cause, location, time commitment, or certificate availability.' },
                { num: '03', title: 'Apply & contribute', desc: 'Complete tasks, get verified by the NGO, and earn your certificate automatically.' },
              ].map(({ num, title, desc }) => (
                <motion.div key={num} variants={fadeUp} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-amber flex items-center justify-center text-ink font-serif text-2xl mb-6 shadow-lg shadow-amber/20 relative z-10">
                    {num}
                  </div>
                  <h3 className="font-serif text-xl text-ink mb-3">{title}</h3>
                  <p className="text-muted leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES LIST ────────────────────────────────────────── */}
      <section className="bg-warm py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="font-serif text-4xl text-ink mb-4">
                Built for volunteers who{' '}
                <span className="italic text-teal">mean it.</span>
              </h2>
            </motion.div>

            <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
              {[
                { Icon: Search, title: 'Smart NGO Search', desc: 'Filter by location, cause, time commitment, and whether a certificate is offered.' },
                { Icon: FileCheck, title: 'Auto-Generated Certificates', desc: 'Every completed and verified task generates a tamper-proof digital certificate instantly.' },
                { Icon: Award, title: 'Milestone Badges', desc: 'Unlock badges as you grow — from First Step to Community Hero to Legend.' },
                { Icon: Star, title: 'Personal Trust Score', desc: 'Your score is visible to NGOs — making it easier to get selected for competitive tasks.' },
                { Icon: Users, title: 'Team Volunteering', desc: 'Bring your college group or corporate team. Volunteer together, earn together.' },
                { Icon: Trophy, title: 'Leaderboard Recognition', desc: 'Top volunteers get featured on the platform — inspiring others and building your reputation.' },
              ].map(({ Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-light flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-dark" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink mb-1">{title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CERTIFICATE PREVIEW ──────────────────────────────────── */}
      <section className="bg-teal-light py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-10">
              <h2 className="font-serif text-4xl text-ink mb-4">
                Every task earns you a{' '}
                <span className="italic text-teal">verified certificate.</span>
              </h2>
              <p className="text-muted max-w-lg mx-auto">
                Tamper-proof, digitally signed, and shareable. Add it to your LinkedIn, resume, or portfolio.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <CertificatePreview />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── BADGES ───────────────────────────────────────────────── */}
      <section className="bg-sand py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="font-serif text-4xl text-ink mb-4">
                Earn badges.{' '}
                <span className="italic text-teal">Build your story.</span>
              </h2>
              <p className="text-muted max-w-lg mx-auto">
                Every milestone unlocks a badge. Every badge tells a story.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map(({ name, desc, color, Icon }) => (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-4 hover:shadow-sm transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{name}</p>
                    <p className="text-muted text-xs mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── LEADERBOARD ──────────────────────────────────────────── */}
      <section className="bg-ink py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-10">
              <h2 className="font-serif text-4xl text-white mb-4">
                Top volunteers this month.
              </h2>
              <p className="text-muted">Real people. Real hours. Real impact.</p>
            </motion.div>

            <motion.div variants={stagger} className="space-y-3">
              {leaderboard.map(({ initials, name, city, score, badges: badgeCount, color }, i) => (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  className="flex items-center gap-4 bg-ink-2 rounded-xl p-4 border border-ink-3"
                >
                  <span className="text-muted font-mono text-sm w-6 text-center">{i + 1}</span>
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {initials}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-white text-sm">{name}</p>
                    <p className="text-muted text-xs">{city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-teal font-bold">{score}</p>
                    <p className="text-muted text-xs">{badgeCount} badges</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="bg-amber py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl text-ink mb-4">
              Your impact deserves a record.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-ink/70 mb-8">
              Join 12,400+ volunteers already building their verified impact profiles on ServeSphere.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                to="/dashboard/volunteer"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-ink text-white font-bold hover:bg-ink-2 transition-colors shadow-lg"
              >
                Create your profile — it's free <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

