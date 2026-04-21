import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Camera, Globe, ArrowRight, CheckCircle, DollarSign, Package } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

/* ─── Donation Trail Timeline ────────────────────────────────── */
function DonationTrail() {
  const steps = [
    { label: '₹500 donated', sub: 'by you, via ServeSphere', color: 'bg-teal', done: true },
    { label: 'NGO received funds', sub: 'Asha Foundation, Mumbai', color: 'bg-teal', done: true },
    { label: 'Books purchased', sub: '42 textbooks · ₹480 spent', color: 'bg-teal', done: true },
    { label: 'Photo uploaded', sub: 'NGO uploaded receipt + photo', color: 'bg-teal', done: true },
    { label: '✓ Impact verified', sub: 'Delivered to 38 students', color: 'bg-teal', done: true },
  ];

  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-teal/30" />

      <div className="space-y-6">
        {steps.map(({ label, sub, color, done }, i) => (
          <motion.div
            key={label}
            className="flex items-start gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center shrink-0 relative z-10 shadow-md`}>
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{label}</p>
              <p className="text-white/50 text-xs mt-0.5">{sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ForDonors() {
  return (
    <div className="font-sans text-ink">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-ink pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="inline-block text-xs font-semibold uppercase tracking-widest text-teal bg-teal/10 px-4 py-2 rounded-full mb-6">
                For Donors
              </motion.span>
              <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl text-white leading-tight mb-6">
                Your ₹500 built a classroom.{' '}
                <span className="italic" style={{ color: '#5DCAA5' }}>Here's the receipt.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
                Every rupee you donate has a trail. Photos, bills, reports — you see exactly where your money went and what it built.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  to="/dashboard/donor"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-teal text-white font-semibold hover:bg-teal-dark transition-colors shadow-lg shadow-teal/20"
                >
                  Start donating with transparency <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="bg-ink-2 rounded-2xl p-8 border border-ink-3">
                <p className="text-xs text-muted uppercase tracking-widest mb-6">Your donation trail</p>
                <DonationTrail />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY DONATE THROUGH SERVESPHERE ───────────────────────── */}
      <section className="bg-sand py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4">
                Why donate through{' '}
                <span className="italic text-teal">ServeSphere?</span>
              </h2>
              <p className="text-muted max-w-xl mx-auto">
                Because you deserve to know what your generosity actually built.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { Icon: ShieldCheck, title: 'Verified NGOs only', desc: 'Every NGO on ServeSphere is manually verified. No unregistered organisations. No exceptions.', color: 'bg-teal-light', iconColor: 'text-teal' },
                { Icon: TrendingUp, title: 'Real-time fund tracking', desc: 'Watch your donation move from your account to the NGO to the actual purchase — in real time.', color: 'bg-amber-light', iconColor: 'text-amber-dark' },
                { Icon: Camera, title: 'Photo & bill proof', desc: 'NGOs upload photos and bills for every fund request. You see the evidence before and after.', color: 'bg-coral-light', iconColor: 'text-coral' },
                { Icon: Globe, title: 'SDG impact score', desc: 'See which of the 17 UN Sustainable Development Goals your donation is contributing to.', color: 'bg-teal-light', iconColor: 'text-teal' },
              ].map(({ Icon, title, desc, color, iconColor }) => (
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

      {/* ── HOW DONATIONS WORK ───────────────────────────────────── */}
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
                Four steps.{' '}
                <span className="italic text-teal">Full transparency.</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-10 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px border-t-2 border-dashed border-teal/40" />
              {[
                { num: '01', title: 'Browse NGOs', desc: 'Filter by cause, location, SDG, or urgency.' },
                { num: '02', title: 'Choose a request', desc: 'Pick a specific fund request — books, food, medicine, or infrastructure.' },
                { num: '03', title: 'Donate', desc: 'Contribute any amount. Every rupee is tracked from the moment you give.' },
                { num: '04', title: 'Track usage', desc: 'Get notified when the NGO uploads proof of purchase and impact.' },
              ].map(({ num, title, desc }) => (
                <motion.div key={num} variants={fadeUp} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-teal flex items-center justify-center text-white font-serif text-2xl mb-5 shadow-lg shadow-teal/20 relative z-10">
                    {num}
                  </div>
                  <h3 className="font-serif text-lg text-ink mb-2">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── DONATION TYPES ───────────────────────────────────────── */}
      <section className="bg-sand py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="font-serif text-4xl text-ink mb-4">
                Two ways to{' '}
                <span className="italic text-teal">give.</span>
              </h2>
            </motion.div>

            <motion.div variants={stagger} className="grid md:grid-cols-2 gap-6">
              <motion.div
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center mb-5">
                  <DollarSign className="w-6 h-6 text-teal" />
                </div>
                <h3 className="font-serif text-2xl text-ink mb-3">Money Donations</h3>
                <p className="text-muted leading-relaxed mb-5">
                  Fund specific requests — urgent or general. Every rupee is tracked with bills and photos uploaded by the NGO.
                </p>
                <div className="space-y-2">
                  {['Urgent requests — time-sensitive needs', 'General requests — ongoing programmes', 'Full fund trail with receipts'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted">
                      <CheckCircle className="w-4 h-4 text-teal shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-light flex items-center justify-center mb-5">
                  <Package className="w-6 h-6 text-amber-dark" />
                </div>
                <h3 className="font-serif text-2xl text-ink mb-3">Physical Resources</h3>
                <p className="text-muted leading-relaxed mb-5">
                  Donate books, food, clothes, or equipment directly to NGOs that need them. Coordinate pickup or drop-off through the platform.
                </p>
                <div className="space-y-2">
                  {['Books & stationery', 'Food & groceries', 'Clothes & essentials', 'Equipment & tools'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted">
                      <CheckCircle className="w-4 h-4 text-amber-dark shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TRANSPARENCY PROMISE ─────────────────────────────────── */}
      <section className="bg-teal-dark py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-6">
              <ShieldCheck className="w-12 h-12 text-teal-mid mx-auto" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl text-white mb-6">
              Zero unverified NGOs.
              <br />
              Zero untracked funds.
              <br />
              <span className="italic" style={{ color: '#5DCAA5' }}>Every rupee has a trail.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 max-w-xl mx-auto text-lg leading-relaxed">
              We built ServeSphere because we were tired of donating into a black hole. Every feature on this platform exists to make sure that never happens to you.
            </motion.p>
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
              Give with confidence.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 mb-8">
              Join thousands of donors who know exactly where their money goes.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                to="/dashboard/donor"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-teal font-bold hover:bg-teal-light transition-colors shadow-lg"
              >
                Start donating — it's free <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

