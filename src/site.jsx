import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

const Arrow = ({ diagonal = false }) => <svg className={diagonal ? 'arrow diagonal' : 'arrow'} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Mark = () => <svg className="brand-mark" viewBox="0 0 38 38" fill="none" aria-hidden="true"><path d="M4 18.5 19 6l15 12.5M9.5 17.5v13h19v-13M15 30.5V22h8v8.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="square"/><path d="M2.8 19.2 19 5.7l16.2 13.5" stroke="currentColor" strokeWidth=".65" opacity=".6"/></svg>;
const Reveal = ({ children, className = '', delay = 0, y = 38 }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 98%', 'start 44%'] });
  const start = Math.min(delay * 1.6, .28);
  const end = Math.min(start + .72, 1);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const lift = useTransform(scrollYProgress, [start, end], [y, 0]);
  const blur = useTransform(scrollYProgress, [start, end], ['8px', '0px']);
  const scale = useTransform(scrollYProgress, [start, end], [.985, 1]);
  return <motion.div ref={ref} className={className} style={{ opacity: reduced ? 1 : opacity, y: reduced ? 0 : lift, filter: reduced ? 'none' : blur, scale: reduced ? 1 : scale, willChange: reduced ? 'auto' : 'transform, opacity, filter' }}>{children}</motion.div>;
};

const ScrollImage = ({ src, alt, className = '', loading = 'lazy' }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : ['-7%', '7%']);
  return <motion.img ref={ref} className={`scroll-image ${className}`} src={src} alt={alt} loading={loading} style={{ y }} whileHover={reduced ? undefined : { scale: 1.055 }} transition={{ scale: { duration: .7, ease: [.22, 1, .36, 1] } }} />;
};

const ProcessLine = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 82%', 'end 55%'] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 95, damping: 24, restDelta: .001 });
  return <div className="process-track" ref={ref} aria-hidden="true"><div className="process-track-base"/><motion.div className="process-track-fill" style={{ scaleX: reduced ? 1 : scaleX }} /></div>;
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const scale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: .001 });
  return <motion.div className="scroll-progress" style={{ scaleX: reduced ? scrollYProgress : scale }} aria-hidden="true" />;
};

const PointerAura = () => {
  const x = useMotionValue(-40);
  const y = useMotionValue(-40);
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: .28 });
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: .28 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    let clickTimer;
    const move = event => { x.set(event.clientX); y.set(event.clientY); };
    const over = event => setHovering(Boolean(event.target.closest('a, button, [role="button"]')));
    const down = () => { setClicking(true); clearTimeout(clickTimer); clickTimer = setTimeout(() => setClicking(false), 220); };
    const out = event => { if (!event.relatedTarget) setHovering(false); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerout', out, { passive: true });
    return () => { clearTimeout(clickTimer); window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); window.removeEventListener('pointerdown', down); window.removeEventListener('pointerout', out); };
  }, [x, y]);
  return <motion.div className="pointer-aura" style={{ x: springX, y: springY }} animate={{ scale: clicking ? .62 : hovering ? 1.8 : 1, opacity: hovering ? .92 : .45 }} transition={{ type: 'spring', stiffness: 340, damping: 24 }} aria-hidden="true"><i /></motion.div>;
};

