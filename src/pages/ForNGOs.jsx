import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, DollarSign, Package, Bell, FileText, ShieldCheck,
  ArrowRight, CheckCircle, AlertTriangle, Globe
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

/* ─── Trust Score Ring ───────────────────────────────────────── */
function TrustRing({ score = 87 }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#E1F5EE" strokeWidth="10" />
        <motion.circle
          cx="64" cy="64" r={r}
          fill="none"
          stroke="#1D9E75"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: circ - dash }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center">
        <p className="font-serif text-2xl text-teal">{score}</p>
        <p className="text-xs text-muted">/100</p>
      </div>
    </div>
  );
}

/* ─── Mock NGO Dashboard Card ────────────────────────────────── */
function NGODashboardCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-serif text-lg text-ink">Asha Foundation</p>
          <p className="text-muted text-sm">Mumbai, Maharashtra</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-teal bg-teal-light px-3 py-1 rounded-full">
          <ShieldCheck className="w-3 h-3" /> Verified
        </span>
      </div>

      <div className="flex items-center gap-6 mb-5">
        <TrustRing score={87} />
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Trust Score</p>
          <p className="font-semibold text-ink">Excellent</p>
          <p className="text-xs text-muted mt-1">Top 12% of NGOs</p>
        </div>
      </div>

      <div className="space-y-2">
        {['Education Drive — 3 volunteers needed', 'Food Distribution — Urgent', 'Tree Plantation — 12 slots open'].map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-ink-3 bg-teal-light/40 rounded-lg px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-teal shrink-0" />
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

const features = [
  { Icon: Users, title: 'Post Volunteer Requirements', desc: 'Specify skills, time, location, and urgency. Reach verified volunteers instantly.' },
  { Icon: DollarSign, title: 'Post Fund Requests', desc: 'Create urgent or general fund requests with full context — donors can track every rupee.' },
  { Icon: Package, title: 'Post Resource Needs', desc: 'Request books, food, clothes, or equipment. Connect with donors who have what you need.' },
  { Icon: Bell, title: 'Emergency Alert System', desc: 'Notify nearby verified volunteers instantly when every second counts.' },
  { Icon: FileText, title: 'Upload Transparency Docs', desc: 'Share photos, bills, and reports. Build donor confidence with every upload.' },
  { Icon: ShieldCheck, title: 'Trust Score System', desc: 'Your score grows with every verified update — making you more visible to donors and volunteers.' },
];

const trustFactors = [
  { label: 'Registration Documents', value: 95 },
  { label: 'Past Work & Projects', value: 82 },
  { label: 'Financial Transparency', value: 78 },
  { label: 'Volunteer Reviews', value: 91 },
];

const sdgs = [
  { num: 1, label: 'No Poverty', color: '#E5243B' },
  { num: 2, label: 'Zero Hunger', color: '#DDA63A' },
  { num: 3, label: 'Good Health', color: '#4C9F38' },
  { num: 4, label: 'Quality Education', color: '#C5192D' },
  { num: 10, label: 'Reduced Inequalities', color: '#DD1367' },
  { num: 13, label: 'Climate Action', color: '#3F7E44' },
  { num: 17, label: 'Partnerships', color: '#19486A' },
];

export default function ForNGOs() {
  return (
    <div className="font-sans text-ink">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-teal-light pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="inline-block text-xs font-semibold uppercase tracking-widest text-teal bg-teal/10 px-4 py-2 rounded-full mb-6">
                For NGOs
              </motion.span>
              <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-6">
                Your mission deserves{' '}
                <span className="italic text-teal">real support.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-muted text-lg leading-relaxed mb-8 max-w-lg">
                Stop chasing volunteers on WhatsApp. Stop explaining your work to every new donor. ServeSphere gives your NGO a verified presence, a trust score, and a direct line to the people who want to help.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  to="/dashboard/ngo"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-teal text-white font-semibold hover:bg-teal-dark transition-colors shadow-lg shadow-teal/20"
                >
                  Register your NGO <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <NGODashboardCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────── */}
      <section className="bg-sand py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl text-ink mb-4">
              Everything your NGO needs.{' '}
              <span className="italic text-teal">In one place.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted max-w-xl mx-auto">
              From finding volunteers to proving impact — ServeSphere handles the infrastructure so you can focus on the mission.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {features.map(({ Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-light flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-teal" />
                </div>
                <h3 className="font-serif text-xl text-ink mb-2">{title}</h3>
                <p className="text-muted leading-relaxed text-sm">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRUST SCORE EXPLAINER ────────────────────────────────── */}
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
                How your{' '}
                <span className="italic text-teal">trust score</span>{' '}
                is built.
              </h2>
              <p className="text-muted max-w-lg mx-auto">
                Four factors. Fully transparent. The more you share, the more donors trust you.
              </p>
            </motion.div>

            <div className="space-y-5">
              {trustFactors.map(({ label, value }) => (
                <motion.div key={label} variants={fadeUp} className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-ink">{label}</span>
                    <span className="text-teal font-semibold">{value}%</span>
                  </div>
                  <div className="h-2 bg-teal-light rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-teal rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── EMERGENCY ALERT CTA ──────────────────────────────────── */}
      <section className="bg-ink py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-ink-2 rounded-2xl p-10 border-l-4 border-red-500 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <AlertTriangle className="w-40 h-40 text-red-400" />
            </div>
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-red-400" />
              <span className="text-red-400 font-semibold uppercase tracking-widest text-xs">Emergency Alert System</span>
            </motion.div>
            <motion.h3 variants={fadeUp} className="font-serif text-3xl text-white mb-4">
              When every second counts.
            </motion.h3>
            <motion.p variants={fadeUp} className="text-white/60 leading-relaxed max-w-xl mb-6">
              Trigger an emergency alert and reach every verified volunteer within 10 km — instantly. No phone calls. No WhatsApp chains. One tap, real response.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                to="/dashboard/ngo"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                Get Emergency Access <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SDG MAPPING ──────────────────────────────────────────── */}
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
                Map your work to the{' '}
                <span className="italic text-teal">17 SDGs.</span>
              </h2>
              <p className="text-muted max-w-lg mx-auto">
                Every project you post gets mapped to the UN Sustainable Development Goals — making your impact visible to donors who care about specific causes.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="flex flex-wrap justify-center gap-3">
              {sdgs.map(({ num, label, color }) => (
                <motion.div
                  key={num}
                  variants={fadeUp}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: color }}
                >
                  <span className="font-bold">SDG {num}</span>
                  <span className="opacity-80">{label}</span>
                </motion.div>
              ))}
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-muted text-sm font-medium"
              >
                + 10 more SDGs
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 bg-teal-light rounded-2xl p-6 text-center">
              <Globe className="w-8 h-8 text-teal mx-auto mb-3" />
              <p className="text-teal-dark font-medium">
                Donors can filter NGOs by SDG — your mapped projects appear in their search results automatically.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="bg-teal py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl text-white mb-4">
              Ready to grow your impact?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 mb-8">
              Join 340+ verified NGOs already using ServeSphere to find volunteers, track funds, and build trust.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                to="/dashboard/ngo"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-teal font-bold hover:bg-teal-light transition-colors shadow-lg"
              >
                Register your NGO — it's free <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

