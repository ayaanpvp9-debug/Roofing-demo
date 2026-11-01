import { MotionPreferenceProvider, motionEnabled } from "./MotionPreference";
import { useKineticMotion, HeroSeal, KineticRibbon } from "./KineticMotion";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Plus,
  Minus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  MoveHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./style.css";
import {
  CinematicIntro,
  RoofAnatomy,
  CraftStory,
  SplitText,
} from "./Storytelling";
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
// Keep GSAP and Lenis on real elapsed time, including after slow frames.
gsap.ticker.lagSmoothing(0);
const images = {
  hero: "/images/ridgeline.webp",
  house: "/images/ridgeline.webp",
  modern: "/images/woodland.webp",
  detail: "/images/montecito.webp",
  dark: "/images/woodland.webp",
};
const services = [
  [
    "Residential Roofing",
    "Protection, beautifully considered.",
    "Crafted roofing systems that honor the architecture of your home. From material selection to the final detail, nothing is left to chance.",
    images.house,
  ],
  [
    "Commercial Roofing",
    "Performance at every scale.",
    "High-performance systems designed for demanding spaces, long-term efficiency, and business as usual.",
    images.modern,
  ],
  [
    "Roof Replacement",
    "A fresh perspective. A lasting future.",
    "A seamless transformation with carefully selected materials and uncompromising installation.",
    images.detail,
  ],
  [
    "Roof Inspections",
    "Confidence starts with clarity.",
    "A detailed assessment of your roofing system, with straightforward recommendations and a clear path forward.",
    images.hero,
  ],
  [
    "Storm Damage Restoration",
    "Resilience, restored.",
    "Responsive assessment and meticulous restoration when the unexpected happens.",
    images.dark,
  ],
  [
    "Metal Roofing",
    "Enduring by design.",
    "Architectural metal roofing that unites sculptural lines with exceptional durability.",
    images.modern,
  ],
];
const projects = [
  [
    "The Ridgeline Residence",
    "Austin, Texas",
    "Standing seam metal · 2025",
    images.house,
  ],
  [
    "Montecito Retreat",
    "Montecito, California",
    "Copper standing seam · 2025",
    images.detail,
  ],
  [
    "The Woodland House",
    "Asheville, North Carolina",
    "Custom metal system · 2024",
    images.modern,
  ],
];
import "./kinetic.css";

