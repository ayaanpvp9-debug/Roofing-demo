import { motionEnabled } from "./MotionPreference";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import "./storytelling.css";

gsap.registerPlugin(ScrollTrigger);

export function SplitText({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {Array.from(text).map((char, i) => (
        <span className="hero-char" aria-hidden="true" key={i}>
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </span>
  );
}

export function CinematicIntro() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!motionEnabled()) {
      ref.current?.removeAttribute("data-playing");
      return;
    }
    const safety = window.setTimeout(
      () => ref.current?.removeAttribute("data-playing"),
      2600,
    );
    const context = gsap.context(() => {
      const count = { n: 0 };
      const number = ref.current!.querySelector(".intro-percent")!;
      gsap
        .timeline()
        .fromTo(
          ".intro-logo path",
          { strokeDashoffset: 220 },
          { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
        )
        .to(
          count,
          {
            n: 100,
            duration: 0.65,
            onUpdate: () => {
              number.textContent = String(Math.round(count.n)).padStart(3, "0");
            },
          },
          0,
        )
        .to(
          ".intro-rule span",
          { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
          0,
        )
        .to(".intro-lockup", { y: -20, opacity: 0, duration: 0.35 }, 1)
        .to(
          ref.current,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.7,
            ease: "power4.inOut",
            onComplete: () => ref.current?.removeAttribute("data-playing"),
          },
          1.15,
        );
    }, ref);
    return () => {
      window.clearTimeout(safety);
      context.revert();
    };
  }, []);
  return (
    <div
      ref={ref}
      className="cinematic-intro"
      data-playing="true"
      aria-hidden="true"
    >
      <div className="intro-lockup">
        <svg className="intro-logo" viewBox="0 0 120 80" fill="none">
          <path
            d="M8 62L60 12L112 62M26 62L60 30L94 62M44 62L60 48L76 62"
            stroke="currentColor"
            strokeWidth="2"
            pathLength="220"
            strokeDasharray="220"
          />
        </svg>
        <span className="intro-brand">ROOFCRAFT</span>
        <span className="intro-tag">A HIGHER PERSPECTIVE</span>
        <div className="intro-rule">
          <span />
        </div>
        <span className="intro-progress-label">
          SETTING THE STANDARD{" "}
          <b>
            <span className="intro-percent">000</span>%
          </b>
        </span>
      </div>
      <span className="intro-corner">FORM / FUNCTION / FOREVER</span>
    </div>
  );
}

const layers = [
  {
    name: "Architectural finish",
    detail: "Standing seam metal · the outer expression",
    color: "#d98250",
  },
  {
    name: "Weather barrier",
    detail: "Continuous protection · engineered resilience",
    color: "#8c9a83",
  },
  {
    name: "Thermal insulation",
    detail: "Comfort within · efficiency throughout",
    color: "#b9af91",
  },
  {
    name: "Structural foundation",
    detail: "Precision decking · strength from the start",
    color: "#535d50",
  },
];

