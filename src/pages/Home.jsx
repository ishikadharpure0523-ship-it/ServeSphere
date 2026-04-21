import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  ChevronDown, ChevronLeft, ChevronRight,
  Users, Globe, Building, Heart, Star, CheckCircle,
} from 'lucide-react';

/* ─── Animation Variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

/* ─── Animated Counter ───────────────────────────────────────── */
function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString('en-IN') + suffix);
  useEffect(() => {
    if (inView) animate(count, to, { duration: 2, ease: 'easeOut' });
  }, [inView, to, count]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

/* ─── Slide Data ─────────────────────────────────────────────── */
const slides = [
  {
    id: 0,
    img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&auto=format&fit=crop&q=80',
    badge: '🌍 Built for grassroots India',
    line1: 'Where service',
    line2: 'finds its',
    italic: 'sphere.',
    sub: 'Connecting NGOs, volunteers, and donors through trust, transparency, and real-world impact.',
    ctas: [
      { label: "I'm an NGO",      href: '/dashboard/ngo',       cls: 'bg-teal text-white hover:bg-teal-dark' },
      { label: "I'm a Volunteer", href: '/dashboard/volunteer', cls: 'bg-amber text-ink hover:bg-amber-dark hover:text-white' },
      { label: "I'm a Donor",     href: '/dashboard/donor',     cls: 'border-2 border-white text-white hover:bg-white/10' },
    ],
  },
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80',
    badge: null,
    line1: 'Your mission deserves',
    line2: '',
    italic: 'real support.',
    sub: 'Register your NGO and connect with verified volunteers, trusted donors, and a platform built for your reality.',
    ctas: [
      { label: 'Register your NGO', href: '/dashboard/ngo', cls: 'bg-teal text-white hover:bg-teal-dark' },
      { label: 'Learn More',        href: '/for-ngos',         cls: 'border-2 border-white text-white hover:bg-white/10' },
    ],
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1600&auto=format&fit=crop&q=80',
    badge: null,
    line1: 'Your \u20b9500 built',
    line2: '',
    italic: 'a classroom.',
    sub: 'Every rupee tracked. Every impact verified. Donate with full transparency.',
    ctas: [
      { label: 'Start Donating',   href: '/dashboard/donor', cls: 'bg-coral text-white hover:opacity-90' },
      { label: 'See How It Works', href: '/for-donors',         cls: 'border-2 border-white text-white hover:bg-white/10' },
    ],
  },
];

const trustBadges = [
  { icon: '✓',  label: '12,400+ Volunteers', delay: 0 },
  { icon: '🏅', label: '340+ Verified NGOs', delay: 0.35 },
  { icon: '🌍', label: '17 SDGs',            delay: 0.7 },
];

