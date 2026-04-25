'use client'

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    let reqId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if(cursor) {
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if(ring) {
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      reqId = requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactiveEls = document.querySelectorAll('button, a, .feature-card, .role-card');
    const handleMouseEnter = () => {
      if(cursor) { cursor.style.width = '18px'; cursor.style.height = '18px'; }
      if(ring) { ring.style.width = '52px'; ring.style.height = '52px'; }
    };
    const handleMouseLeave = () => {
      if(cursor) { cursor.style.width = '10px'; cursor.style.height = '10px'; }
      if(ring) { ring.style.width = '36px'; ring.style.height = '36px'; }
    };

    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    const handleScroll = () => {
      const nav = document.getElementById('nav');
      if (nav) {
        if (window.scrollY > 40) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(reqId);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      reveals.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700;900&display=swap');

        :root {
          --ink: #0f172a;
          --paper: #f8fafc;
          --cyan: #0891b2;
          --warm: #d97706;
          --muted: #64748b;
          --card-bg: #ffffff;
          --border: rgba(15,23,42,0.08);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          background: var(--paper) !important;
          color: var(--ink) !important;
          font-family: 'Outfit', sans-serif !important;
          overflow-x: hidden;
          cursor: none;
        }

        /* CUSTOM CURSOR */
        .cursor {
          width: 10px; height: 10px;
          background: var(--cyan);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: transform 0.1s, width 0.3s, height 0.3s, background 0.3s;
          mix-blend-mode: difference;
        }
        .cursor-ring {
          width: 36px; height: 36px;
          border: 1px solid rgba(0,212,200,0.5);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: transform 0.18s ease, width 0.3s, height 0.3s;
        }

        /* NAV */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 20px 60px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s, background 0.3s;
        }
        nav.scrolled {
          background: rgba(248,250,252,0.92);
          backdrop-filter: blur(20px);
          border-color: var(--border);
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 36px; height: 36px;
          background: var(--cyan);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-logo-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: var(--ink);
          letter-spacing: -0.3px;
        }
        .nav-links {
          display: flex; align-items: center; gap: 36px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links a {
          color: rgba(15,23,42,0.55);
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--ink); }
        .nav-cta {
          background: var(--cyan) !important;
          color: var(--ink) !important;
          padding: 10px 22px;
          border-radius: 50px;
          font-weight: 600 !important;
          font-size: 14px !important;
          transition: background 0.2s, transform 0.2s !important;
          text-decoration: none;
          display: inline-block;
        }
        .nav-cta:hover { background: #00f0e2 !important; transform: scale(1.04); }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 140px 60px 80px;
          position: relative;
          overflow: hidden;
        }

        .hero-bg-grid {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(8,145,178,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(8,145,178,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at 60% 40%, black 30%, transparent 70%);
        }

        .hero-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(8,145,178,0.10) 0%, transparent 70%);
          top: -100px; right: -100px;
          pointer-events: none;
        }
        .hero-glow-2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 70%);
          bottom: 0; left: 200px;
          pointer-events: none;
        }

        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(0,212,200,0.1);
          border: 1px solid rgba(0,212,200,0.25);
          border-radius: 50px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 500;
          color: var(--cyan);
          letter-spacing: 1px;
          text-transform: uppercase;
          width: fit-content;
          margin-bottom: 32px;
          position: relative; z-index: 1;
          animation: fadeUp 0.8s ease both;
        }
        .hero-tag-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--cyan);
          animation: blink 1.5s ease-in-out infinite;
        }

        .hero-headline {
          position: relative; z-index: 1;
          font-family: 'Instrument Serif', serif;
          font-size: clamp(56px, 8vw, 96px);
          line-height: 1.0;
          letter-spacing: -2px;
          max-width: 820px;
          animation: fadeUp 0.8s 0.1s ease both;
          margin: 0 0 28px 0;
        }
        .hero-headline em {
          font-style: italic;
          color: var(--cyan);
        }
        .hero-headline .warm { color: var(--warm); font-style: normal; }

        .hero-sub {
          position: relative; z-index: 1;
          font-size: 18px;
          line-height: 1.7;
          color: rgba(15,23,42,0.55);
          max-width: 480px;
          margin-top: 0;
          font-weight: 300;
          animation: fadeUp 0.8s 0.2s ease both;
        }

        .hero-actions {
          display: flex; align-items: center; gap: 16px;
          margin-top: 44px;
          position: relative; z-index: 1;
          animation: fadeUp 0.8s 0.3s ease both;
        }
        .btn-primary {
          background: var(--cyan);
          color: var(--ink);
          border: none;
          border-radius: 50px;
          padding: 16px 36px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.2px;
          transition: all 0.25s;
          display: flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { background: #00f0e2; transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,212,200,0.25); }
        .btn-secondary {
          background: transparent;
          color: var(--ink);
          border: 1px solid rgba(15,23,42,0.2);
          border-radius: 50px;
          padding: 16px 36px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s;
          display: flex; align-items: center; gap: 8px;
        }
        .btn-secondary:hover { border-color: rgba(15,23,42,0.5); background: rgba(15,23,42,0.05); }

        .hero-stats {
          display: flex; align-items: center; gap: 48px;
          margin-top: 64px;
          position: relative; z-index: 1;
          padding-top: 40px;
          border-top: 1px solid var(--border);
          animation: fadeUp 0.8s 0.4s ease both;
        }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 36px;
          letter-spacing: -1px;
          color: var(--ink);
          line-height: 1;
        }
        .stat-num span { color: var(--cyan); }
        .stat-desc { font-size: 13px; color: rgba(15,23,42,0.45); font-weight: 400; }
        .stat-divider { width: 1px; height: 40px; background: var(--border); }

        /* MARQUEE */
        .marquee-section {
          padding: 24px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          overflow: hidden;
          background: rgba(15,23,42,0.03);
        }
        .marquee-track {
          display: flex; gap: 0;
          animation: marquee 28s linear infinite;
          width: max-content;
        }
        .marquee-item {
          display: flex; align-items: center; gap: 16px;
          padding: 0 36px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(15,23,42,0.4);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .marquee-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--cyan); opacity: 0.6; }

        /* FEATURES */
        .features {
          padding: 120px 60px;
          position: relative;
        }
        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 20px;
        }
        .section-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(36px, 4vw, 52px);
          line-height: 1.1;
          letter-spacing: -1.5px;
          max-width: 560px;
          margin: 0;
        }
        .section-title em { font-style: italic; color: rgba(15,23,42,0.4); }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin-top: 64px;
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }
        .feature-card {
          background: var(--card-bg);
          padding: 40px 36px;
          position: relative;
          transition: background 0.3s, box-shadow 0.3s;
          cursor: default;
        }
        .feature-card:hover { background: #f0f9ff; box-shadow: inset 0 0 0 1px rgba(8,145,178,0.1); }
        .feature-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 36px; right: 36px;
          height: 1px;
          background: var(--border);
        }
        .feature-card:nth-child(n+4)::after { display: none; }

        .feature-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          font-size: 22px;
        }
        .ic-cyan { background: rgba(0,212,200,0.12); }
        .ic-warm { background: rgba(240,160,80,0.12); }
        .ic-purple { background: rgba(160,120,255,0.12); }

        .feature-title {
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }
        .feature-desc {
          font-size: 14px;
          line-height: 1.65;
          color: rgba(15,23,42,0.5);
          font-weight: 400;
        }
        .feature-tag {
          display: inline-block;
          margin-top: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 50px;
          background: rgba(0,212,200,0.1);
          color: var(--cyan);
          border: 1px solid rgba(0,212,200,0.2);
        }
        .feature-tag.warm-tag {
          background: rgba(240,160,80,0.1);
          color: var(--warm);
          border-color: rgba(240,160,80,0.2);
        }
        .feature-tag.purple-tag {
          background: rgba(160,120,255,0.1);
          color: #a078ff;
          border-color: rgba(160,120,255,0.2);
        }

        /* ROLES SECTION */
        .roles {
          padding: 0 60px 120px;
        }
        .roles-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 48px;
        }
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .role-card {
          border-radius: 20px;
          padding: 40px 36px 36px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s;
          cursor: default;
        }
        .role-card:hover { transform: translateY(-6px); }

        .role-student { background: #f0fdfa; border: 1px solid rgba(8,145,178,0.18); }
        .role-mentor { background: #fffbeb; border: 1px solid rgba(217,119,6,0.18); }
        .role-admin { background: #faf5ff; border: 1px solid rgba(139,92,246,0.18); }

        .role-accent {
          position: absolute;
          top: -40px; right: -40px;
          width: 140px; height: 140px;
          border-radius: 50%;
          opacity: 0.12;
        }
        .student-accent { background: var(--cyan); }
        .mentor-accent { background: var(--warm); }
        .admin-accent { background: #a078ff; }

        .role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .rb-student { background: rgba(0,212,200,0.15); color: var(--cyan); }
        .rb-mentor { background: rgba(240,160,80,0.15); color: var(--warm); }
        .rb-admin { background: rgba(160,120,255,0.15); color: #a078ff; }

        .role-title {
          font-family: 'Instrument Serif', serif;
          font-size: 28px;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }
        .role-features {
          list-style: none;
          display: flex; flex-direction: column; gap: 10px;
          margin: 0; padding: 0;
        }
        .role-features li {
          font-size: 13px;
          color: rgba(15,23,42,0.55);
          font-weight: 400;
          display: flex; align-items: center; gap: 10px;
          line-height: 1.4;
        }
        .role-features li::before {
          content: '';
          width: 4px; height: 4px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
          opacity: 0.6;
        }
        .role-features .student-li { color: rgba(8,145,178,0.85); }
        .role-features .mentor-li { color: rgba(217,119,6,0.85); }
        .role-features .admin-li { color: rgba(139,92,246,0.85); }

        /* CTA BANNER */
        .cta-banner {
          margin: 0 60px 120px;
          background: var(--cyan);
          border-radius: 24px;
          padding: 72px 80px;
          display: flex; align-items: center; justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .cta-banner::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
        }
        .cta-banner::after {
          content: '';
          position: absolute;
          bottom: -80px; left: 40%;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(0,0,0,0.06);
        }
        .cta-banner-text { position: relative; z-index: 1; }
        .cta-banner-title {
          font-family: 'Instrument Serif', serif;
          font-size: 44px;
          color: var(--ink);
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .cta-banner-sub {
          font-size: 15px;
          color: rgba(10,10,15,0.6);
          font-weight: 400;
        }
        .cta-banner-actions {
          display: flex; gap: 12px; flex-shrink: 0;
          position: relative; z-index: 1;
        }
        .btn-dark {
          background: var(--ink);
          color: var(--paper);
          border: none;
          border-radius: 50px;
          padding: 16px 32px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-dark:hover { background: #1a1a2e; transform: translateY(-2px); }
        .btn-ghost-dark {
          background: transparent;
          color: var(--ink);
          border: 1.5px solid rgba(10,10,15,0.3);
          border-radius: 50px;
          padding: 16px 32px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost-dark:hover { border-color: var(--ink); background: rgba(10,10,15,0.06); }

        /* FOOTER */
        footer {
          padding: 48px 60px;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-logo { font-family: 'Instrument Serif', serif; font-size: 20px; letter-spacing: -0.5px; color: var(--ink); }
        .footer-links { display: flex; gap: 28px; }
        .footer-links a { font-size: 13px; color: rgba(15,23,42,0.4); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--ink); }
        .footer-copy { font-size: 12px; color: rgba(15,23,42,0.3); }

        /* ANIMATIONS */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.3; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* SVG icons */
        .icon-svg { width: 24px; height: 24px; }
      `}} />

      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* NAV */}
      <nav id="nav">
        <Link href="#" className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 7v6l7 5 7-5V7L10 2z" fill="#0a0a0f"/>
              <path d="M10 7v8M3 7l7 4 7-4" stroke="#0a0a0f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="nav-logo-text">LearnWave</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="#features">Features</Link></li>
          <li><Link href="#roles">For You</Link></li>
          <li><Link href="#">Pricing</Link></li>
          <li><Link href="#">Docs</Link></li>
          <li><Link href="/auth/login" className="nav-cta">Get Started Free</Link></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-grid"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow-2"></div>

        <div className="hero-tag">
          <span className="hero-tag-dot"></span>
          AI-Powered Platform — Now Live
        </div>

        <h1 className="hero-headline">
          Learn smarter.<br/>
          Teach <em>better.</em><br/>
          <span className="warm">Grow together.</span>
        </h1>

        <p className="hero-sub">
          LearnWave brings students, mentors, and admins onto one intelligent platform — with AI tutoring, voice navigation, and real-time collaboration built in.
        </p>

        <div className="hero-actions">
          <Link href="/auth/login">
            <button className="btn-primary">
              <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Start Learning Free
            </button>
          </Link>
          <button className="btn-secondary">
            <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none"/>
            </svg>
            Watch Demo
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">12<span>,478</span></div>
            <div className="stat-desc">Active students</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-num">1<span>.2K</span></div>
            <div className="stat-desc">Courses available</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-num">4.9<span>★</span></div>
            <div className="stat-desc">Average rating</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-num">98<span>%</span></div>
            <div className="stat-desc">Completion rate</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track" id="marquee">
          <div className="marquee-item"><span className="marquee-dot"></span>AI Tutoring</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Voice Navigation</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Live Collaboration</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Smart Analytics</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Mentor Matching</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Quiz Engine</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Placement Prep</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Discussion Forum</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Revenue Tracking</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Role-Based Access</div>
          <div className="marquee-item"><span className="marquee-dot"></span>AI Tutoring</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Voice Navigation</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Live Collaboration</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Smart Analytics</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Mentor Matching</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Quiz Engine</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Placement Prep</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Discussion Forum</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Revenue Tracking</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Role-Based Access</div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="features reveal" id="features">
        <div className="section-label">What&apos;s inside</div>
        <h2 className="section-title">Everything you need, <em>nothing you don&apos;t</em></h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon ic-cyan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4c8" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div className="feature-title">AI Study Assistant</div>
            <div className="feature-desc">Powered by Google Gemini. Ask anything — from calculus proofs to career advice — and get instant, context-aware academic help.</div>
            <span className="feature-tag">Gemini AI</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon ic-warm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f0a050" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="feature-title">Mentor Marketplace</div>
            <div className="feature-desc">Browse expert mentors, book 1-on-1 sessions, track earnings, and build real student-mentor relationships that last.</div>
            <span className="feature-tag warm-tag">1-on-1 Sessions</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon ic-purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a078ff" strokeWidth="2" strokeLinecap="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3z"/>
              </svg>
            </div>
            <div className="feature-title">Voice Navigation</div>
            <div className="feature-desc">Hands-free control across the entire platform. Say &quot;open quiz&quot; or &quot;find mentor&quot; — the platform listens and responds instantly.</div>
            <span className="feature-tag purple-tag">Web Speech API</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon ic-cyan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4c8" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <div className="feature-title">Admin Dashboard</div>
            <div className="feature-desc">Real-time analytics, user management, mentor approvals, announcement system — full platform control in a single view.</div>
            <span className="feature-tag">Full Control</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon ic-warm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f0a050" strokeWidth="2" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="feature-title">Quiz & Assessment</div>
            <div className="feature-desc">Drag-and-drop quiz builder, auto-grading, performance analytics per student. Make learning measurable and fun.</div>
            <span className="feature-tag warm-tag">Auto-graded</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon ic-purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a078ff" strokeWidth="2" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="feature-title">Placement Center</div>
            <div className="feature-desc">Career opportunities, resume tools, and company connections — all integrated. Take students from classroom to career.</div>
            <span className="feature-tag purple-tag">Career Ready</span>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="roles reveal" id="roles">
        <div className="roles-header">
          <div>
            <div className="section-label">Built for everyone</div>
            <h2 className="section-title">Your role, <em>your platform</em></h2>
          </div>
        </div>

        <div className="roles-grid">
          <div className="role-card role-student">
            <div className="role-accent student-accent"></div>
            <div className="role-badge rb-student">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Student
            </div>
            <div className="role-title">Learn your way</div>
            <ul className="role-features">
              <li className="student-li">AI-powered study assistant</li>
              <li className="student-li">Personalized timetable</li>
              <li className="student-li">Find & book mentors</li>
              <li className="student-li">Quizzes & performance tracking</li>
              <li className="student-li">Placement preparation</li>
              <li className="student-li">Discussion forums</li>
            </ul>
          </div>

          <div className="role-card role-mentor">
            <div className="role-accent mentor-accent"></div>
            <div className="role-badge rb-mentor">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Mentor
            </div>
            <div className="role-title">Teach & earn</div>
            <ul className="role-features">
              <li className="mentor-li">Manage student relationships</li>
              <li className="mentor-li">Session scheduling tools</li>
              <li className="mentor-li">Revenue analytics dashboard</li>
              <li className="mentor-li">Share learning resources</li>
              <li className="mentor-li">Professional profile page</li>
              <li className="mentor-li">Direct student messaging</li>
            </ul>
          </div>

          <div className="role-card role-admin">
            <div className="role-accent admin-accent"></div>
            <div className="role-badge rb-admin">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 0 0 19.07 4.93z"/></svg>
              Admin
            </div>
            <div className="role-title">Run the platform</div>
            <ul className="role-features">
              <li className="admin-li">Real-time platform analytics</li>
              <li className="admin-li">Full user management</li>
              <li className="admin-li">Mentor approval workflow</li>
              <li className="admin-li">Announcement broadcasting</li>
              <li className="admin-li">Revenue tracking</li>
              <li className="admin-li">Advanced insights & reports</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="cta-banner reveal">
        <div className="cta-banner-text">
          <div className="cta-banner-title">Ready to ride the wave?</div>
          <div className="cta-banner-sub">Join 12,000+ learners already on LearnWave. Free to start.</div>
        </div>
        <div className="cta-banner-actions">
          <Link href="/auth/register"><button className="btn-dark">Create Free Account</button></Link>
          <button className="btn-ghost-dark">Talk to Sales</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">LearnWave</div>
        <div className="footer-links">
          <Link href="#">Features</Link>
          <Link href="#">Pricing</Link>
          <Link href="#">Docs</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Contact</Link>
        </div>
        <div className="footer-copy">© 2025 LearnWave. All rights reserved.</div>
      </footer>
    </>
  )
}
