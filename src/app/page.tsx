'use client'

import React from 'react';
import Link from 'next/link';
import { useLandingPage } from '@/hooks/useLandingPage';
import { LandingPageStyles } from '@/components/landing/LandingPageStyles';

export default function Home() {
  const {
    featuresRef,
    featuresVisible,
    rolesRef,
    rolesVisible,
    ctaRef,
    ctaVisible
  } = useLandingPage();

  return (
    <>
      <LandingPageStyles />

      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* NAV */}
      <nav id="nav">
        <Link href="#" className="nav-logo">
          <img src="/logo.png" alt="LearnWave Logo" className="w-9 h-9 object-contain rounded-lg shadow-sm" />
          <span className="nav-logo-text">LearnWave</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="#features">Features</Link></li>
          <li><Link href="#roles">For You</Link></li>
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
      <section ref={featuresRef} className={`features reveal ${featuresVisible ? 'visible' : ''}`} id="features">
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
      <section ref={rolesRef} className={`roles reveal ${rolesVisible ? 'visible' : ''}`} id="roles">
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
      <div ref={ctaRef} className={`cta-banner reveal ${ctaVisible ? 'visible' : ''}`}>
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
