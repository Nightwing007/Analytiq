
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { THEME_CONFIG } from '../config.js';
import {
  BarChart3, Shield, Zap, Eye, TrendingUp, Globe, ArrowRight, Star,
  CheckCircle, MousePointer2, Lock, Smartphone, Activity
} from 'lucide-react';
import NavLogo from '../assets/NavLogo.png';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility for Classes ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Components ---

/**
 * Spotlight Effect Component
 * Creates a radial gradient that follows the mouse
 */
const Spotlight = ({ children, className = "" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "group relative border border-white/10 bg-gray-900/50 overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 212, 255, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
};

/**
 * Animated Gradient Text
 */
const GradientText = ({ children, className }) => {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x",
        className
      )}
    >
      {children}
    </span>
  );
};

/**
 * 3D Tilt Card
 */
const TiltCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragElastic={0.16}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      whileTap={{ cursor: "grabbing" }}
      className="relative z-10 h-full"
    >
      <Spotlight className="h-full rounded-2xl p-8 backdrop-blur-xl bg-black/40 border-white/10 flex flex-col items-start gap-4">
        <div className="p-3 rounded-lg bg-blue-500/10 text-cyan-400 ring-1 ring-cyan-400/50">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-white font-orbitron">{title}</h3>
        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
      </Spotlight>
    </motion.div>
  );
};

/**
 * Matrix/Grid Background Animation
 */
const GridBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>
      <div className="absolute right-0 bottom-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-600 opacity-20 blur-[100px]"></div>
    </div>
  );
};

/**
 * Navbar Component
 */
const Navbar = () => {
  return (
    <motion.nav
      className="fixed top-0 inset-x-0 z-50 h-20 bg-[#121218] border-b border-white/10 transition-all duration-300 flex items-center"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={NavLogo}
            alt="Analytiq"
            className="h-10 w-auto"
          />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/manage"
            className="flex items-center justify-center px-10 py-2 rounded-lg bg-transparent border border-cyan-500 hover:bg-cyan-500/10 text-cyan-500 font-medium text-sm tracking-wide transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] hover:-translate-y-0.5"
          >
            Try Analytiq
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

const LANDING_DATA = {
  stats: [
    { value: "99.9%", label: "Uptime Guaranteed" },
    { value: "<50ms", label: "Latency Global" },
    { value: "100%", label: "Privacy First" }
  ],
  features: [
    {
      icon: BarChart3,
      title: "Real-time Intelligence",
      description: "Watch your traffic evolve in real-time. Live visitor counts, active pages, and instant event tracking without delay."
    },
    {
      icon: Shield,
      title: "Privacy Fortress",
      description: "GDPR, CCPA, and PECR compliant by default. No cookies required. We respect your users' data sovereignty."
    },
    {
      icon: Zap,
      title: "Lightweight Script",
      description: "Our tracking script is less than 2kb. It loads asynchronously and never slows down your website performance."
    },
    {
      icon: Globe,
      title: "Global Edge Network",
      description: "Data collection points distributed worldwide ensure low latency and high availability for all your visitors."
    },
    {
      icon: Activity,
      title: "User Journeys",
      description: "Visualize how users navigate through your site. Identify bottlenecks and optimize conversion funnels effectively."
    },
    {
      icon: Smartphone,
      title: "Device Fingerprinting",
      description: "Advanced device recognition without collecting PII. Understand your audience's tech stack accurately."
    }
  ]
};

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { scrollYProgress } = useScroll();

  // Inject fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleGetStarted = () => navigate(isAuthenticated ? '/manage' : '/auth');

  // Parallax Text
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white selection:bg-cyan-500/30 overflow-x-hidden font-inter">
      <Navbar />

      {/* Background Elements */}
      <GridBackground />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[110vh] flex flex-col justify-center items-center pt-20 overflow-hidden">
        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="container px-4 mx-auto relative z-10 text-center">
          <motion.div
            style={{ y: yText, opacity: opacityHero }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md"
            >
              <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase font-orbitron">
                Next Gen Analytics
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-orbitron tracking-tight leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 mb-8">
              DATA <br className="hidden md:block" />
              <span className="text-stroke-cyan-thin relative">
                WITHOUT
                <motion.svg
                  className="absolute w-full h-[15%] -bottom-2 left-0 text-cyan-500"
                  viewBox="0 0 100 10"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 1.5 }}
                >
                  <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="2" />
                </motion.svg>
              </span>
              <br className="hidden md:block" />
              DOUBT
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 font-light leading-relaxed">
              Unlock the power of <span className="text-cyan-400 font-medium">privacy-centric insights</span>.
              Real-time data visualization that respects your users and empowers your business decisions.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-20 relative z-20 -mt-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LANDING_DATA.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-8 rounded-2xl bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/5 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <h3 className="text-4xl md:text-5xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-3 group-hover:from-cyan-400 group-hover:to-cyan-200 transition-all duration-500">
                    {stat.value}
                  </h3>
                  <div className="h-0.5 w-12 bg-white/10 mb-3 group-hover:bg-cyan-500/50 transition-colors" />
                  <p className="text-gray-400 uppercase tracking-[0.2em] text-xs font-semibold group-hover:text-cyan-400/80 transition-colors">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="mb-20">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold font-orbitron mb-6"
            >
              INTELLIGENCE <span className="text-cyan-500">EVOLVED</span>
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 200 }}
              viewport={{ once: true }}
              className="h-1 bg-gradient-to-r from-cyan-500 to-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LANDING_DATA.features.map((feature, idx) => (
              <div key={idx} className="h-[300px]">
                <TiltCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={idx * 0.1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BIG CTA --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-[#0A0A0F] to-[#0A0A0F]" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto border border-cyan-500/30 bg-[#0A0A0F]/80 backdrop-blur-xl rounded-3xl p-12 md:p-20 shadow-[0_0_100px_-20px_rgba(6,182,212,0.2)]"
          >
            <h2 className="text-4xl md:text-6xl font-bold font-orbitron mb-8">
              READY TO <span className="text-cyan-400">ASCEND?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of data-driven companies that have switched to Analytiq for superior insights without the privacy trade-offs.
            </p>

            <button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-cyan-600 font-orbitron rounded-xl hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 ring-offset-[#0A0A0F]"
            >
              <span className="mr-2">LAUNCH DASHBOARD</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 -z-10 rounded-xl blur-lg bg-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/10 bg-[#060609]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={NavLogo} alt="Logo" className="h-8 opacity-80" />
              <span className="text-gray-500 font-orbitron text-sm">© 2025 Analytiq Systems</span>
            </div>

            <div className="flex gap-8 text-sm text-gray-400">
              <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact Support</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .text-stroke-cyan-thin {
          -webkit-text-stroke: 1px #22d3ee;
          color: transparent;
        }
        .shimmer-text {
          background: linear-gradient(to right, #fff 20%, #22d3ee 30%, #22d3ee 70%, #fff 80%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-fill-color: transparent;
          background-size: 500% auto;
          animation: textShimmer 5s ease-in-out infinite alternate;
        }
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
