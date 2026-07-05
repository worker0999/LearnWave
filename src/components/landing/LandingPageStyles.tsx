'use client'

import React from 'react'

export function LandingPageStyles() {
  return (
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

        @media (max-width: 768px), (pointer: coarse) {
          .cursor, .cursor-ring {
            display: none !important;
          }
          body {
            cursor: auto !important;
          }
        }

        @media (max-width: 768px) {
          nav {
            padding: 15px 20px !important;
          }
          .nav-links {
            display: flex !important;
            gap: 0 !important;
          }
          .nav-links li:not(:last-child) {
            display: none !important;
          }
          .nav-cta {
            padding: 8px 16px !important;
            font-size: 13px !important;
          }
          .hero {
            padding: 100px 20px 40px !important;
            text-align: center;
            align-items: center;
            min-height: auto !important;
          }
          .hero-headline {
            font-size: 42px !important;
            text-align: center;
            max-width: 100% !important;
          }
          .hero-sub {
            text-align: center;
            max-width: 100% !important;
            font-size: 15px !important;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
            gap: 12px;
            margin-top: 32px !important;
          }
          .hero-actions a, .hero-actions button {
            width: 100%;
            justify-content: center;
          }
          .hero-stats {
            flex-direction: column;
            gap: 20px;
            align-items: center;
            width: 100%;
            margin-top: 40px !important;
          }
          .stat-divider {
            display: none !important;
          }
          .features {
            padding: 60px 20px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
            border: none !important;
            border-radius: 0 !important;
            gap: 16px;
            margin-top: 40px !important;
          }
          .feature-card {
            border: 1px solid var(--border) !important;
            border-radius: 20px !important;
            padding: 30px 24px !important;
          }
          .feature-card::after {
            display: none !important;
          }
          .roles {
            padding: 0 20px 60px !important;
          }
          .roles-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 32px !important;
          }
          .roles-grid {
            grid-template-columns: 1fr !important;
            gap: 16px;
          }
          .role-card {
            padding: 30px 24px !important;
          }
          .cta-banner {
            margin: 0 20px 60px !important;
            padding: 40px 24px !important;
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }
          .cta-banner-title {
            font-size: 32px !important;
          }
          .cta-banner-actions {
            flex-direction: column;
            width: 100%;
          }
          .cta-banner-actions button, .cta-banner-actions a {
            width: 100%;
            justify-content: center;
          }
          footer {
            padding: 30px 20px !important;
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          .footer-links {
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          }
        }
      ` }} />
  )
}