const services = [
  { title: 'Residential Roofing', desc: 'A considered roof, beautifully fitted to the way you live.', img: '/images/project-valley.webp', tag: '01' },
  { title: 'Roof Replacement', desc: 'A fresh start above. Thoughtful from first layer to final line.', img: '/images/roof-shingles.jpg', tag: '02' },
  { title: 'Roof Repairs', desc: 'Careful diagnosis and lasting fixes, never quick cover-ups.', img: '/images/roofer.jpg', tag: '03' },
  { title: 'Metal Roofing', desc: 'Crisp profiles and enduring performance in every detail.', img: '/images/standing-seam.jpg', tag: '04' },
  { title: 'Roof Inspections', desc: 'A clear-eyed assessment, with the next step explained plainly.', img: '/images/roof-detail.jpg', tag: '05' },
  { title: 'Commercial Roofing', desc: 'Reliable roof systems, shaped around your property and plans.', img: '/images/project-ridge.webp', tag: '06' },
];
const projects = [
  { name: 'The Ridge House', place: 'Northwood · Residence', img: '/images/project-ridge.webp', cls: 'project-tall' },
  { name: 'A Study in Slate', place: 'Westhaven · Roof renewal', img: '/images/roof-shingles.jpg', cls: 'project-wide' },
  { name: 'Copperline Retreat', place: 'Cedar Valley · Standing seam', img: '/images/project-valley.webp', cls: '' },
  { name: 'The Evening House', place: 'Willow Creek · New build', img: '/images/project-dusk.jpg', cls: '' },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 850], [0, reduced ? 0 : 105]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = formOpen || menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [formOpen, menuOpen]);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setFormOpen(false); setMenuOpen(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  const openForm = () => { setMenuOpen(false); setSubmitted(false); setFormOpen(true); };
  const closeForm = () => setFormOpen(false);
  const testimonials = [
    { quote: 'The whole experience felt considered. From the first walkthrough to the final clean-up, every detail was handled with care.', name: 'Demo Client', meta: 'Residential project · Sample testimonial' },
    { quote: 'The finished roof feels like it belongs to the house in a way the old one never did. Clear communication made all the difference.', name: 'Demo Homeowner', meta: 'Roof replacement · Sample testimonial' },
    { quote: 'Thoughtful advice, beautiful workmanship, and a team that treated our home with genuine respect.', name: 'Demo Client', meta: 'Residential project · Sample testimonial' },
  ];
  const navItems = [['Approach', '#approach'], ['Services', '#services'], ['Selected work', '#work'], ['Our process', '#process']];

  return <>
    <ScrollProgress />
    {!reduced && <PointerAura />}
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="#top" aria-label="Oak and Iron Roofing home"><Mark /><span className="brand-type">OAK <i>&</i> IRON<span className="brand-sub">ROOFING, RECONSIDERED</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
      <button className="nav-cta" onClick={openForm}>Let’s talk <Arrow /></button>
      <button className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}><span/><span/></button>
    </header>
    <AnimatePresence>{menuOpen && <motion.div className="mobile-menu" initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .5, ease: [.76, 0, .24, 1] }}><nav aria-label="Mobile navigation">{navItems.map(([label, href], i) => <motion.a key={label} href={href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .18 + i * .07, duration: .45, ease: [.22, 1, .36, 1] }} whileTap={{ scale: .97 }}><span>0{i + 1}</span>{label}<Arrow diagonal /></motion.a>)}<button onClick={openForm}>Request an estimate <Arrow /></button></nav><p>CRAFTED FOR THE LONG VIEW.</p></motion.div>}</AnimatePresence>

    <main id="top">
      <section className="hero">
        <motion.div className="hero-photo" style={{ y: heroParallax }} initial={{ scale: reduced ? 1 : 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: [.22, 1, .36, 1] }} />
        <div className="hero-shade" />
        <div className="hero-caption"><i className="availability-dot"/><span>AVAILABLE FOR SELECT PROJECTS</span></div>
        <div className="hero-copy">
          <motion.p className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .7 }}>BUILT ABOVE. MADE TO LAST.</motion.p>
          <h1><motion.span initial={{ opacity: 0, y: 46 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .46, duration: .9, ease: [.22, 1, .36, 1] }}>Built Above.</motion.span><motion.span className="headline-italic" initial={{ opacity: 0, y: 46 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .61, duration: .9, ease: [.22, 1, .36, 1] }}>Made to Last.</motion.span></h1>
          <motion.div className="hero-bottom" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .82, duration: .8 }}><p>Exceptional roofing craftsmanship, thoughtful design, and protection engineered for the years ahead.</p><div className="hero-actions"><button className="button button-light" onClick={openForm}>Request a free estimate <Arrow /></button><a className="text-link light-link" href="#work">Explore our work <span>↘</span></a></div></motion.div>
        </div>
        <div className="hero-side-note">A HIGHER STANDARD<br/>OF SHELTER</div>
        <a href="#intro" className="scroll-cue"><span>SCROLL TO DISCOVER</span><i /></a>
        <div className="hero-index">01 <span> / </span> 06</div>
      </section>

      <section className="intro-section" id="intro">
        <div className="intro-top"><p className="eyebrow">A ROOF SHOULD DO MORE THAN COVER</p><span className="intro-note">Thoughtful work. Lasting peace of mind.</span></div>
        <div className="intro-grid"><Reveal><h2>Good work is<br/>felt <em>for years.</em></h2></Reveal><Reveal delay={.13} className="intro-description"><p>We believe the best roofs are the ones you don’t have to think about — because every detail has already been thought through.</p><a href="#approach" className="text-link">A little about us <span>↘</span></a></Reveal></div>
        <div className="principles">{[['01','Quality craftsmanship'],['02','Premium materials'],['03','Experienced professionals'],['04','Customer-first service']].map(([n,t], i) => <Reveal key={n} delay={i*.08} className="principle"><span>{n}</span><div className="principle-mark"><i/></div><p>{t}</p></Reveal>)}</div>
      </section>

      <section className="approach-section" id="approach">
        <div className="approach-image-wrap"><ScrollImage src="/images/roofer.jpg" alt="Roofing professionals carefully working on a residential roof" loading="lazy"/><span className="image-stamp">THE OAK & IRON<br/>APPROACH <i>✳</i></span><div className="image-caption">DETAIL IS THE DIFFERENCE <span>01 — 03</span></div></div>
        <div className="approach-copy"><Reveal><p className="eyebrow">MADE WITH INTENTION</p><h2>More than a roof.<br/><em>A commitment<br/>to quality.</em></h2></Reveal><Reveal delay={.12}><p className="body-copy">A roof is one of the most important things we build — and one of the least seen. That’s why we bring the same care to what’s underneath as we do to the lines you see from the street.</p><p className="body-copy">We pair considered materials with skilled, professional installation, keeping you informed at every turn. No shortcuts. No surprises. Just work made to stand the test of time.</p><a href="#process" className="text-link">Discover our approach <span>↘</span></a></Reveal><div className="approach-signature">O&I <span>BUILT WITH CARE, IN EVERY DETAIL</span></div></div>
      </section>

      <section className="services-section section-pad" id="services">
        <div className="section-heading"><Reveal><p className="eyebrow">WHAT WE DO, DONE WELL</p><h2>Considered care<br/><em>from the top down.</em></h2></Reveal><Reveal delay={.12} className="section-side-copy"><p>Every home is different. Our work starts with listening, then finding the right solution for yours.</p><a href="#contact" className="text-link" onClick={e=>{e.preventDefault();openForm();}}>Talk through your project <span>↗</span></a></Reveal></div>
        <div className="service-grid">{services.map((service, i) => <Reveal key={service.title} delay={(i%3)*.08} className="service-card"><a href="#contact" onClick={e=>{e.preventDefault();openForm();}} aria-label={`Discuss ${service.title}`}><div className="service-image"><ScrollImage src={service.img} alt="" loading="lazy"/><span className="service-tag">{service.tag} / 06</span><span className="service-arrow"><Arrow diagonal /></span></div><div className="service-info"><div><h3>{service.title}</h3><p>{service.desc}</p></div><span className="service-line"/></div></a></Reveal>)}</div>
        <div className="services-foot"><span>MADE FOR YOUR HOME. BUILT FOR WHAT’S NEXT.</span><span>01 — 06</span></div>
      </section>

      <section className="work-section" id="work">
        <div className="work-intro"><Reveal><p className="eyebrow">A FEW THINGS WE’VE MADE</p><h2>Craftsmanship<br/><em>you can see.</em></h2></Reveal><Reveal delay={.12} className="work-description"><p>Every home tells a different story. These are a few of the details we’re proud to be part of.</p><span className="work-asterisk">✳</span></Reveal></div>
        <div className="project-grid">{projects.map((project, i)=><Reveal key={project.name} delay={(i%2)*.08} className={`project-card ${project.cls}`}><a href="#contact" onClick={e=>{e.preventDefault();openForm();}}><div className="project-image"><ScrollImage src={project.img} alt={`${project.name}, a roofing and residential architecture project`} loading="lazy"/><span className="project-open"><Arrow diagonal /></span></div><div className="project-caption"><h3>{project.name}</h3><span>{project.place}</span></div></a></Reveal>)}</div>
        <div className="work-disclaimer">PROJECT IMAGERY IS PRESENTED AS A VISUAL DEMO.</div>
      </section>

      <section className="difference-section">
        <div className="difference-head"><Reveal><p className="eyebrow">THE OAK & IRON DIFFERENCE</p><h2>A better roof<br/><em>starts here.</em></h2></Reveal><Reveal delay={.1}><p className="difference-summary">The difference is rarely one grand gesture. It’s a hundred small decisions made with care.</p></Reveal></div>
        <div className="difference-list">{[['01','Attention to detail','Every edge, flashing and finish receives the care it deserves.'],['02','Quality materials','We choose materials for how they perform — and how they belong.'],['03','Transparent communication','You’ll know what we’re doing, why, and what comes next.'],['04','Professional workmanship','Experienced hands. Thoughtful execution. A tidy site.'],['05','Reliable service','We show up, follow through, and stand behind our work.']].map(([n,t,d],i)=><Reveal key={n} delay={i*.04} className="difference-row"><span className="difference-num">{n}</span><h3>{t}</h3><p>{d}</p><span className="difference-plus">↗</span></Reveal>)}</div>
      </section>

      <section className="process-section" id="process"><div className="process-top"><Reveal><p className="eyebrow">CLEAR FROM THE FIRST CONVERSATION</p><h2>A thoughtful process.<br/><em>A roof to trust.</em></h2></Reveal><Reveal delay={.12}><p>Good work begins with a clear plan. Here’s what working together looks like.</p></Reveal></div><div className="process-grid"><ProcessLine />{[['01','Consultation','We start by listening to what you need and what matters most.'],['02','Inspection','We take a close look and explain what we find, without the jargon.'],['03','Planning & estimate','A considered recommendation and a clear, detailed estimate.'],['04','Installation','Skilled work, a cared-for property, and a thorough final walkthrough.']].map(([n,t,d],i)=><Reveal key={n} delay={i*.1} className="process-step"><div className="step-top"><span>{n}</span><i /></div><h3>{t}</h3><p>{d}</p><span className="step-rule"/></Reveal>)}</div></section>

      <section className="testimonial-section"><div className="testimonial-kicker"><span className="eyebrow">KIND WORDS, SHARED WITH PERMISSION</span><span className="demo-label">DEMO TESTIMONIALS — NOT VERIFIED REVIEWS</span></div><div className="testimonial-main"><span className="quote-mark">“</span><AnimatePresence mode="wait"><motion.blockquote key={activeTestimonial} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .45 }}>{testimonials[activeTestimonial].quote}</motion.blockquote></AnimatePresence></div><div className="testimonial-bottom"><div className="testimonial-person"><span>{testimonials[activeTestimonial].name}</span><span>{testimonials[activeTestimonial].meta}</span></div><div className="quote-controls"><span>0{activeTestimonial+1} <i>/</i> 03</span><button onClick={()=>setActiveTestimonial((activeTestimonial+2)%3)} aria-label="Previous testimonial">←</button><button onClick={()=>setActiveTestimonial((activeTestimonial+1)%3)} aria-label="Next testimonial">→</button></div></div></section>

      <section className="closing-cta" id="contact"><div className="closing-image"/><div className="closing-shade"/><div className="closing-content"><Reveal><p className="eyebrow">A GOOD PLACE TO BEGIN</p><h2>Your home deserves<br/><em>better protection.</em></h2><p>Let’s build something that lasts.</p><button className="button button-light" onClick={openForm}>Get your free estimate <Arrow /></button></Reveal></div><div className="closing-bottom"><span>THOUGHTFUL ROOFING. BUILT FOR THE LONG VIEW.</span><span>KIND TO YOUR HOME. MADE TO LAST.</span></div></section>
    </main>

    <footer className="footer"><div className="footer-top"><div className="footer-brand"><a className="brand footer-logo" href="#top"><Mark /><span className="brand-type">OAK <i>&</i> IRON<span className="brand-sub">ROOFING, RECONSIDERED</span></span></a><p>Good work above.<br/>Peace of mind below.</p></div><div className="footer-col"><span className="footer-label">EXPLORE</span>{[['Our approach','#approach'],['Services','#services'],['Selected work','#work'],['The process','#process']].map(([l,h])=><a href={h} key={l}>{l}</a>)}</div><div className="footer-col"><span className="footer-label">OUR SERVICES</span>{['Residential roofing','Roof replacement','Roof repairs','Metal roofing'].map(s=><a href="#services" key={s}>{s}</a>)}</div><div className="footer-col footer-contact"><span className="footer-label">SAY HELLO</span><a href="tel:+10000000000">(000) 000-0000</a><a href="mailto:hello@oakandiron.example">hello@oakandiron.example</a><span>Serving your neighborhood<br/>and the homes around it.</span></div></div><div className="footer-bottom"><span>© 2026 OAK & IRON ROOFING. ALL RIGHTS RESERVED.</span><div><a href="#top">INSTAGRAM ↗</a><a href="#top">PINTEREST ↗</a></div><span>BUILT ABOVE. MADE TO LAST.</span></div></footer>

    <AnimatePresence>{formOpen && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} onMouseDown={e=>{if(e.target===e.currentTarget)closeForm();}}><motion.div className="estimate-modal" role="dialog" aria-modal="true" aria-labelledby="form-title" initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }} transition={{ duration: .4, ease: [.22,1,.36,1] }}><button className="modal-close" onClick={closeForm} aria-label="Close estimate form">×</button>{submitted ? <div className="success-state"><span className="success-symbol">✳</span><p className="eyebrow">DEMO SUBMISSION COMPLETE</p><h2>Thank you for<br/><em>getting in touch.</em></h2><p>This is a website demo. Your details were not sent or stored.</p><button className="button button-dark" onClick={closeForm}>Back to the site <Arrow /></button></div> : <><div className="modal-heading"><p className="eyebrow">A GOOD PLACE TO BEGIN</p><h2 id="form-title">Let’s talk about<br/><em>your roof.</em></h2><p>Tell us a little about your project. This demo form won’t send or store your information.</p></div><form onSubmit={e=>{e.preventDefault();setSubmitted(true);}}><div className="form-row"><label>Full name<input name="name" placeholder="Your name" required autoComplete="name"/></label><label>Phone number<input name="phone" type="tel" placeholder="(000) 000-0000" required autoComplete="tel"/></label></div><div className="form-row"><label>Email address<input name="email" type="email" placeholder="you@example.com" required autoComplete="email"/></label><label>Property address<input name="address" placeholder="Street, city, ZIP" required autoComplete="street-address"/></label></div><label>Service needed<select name="service" defaultValue="" required><option value="" disabled>Select a service</option>{services.map(s=><option key={s.title}>{s.title}</option>)}</select></label><label>Tell us about your project<textarea name="details" placeholder="What would you like us to know?" rows="3"/></label><button className="button button-dark form-submit" type="submit">Send project inquiry <Arrow /></button><p className="form-note">DEMO ONLY · SUBMITTING WILL NOT SEND YOUR INFORMATION</p></form></>}</motion.div></motion.div>}</AnimatePresence>
  </>;
}
