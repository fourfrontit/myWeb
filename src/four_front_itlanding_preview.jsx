import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced single-file React landing page with consistent styling across sections.
// Tailwind CSS + Framer Motion.

export default function FourFrontITLanding() {
  const [chatOpen, setChatOpen] = useState(false);
  const [calc, setCalc] = useState({ users: 5, servers: 1, support: "standard", plan: 'standard', addons: {} });
  const [estimate, setEstimate] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);

  const sections = useRef({});

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActiveSection(e.target.id || 'home');
      });
    }, { root: null, threshold: 0.55 });

    Object.values(sections.current).forEach(node => { if (node) obs.observe(node); });
    return () => obs.disconnect();
  }, []);

  function calcEstimate(values) {
    const planRates = { basic: 60, standard: 120, premium: 180 };
    const perUser = planRates[(values && values.plan) || 'standard'] || 120;
    const addonRates = { security: 40, backup: 25, ai: 50 };
    let addonPerUser = 0;
    const addons = (values && values.addons) || {};
    Object.keys(addons).forEach(k => { if (addons[k]) addonPerUser += (addonRates[k] || 0); });
    const users = Number((values && values.users) || 0);
    const monthly = users * (perUser + addonPerUser);
    const yearly = monthly * 12;
    return { monthly, yearly };
  }

  function handleCalcSubmit(e) {
    e && e.preventDefault();
    const res = calcEstimate(calc);
    setEstimate(res);
    document.getElementById("calc-result")?.scrollIntoView({ behavior: "smooth", block: 'center' });
  }

  function calculatePreview(values) {
    try { return calcEstimate(values); } catch (e) { return { monthly: 0, yearly: 0 }; }
  }

  function useAnimatedNumber(target, duration = 700) {
    const [value, setValue] = useState(target);
    useEffect(() => {
      let raf = null;
      const start = Date.now();
      const from = Number(value) || 0;
      const to = Number(target) || 0;
      if (from === to) return setValue(to);
      const step = () => {
        const t = Math.min(1, (Date.now() - start) / duration);
        const v = Math.round(from + (to - from) * t);
        setValue(v);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target]);
    return value;
  }

  const preview = calculatePreview(calc);
  const animatedPreviewMonthly = useAnimatedNumber(estimate ? estimate.monthly : preview.monthly);

  const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-gray-800 text-slate-100' : 'bg-white text-slate-900'}`}>

      {/* top progress bar */}
      <div className="fixed left-0 top-0 h-1 z-50 w-full bg-transparent pointer-events-none">
        <div style={{ width: `${Math.min(100, (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)}%` }} className="h-1 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-150" />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur bg-black/40 dark:bg-slate-900/60 border-b border-white/5">
        <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* <-- Replaced brand block with accessible link that smooth-scrolls and updates activeSection */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              sections.current.home?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setActiveSection('home');
            }}
            aria-label="Go to home"
            className="flex items-center gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
          >
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-black font-bold">FF</div>
            <div>
              <div className="font-semibold">FourFrontIT</div>
              <div className="text-xs text-slate-400">Managed IT + AI Ops</div>
            </div>
          </a>

          <ul className="hidden md:flex items-center gap-6 text-sm">
            {['about','services','calculator','prices','contact'].map(id => (
              <li key={id}>
                <a href={`#${id}`} className={`relative px-2 py-1 hover:text-white ${activeSection === id ? 'text-white font-semibold' : 'text-slate-300'}`}>{id.charAt(0).toUpperCase()+id.slice(1)}</a>
              </li>
            ))}
            <li>
              <a href="/portal" className="inline-flex items-center px-4 py-2 rounded-full font-medium bg-gradient-to-r from-cyan-400 to-violet-500 text-black shadow">Client Portal</a>
            </li>
            <li>
              <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 rounded-md bg-white/5 text-slate-200">{theme === 'dark' ? '☀️' : '🌙'}</button>
            </li>
          </ul>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 rounded-md bg-white/5">{theme === 'dark' ? '☀️' : '🌙'}</button>
            <select onChange={(e) => { const v = e.target.value; if (v) window.location.href = v; }} className="bg-transparent p-2 rounded text-sm text-slate-200 border border-white/5">
              <option value="">Menu</option>
              <option value="#about">About</option>
              <option value="#services">Services</option>
              <option value="#calculator">Calculator</option>
              <option value="#prices">Prices</option>
              <option value="#contact">Contact</option>
            </select>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 80 } }, hidden: {} }}>

          <section id="home" ref={el => sections.current.home = el} className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 120 } } }}>
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold leading-tight">Managed IT that <span className="text-cyan-400">thinks like AI</span> — for small & medium business</motion.h1>
              <motion.p variants={fadeUp} className="mt-4 text-slate-300 max-w-xl">FourFrontIT blends proactive monitoring, cloud workflows and automated remediation so your team focusses on customers — not firefighting.</motion.p>

              <motion.div variants={fadeUp} className="mt-6 flex gap-3">
                <a href="#calculator" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 font-semibold text-black">Estimate Cost</a>
                <a href="#services" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10">Our Services</a>
              </motion.div>

              {/* feature badges with subtle glass cards */}
              <motion.div variants={fadeUp} className="mt-8 grid grid-cols-3 gap-4 text-xs">
                {['24/7 Monitoring','Automated Backups','Security & Patching'].map((t,i)=> (
                  <div key={t} className="p-3 rounded-lg bg-gradient-to-br from-white/3 to-white/2 backdrop-blur-sm border border-white/5 text-slate-200 flex flex-col items-start">
                    <div className="font-semibold">{t}</div>
                    <div className="text-slate-400 text-xs mt-1">{i===0? 'Always-on alerts' : i===1? 'Incremental & offsite' : 'Endpoint & server'}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative">
              <div className="w-full h-64 md:h-80 rounded-2xl bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center overflow-hidden border border-white/6 shadow-lg">
                <motion.div animate={{ scale: [1, 1.04, 1], rotate: [0, 3, -2, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full opacity-10" viewBox="0 0 600 400" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0" stopColor="#06b6d4" />
                        <stop offset="1" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                    <rect x="-5" y="-5" width="610" height="410" fill="url(#g1)" />
                  </svg>
                </motion.div>

                <div className="relative z-10 text-center px-6">
                  <div className="text-2xl font-semibold">AI-driven Insights</div>
                  <div className="text-sm mt-2 text-slate-300">Predictive alerts • Anomaly detection • Cost optimisation</div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="px-3 py-2 rounded bg-white/5 text-xs">Realtime Status</div>
                    <div className="px-3 py-2 rounded bg-gradient-to-r from-cyan-400 to-violet-500 text-black text-xs font-medium">Auto-remediation</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400">Tip: add a realtime status panel or mini dashboard here.</div>
            </motion.div>
          </section>

          {/* ABOUT */}
          <motion.section id="about" ref={el => sections.current.about = el} className="mt-20" initial="hidden" whileInView="show" viewport={{ once: true }}>
  <motion.h3 variants={fadeUp} className="text-2xl font-semibold">About Us</motion.h3>
  <motion.p variants={fadeUp} className="mt-3 text-slate-300 max-w-3xl">FourFrontIT is an MSP focused on reliable cloud hosting, device management and security for growing businesses. Our automation-first approach reduces downtime and predictable costs while keeping human experts in the loop.</motion.p>

  <motion.div variants={fadeUp} className="mt-6">
    <div className="p-4 rounded-lg bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-white/6">
      <div className="text-slate-300">For more about our leadership and company vision, visit our <a href="/about" className="text-cyan-400 underline">About page</a>.</div>
    </div>
  </motion.div>
</motion.section>

          {/* SERVICES */}
          <section id="services" ref={el => sections.current.services = el} className="mt-12 grid md:grid-cols-3 gap-6">
            {[{
              title: 'Managed Cloud',
              desc: 'Provisioning, monitoring, cost optimisation on Linode, AWS, Azure.'
            },{
              title: 'Security & Compliance',
              desc: 'EDR, vulnerability scanning, patching and policy automation.'
            },{
              title: 'Support & Automation',
              desc: '24/7 monitoring, automated remediation playbooks, and service desk.'
            }].map((s,i)=> (
              <motion.div key={s.title} whileHover={{ scale: 1.04, y: -8 }} initial={{ opacity:0, y:6 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.12 }} className="p-6 rounded-lg bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-white/6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center font-bold text-black">{s.title.split(' ').map(w=>w[0]).join('')}</div>
                  <div>
                    <div className="font-semibold text-white">{s.title}</div>
                    <div className="text-slate-300 text-sm mt-1">{s.desc}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-slate-400">From</div>
                  <div className="text-sm font-semibold text-white">Contact for quote</div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* PRICES */}
          <motion.section id="prices" ref={el => sections.current.prices = el} className="mt-20 bg-white/2 p-8 rounded-lg" initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.h3 variants={fadeUp} className="text-2xl font-semibold">Prices</motion.h3>
            <motion.p variants={fadeUp} className="mt-2 text-slate-300">Transparent pricing to help you plan. Contact us for customised enterprise quotes.</motion.p>

            <div className="mt-6 grid md:grid-cols-3 gap-6">
              <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }} className="p-6 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">Personal / Family</div>
                    <div className="text-slate-300 mt-2">Ideal for home offices. Up to 6 users.</div>
                  </div>
                  <div className="text-sm text-slate-400">Best for starters</div>
                </div>
                <div className="mt-4 font-bold text-white">$100/year</div>
                <div className="mt-4 text-xs text-slate-400">Includes basic monitoring & backups</div>
              </motion.div>

              <motion.div variants={fadeUp} whileHover={{ scale: 1.03 }} className="p-6 rounded-lg bg-gradient-to-br from-cyan-800 to-cyan-700 border border-white/6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">Business Standard</div>
                    <div className="text-slate-300 mt-2">Web, mobile & desktop management.</div>
                  </div>
                  <div className="text-sm text-slate-200 bg-white/5 px-3 py-1 rounded">Popular</div>
                </div>
                <div className="mt-4 font-bold text-white">$9.99/user/month</div>
                <div className="mt-4 text-xs text-slate-100">Device management, patching, and helpdesk</div>
              </motion.div>

              <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }} className="p-6 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">Enterprise</div>
                    <div className="text-slate-300 mt-2">Custom SLA, dedicated support.</div>
                  </div>
                  <div className="text-sm text-slate-400">Custom</div>
                </div>
                <div className="mt-4 font-bold text-white">Contact us</div>
                <div className="mt-4 text-xs text-slate-400">Scale with dedicated onboarding</div>
              </motion.div>
            </div>

            <div className="mt-8 text-sm text-slate-300">Questions? <a href="#prices" className="underline">Contact us</a> and we'll get back within one business day.</div>
          </motion.section>

          {/* CALCULATOR */}
          <motion.section id="calculator" ref={el => sections.current.calculator = el} className="mt-20" initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.h3 variants={fadeUp} className="text-2xl font-semibold">Cost Calculator</motion.h3>
            <motion.p variants={fadeUp} className="mt-2 text-slate-300">Estimate monthly & yearly managed services costs.</motion.p>

            <motion.div variants={fadeUp} className="mt-6 p-6 rounded-lg bg-gradient-to-b from-slate-800/60 to-slate-900/40 border border-white/6">
              <div className="grid md:grid-cols-2 gap-6">
                <form onSubmit={handleCalcSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm text-slate-300 block mb-2">Number of Users</label>
                    <input type="number" min={1} value={calc.users} onChange={(e) => setCalc({ ...calc, users: Number(e.target.value) })} className="w-full px-4 py-3 rounded bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 block mb-2">Plan Type</label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setCalc({ ...calc, plan: 'basic' })} className={`px-4 py-2 rounded-lg text-sm font-medium ${calc.plan === 'basic' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-300 border border-white/5'}`}>Basic</button>
                      <button type="button" onClick={() => setCalc({ ...calc, plan: 'standard' })} className={`px-4 py-2 rounded-lg text-sm font-medium ${calc.plan === 'standard' ? 'bg-cyan-400 text-black' : 'bg-slate-900 text-slate-300 border border-white/5'}`}>Standard</button>
                      <button type="button" onClick={() => setCalc({ ...calc, plan: 'premium' })} className={`px-4 py-2 rounded-lg text-sm font-medium ${calc.plan === 'premium' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-300 border border-white/5'}`}>Premium</button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-300 block mb-2">Add-ons</label>
                    <div className="grid gap-2">
                      <label className="flex items-center gap-3 text-slate-300">
                        <input type="checkbox" checked={!!(calc.addons && calc.addons.security)} onChange={(e) => setCalc({ ...calc, addons: { ...(calc.addons || {}), security: e.target.checked } })} />
                        <span>Security <span className="text-slate-400">(+ $40/user)</span></span>
                      </label>
                      <label className="flex items-center gap-3 text-slate-300">
                        <input type="checkbox" checked={!!(calc.addons && calc.addons.backup)} onChange={(e) => setCalc({ ...calc, addons: { ...(calc.addons || {}), backup: e.target.checked } })} />
                        <span>Backup <span className="text-slate-400">(+ $25/user)</span></span>
                      </label>
                      <label className="flex items-center gap-3 text-slate-300">
                        <input type="checkbox" checked={!!(calc.addons && calc.addons.ai)} onChange={(e) => setCalc({ ...calc, addons: { ...(calc.addons || {}), ai: e.target.checked } })} />
                        <span>AI <span className="text-slate-400">(+ $50/user)</span></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="px-4 py-2 rounded bg-cyan-500 text-black font-semibold">Calculate</button>
                    <button type="button" onClick={() => { setCalc({ users: 5, servers: 1, support: 'standard', plan: 'standard', addons: {} }); setEstimate(null); }} className="px-4 py-2 rounded border">Reset</button>
                  </div>
                </form>

                <div className="p-6 rounded-lg bg-slate-900 border border-white/6 shadow-inner sticky top-28">
                  <h4 className="text-xl font-semibold text-cyan-400">Estimate Summary</h4>
                  <div className="mt-4 text-slate-300">
                    <div>Users: <span className="font-medium text-white">{calc.users}</span></div>
                    <div className="mt-2">Plan: <span className="font-medium text-white">{(calc.plan || 'standard').charAt(0).toUpperCase() + (calc.plan || 'standard').slice(1)}</span> — <span className="text-slate-400">${calc.plan === 'basic' ? 60 : calc.plan === 'premium' ? 180 : 120}/user</span></div>
                    <div className="mt-2">Add-ons: <span className="text-slate-400">{(calc.addons && Object.keys(calc.addons).filter(k=>calc.addons[k]).length) ? Object.keys(calc.addons).filter(k=>calc.addons[k]).join(', ') : 'None'}</span></div>
                  </div>

                  <div className="mt-6 text-center">
                    <div className="text-sm text-slate-400">Estimated Monthly Cost:</div>
                    <div id="calc-result" className="text-4xl font-extrabold text-cyan-400 mt-2">${animatedPreviewMonthly}</div>
                    <div className="text-sm text-slate-400 mt-2">Includes all selected options and users.</div>
                  </div>

                  <div className="mt-4 text-xs text-slate-500">This is a rough estimate; contact us for a tailored proposal.</div>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* CONTACT */}
          <motion.section id="contact" ref={el => sections.current.contact = el} className="max-w-6xl mx-auto px-6 py-20" initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.h3 variants={fadeUp} className="text-2xl font-semibold">Start a conversation</motion.h3>
            <motion.p variants={fadeUp} className="mt-2 text-slate-300 max-w-3xl">Tell us about your environment and we'll propose an SLA and migration plan tailored to you.</motion.p>

            <div className="mt-10 grid md:grid-cols-2 gap-8">
              <motion.form variants={fadeUp} className="space-y-4 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-6 rounded-lg border border-white/6" onSubmit={(e)=>{ e.preventDefault(); alert('Thanks! We will follow up.'); }}>
                <input type="text" placeholder="Name" className="w-full p-3 rounded bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                <input type="email" placeholder="Email" className="w-full p-3 rounded bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                <textarea placeholder="How can we help?" rows="4" className="w-full p-3 rounded bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                <div className="flex gap-3">
                  <button type="submit" className="w-full md:w-auto px-6 py-2 rounded bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold">Send message</button>
                  <button type="button" onClick={()=>{navigator.clipboard?.writeText('info@fourfrontit.com');}} className="px-4 py-2 rounded border">Copy email</button>
                </div>
                <p className="text-sm text-slate-400 mt-2">Or email us at <a href="mailto:info@fourfrontit.com" className="text-cyan-400 underline">info@fourfrontit.com</a></p>
              </motion.form>

              <motion.div variants={fadeUp} className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-6 border border-white/6 shadow-md">
                <h4 className="text-lg font-semibold text-slate-200">Estimate</h4>
                <div className="text-4xl font-extrabold text-cyan-400 mt-2">$2,000</div>
                <p className="text-sm text-slate-400 mt-2">Typical monthly starting price for SMB managed services — custom quotes available.</p>

                <div className="mt-4">
                  <h5 className="text-slate-200 font-semibold text-sm mb-2">What's included</h5>
                  <ul className="space-y-1 text-sm text-slate-400">
                    <li>• 24/7 monitoring</li>
                    <li>• Patch management</li>
                    <li>• Security &amp; backups</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* CONTACT OPTIONS (kept as-is because it's already styled) */}
          <section className="max-w-6xl mx-auto px-6 py-12" aria-label="Contact options">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold">Contact Options</h3>
            </div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.12 } }, hidden: {} }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

              <motion.div variants={fadeUp} whileHover={{ scale: 1.02, y: -6 }} className="p-6 bg-slate-900/50 rounded-lg border border-white/5 shadow-inner text-center relative overflow-hidden">
                <div className="absolute -left-10 -top-10 opacity-10 pointer-events-none">
                  <svg width="160" height="160" viewBox="0 0 100 100" className="transform rotate-12">
                    <defs>
                      <linearGradient id="g-card-1" x1="0" x2="1">
                        <stop offset="0" stopColor="#06b6d4" />
                        <stop offset="1" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="url(#g-card-1)" />
                  </svg>
                </div>

                <div className="flex items-center justify-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8.5C3 6 5 4 7.5 4h9C18 4 20 6 20 8.5v7C20 18 18 20 15.5 20h-9C5 20 3 18 3 15.5v-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <h4 className="font-semibold text-white">Email Support</h4>
                </div>

                <p className="text-slate-400 text-sm">For any questions or requests, please contact us at</p>
                <button onClick={() => window.location.href = 'mailto:info@fourfrontit.com'} className="mt-4 inline-flex items-center gap-2 text-cyan-400 font-medium">
                  <span>info@fourfrontit.com</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 8.5C3 6 5 4 7.5 4h9C18 4 20 6 20 8.5v7C20 18 18 20 15.5 20h-9C5 20 3 18 3 15.5v-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                <div className="mt-6 flex justify-center">
                  <button onClick={() => window.location.href = 'mailto:info@fourfrontit.com'} className="px-4 py-2 rounded bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold">Open Email</button>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} whileHover={{ scale: 1.02, y: -6 }} className="p-6 bg-slate-900/50 rounded-lg border border-white/5 shadow-inner text-center relative overflow-hidden">
                <div className="absolute right-0 -top-8 opacity-10 pointer-events-none">
                  <svg width="120" height="120" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="g-card-2" x1="0" x2="1">
                        <stop offset="0" stopColor="#34d399" />
                        <stop offset="1" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="100" height="100" rx="20" fill="url(#g-card-2)" />
                  </svg>
                </div>

                <div className="flex items-center justify-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92V21a1 1 0 0 1-1.11 1 19.86 19.86 0 0 1-8.63-3.07A19.86 19.86 0 0 1 3.07 9.74 19.86 19.86 0 0 1 0 1.37 1 1 0 0 1 1 0h4.09a1 1 0 0 1 1 .75c.17.94.48 1.86.91 2.72a1 1 0 0 1-.24 1.09L5.7 6.7c1.82 3.7 5.12 7 8.82 8.82l1.14-1.14a1 1 0 0 1 1.09-.24c.86.43 1.78.74 2.72.91a1 1 0 0 1 .75 1V22z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <h4 className="font-semibold text-white">Call Us</h4>
                </div>

                <p className="text-slate-400 text-sm">Available Monday to Friday, 8am–5pm (PT)</p>
                <button onClick={() => window.location.href = 'tel:+16727623822'} className="mt-4 inline-flex items-center gap-2 text-cyan-400 font-medium">+1 (672) 762-3822</button>

                <div className="mt-6 flex justify-center">
                  <button onClick={() => window.location.href = 'tel:+16727623822'} className="px-4 py-2 rounded border border-white/10">Call Now</button>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} whileHover={{ scale: 1.02, y: -6 }} className="p-6 bg-slate-900/50 rounded-lg border border-white/5 shadow-inner text-center relative overflow-hidden">
                <div className="absolute left-0 bottom-0 opacity-8 pointer-events-none -z-10">
                  <svg width="180" height="80" viewBox="0 0 180 80"><defs><linearGradient id="g-card-3" x1="0" x2="1"><stop offset="0" stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs><ellipse cx="90" cy="40" rx="90" ry="40" fill="url(#g-card-3)"/></svg>
                </div>

                <div className="flex items-center justify-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <h4 className="font-semibold text-white">Location</h4>
                </div>

                <p className="text-slate-400 text-sm">Head office:<br/>401–570 East 8th Avenue,<br/>Vancouver, BC V5T 1S8, Canada.</p>
                <p className="text-slate-400 text-sm mt-3">Contact our international locations:</p>
                <div className="mt-2">
                  <a href="#" className="text-cyan-400 underline mr-2">Sri Lanka</a>
                  <a href="#" className="text-cyan-400 underline">Australia</a>
                </div>

                <div className="mt-6 flex justify-center">
                  <button onClick={() => window.open('https://maps.google.com?q=401-570+East+8th+Avenue+Vancouver') } className="px-4 py-2 rounded bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold">Get Directions</button>
                </div>
              </motion.div>

            </motion.div>
          </section>

          {/* FOOTER */}
          <footer className="mt-20 bg-gradient-to-tr from-slate-900 to-slate-800 text-slate-300">
            <div className="max-w-6xl mx-auto px-6 py-12">
              <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-8 items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-black font-bold">FF</div>
                    <div>
                      <div className="text-white font-semibold">FourFront IT</div>
                      <div className="text-xs text-slate-400">Managed IT · AI Ops · Security</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 mt-4">All rights reserved © {new Date().getFullYear()} FourFront IT, Vancouver, Canada</div>
                </div>

                <div className="flex justify-center">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="font-semibold text-white mb-2">Company</div>
                      <ul className="text-sm text-slate-400 space-y-2">
                        <li><a href="#features" className="hover:underline">Features</a></li>
                        <li><a href="#about" className="hover:underline">About</a></li>
                        <li><a href="#prices" className="hover:underline">Pricing</a></li>
                        <li><a href="#contact" className="hover:underline">Contact</a></li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-2">Resources</div>
                      <ul className="text-sm text-slate-400 space-y-2">
                        <li><a href="#blog" className="hover:underline">Blog</a></li>
                        <li><a href="#docs" className="hover:underline">Docs</a></li>
                        <li><a href="#support" className="hover:underline">Support</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-white mb-3">Follow us</div>
                  <div className="flex justify-end gap-3">
                    <button className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center">f</button>
                    <button className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center">t</button>
                    <button className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center">in</button>
                  </div>

                  <div className="text-sm text-slate-400 mt-6">Built for Linode / Ubuntu — Deployable on your stack</div>
                </div>
              </motion.div>

              <div className="border-t border-white/5 mt-8 pt-6">
                <div className="text-center text-sm text-slate-500">Designed with an AI-driven aesthetic — FourFront IT</div>
              </div>
            </div>
          </footer>

        </motion.div>
      </main>

      {/* FLOATING CHAT / AI ICON */}
      <div>
        <button onClick={() => setChatOpen(true)} aria-label="Open chat" className="fixed right-6 bottom-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-br from-cyan-400 to-violet-500 text-black font-bold">AI</button>

        <AnimatePresence>
          {chatOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="fixed right-6 bottom-24 w-96 bg-slate-900 border border-white/5 rounded-lg p-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <div className="font-semibold">FourFrontIT Assistant</div>
                <button onClick={() => setChatOpen(false)} className="text-slate-400">Close</button>
              </div>
              <div className="mt-3 text-sm text-slate-300">This chat would connect to your AI backend. Use OpenAI or an on-prem LLM for automated ticket triage, knowledgebase answers, and runbooks.</div>
              <form className="mt-3">
                <input placeholder="Ask about pricing, incidents..." className="w-full p-2 rounded bg-black/20 text-sm" />
                <div className="mt-2 flex justify-end">
                  <button className="px-3 py-1 rounded bg-cyan-500 text-black text-sm">Send</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AboutPage() {
  const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">
      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 80 } }, hidden: {} }}>
          <motion.header variants={fadeUp} className="mb-8">
            <a href="/" className="text-sm text-cyan-400 underline">← Back to Home</a>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-4">About FourFront IT</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">We empower businesses through reliable, scalable, and secure technology solutions.</p>
          </motion.header>

          <motion.section variants={fadeUp} className="mt-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-lg border border-white/6">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Our Leadership</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">At the core of FourFront IT is a leadership team driven by innovation, accountability, and an unwavering commitment to client success. With decades of combined experience across IT infrastructure, cybersecurity, cloud computing, and digital transformation, our leadership guides the company with a clear vision: to empower businesses through reliable, scalable, and secure technology solutions.</p>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-white/5">
                <div className="font-semibold text-slate-900 dark:text-white">Gary Flavin — Co-founder &amp; Director of Marketing</div>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Gary is a tech enthusiast and mechanical engineering professional with a deep passion for technology, innovation, and the MSP industry. With a sharp eye for emerging trends and a hands-on approach to problem-solving, Gary brings both technical expertise and strategic marketing insight to the team.</p>
                <p className="mt-2 text-slate-600 dark:text-slate-300">As Co-founder of FourFront IT, he is dedicated to helping businesses thrive through smart IT solutions, clear communication, and a commitment to excellence.</p>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-white/5">
                <div className="font-semibold text-slate-900 dark:text-white">Benefits to you</div>
                <p className="mt-2 text-slate-600 dark:text-slate-300">The ever changing and increasingly competitive global marketplace demands that business owners continuously seek to improve their financial position to ensure their survival. Our services focus on predictable costs, reduced downtime, and improved security posture so you can focus on growth while we handle the technology.</p>
              </div>
            </div>

            <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">Interested in meeting the rest of our leadership or discussing a tailored roadmap? <a href="mailto:info@fourfrontit.com" className="text-cyan-400 underline">Contact us</a>.</div>
          </motion.section>
        </motion.div>
      </main>
      </div>
    );
  }