export function RoofAnatomy() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 0px)",
      () => {
        if (!motionEnabled()) return;
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: "roof-anatomy",
            trigger: ref.current,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .fromTo(
            ".anatomy-photo img",
            { scale: 1 },
            { scale: 1.55, duration: 1 },
          )
          .to(".anatomy-photo", { opacity: 0.08, duration: 0.6 }, 0.7)
          .fromTo(
            ".roof-diagram",
            {
              opacity: 1,
              scale: 0.05,
              rotationY: -120,
              rotationZ: -25,
              z: -500,
            },
            {
              opacity: 1,
              scale: 1,
              rotationY: 0,
              rotationZ: 0,
              z: 0,
              duration: 0.8,
            },
            0.8,
          )
          .fromTo(
            ".roof-layer",
            { y: 0, rotationX: 0, rotationZ: 0, x: 0 },
            {
              y: (i) => (i - 1.5) * (innerWidth <= 900 ? 55 : 80),
              x: (i) => (i - 1.5) * (innerWidth <= 900 ? 4 : 14),
              rotationX: 18,
              rotationZ: (i) => (i - 1.5) * 4,
              stagger: 0.08,
              duration: 1,
            },
            1.2,
          )
          .fromTo(
            ".roof-label",
            { opacity: 0, x: 25 },
            { opacity: 1, x: 0, stagger: 0.15, duration: 0.5 },
            1.7,
          )
          .to(".anatomy-status", { opacity: 0, duration: 0.2 }, 2.6)
          .to(".roof-label", { opacity: 0, duration: 0.35 }, 3.1)
          .to(
            ".roof-layer",
            {
              y: 0,
              x: 0,
              rotationX: 0,
              rotationZ: 0,
              duration: 1,
              stagger: 0.06,
              ease: "power2.inOut",
            },
            3.2,
          )
          .fromTo(
            ".anatomy-complete",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            3.9,
          )
          .to({}, { duration: 0.5 });
        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      },
      ref,
    );
    return () => mm.revert();
  }, []);
  return (
    <section className="anatomy" ref={ref} id="anatomy">
      <div className="anatomy-photo">
        <img
          src="/images/ridgeline.webp"
          alt="Architectural residence with a precision-crafted roof"
          loading="lazy"
        />
      </div>
      <div className="anatomy-grid" />
      <div className="anatomy-heading">
        <div className="eyebrow">
          <span>ENGINEERED FROM THE INSIDE OUT</span>
          <span>TECHNICAL STUDY / 001</span>
        </div>
        <h2>
          Beauty above.
          <br />
          <em>Brilliance beneath.</em>
        </h2>
        <p>
          Four layers. One extraordinary system.
          <br />
          Explore the anatomy of lasting protection.
        </p>
      </div>
      <div
        className="roof-diagram"
        role="img"
        aria-label="Illustrative exploded roof system with architectural finish, weather barrier, thermal insulation and structural decking"
      >
        {layers.map((layer, i) => (
          <div
            className="roof-layer"
            key={layer.name}
            style={
              {
                zIndex: 4 - i,
                "--layer-color": layer.color,
              } as React.CSSProperties
            }
          >
            <svg viewBox="0 0 480 190" className="layer-plane">
              <defs>
                <pattern
                  id={"seams-" + i}
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(-25)"
                >
                  <path d="M0 0V30" stroke="#ffffff40" strokeWidth="1" />
                </pattern>
              </defs>
              <path
                d="M15 100L240 10L465 100L240 180Z"
                fill={layer.color}
                fillOpacity=".85"
                stroke={layer.color}
              />
              <path
                d="M15 100L240 10L465 100L240 180Z"
                fill={"url(#seams-" + i + ")"}
              />
              <path
                d="M15 100V112L240 190L465 112V100L240 180Z"
                fill={layer.color}
                opacity=".45"
              />
            </svg>
            <div className="roof-label">
              <span>0{i + 1}</span>
              <div>
                <strong>{layer.name}</strong>
                <small>{layer.detail}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="anatomy-bottom">
        <span className="anatomy-status">
          <ArrowDown size={15} /> SCROLL TO EXPLODE / CONTINUE TO ASSEMBLE
        </span>
        <span className="anatomy-complete">
          EVERY LAYER. ONE PROMISE. <ArrowUpRight size={17} />
        </span>
        <small>Illustrative system · not a construction specification</small>
      </div>
    </section>
  );
}

const craft = [
  {
    title: "Vision first.",
    word: "01 / CONSIDER",
    text: "Every roof begins with a different perspective. We study the architecture, the landscape, and the way you live.",
    image: "ridgeline",
  },
  {
    title: "Precision always.",
    word: "02 / CRAFT",
    text: "A millimeter matters. From the first seam to the last flashing, intention becomes execution.",
    image: "montecito",
  },
  {
    title: "Beyond the finish.",
    word: "03 / ENDURE",
    text: "A beautiful result is only the beginning. Our approach is built around lasting protection and peace of mind.",
    image: "woodland",
  },
];

export function CraftStory() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 0px)",
      () => {
        if (!motionEnabled()) return;
        const distance = () =>
          track.current!.scrollWidth - ref.current!.clientWidth;
        const tl = gsap.timeline({
          scrollTrigger: {
            id: "our-craft",
            trigger: ref.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        tl.to(track.current, { x: () => -distance(), ease: "none" }, 0).fromTo(
          ".craft-progress span",
          { scaleX: 0 },
          { scaleX: 1, ease: "none" },
          0,
        );
        gsap.utils.toArray<HTMLElement>(".craft-panel").forEach((panel) => {
          gsap.fromTo(
            panel.querySelector(".craft-copy h2"),
            { xPercent: 55, rotationY: 50, skewX: -14 },
            {
              xPercent: 0,
              rotationY: 0,
              skewX: 0,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tl,
                start: "left right",
                end: "left left",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            panel.querySelector(".craft-number"),
            { rotation: 90, scale: 0.3 },
            {
              rotation: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tl,
                start: "left right",
                end: "left left",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            panel.querySelector("img"),
            {
              clipPath: "polygon(20% 0,100% 15%,80% 100%,0 85%)",
              scale: 1.3,
              rotationZ: 8,
              rotationY: -25,
            },
            {
              clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)",
              scale: 1,
              rotationZ: 0,
              rotationY: 0,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tl,
                start: "left right",
                end: "left left",
                scrub: true,
              },
            },
          );
        });
      },
      ref,
    );
    return () => mm.revert();
  }, []);
  return (
    <section className="craft-story" ref={ref} id="craft">
      <div className="craft-top">
        <span>THE ROOFCRAFT METHOD</span>
        <span>CONSIDERED / CRAFTED / ENDURING</span>
      </div>
      <div className="craft-track" ref={track}>
        {craft.map((item, i) => (
          <article className="craft-panel" key={item.word}>
            <div className="craft-visual">
              <img
                src={"/images/" + item.image + ".webp"}
                srcSet={`/images/${item.image}-small.webp 800w, /images/${item.image}.webp 1920w`}
                sizes="(max-width: 600px) 90vw, 55vw"
                alt={item.title + " Architectural project study"}
                loading="lazy"
              />
              <span>ROOFCRAFT / STUDY 0{i + 1}</span>
            </div>
            <div className="craft-copy">
              <span className="eyebrow">{item.word}</span>
              <h2>
                {item.title.split(" ")[0]}
                <br />
                <em>{item.title.split(" ").slice(1).join(" ")}</em>
              </h2>
              <p>{item.text}</p>
              <span className="craft-number">
                0{i + 1}
                <span> / 03</span>
              </span>
            </div>
          </article>
        ))}
      </div>
      <div className="craft-progress">
        <span />
      </div>
      <div className="craft-bottom">
        <span>OUR CRAFT. YOUR CONFIDENCE.</span>
        <span>
          SCROLL TO DISCOVER <ArrowUpRight size={15} />
        </span>
      </div>
    </section>
  );
}