/* ─── How It Works Role Tab Content ─────────────────────────── */
const roleContent = {
  NGO: {
    title: 'For NGOs',
    items: [
      'Post volunteer requirements & fund requests',
      'Upload transparency docs & photos',
      'Build your trust score with every update',
      'Map projects to 17 SDGs for donor visibility',
    ],
  },
  Volunteer: {
    title: 'For Volunteers',
    items: [
      'Search NGOs by location, cause & time',
      'Apply and contribute to real projects',
      'Earn auto-generated verified certificates',
      'Build your impact profile & trust score',
    ],
  },
  Donor: {
    title: 'For Donors',
    items: [
      'Browse verified NGOs only',
      'Choose specific fund requests to support',
      'Track every rupee with photo & bill proof',
      'See your SDG impact score grow',
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [current, setCurrent] = useState(0);
  const [activeRole, setActiveRole] = useState('NGO');
  const timerRef = useRef(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = slides[current];

  return (
    <div className="font-sans text-ink">

      {/* ══ SECTION 1 — HERO SLIDER ══════════════════════════════ */}
      <section className="relative h-screen overflow-hidden">

        {/* Crossfade backgrounds */}
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <img src={slide.img} alt="" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/75" />
          </motion.div>
        </AnimatePresence>

        {/* Slide content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="flex flex-col items-center max-w-5xl mx-auto w-full"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              variants={stagger}
            >
              {slide.badge && (
                <motion.div
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-8 border border-white/20"
                >
                  {slide.badge}
                </motion.div>
              )}

              <motion.h1
                variants={fadeUp}
                className="font-serif text-6xl md:text-8xl text-white leading-[1.05] mb-6"
              >
                {slide.line1}
                <br />
                {slide.line2 && <>{slide.line2}{' '}</>}
                <span className="italic" style={{ color: '#5DCAA5' }}>{slide.italic}</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-white/70 text-lg md:text-xl font-light max-w-2xl mb-10 leading-relaxed"
              >
                {slide.sub}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                {slide.ctas.map(({ label, href, cls }) => (
                  <Link key={label} to={href} className={`px-8 py-3 rounded-full font-semibold transition-colors shadow-lg ${cls}`}>
                    {label}
                  </Link>
                ))}
              </motion.div>

              {/* Trust badges — all slides */}
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
                {trustBadges.map(({ icon, label, delay }) => (
                  <motion.div
                    key={label}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium border border-white/20"
                  >
                    <span>{icon}</span><span>{label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Arrow buttons */}
        <button
          onClick={() => { prev(); resetTimer(); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => { next(); resetTimer(); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); resetTimer(); }}
              aria-label={`Slide ${i + 1}`}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: i === current ? '2rem' : '0.5rem',
                backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ══ SECTION 2 — PROBLEM ══════════════════════════════════ */}
      <section className="bg-ink py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif text-white mb-2">
              The system is broken.
            </motion.h2>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif italic mb-6" style={{ color: '#5DCAA5' }}>
              We fixed it.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted max-w-xl mx-auto text-lg">
              NGOs, volunteers, and donors operate in silos. Nobody wins.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {[
              { role: 'For NGOs',       stat: '73% of NGOs',       desc: "Can't find reliable volunteers or prove fund usage to donors due to fragmented tracking.", Icon: Building },
              { role: 'For Volunteers', stat: 'No recognition',    desc: 'Zero verified proof of contributions despite years of service and thousands of hours given.', Icon: Users },
              { role: 'For Donors',     stat: '\u20b90 accountability', desc: 'Donate and never know where the money actually went. No photos. No bills. No trail.', Icon: Heart },
            ].map(({ role, stat, desc, Icon }) => (
              <motion.div
                key={role}
                variants={fadeUp}
                className="bg-ink-2 p-8 rounded-2xl border-l-[3px] border-[#E24B4A] relative overflow-hidden hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Icon className="w-28 h-28 text-white" />
                </div>
                <Icon className="w-7 h-7 text-[#E24B4A] mb-4" />
                <p className="text-xs font-semibold uppercase tracking-widest text-[#E24B4A] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E24B4A] inline-block" />
                  {role}
                </p>
                <p className="text-3xl font-serif text-white mb-3">{stat}</p>
                <p className="text-white/60 leading-relaxed text-sm">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ SECTION 3 — HOW IT WORKS ═════════════════════════════ */}
      <section className="bg-sand py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif text-ink mb-4">
              One platform.{' '}
              <span className="italic text-teal">Three roles.</span>{' '}
              Infinite impact.
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-16 relative"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px border-t-2 border-dashed border-teal/40 z-0" />
            {[
              { num: '01', title: 'Sign up & choose your role',   desc: 'NGO, Volunteer, or Donor — pick your path in under 2 minutes.' },
              { num: '02', title: 'Connect, contribute, or fund', desc: 'Post needs, apply to tasks, or browse verified NGOs to support.' },
              { num: '03', title: 'Track impact, earn trust, grow', desc: 'Certificates, trust scores, fund trails — every action leaves a mark.' },
            ].map(({ num, title, desc }) => (
              <motion.div key={num} variants={fadeUp} className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-full bg-teal flex items-center justify-center text-white font-serif text-2xl mb-6 shadow-lg shadow-teal/20">
                  {num}
                </div>
                <h3 className="font-serif text-xl text-ink mb-3">{title}</h3>
                <p className="text-muted leading-relaxed text-sm">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Role Switcher */}
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center gap-2 mb-8">
              {Object.keys(roleContent).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                    activeRole === role
                      ? role === 'NGO'        ? 'bg-teal text-white shadow-md'
                      : role === 'Volunteer'  ? 'bg-amber text-ink shadow-md'
                                             : 'bg-coral text-white shadow-md'
                      : 'bg-white text-muted hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h3 className="font-serif text-2xl text-ink mb-5">{roleContent[activeRole].title}</h3>
              <ul className="space-y-3">
                {roleContent[activeRole].items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted text-sm">
                    <CheckCircle className="w-5 h-5 text-teal mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — IMPACT STATS ═════════════════════════════ */}
      <section className="bg-teal py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {[
              { to: 12400, suffix: '+', label: 'Volunteers Registered' },
              { to: 340,   suffix: '+', label: 'NGOs on Platform' },
              { display: '\u20b928L+',  label: '\u20b9 Funds Tracked' },
              { to: 17,    suffix: '',  label: 'SDGs Addressed' },
            ].map(({ to, suffix, label, display }) => (
              <motion.div key={label} variants={fadeUp}>
                <p className="font-serif text-4xl md:text-5xl text-white mb-2">
                  {display ? display : <Counter to={to} suffix={suffix} />}
                </p>
                <p className="text-white/70 text-sm font-medium uppercase tracking-wider">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ SECTION 5 — TESTIMONIALS ═════════════════════════════ */}
      <section className="bg-warm py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif text-ink mb-4">
              Real people.{' '}
              <span className="italic text-teal">Real impact.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {[
              {
                initials: 'PR', name: 'Priya Rajan', role: 'NGO Coordinator, Mumbai',
                quote: 'Before ServeSphere, we spent weeks finding volunteers. Now we post a need and get responses within hours. The trust score changed how donors see us.',
                avatarBg: 'bg-teal', tag: 'NGO', tagCls: 'bg-teal-light text-teal-dark',
              },
              {
                initials: 'AK', name: 'Arjun Kulkarni', role: 'Student Volunteer, Pune',
                quote: 'I volunteered for two years with no proof to show. ServeSphere gave me a verified certificate for every task. My profile now speaks for itself.',
                avatarBg: 'bg-amber', tag: 'Volunteer', tagCls: 'bg-amber-light text-amber-dark',
              },
              {
                initials: 'SM', name: 'Sunita Mehta', role: 'Individual Donor, Bangalore',
                quote: "I donated \u20b95,000 and got photos of the books purchased, the classroom built, and a thank-you from the kids. That's accountability I never expected.",
                avatarBg: 'bg-coral', tag: 'Donor', tagCls: 'bg-coral-light text-coral',
              },
            ].map(({ initials, name, role, quote, avatarBg, tag, tagCls }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-full ${avatarBg} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{name}</p>
                    <p className="text-muted text-sm">{role}</p>
                  </div>
                </div>
                <span className={`self-start text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${tagCls} mb-5`}>
                  {tag}
                </span>
                <p className="font-serif italic text-ink-3 leading-relaxed flex-grow text-sm">"{quote}"</p>
                <div className="flex gap-1 mt-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber fill-amber" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ SECTION 6 — CTA BANNER ═══════════════════════════════ */}
      <section className="bg-ink py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(29,158,117,0.18),transparent_65%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-serif text-white mb-14">
              The cause needs you.
            </motion.h2>

            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              {[
                { Icon: Building, label: 'NGO',       desc: 'Post needs, verify impact, and build trust.',  btn: 'Join as NGO',       href: '/dashboard/ngo',       btnCls: 'bg-teal text-white hover:bg-teal-dark',                  border: 'hover:border-teal/50' },
                { Icon: Users,    label: 'Volunteer', desc: 'Find tasks, earn certificates, and help out.', btn: 'Join as Volunteer', href: '/dashboard/volunteer', btnCls: 'bg-amber text-ink hover:bg-amber-dark hover:text-white', border: 'hover:border-amber/50' },
                { Icon: Heart,    label: 'Donor',     desc: 'Track your impact, transparently.',            btn: 'Join as Donor',     href: '/dashboard/donor',     btnCls: 'bg-coral text-white hover:opacity-90',                   border: 'hover:border-coral/50' },
              ].map(({ Icon, label, desc, btn, href, btnCls, border }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className={`bg-ink-2 p-8 rounded-2xl border border-ink-3 ${border} transition-colors`}
                >
                  <Icon className="w-12 h-12 text-teal mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
                  <p className="text-gray-400 mb-6 text-sm">{desc}</p>
                  <Link to={href} className={`block w-full py-3 rounded-xl font-semibold transition-colors ${btnCls}`}>
                    {btn}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.p variants={fadeUp} className="text-white/40 text-sm">
              Free to join. No software budget needed. Built for India.
            </motion.p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}


