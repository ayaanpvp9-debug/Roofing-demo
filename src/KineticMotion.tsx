import { motionEnabled } from "./MotionPreference";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** A motion score: scroll-scrubbed geometry, never a pile of fade-in effects. */
export function useKineticMotion() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: "(min-width: 901px)",
        mobile: "(max-width: 900px)",
      },
      (context) => {
        if (!motionEnabled()) return;
        const desktop = context.conditions?.desktop;
        const hero = gsap.timeline({
          scrollTrigger: {
            id: "hero-disassemble",
            refreshPriority: 10,
            trigger: ".hero",
            start: "top top",
            end: "+=110%",
            scrub: 0.65,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        hero
          .to(
            ".hero-image",
            {
              scale: desktop ? 1.65 : 1.5,
              yPercent: 12,
              ease: "none",
              duration: 1,
            },
            0,
          )
          .to(
            ".hero-title .mask:first-child .word",
            {
              xPercent: -90,
              rotation: -7,
              ease: "power1.in",
              duration: 1,
            },
            0,
          )
          .to(
            ".hero-title .mask:last-child .word",
            {
              xPercent: 90,
              rotation: 7,
              ease: "power1.in",
              duration: 1,
            },
            0,
          )
          .to(
            ".hero-bottom",
            { autoAlpha: 0, duration: 0.18, ease: "power2.out" },
            0.1,
          )
          .to(".hero-content", { autoAlpha: 0, duration: 0.14 }, 0.26)
          .to(
            ".hero-topline, .hero-foot, .vertical-label, .hero-measure, .hero-light",
            { autoAlpha: 0, duration: 0.18 },
            0.18,
          )
          .to(
            ".hero-shade",
            { backgroundColor: "#101211", duration: 0.25 },
            0.25,
          )
          .fromTo(
            ".hero-seal",
            { scale: 0.15, rotation: -120, clipPath: "circle(0% at 50% 50%)" },
            {
              scale: 1,
              rotation: 0,
              clipPath: "circle(75% at 50% 50%)",
              duration: 0.56,
              ease: "power2.out",
            },
            0.44,
          );

        gsap.utils
          .toArray<HTMLElement>(
            ".intro h2, .services .section-heading h2, .transformation h2, .why h2, .contact h2",
          )
          .forEach((el) => {
            gsap.fromTo(
              el,
              {
                rotationX: -65,
                y: 85,
                transformOrigin: "50% 100%",
                clipPath: "inset(100% 0 0 0)",
              },
              {
                rotationX: 0,
                y: 0,
                clipPath: "inset(-10% -10% -10% -10%)",
                ease: "power3.out",
                duration: 1.3,
                scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          });
        gsap.utils.toArray<HTMLElement>(".project-image").forEach((el, i) => {
          gsap.fromTo(
            el,
            {
              clipPath: "polygon(0 30%,100% 0,100% 70%,0 100%)",
              rotation: i % 2 ? 5 : -5,
              scale: 0.88,
            },
            {
              clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)",
              rotation: 0,
              scale: 1,
              duration: 1.4,
              ease: "power3.out",
              scrollTrigger: { trigger: ".work", start: "top 65%" },
            },
          );
        });
        gsap.utils
          .toArray<HTMLElement>(".why-grid article")
          .forEach((el, i) => {
            gsap.fromTo(
              el,
              {
                y: 100 + i * 60,
                rotationY: -28,
                rotationZ: 4,
                transformPerspective: 1200,
              },
              {
                y: 0,
                rotationY: 0,
                rotationZ: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: ".why-grid",
                  start: "top 95%",
                  end: "top 35%",
                  scrub: 1,
                },
              },
            );
          });
        gsap.fromTo(
          ".comparison",
          { clipPath: "inset(15% 20% 15% 20%)", scale: 0.92 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".comparison",
              start: "top 90%",
              end: "top 30%",
              scrub: 0.7,
            },
          },
        );
        gsap.to(".footer-word", {
          xPercent: -8,
          letterSpacing: "-.1vw",
          ease: "none",
          scrollTrigger: {
            trigger: "footer",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        });
        gsap.fromTo(
          ".footer-word",
          { rotationX: -80, yPercent: 70, transformOrigin: "50% 100%" },
          {
            rotationX: 0,
            yPercent: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "footer",
              start: "top 95%",
              end: "bottom bottom",
              scrub: 1,
            },
          },
        );

        const refreshFrame = requestAnimationFrame(() => {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
        if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
          const clean: (() => void)[] = [];
          document
            .querySelectorAll<HTMLElement>(
              ".project-image, .service-photo, .why-grid article",
            )
            .forEach((el) => {
              const move = (e: PointerEvent) => {
                const r = el.getBoundingClientRect();
                gsap.to(el, {
                  rotationY: ((e.clientX - r.left - r.width / 2) / r.width) * 9,
                  rotationX:
                    (-(e.clientY - r.top - r.height / 2) / r.height) * 8,
                  transformPerspective: 1200,
                  duration: 0.5,
                  overwrite: "auto",
                });
              };
              const leave = () =>
                gsap.to(el, {
                  rotationY: 0,
                  rotationX: 0,
                  duration: 0.9,
                  ease: "elastic.out(1,.6)",
                });
              el.addEventListener("pointermove", move);
              el.addEventListener("pointerleave", leave);
              clean.push(() => {
                el.removeEventListener("pointermove", move);
                el.removeEventListener("pointerleave", leave);
              });
            });
          return () => {
            cancelAnimationFrame(refreshFrame);
            clean.forEach((fn) => fn());
          };
        }
        return () => cancelAnimationFrame(refreshFrame);
      },
    );
    return () => mm.revert();
  }, []);
}

export function HeroSeal() {
  return (
    <div className="hero-seal" aria-hidden="true">
      <svg viewBox="0 0 260 260">
        <circle cx="130" cy="130" r="122" />
        <circle cx="130" cy="130" r="105" />
        <path d="M58 140L130 68L202 140M80 140L130 90L180 140M104 140L130 114L156 140" />
      </svg>
      <span>ABOVE ALL.</span>
      <small>THE ROOFCRAFT STANDARD</small>
    </div>
  );
}

export function KineticRibbon() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 0px)",
      () => {
        if (!motionEnabled()) return;
        gsap.to(".kinetic-track", {
          xPercent: -35,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.to(".kinetic-wire", {
          rotation: 180,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.fromTo(
          ".kinetic-ribbon",
          { clipPath: "polygon(0 15%,100% 0,100% 85%,0 100%)" },
          {
            clipPath: "polygon(0 0,100% 15%,100% 100%,0 85%)",
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      },
      ref,
    );
    return () => mm.revert();
  }, []);
  return (
    <section
      className="kinetic-ribbon"
      ref={ref}
      aria-label="Precision in every dimension"
    >
      <div className="kinetic-track" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i}>
            PRECISION IN EVERY DIMENSION{" "}
            <svg className="kinetic-wire" viewBox="0 0 100 100">
              <path d="M50 5L95 50L50 95L5 50ZM50 20L80 50L50 80L20 50ZM50 35L65 50L50 65L35 50Z" />
            </svg>
          </span>
        ))}
      </div>
      <div className="ribbon-caption">
        <span>ENGINEERED TO PROTECT.</span>
        <span>DESIGNED TO MOVE YOU.</span>
      </div>
    </section>
  );
}
