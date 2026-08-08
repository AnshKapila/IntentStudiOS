import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Unicorn Studio
    if (window.UnicornStudio) {
      window.UnicornStudio.init()
        .then((scenese: any) => console.log('Unicorn Studio initialized'))
        .catch((err: Error) => console.error(err));
    }

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    // Expose for any global use as requested by prompt
    (window as any).__inViewIO = observer;

    return () => {
      elements.forEach(el => observer.unobserve(el));
      // Cleanup UnicornStudio if needed
      if (window.UnicornStudio && window.UnicornStudio.destroy) {
        window.UnicornStudio.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-blue-500 selection:text-white" style={{ fontFamily: 'var(--font-sans)' }}>
      
      {/* Background Layers */}
      <div className="fixed inset-0 -z-10" id="aura-container" data-us-project="1bY8o6HVTI1oxJxuCJEG"></div>
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-40">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"></rect>
        </svg>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-6 flex justify-center">
        <div className="w-full max-w-5xl rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-[12px] flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGetStarted}>
            <span className="text-2xl text-blue-500" style={{ fontFamily: 'var(--font-logo)' }}>I</span>
            <span className="font-semibold tracking-wide text-lg" style={{ fontFamily: 'var(--font-jakarta)' }}>IntentStudiOS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <button 
            onClick={onGetStarted}
            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Campaign
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center animate-on-scroll">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-jakarta)' }}>
          Agency on <span className="italic" style={{ fontFamily: 'var(--font-serif)' }}>Autopilot.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12">
          Stop manually managing projects, leads, and talent. Scale from a solo founder to a full agency team with an AI-driven operating system.
        </p>
        
        {/* Dashboard Visualization */}
        <div className="relative z-10 w-full max-w-6xl mx-auto h-[600px] border border-white/10 rounded-2xl bg-[#0c0c0c] shadow-[0_0_15px_rgba(37,99,235,0.4)] overflow-hidden flex flex-col">
          
          {/* Top Bar */}
          <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black/40">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-xs text-gray-500 font-mono flex gap-2 items-center">
              <span>Active Fleet</span>
              <span>/</span>
              <span className="text-gray-300">intent-studios.ai</span>
              <span>/</span>
              <span className="text-blue-400">orchestration</span>
            </div>
            <div className="w-16"></div> {/* Spacer */}
          </div>

          <div className="flex-1 flex relative">
            {/* Energy Drop Animation */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 z-0 overflow-hidden">
              <div className="w-full h-32 bg-gradient-to-b from-transparent via-blue-500 to-transparent energy-drop shadow-[0_0_8px_#2563eb]"></div>
            </div>

            {/* Left Sidebar */}
            <div className="w-64 border-r border-white/5 p-4 z-20 bg-[#0a0a0a]/80 backdrop-blur-sm">
              <div className="mb-6 relative">
                <iconify-icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></iconify-icon>
                <input type="text" placeholder="Fleet Command..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500/50" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold mb-2 px-2">Active Modules</div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/10 border-l-2 border-blue-500 text-blue-400 cursor-pointer">
                  <iconify-icon icon="lucide:cpu" className="text-lg"></iconify-icon>
                  <span className="text-sm font-medium">Sales SDR Swarm</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer transition-colors">
                  <iconify-icon icon="lucide:briefcase" className="text-lg"></iconify-icon>
                  <span className="text-sm font-medium">Project Delivery</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer transition-colors">
                  <iconify-icon icon="lucide:users" className="text-lg"></iconify-icon>
                  <span className="text-sm font-medium">Hiring Pipeline</span>
                </div>
              </div>
            </div>

            {/* Center Canvas */}
            <div className="flex-1 dot-bg relative overflow-hidden z-10">
              
              {/* SVG Connections */}
              <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <path d="M 200 180 C 250 180, 250 100, 350 100" fill="none" stroke="#2563eb" strokeWidth="2" strokeOpacity="0.4" className="svg-line" />
                <path d="M 200 180 C 250 180, 250 280, 350 280" fill="none" stroke="#2563eb" strokeWidth="2" strokeOpacity="0.4" className="svg-line" />
                <path d="M 550 100 C 600 100, 600 180, 680 180" fill="none" stroke="#2563eb" strokeWidth="2" strokeOpacity="0.4" className="svg-line" />
                
                {/* Pulse points */}
                <circle cx="200" cy="180" r="4" fill="#2563eb" className="animate-pulse shadow-[0_0_8px_#2563eb]" />
                <circle cx="350" cy="100" r="4" fill="#2563eb" className="animate-pulse shadow-[0_0_8px_#2563eb]" />
                <circle cx="350" cy="280" r="4" fill="#2563eb" className="animate-pulse shadow-[0_0_8px_#2563eb]" />
              </svg>

              {/* Node 1: Data Source */}
              <div className="absolute z-10 bg-[#111] border border-white/10 rounded-xl p-4 w-48 shadow-lg backdrop-blur-md" style={{ left: '50px', top: '140px' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                    <iconify-icon icon="lucide:database" className="text-gray-300"></iconify-icon>
                  </div>
                  <span className="text-xs font-semibold">Intent Signals</span>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-blue-500/50 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Node 2: SDR Agent */}
              <div className="absolute z-10 bg-[#111] border border-blue-500/30 rounded-xl p-4 w-52 shadow-[0_0_15px_rgba(37,99,235,0.15)] backdrop-blur-md" style={{ left: '350px', top: '40px' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <iconify-icon icon="lucide:bot"></iconify-icon>
                    </div>
                    <span className="text-xs font-semibold text-blue-400">Agent: SDR</span>
                  </div>
                  <span className="flex w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  &gt; Analyzing leads...<br/>
                  &gt; Drafting outreach...<br/>
                  &gt; Queued 45 emails.
                </div>
              </div>

              {/* Node 3: Co-Pilot */}
              <div className="absolute z-10 bg-[#111] border border-white/10 rounded-xl p-4 w-52 shadow-lg backdrop-blur-md" style={{ left: '350px', top: '230px' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-gray-300">
                      <iconify-icon icon="lucide:layers"></iconify-icon>
                    </div>
                    <span className="text-xs font-semibold">Agent: Co-Pilot</span>
                  </div>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  &gt; Tracking deliverables<br/>
                  &gt; Alert: Project Delta<br/>
                  &gt; Rebalancing load...
                </div>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="w-72 border-l border-white/5 p-4 z-20 bg-[#0a0a0a]/80 backdrop-blur-sm flex flex-col">
              <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">Mandate Console</div>
              <div className="flex-1 bg-black/50 border border-white/5 rounded-lg p-3 font-mono text-[10px] text-gray-400 relative">
                <div className="text-blue-400 mb-2">// Active Protocol: Prospecting</div>
                <div className="text-gray-300 mb-1">target_criteria = &#123;</div>
                <div className="pl-4">industry: "SaaS",</div>
                <div className="pl-4">revenue_min: "1M",</div>
                <div className="pl-4">intent_signal: "Hiring Designers"</div>
                <div className="mb-2">&#125;;</div>
                <div className="text-gray-300 mb-1">action = generate_hyper_personalized_pitch(</div>
                <div className="pl-4">tone="professional yet bold"</div>
                <div>);<span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-blink align-middle"></span></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-white/5 bg-black/40 animate-on-scroll">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-8">Powering the next generation of agencies</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70">
            {['ACME CORP', 'Globex', 'Soylent', 'Umbrella', 'Initech', 'Massive Dynamic'].map(logo => (
              <span key={logo} className="text-xl md:text-2xl font-bold text-gray-400 grayscale hover:grayscale-0 hover:text-white transition-all cursor-default" style={{ fontFamily: 'var(--font-jakarta)' }}>
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="capabilities" className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-jakarta)' }}>One platform. <br className="hidden md:block"/> Infinite scale.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">From an individual founder managing a few clients to a sprawling agency team. Everything you need is integrated.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Leads */}
          <div className="md:col-span-2 bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors animate-on-scroll flex flex-col justify-between group overflow-hidden relative">
            <div className="relative z-10 mb-12">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                <iconify-icon icon="lucide:target" className="text-2xl text-blue-400"></iconify-icon>
              </div>
              <h3 className="text-2xl font-bold mb-3">Precision Leads</h3>
              <p className="text-gray-400 max-w-sm">Stop hunting. Our AI qualifies intent signals and orchestrates outreach sequences automatically.</p>
            </div>
            {/* UI Mock */}
            <div className="relative z-10 bg-[#151515] rounded-xl border border-white/5 p-4 w-3/4 self-end shadow-xl transform translate-y-2 group-hover:-translate-y-2 transition-transform duration-500">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Match Score</span>
                <span className="text-blue-400 font-mono">98%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[98%] bg-gradient-to-r from-blue-600 to-blue-400 rounded-full relative">
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/30 blur-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Hiring */}
          <div className="md:col-span-1 bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors animate-on-scroll flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                <iconify-icon icon="lucide:users-2" className="text-2xl text-gray-300"></iconify-icon>
              </div>
              <h3 className="text-2xl font-bold mb-3">Scale Your Team</h3>
              <p className="text-gray-400">Automated vetting and hiring pipelines for when you outgrow solo-mode.</p>
            </div>
            <div className="relative z-10 bg-black/50 rounded-xl border border-white/5 border-l-2 border-l-blue-500 p-4 font-mono text-[10px] text-gray-400">
              <span className="text-green-400">✔</span> Candidate matched<br/>
              <span className="text-green-400">✔</span> Portfolio verified<br/>
              <span className="text-blue-400">⟳</span> Scheduling interview...
            </div>
          </div>

          {/* Card 3: Projects */}
          <div className="md:col-span-1 bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors animate-on-scroll">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
              <iconify-icon icon="lucide:layers" className="text-2xl text-gray-300"></iconify-icon>
            </div>
            <h3 className="text-2xl font-bold mb-3">Project Command</h3>
            <p className="text-gray-400 mb-8">Unified Kanban boards and timeline views. Never miss a client deliverable again, whether working alone or with collaborators.</p>
            <button onClick={onGetStarted} className="flex items-center gap-2 text-sm font-semibold hover:text-blue-400 transition-colors">
              Explore Projects <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 4: Earnings */}
          <div className="md:col-span-2 bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors animate-on-scroll flex flex-col md:flex-row items-center gap-8 group">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                <iconify-icon icon="lucide:wallet" className="text-2xl text-gray-300"></iconify-icon>
              </div>
              <h3 className="text-2xl font-bold mb-3">Predictable Earnings</h3>
              <p className="text-gray-400">Track invoices, project milestones, and MRR. The dashboard provides a birds-eye view of your cashflow health.</p>
            </div>
            <div className="flex-1 w-full h-40 flex items-end justify-between gap-2 border-b border-white/10 pb-2 px-2">
              {[40, 60, 45, 80, 65, 90, 100].map((h, i) => (
                <div key={i} className="w-full bg-blue-500/20 rounded-t-sm transition-all duration-500 group-hover:bg-blue-500/80" style={{ height: `${h * 0.5}%` }}>
                  <div className="w-full bg-blue-400 transition-all duration-700 delay-100 group-hover:h-[90%]" style={{ height: `${h * 0.8}%` }}></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto border-t border-white/5 animate-on-scroll">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-jakarta)' }}>Simple, scalable pricing</h2>
          
          <div className="inline-flex items-center p-1 bg-white/5 rounded-full border border-white/10 mx-auto mt-8 relative">
            <div className="absolute left-1 w-1/2 h-[calc(100%-8px)] bg-neutral-800 rounded-full transition-transform"></div>
            <button className="relative z-10 px-6 py-2 text-sm font-medium text-white w-32">Monthly</button>
            <button className="relative z-10 px-6 py-2 text-sm font-medium text-gray-400 w-32">Yearly <span className="text-[10px] text-blue-400 ml-1">Save 20%</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-colors">
            <h3 className="text-lg text-gray-400 mb-2">Solo Pilot</h3>
            <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <p className="text-sm text-gray-400 mb-8 border-b border-white/5 pb-8">Perfect for freelancers and solo founders just starting their journey.</p>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
              <li className="flex gap-3"><iconify-icon icon="lucide:check-circle-2" className="text-blue-500 text-lg"></iconify-icon> Up to 3 Active Projects</li>
              <li className="flex gap-3"><iconify-icon icon="lucide:check-circle-2" className="text-blue-500 text-lg"></iconify-icon> Basic CRM & Leads</li>
              <li className="flex gap-3"><iconify-icon icon="lucide:check-circle-2" className="text-blue-500 text-lg"></iconify-icon> Manual Invoicing</li>
            </ul>
            <button onClick={onGetStarted} className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">Get Started</button>
          </div>

          {/* Tier 2 */}
          <div className="bg-[#0c0c0c] border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.15)] rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-3xl"></div>
            <h3 className="text-lg text-blue-400 mb-2">Growth Engine</h3>
            <div className="text-4xl font-bold mb-6">$149<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <p className="text-sm text-gray-400 mb-8 border-b border-white/5 pb-8">For small agencies scaling their operations and team.</p>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
              <li className="flex gap-3"><iconify-icon icon="lucide:check-circle-2" className="text-blue-500 text-lg"></iconify-icon> Unlimited Projects</li>
              <li className="flex gap-3"><iconify-icon icon="lucide:check-circle-2" className="text-blue-500 text-lg"></iconify-icon> AI SDR Swarm (500 leads/mo)</li>
              <li className="flex gap-3"><iconify-icon icon="lucide:check-circle-2" className="text-blue-500 text-lg"></iconify-icon> Automated Hiring Pipelines</li>
              <li className="flex gap-3"><iconify-icon icon="lucide:check-circle-2" className="text-blue-500 text-lg"></iconify-icon> Automated Invoicing & Escrow</li>
            </ul>
            <button onClick={onGetStarted} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white text-sm font-medium shadow-[0_0_15px_rgba(37,99,235,0.4)]">Start Free Trial</button>
          </div>

          {/* Tier 3 */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-colors">
            <h3 className="text-lg text-gray-400 mb-2">Scale</h3>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <p className="text-sm text-gray-400 mb-8 border-b border-white/5 pb-8">For established enterprises requiring bespoke infrastructure.</p>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
              <li className="flex gap-3"><iconify-icon icon="lucide:check-circle-2" className="text-gray-500 text-lg"></iconify-icon> Dedicated Infrastructure</li>
              <li className="flex gap-3"><iconify-icon icon="lucide:check-circle-2" className="text-gray-500 text-lg"></iconify-icon> Custom AI Model Training</li>
              <li className="flex gap-3"><iconify-icon icon="lucide:check-circle-2" className="text-gray-500 text-lg"></iconify-icon> 24/7 Priority Support</li>
            </ul>
            <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-24 px-6 text-center border-t border-white/5 bg-gradient-to-t from-blue-900/10 to-transparent animate-on-scroll relative overflow-hidden">
        <div className="absolute left-1/2 bottom-0 w-[600px] h-[300px] bg-blue-500/20 blur-[120px] rounded-full -translate-x-1/2 pointer-events-none"></div>
        <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10" style={{ fontFamily: 'var(--font-jakarta)' }}>Start building your empire.</h2>
        <button onClick={onGetStarted} className="relative z-10 bg-white text-black px-8 py-4 rounded-full text-sm font-semibold hover:bg-gray-100 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          Initialize Workspace
        </button>
      </footer>
    </div>
  );
};