function App() {
  useKineticMotion();
  const [menu, setMenu] = useState(false),
    [service, setService] = useState(0),
    [compare, setCompare] = useState(50),
    [testimonial, setTestimonial] = useState(0),
    [sent, setSent] = useState(false),
    [activeProject, setActiveProject] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null),
    gallery = useRef<HTMLDivElement>(null);
  const smoothScroll = useRef<Lenis | null>(null);
  useEffect(() => {
    const reduce = !motionEnabled();
    let lenis: Lenis | undefined,
      raf = 0;
    if (!reduce) {
      lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        respectReducedMotion: false,
      });
      smoothScroll.current = lenis;
      const tick = (t: number) => {
        lenis!.raf(t);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      lenis.on("scroll", ScrollTrigger.update);
    }
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.from(".hero-char", {
        yPercent: 150,
        rotationX: -110,
        rotationZ: 12,
        scaleY: 1.8,
        duration: 0.9,
        stagger: 0.025,
        ease: "power4.out",
        delay: 1.6,
      });
      gsap.from(".hero-bottom", {
        clipPath: "inset(0 100% 0 0)",
        y: 30,
        duration: 1.2,
        delay: 2,
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
        gsap.fromTo(
          el,
          { y: 35, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%" },
          },
        ),
      );
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
        const obj = { n: 0 };
        gsap.to(obj, {
          n: Number(el.dataset.value),
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () =>
            (el.textContent =
              Math.round(obj.n).toLocaleString() + el.dataset.suffix),
        });
      });
    }, root);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    let disposed = false;
    let refreshFrame = 0;
    const refreshScenes = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        if (disposed) return;
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    };
    const onVisible = () => {
      if (!document.hidden) refreshScenes();
    };
    window.addEventListener("pageshow", refreshScenes);
    window.addEventListener("orientationchange", refreshScenes);
    document.addEventListener("visibilitychange", onVisible);
    document.fonts.ready.then(() => {
      if (!disposed) refreshScenes();
    });
    const cursor = document.querySelector<HTMLElement>(".cursor");
    const move = (e: PointerEvent) => {
      if (cursor) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("pointermove", move);
    return () => {
      disposed = true;
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener("pageshow", refreshScenes);
      window.removeEventListener("orientationchange", refreshScenes);
      document.removeEventListener("visibilitychange", onVisible);
      ctx.revert();
      lenis?.destroy();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);
  useEffect(() => {
    const blocked = menu || activeProject !== null;
    document.body.style.overflow = blocked ? "hidden" : "";
    if (blocked) smoothScroll.current?.stop();
    else smoothScroll.current?.start();
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu, activeProject]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setActiveProject(null);
      }
      if (e.key === "Tab" && (menu || activeProject !== null)) {
        const panel = document.querySelector(
          activeProject !== null ? ".project-modal" : ".menu-panel",
        );
        const items = panel?.querySelectorAll<HTMLElement>("a,button");
        if (!items?.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [menu, activeProject]);
  useEffect(() => {
    if (!motionEnabled() || !matchMedia("(hover:hover)").matches) return;
    const clean: (() => void)[] = [];
    document
      .querySelectorAll<HTMLElement>(".magnetic,.gallery-controls button")
      .forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          gsap.to(el, {
            x: (e.clientX - r.left - r.width / 2) * 0.18,
            y: (e.clientY - r.top - r.height / 2) * 0.2,
            duration: 0.35,
          });
        };
        const leave = () =>
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.5)" });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        clean.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    return () => clean.forEach((f) => f());
  }, []);

  useEffect(() => {
    const el = gallery.current;
    if (!el) return;
    const progress = document.querySelector<HTMLElement>(
      ".gallery-progress span",
    );
    const update = () => {
      if (progress) {
        const total = el.scrollWidth - el.clientWidth;
        progress.style.transform = `scaleX(${total > 0 ? 0.1 + (0.9 * el.scrollLeft) / total : 1})`;
      }
    };
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  useEffect(() => {
    if (
      !motionEnabled() ||
      !matchMedia("(hover:hover) and (pointer:fine)").matches
    )
      return;
    const hero = document.querySelector<HTMLElement>(".hero")!;
    const image = hero.querySelector(".hero-image");
    const move = (e: PointerEvent) => {
      gsap.to(image, {
        x: (e.clientX / innerWidth - 0.5) * 18,
        rotation: (e.clientX / innerWidth - 0.5) * 0.3,
        duration: 1.2,
        overwrite: "auto",
      });
    };
    const leave = () => gsap.to(image, { x: 0, rotation: 0, duration: 1 });
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    const cursor = document.querySelector(".cursor");
    const over = (e: PointerEvent) =>
      cursor?.classList.toggle(
        "is-project",
        !!(e.target as Element).closest(".project"),
      );
    document.addEventListener("pointerover", over);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerover", over);
      gsap.killTweensOf(image);
    };
  }, []);
  useEffect(() => {
    const el = gallery.current;
    if (!el) return;
    let start = 0,
      scroll = 0,
      dragged = false,
      down = false;
    const begin = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      dragged = false;
      start = e.clientX;
      scroll = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!down) return;
      if (Math.abs(e.clientX - start) > 7) {
        dragged = true;
        el.classList.add("is-dragging");
        el.scrollLeft = scroll - (e.clientX - start);
      }
    };
    const end = () => {
      down = false;
      el.classList.remove("is-dragging");
    };
    const click = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };
    const prevent = (e: DragEvent) => e.preventDefault();
    el.addEventListener("pointerdown", begin);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    el.addEventListener("click", click, true);
    el.addEventListener("dragstart", prevent);
    return () => {
      el.removeEventListener("pointerdown", begin);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      el.removeEventListener("click", click, true);
      el.removeEventListener("dragstart", prevent);
    };
  }, []);
  const quotes = [
    [
      "They didn’t just replace our roof. They completely elevated our home. The level of care was unlike anything we’ve experienced.",
      "Alex & Morgan R.",
      "Residential project · Austin, TX",
    ],
    [
      "Every line, every finish, every detail. The result feels like it was always meant to be part of the architecture.",
      "Jamie L.",
      "Metal roofing · Montecito, CA",
    ],
    [
      "Clear communication from the first conversation to the final inspection. A remarkable team and an even better result.",
      "Chris & Taylor W.",
      "Roof replacement · Asheville, NC",
    ],
  ];
  return (
    <div ref={root}>
      <CinematicIntro />
      <div className="cursor" />
      <motion.div className="progress" style={{ scaleX: undefined }} />
      <header>
        <a className="brand" href="#home" aria-label="Roofcraft home">
          <svg
            className="brand-roof"
            viewBox="0 0 44 32"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 26L22 6L42 26M10 26L22 14L34 26M18 26L22 22L26 26"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>{" "}
          ROOFCRAFT<span className="reg">®</span>
        </a>
        <nav>
          <a href="#about">Our approach</a>
          <a href="#services">Expertise</a>
          <a href="#work">Selected work</a>
        </nav>
        <a href="#contact" className="nav-cta">
          Let’s talk <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-button"
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          aria-controls="mobile-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobile-navigation"
            className="menu-panel"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          >
            {[
              "Our approach",
              "Expertise",
              "Selected work",
              "Get an estimate",
            ].map((x, i) => (
              <motion.a
                key={x}
                initial={{ y: 100, rotateX: -65 }}
                animate={{ y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.75,
                  delay: i * 0.08 + 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => setMenu(false)}
                href={["#about", "#services", "#work", "#contact"][i]}
              >
                <sup>0{i + 1}</sup>
                {x}
                <ArrowUpRight />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <main>
        <section className="hero" id="home">
          <img
            className="hero-image"
            src={images.hero}
            alt="Sculptural modern residence with striking architectural rooflines"
            fetchPriority="high"
            srcSet="/images/ridgeline-small.webp 800w, /images/ridgeline.webp 1920w"
            sizes="100vw"
          />
          <div className="hero-shade" />
          <HeroSeal />
          <div className="hero-light" />
          <div className="hero-measure" />
          <div className="hero-topline">
            <span>
              <i /> A HIGHER STANDARD OF ROOFING
            </span>
            <span>EST. 2010 — BUILT FOR WHAT’S NEXT</span>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="mask">
                <span className="word">
                  <SplitText text="BUILT ABOVE" />
                </span>
              </span>
              <span className="mask">
                <span className="word outline">
                  <SplitText text="EXPECTATIONS." />
                </span>
              </span>
            </h1>
            <div className="hero-bottom">
              <p>
                Precision roofing. Extraordinary protection.
                <br />
                Built to last.
              </p>
              <a href="#work" className="button copper magnetic">
                Explore our work <ArrowUpRight size={19} />
              </a>
              <a href="#contact" className="text-link">
                Get a free estimate <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="hero-foot">
            <a href="#about" className="scroll-cue">
              <span>
                <ArrowDown size={15} />
              </span>{" "}
              SCROLL TO DISCOVER
            </a>
            <span>CRAFTED WITH PURPOSE. BUILT WITHOUT COMPROMISE.</span>
            <span className="hero-index">01 — 06</span>
          </div>
          <div className="vertical-label">FORM. FUNCTION. FOREVER.</div>
        </section>
        <div className="trust-strip">
          <span>EXCEPTIONAL FROM THE TOP DOWN.</span>
          <span>
            <Check /> Precision craftsmanship
          </span>
          <span>
            <Check /> Premium materials
          </span>
          <span>
            <Check /> Built for the long run
          </span>
          <span className="strip-star">✳</span>
        </div>
        <KineticRibbon />
        <section className="intro section-pad" id="about">
          <div className="eyebrow" data-reveal>
            <span>01 / THE ROOFCRAFT STANDARD</span>
            <span>NOT JUST A ROOF. A PROMISE.</span>
          </div>
          <div className="intro-grid">
            <div data-reveal>
              <h2>
                Good roofs protect.
                <br />
                Great roofs <em>inspire.</em>
              </h2>
              <div className="intro-caption">
                <span className="small-cross">+</span>
                <p>
                  We believe what’s above you should be
                  <br />
                  as considered as everything beneath it.
                </p>
              </div>
            </div>
            <div className="intro-copy" data-reveal>
              <p>
                A roof is more than the finishing touch. It’s the first line of
                protection. The defining line of your architecture. And the
                quiet confidence that your world is covered.
              </p>
              <p>
                We bring a craftsman’s obsession and an architect’s eye to every
                project. Thoughtfully designed. Precisely installed. Built above
                expectations.
              </p>
              <a className="text-link dark-link" href="#services">
                Discover the difference <ArrowUpRight size={19} />
              </a>
            </div>
          </div>
          <div className="stats">
            {[
              ["15", "+", "Years of experience"],
              ["2500", "+", "Projects completed"],
              ["100", "%", "Commitment to quality"],
              ["24", "/7", "Emergency support"],
            ].map(([v, s, l]) => (
              <div className="stat" key={l}>
                <span className="stat-number" data-value={v} data-suffix={s}>
                  {v}
                  {s}
                </span>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <p className="demo-note">
            A concept company. All statistics, projects, and client stories are
            illustrative demo content.
          </p>
        </section>
        <RoofAnatomy />
        <section className="services section-pad" id="services">
          <div className="eyebrow" data-reveal>
            <span>02 / OUR EXPERTISE</span>
            <span>EVERY DETAIL. EVERY ANGLE.</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2>
              Consider it <em>covered.</em>
            </h2>
            <p>
              Specialized expertise.
              <br />
              One uncompromising standard.
            </p>
          </div>
          <div className="service-layout">
            <div className="service-list">
              {services.map(([name, tag, desc, img], i) => (
                <div
                  className={
                    "service-item " + (service === i ? "selected" : "")
                  }
                  key={name}
                >
                  <button
                    aria-expanded={service === i}
                    onClick={() => setService(i)}
                  >
                    <span className="number">0{i + 1}</span>
                    <span>{name}</span>
                    {service === i ? <Minus /> : <Plus />}
                  </button>
                  <AnimatePresence initial={false}>
                    {service === i && (
                      <motion.div
                        className="service-description"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <p>{desc}</p>
                        <a href="#contact">
                          Let’s talk about your project{" "}
                          <ArrowUpRight size={15} />
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <div className="service-photo">
              <AnimatePresence mode="wait">
                <motion.img
                  key={service}
                  src={services[service][3]}
                  srcSet={`${services[service][3].replace(".webp", "-small.webp")} 800w, ${services[service][3]} 1920w`}
                  sizes="(max-width: 650px) 90vw, 45vw"
                  alt={services[service][0] + " architectural example"}
                  loading="lazy"
                  initial={{
                    clipPath: "inset(0 100% 0 0)",
                    scale: 1.35,
                    rotate: 4,
                  }}
                  animate={{ clipPath: "inset(0 0% 0 0)", scale: 1, rotate: 0 }}
                  exit={{
                    clipPath: "inset(0 0 0 100%)",
                    scale: 0.95,
                    rotate: -4,
                  }}
                  transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
                />
              </AnimatePresence>
              <div className="photo-label">
                <span>{services[service][1]}</span>
                <ArrowUpRight />
              </div>
              <span className="photo-counter">0{service + 1} / 06</span>
            </div>
          </div>
        </section>
        <CraftStory />
        <section className="work section-pad" id="work">
          <div className="eyebrow" data-reveal>
            <span>03 / SELECTED WORK</span>
            <span>BUILT TO SPEAK FOR ITSELF.</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2>
              PROOF IS IN
              <br />
              THE <em>ROOF.</em>
              <span className="heading-period">↗</span>
            </h2>
            <div>
              <p>
                A few rooftops.
                <br />A higher point of view.
              </p>
              <div className="gallery-controls">
                <button
                  aria-label="Previous projects"
                  onClick={() =>
                    gallery.current?.scrollBy({
                      left: -650,
                      behavior: "smooth",
                    })
                  }
                >
                  <ChevronLeft />
                </button>
                <button
                  aria-label="Next projects"
                  onClick={() =>
                    gallery.current?.scrollBy({ left: 650, behavior: "smooth" })
                  }
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
          <div className="projects" ref={gallery}>
            {projects.map(([name, loc, type, img], i) => (
              <button
                className="project"
                key={name}
                onClick={() => setActiveProject(i)}
              >
                <div className="project-image">
                  <img
                    src={img}
                    srcSet={`${img.replace(".webp", "-small.webp")} 800w, ${img} 1920w`}
                    sizes="(max-width: 650px) 90vw, 65vw"
                    alt={name}
                    loading="lazy"
                  />
                  <span className="project-pill">
                    VIEW PROJECT <ArrowUpRight size={16} />
                  </span>
                  <span className="project-no">0{i + 1}</span>
                </div>
                <div className="project-info">
                  <div>
                    <h3>{name}</h3>
                    <p>{loc}</p>
                  </div>
                  <span>{type}</span>
                  <ArrowUpRight />
                </div>
              </button>
            ))}
          </div>
          <div className="gallery-progress" aria-hidden="true">
            <span />
          </div>
          <div className="work-bottom">
            <span>RESIDENTIAL / COMMERCIAL / EXCEPTIONAL</span>
            <span>
              DRAG OR SCROLL TO EXPLORE <ArrowRight size={15} />
            </span>
          </div>
        </section>
        <section className="transformation section-pad">
          <div className="eyebrow" data-reveal>
            <span>04 / THE TRANSFORMATION</span>
            <span>A DIFFERENCE YOU CAN FEEL.</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2>
              Same home.
              <br />
              <em>New perspective.</em>
            </h2>
            <p>
              Not just restored. Reimagined.
              <br />
              Slide to see what a higher standard looks like.
            </p>
          </div>
          <div
            className="comparison"
            style={{ "--position": compare + "%" } as React.CSSProperties}
          >
            <img
              src={images.house}
              alt="Restored architectural home"
              loading="lazy"
            />
            <div className="before-image">
              <img
                src={images.house}
                alt="Simulated weathered appearance before restoration"
                loading="lazy"
              />
            </div>
            <span className="before-tag">BEFORE</span>
            <span className="after-tag">AFTER</span>
            <div className="comparison-line">
              <span>
                <MoveHorizontal size={25} />
              </span>
            </div>
            <input
              aria-label="Compare simulated before and after restoration"
              type="range"
              min="0"
              max="100"
              value={compare}
              onChange={(e) => setCompare(Number(e.target.value))}
            />
          </div>
          <div className="comparison-caption">
            <span>THE RIDGELINE RESIDENCE — AUSTIN, TX</span>
            <span>
              Illustrative transformation · Before appearance digitally
              simulated
            </span>
          </div>
        </section>
        <section className="why section-pad" id="why">
          <div className="eyebrow" data-reveal>
            <span>WHY ROOFCRAFT</span>
            <span>THE DIFFERENCE IS IN THE DETAILS.</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2>
              Never ordinary.
              <br />
              <em>Always considered.</em>
            </h2>
            <p>
              Protection is the baseline.
              <br />
              Peace of mind is the standard.
            </p>
          </div>
          <div className="why-grid">
            {[
              [
                "01",
                "Architecture, respected.",
                "Your roof should belong to your home. Every line and material is selected to honor the design beneath it.",
              ],
              [
                "02",
                "Nothing left to chance.",
                "Clear planning, thoughtful execution, and a meticulous final inspection. Care is built into the process.",
              ],
              [
                "03",
                "Made for the long view.",
                "Durable systems and carefully resolved details. Because a higher standard should stand the test of time.",
              ],
            ].map(([n, title, copy]) => (
              <article key={n}>
                <span>{n} /</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <ArrowUpRight size={22} />
              </article>
            ))}
          </div>
          <p className="demo-note">
            Our approach is illustrative. ROOFCRAFT is a fictional studio, not
            an active contractor.
          </p>
        </section>
        <section className="testimonials section-pad">
          <div className="eyebrow">
            <span>05 / WORD ON THE ROOF</span>
            <span>TRUST IS EARNED. EVERY TIME.</span>
          </div>
          <div className="quote-layout">
            <div className="quote-mark">“</div>
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonial}
                  initial={{
                    x: "100%",
                    rotate: 5,
                    clipPath: "inset(0 0 100% 0)",
                  }}
                  animate={{ x: 0, rotate: 0, clipPath: "inset(0 0 0% 0)" }}
                  exit={{
                    x: "-100%",
                    rotate: -5,
                    clipPath: "inset(100% 0 0 0)",
                  }}
                  transition={{ duration: 0.35 }}
                >
                  <blockquote>{quotes[testimonial][0]}</blockquote>
                  <div className="quote-author">
                    <span className="author-avatar">
                      {quotes[testimonial][1][0]}
                    </span>
                    <div>
                      <strong>{quotes[testimonial][1]}</strong>
                      <p>{quotes[testimonial][2]}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="quote-bottom">
                <span>ILLUSTRATIVE CLIENT STORY</span>
                <div>
                  <button
                    aria-label="Previous testimonial"
                    onClick={() => setTestimonial((testimonial + 2) % 3)}
                  >
                    <ChevronLeft size={19} />
                  </button>
                  <span>0{testimonial + 1} / 03</span>
                  <button
                    aria-label="Next testimonial"
                    onClick={() => setTestimonial((testimonial + 1) % 3)}
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="contact section-pad" id="contact">
          <div className="eyebrow">
            <span>06 / LET’S BUILD SOMETHING LASTING</span>
            <span>YOUR NEXT CHAPTER STARTS AT THE TOP.</span>
          </div>
          <div className="contact-grid">
            <div data-reveal>
              <h2>
                YOUR ROOF
                <br />
                DESERVES
                <br />
                <em>BETTER.</em>
                <ArrowUpRight className="contact-arrow" />
              </h2>
              <p>
                Tell us what you have in mind.
                <br />
                We’ll take it from here.
              </p>
              <a
                className="contact-email"
                href="mailto:hello@roofcraft.example"
              >
                hello@roofcraft.example <ArrowUpRight size={20} />
              </a>
              <span className="demo-note">
                Fictional brand · Not an active roofing service
              </span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              {sent ? (
                <div className="success" role="status">
                  <span>
                    <Check size={32} />
                  </span>
                  <h3>Your details are validated.</h3>
                  <p>
                    Nothing has been sent or stored. This demo validates your
                    details locally. Actual estimate delivery requires a
                    connected backend or form service.
                  </p>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setSent(false)}
                  >
                    Return to form <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-row">
                    <label>
                      Your name
                      <input
                        required
                        name="name"
                        placeholder="Alex Morgan"
                        autoComplete="name"
                      />
                    </label>
                    <label>
                      Email address
                      <input
                        type="email"
                        required
                        name="email"
                        placeholder="alex@example.com"
                        autoComplete="email"
                      />
                    </label>
                  </div>
                  <label>
                    Phone number
                    <input
                      type="tel"
                      required
                      name="phone"
                      pattern={String.raw`[+0-9\(\) .\-]{7,25}`}
                      title="Enter 7 to 25 characters using numbers, spaces, +, parentheses, or dashes"
                      placeholder="Your phone number"
                      autoComplete="tel"
                    />
                  </label>
                  <div className="form-row">
                    <label>
                      Property type
                      <select required defaultValue="">
                        <option disabled value="">
                          Select property type
                        </option>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Other</option>
                      </select>
                    </label>
                    <label>
                      Service required
                      <select required defaultValue="">
                        <option disabled value="">
                          How can we help?
                        </option>
                        {services.map((s) => (
                          <option key={s[0]}>{s[0]}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    A little about your project
                    <textarea
                      name="description"
                      required
                      placeholder="Your vision, your timeline, your questions..."
                      rows={3}
                    />
                  </label>
                  <button className="button copper submit" type="submit">
                    GET MY FREE ESTIMATE <ArrowUpRight size={20} />
                  </button>
                  <p className="form-note">
                    No pressure. No obligations. Just a conversation about
                    what’s possible.
                    <br />
                    Demo only. No message is sent. Delivery requires a backend
                    or form service.
                  </p>
                </>
              )}
            </form>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a className="brand" href="#home">
            <svg
              className="brand-roof"
              viewBox="0 0 44 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 26L22 6L42 26M10 26L22 14L34 26M18 26L22 22L26 26"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>{" "}
            ROOFCRAFT<sup>®</sup>
          </a>
          <span>ABOVE ALL. BEYOND ORDINARY.</span>
          <a href="#home">
            BACK TO TOP <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="footer-word">
          ROOFCRAFT<span>®</span>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} ROOFCRAFT. A FICTIONAL CONCEPT.
          </span>
          <div>
            <a href="#about">Our approach</a>
            <a href="#services">Expertise</a>
            <a href="#contact">Contact</a>
          </div>
          <span>DESIGNED TO RISE ABOVE.</span>
        </div>
      </footer>
      <AnimatePresence>
        {activeProject !== null && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
          >
            <motion.article
              data-lenis-prevent
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-label={projects[activeProject][0]}
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                autoFocus
                className="modal-close"
                aria-label="Close project"
                onClick={() => setActiveProject(null)}
              >
                <X />
              </button>
              <img
                src={projects[activeProject][3]}
                alt={projects[activeProject][0]}
              />
              <div>
                <span className="eyebrow">
                  SELECTED PROJECT / 0{activeProject + 1}
                </span>
                <h2>{projects[activeProject][0]}</h2>
                <p>
                  {projects[activeProject][1]} · {projects[activeProject][2]}
                </p>
                <p>
                  A carefully considered roofing system, designed to complement
                  the architecture and deliver enduring protection. Precision
                  detailing and premium finishes define every angle.
                </p>
                <small>
                  Fictional portfolio project, presented for demonstration.
                </small>
                <a
                  className="button copper"
                  href="#contact"
                  onClick={() => setActiveProject(null)}
                >
                  Create something like this <ArrowUpRight size={18} />
                </a>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <MotionPreferenceProvider>
    <App />
  </MotionPreferenceProvider>,
);
