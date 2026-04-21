import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, Target, ShieldCheck, Users, Globe, Zap } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const values = [
  {
    Icon: ShieldCheck,
    title: 'Transparency',
    desc: 'Every rupee tracked. Every task verified. Every claim backed by proof. No exceptions.',
    color: 'bg-teal-light',
    iconColor: 'text-teal',
  },
  {
    Icon: Heart,
    title: 'Trust',
    desc: "Trust scores for NGOs and volunteers. Verified badges. Manual reviews. We earn trust, we don't assume it.",
    color: 'bg-coral-light',
    iconColor: 'text-coral',
  },
  {
    Icon: Zap,
    title: 'Recognition',
    desc: 'Volunteers get certificates. NGOs get visibility. Donors get receipts. Everyone gets credit for what they do.',
    color: 'bg-amber-light',
    iconColor: 'text-amber-dark',
  },
  {
    Icon: Target,
    title: 'Impact',
    desc: 'We measure what matters — lives touched, funds tracked, hours contributed, and SDGs addressed.',
    color: 'bg-teal-light',
    iconColor: 'text-teal',
  },
];

const team = [
  { initials: 'RK', name: 'Rohan Kapoor', role: 'Co-Founder & CEO', bio: 'Ex-NGO coordinator who got tired of WhatsApp chaos.', color: 'bg-teal' },
  { initials: 'SM', name: 'Sneha Mehta', role: 'Co-Founder & CTO', bio: 'Built the tech that makes transparency automatic.', color: 'bg-amber' },
  { initials: 'AV', name: 'Arjun Verma', role: 'Head of Community', bio: 'Volunteer for 8 years. Now building tools for volunteers.', color: 'bg-coral' },
  { initials: 'PD', name: 'Priya Desai', role: 'Head of Trust & Safety', bio: 'Ensures every NGO and volunteer is who they say they are.', color: 'bg-teal' },
];

export default function About() {
  return (
    <div className="font-sans text-ink">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-warm pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-6">
              Built by people who{' '}
              <span className="italic text-teal">believe in service.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
              ServeSphere was born from a simple question: why is it so hard for good people to find each other?
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── THE PROBLEM WE SAW ───────────────────────────────────── */}
      <section className="bg-sand py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl text-ink mb-8 text-center">
              The problem we saw.
            </motion.h2>

            <motion.div variants={fadeUp} className="space-y-6 text-muted text-lg leading-relaxed">
              <p>
                We spent years working with NGOs, volunteering on weekends, and donating to causes we believed in. And every single time, we hit the same wall: <span className="font-semibold text-ink">nobody could prove anything.</span>
              </p>
              <p>
                NGOs couldn't prove they were legitimate. Volunteers couldn't prove they'd contributed. Donors couldn't prove their money was used well. Everyone was operating on faith, WhatsApp forwards, and handwritten receipts that disappeared after a month.
              </p>
              <p>
                So we built ServeSphere — a platform where <span className="font-semibold text-ink">every claim is backed by proof</span>, every contribution is recorded, and every rupee has a trail. Not because we don't trust people. But because trust without transparency is just hope.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────────────── */}
      <section className="bg-warm py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl p-10 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-teal" />
              </div>
              <h3 className="font-serif text-3xl text-ink mb-4">Our Mission</h3>
              <p className="text-muted text-lg leading-relaxed">
                To eliminate friction between people who want to help and the communities that need it. No more lost volunteers. No more invisible NGOs. No more untracked donations.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl p-10 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-light flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-amber-dark" />
              </div>
              <h3 className="font-serif text-3xl text-ink mb-4">Our Vision</h3>
              <p className="text-muted text-lg leading-relaxed">
                A India where every NGO is visible, every volunteer is recognised, and every rupee is tracked. Where service isn't a leap of faith — it's a verified, celebrated, and measurable act.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CORE VALUES ──────────────────────────────────────────── */}
      <section className="bg-sand py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="font-serif text-4xl text-ink mb-4">
                What we{' '}
                <span className="italic text-teal">stand for.</span>
              </h2>
            </motion.div>

            <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ Icon, title, desc, color, iconColor }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <h3 className="font-serif text-xl text-ink mb-2">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── THE TEAM ─────────────────────────────────────────────── */}
      <section className="bg-warm py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="font-serif text-4xl text-ink mb-4">
                Meet the{' '}
                <span className="italic text-teal">team.</span>
              </h2>
              <p className="text-muted max-w-xl mx-auto">
                Four people who spent too many years watching good intentions get lost in bad systems.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="grid md:grid-cols-2 gap-6">
              {team.map(({ initials, name, role, bio, color }) => (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow flex items-start gap-5"
                >
                  <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-serif text-xl text-ink">{name}</p>
                    <p className="text-teal text-sm font-medium mb-2">{role}</p>
                    <p className="text-muted text-sm leading-relaxed">{bio}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── JOIN THE MOVEMENT CTA ────────────────────────────────── */}
      <section className="bg-teal py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-6xl text-white mb-14">
              This is just the beginning.
            </motion.h2>

            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { Icon: Users, label: 'NGO', desc: 'Post needs, verify impact, and build trust.', btn: 'Join as NGO', href: '/dashboard/ngo', btnClass: 'bg-white text-teal hover:bg-teal-light' },
                { Icon: Heart, label: 'Volunteer', desc: 'Find tasks, earn certificates, and help out.', btn: 'Join as Volunteer', href: '/dashboard/volunteer', btnClass: 'bg-amber text-ink hover:bg-amber-dark hover:text-white' },
                { Icon: Globe, label: 'Donor', desc: 'Track your impact, transparently.', btn: 'Join as Donor', href: '/dashboard/donor', btnClass: 'bg-coral text-white hover:opacity-90' },
              ].map(({ Icon, label, desc, btn, href, btnClass }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="bg-teal-dark p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-colors"
                >
                  <Icon className="w-12 h-12 text-white mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
                  <p className="text-white/60 mb-6 text-sm">{desc}</p>
                  <Link to={href} className={`block w-full py-3 rounded-xl font-semibold transition-colors ${btnClass}`}>
                    {btn}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

