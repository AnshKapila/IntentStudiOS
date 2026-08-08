import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Inbox, Shield, Code, BarChart2, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const WORDS = ['productive.', 'efficient.', 'fast.', 'successful.', 'unstoppable.', 'dangerous.'];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = document.querySelectorAll('.animate-reveal-up');
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.animationPlayState = 'running';
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (isDone) return;
    const targetWord = WORDS[wordIndex];
    
    if (isTyping) {
      if (currentWord.length < targetWord.length) {
        const timeout = setTimeout(() => {
          setCurrentWord(targetWord.slice(0, currentWord.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        if (wordIndex === WORDS.length - 1) {
          setIsDone(true);
          return;
        }
        const timeout = setTimeout(() => setIsTyping(false), 1500);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentWord.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentWord(targetWord.slice(0, currentWord.length - 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setWordIndex(prev => prev + 1);
        setIsTyping(true);
      }
    }
  }, [currentWord, isTyping, wordIndex, isDone]);

  return (
    <div className="font-sans antialiased selection:bg-gray-100 text-gray-900 overflow-x-hidden relative bg-[var(--bg-cream)] min-h-screen">
      
      {/* Background Layer */}
      <div 
        className="fixed inset-0 -z-10 h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: 'url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/169cdb38-2656-4555-bec1-d1acc64bb6fa_3840w.png)' }}
      />

      {/* Header */}
      <header className="relative z-10 pt-6 pr-6 pb-6 pl-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="mix-blend-multiply cursor-pointer" onClick={onGetStarted}>
          <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1cecfee1-4f70-44cb-859d-503cb03a9e42_320w.png" alt="Sondero" className="h-8" />
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-normal text-gray-500 font-[family-name:--font-inter] tracking-[0.15em] uppercase">
          <a href="#" className="hover:text-[var(--brand-primary)] transition-colors">Manifesto</a>
          <a href="#" className="hover:text-[var(--brand-primary)] transition-colors">Platform</a>
          <a href="#" className="hover:text-[var(--brand-primary)] transition-colors">Services</a>
        </nav>
        <button 
          onClick={onGetStarted}
          className="uppercase tracking-widest bg-[var(--accent-orange)] text-white px-6 py-2.5 rounded-sm shadow-sm hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(246,144,102,0.4)] transition-all text-xs font-[family-name:--font-inter]"
        >
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-40 px-6 max-w-7xl mx-auto flex flex-col items-center text-center animate-slide-up-fade">
        <span className="text-[var(--brand-secondary)] font-[family-name:--font-inter] tracking-widest text-xs font-semibold mb-6 uppercase">
          Sondero AI Operating System
        </span>
        <h1 className="leading-[1.1] md:text-7xl text-5xl font-semibold bg-gradient-to-b from-[var(--brand-secondary)] to-[var(--brand-primary)] bg-clip-text text-transparent font-[family-name:--font-serif] max-w-4xl mx-auto mb-8">
          <span className="font-[family-name:--font-sans]">Make your enterprise incredibly</span><br />
          {currentWord}
          <span className={`${!isDone ? 'animate-blink border-r-4 border-[var(--brand-primary)]' : ''}`}></span>
        </h1>
        <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-10">
          A premium design system for AI-driven enterprise software, balancing trust through classical typography and innovation through glass-heavy UI components.
        </p>
        <button 
          onClick={onGetStarted}
          className="flex items-center gap-2 uppercase tracking-widest bg-[var(--brand-primary)] text-white px-8 py-4 rounded-sm shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all text-sm font-[family-name:--font-inter]"
        >
          Enter Workspace <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Main Content Background Layer container */}
      <div className="relative z-20 bg-[var(--bg-cream)] pt-24 pb-32">
        
        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16 animate-reveal-up">
            <h2 className="text-4xl md:text-5xl font-[family-name:--font-serif] text-[var(--brand-primary)] mb-4">Engineered for Trust</h2>
            <p className="text-[var(--text-muted)]">Absolute security meets frictionless design.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#F5F8F6] to-[#EAEFEB] rounded-2xl shadow-[0_4px_24px_rgba(13,60,31,0.06)] p-8 animate-reveal-up hover:-translate-y-1 transition-transform relative overflow-hidden group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 relative z-10">
                <Shield className="w-6 h-6 text-[var(--brand-secondary)] stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--brand-primary)] mb-3 relative z-10">Enterprise Security</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed relative z-10">Built from the ground up for absolute data sovereignty. Deploy on-premise or in your private cloud.</p>
              
              <svg className="absolute -bottom-6 -right-6 w-32 h-32 text-[var(--brand-primary)] opacity-[0.03] group-hover:opacity-10 transition-opacity rotate-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 6.5 2a1 1 0 0 1 1 1z" />
              </svg>
            </div>

            <div className="bg-gradient-to-bl from-[#F5F8F6] to-[#EAEFEB] rounded-2xl shadow-[0_4px_24px_rgba(13,60,31,0.06)] p-8 animate-reveal-up hover:-translate-y-1 transition-transform relative overflow-hidden group" style={{animationDelay: '100ms'}}>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 relative z-10">
                <Inbox className="w-6 h-6 text-[var(--brand-secondary)] stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--brand-primary)] mb-3 relative z-10">Unified Inbox</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed relative z-10">Centralize all AI interactions. Manage prompts, contexts, and outputs in one beautiful workspace.</p>
              
              <svg className="absolute -bottom-6 -right-6 w-32 h-32 text-[var(--brand-primary)] opacity-[0.03] group-hover:opacity-10 transition-opacity -rotate-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" stroke="currentColor" fill="none" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="bg-gradient-to-b from-[#F5F8F6] to-[#EAEFEB] rounded-2xl shadow-[0_4px_24px_rgba(13,60,31,0.06)] p-8 animate-reveal-up hover:-translate-y-1 transition-transform relative overflow-hidden group" style={{animationDelay: '200ms'}}>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 relative z-10">
                <Zap className="w-6 h-6 text-[var(--brand-secondary)] stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--brand-primary)] mb-3 relative z-10">Instant Workflows</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed relative z-10">Automate complex tasks with multi-step agents. From hiring to lead generation, everything is faster.</p>
            </div>
          </div>
        </section>

        {/* Bento Statistics */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 md:row-span-2 bg-[var(--brand-primary)] rounded-2xl p-10 relative overflow-hidden animate-reveal-up text-white flex flex-col justify-between min-h-[400px]">
                <div className="relative z-10">
                  <span className="text-[var(--accent-orange)] font-[family-name:--font-inter] tracking-widest text-xs uppercase mb-4 block">Performance</span>
                  <h2 className="text-4xl font-[family-name:--font-serif] mb-4">Unmatched ROI</h2>
                  <p className="text-white/80 max-w-sm">Teams using Sondero report massive efficiency gains across all departments.</p>
                </div>
                <div className="relative z-10 mt-12">
                  <div className="text-7xl font-[family-name:--font-serif] text-[var(--accent-orange)]">121%</div>
                  <div className="text-sm text-white/60 mt-2 uppercase tracking-widest">Average Output Increase</div>
                </div>
                
                {/* Decorative absolute SVGs */}
                <BarChart2 className="absolute -right-12 -bottom-12 w-64 h-64 text-white opacity-10 rotate-12" strokeWidth={1} />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)] to-transparent opacity-50"></div>
              </div>
              
              <div className="md:col-span-7 bg-[var(--bg-cream)] rounded-2xl p-10 animate-reveal-up flex items-center justify-between" style={{animationDelay: '100ms'}}>
                <div>
                  <h3 className="text-5xl font-[family-name:--font-serif] text-[var(--brand-primary)]">28%</h3>
                  <p className="text-[var(--text-muted)] mt-2">Reduction in operational costs</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-[var(--accent-orange)] border-r-transparent animate-spin-slow"></div>
              </div>
              
              <div className="md:col-span-7 bg-[var(--brand-secondary)] rounded-2xl p-10 animate-reveal-up text-white" style={{animationDelay: '200ms'}}>
                <h3 className="text-5xl font-[family-name:--font-serif]">72%</h3>
                <p className="text-white/80 mt-2">Faster project delivery times</p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Ways Platform */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-16 animate-reveal-up">
            <h2 className="text-4xl md:text-5xl font-[family-name:--font-serif] text-[var(--brand-primary)] mb-4">Platform Capabilities</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[var(--brand-primary)] rounded-3xl overflow-hidden animate-reveal-up flex flex-col md:flex-row relative">
              <div className="p-12 md:p-16 md:w-1/2 flex flex-col justify-center relative z-20">
                <span className="text-[var(--accent-orange)] font-[family-name:--font-inter] tracking-widest text-xs uppercase mb-4">Core OS</span>
                <h3 className="text-3xl font-[family-name:--font-serif] text-white mb-6">The operating system for your intelligence</h3>
                <p className="text-white/70 leading-relaxed mb-8">
                  A centralized hub to manage AI models, fine-tune context, and oversee autonomous agents. Built with a pristine glassmorphic interface.
                </p>
                <button onClick={onGetStarted} className="self-start px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded backdrop-blur-sm transition-colors font-[family-name:--font-inter] text-sm uppercase tracking-widest">
                  Explore Hub
                </button>
              </div>
              
              {/* Glassmorphic Mockup */}
              <div className="md:w-1/2 relative p-8 md:p-12 flex items-center justify-center min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-l from-[var(--brand-secondary)]/20 to-transparent"></div>
                
                <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-1/3 bg-white/20 rounded"></div>
                    <div className="h-32 w-full bg-white/10 border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center">
                       <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-[var(--accent-orange)]"></div>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <div className="h-10 w-1/2 bg-white/10 rounded-lg"></div>
                      <div className="h-10 w-1/2 bg-[var(--accent-orange)]/80 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F5F5F3] rounded-3xl p-12 animate-reveal-up" style={{animationDelay: '100ms'}}>
                <h3 className="text-xl font-[family-name:--font-serif] text-[var(--brand-primary)] mb-4 uppercase tracking-widest">Beratung</h3>
                <p className="text-[var(--text-muted)]">Strategic AI consulting to identify high-leverage automation opportunities within your existing workflows.</p>
              </div>
              <div className="bg-[#F5F5F3] rounded-3xl p-12 animate-reveal-up" style={{animationDelay: '200ms'}}>
                <Code className="w-8 h-8 text-[var(--brand-secondary)] mb-6 stroke-[1.5]" />
                <h3 className="text-xl font-[family-name:--font-serif] text-[var(--brand-primary)] mb-4 uppercase tracking-widest">Custom Builds</h3>
                <p className="text-[var(--text-muted)]">Bespoke LLM integration and fine-tuning for specialized enterprise applications.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="bg-white py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-[family-name:--font-serif] text-[var(--brand-primary)] text-center mb-24 animate-reveal-up">Integration Process</h2>
            
            <div className="relative">
              {/* Connector Line */}
              <div className="absolute left-[24px] md:left-0 top-0 bottom-0 md:bottom-auto w-[1px] md:w-full md:h-[1px] md:top-[20px] bg-[var(--brand-primary)]/20"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
                {[
                  { num: '01', title: 'Audit', desc: 'Deep dive into your operational bottlenecks.' },
                  { num: '02', title: 'Strategy', desc: 'Map AI capabilities to business objectives.' },
                  { num: '03', title: 'Deployment', desc: 'Secure, on-premise or cloud installation.' },
                  { num: '04', title: 'Scale', desc: 'Expand autonomous agents across departments.' }
                ].map((step, i) => (
                  <div key={i} className="relative pl-16 md:pl-0 pt-0 md:pt-12 animate-reveal-up" style={{animationDelay: `${i * 150}ms`}}>
                    <div className="absolute left-0 md:left-auto md:top-0 w-12 h-12 md:w-10 md:h-10 bg-white border border-[var(--brand-primary)]/20 rounded-full flex items-center justify-center text-[var(--accent-orange)] font-[family-name:--font-serif] text-lg font-bold shadow-sm z-10 -ml-[24px] md:ml-0 mt-[-10px] md:mt-[-20px]">
                      {step.num}
                    </div>
                    <h4 className="text-xl font-bold text-[var(--brand-primary)] mb-2 font-[family-name:--font-serif]">{step.title}</h4>
                    <p className="text-[var(--text-muted)] text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer Banner */}
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <div className="relative rounded-3xl overflow-hidden h-80 flex items-center justify-center group animate-reveal-up cursor-pointer" onClick={onGetStarted}>
            <div 
              className="absolute inset-0 bg-cover bg-center contrast-125 sepia-[.3] hue-rotate-[-10deg] group-hover:scale-105 transition-transform duration-1000"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop)' }}
            />
            <div className="absolute inset-0 bg-[var(--brand-primary)]/70 mix-blend-multiply"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-[family-name:--font-serif] text-white mb-8">Ready to evolve?</h2>
              <button className="uppercase tracking-widest bg-[var(--accent-orange)] text-white px-8 py-4 rounded-sm shadow-sm hover:shadow-[0_0_20px_rgba(246,144,102,0.5)] transition-all font-[family-name:--font-inter] text-sm">
                Initialize Workspace
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
