import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import gsap from "gsap";
import "./cursor.css";

type CursorMode = "idle" | "link" | "view" | "drag" | "slide";

export function ArchitecturalCursor() {
  const layer = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(any-hover: hover) and (any-pointer: fine)", () => {
      const html = document.documentElement;
      const follower = ring.current!;
      const point = dot.current!;
      const root = layer.current!;
      const xTo = gsap.quickTo(follower, "x", {
        duration: 0.25,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(follower, "y", {
        duration: 0.25,
        ease: "power3.out",
      });
      const dotX = gsap.quickSetter(point, "x", "px");
      const dotY = gsap.quickSetter(point, "y", "px");
      let visible = false;
      let position = { x: 0, y: 0 };
      let dragging = false;
      let mode: CursorMode = "idle";
      const hide = () => {
        visible = false;
        dragging = false;
        root.classList.remove("is-visible", "is-pressed");
        html.classList.remove("custom-cursor-ready");
      };
      const updateTarget = (target: Element | null) => {
        if (
          !target ||
          target.closest(
            'input:not([type="range"]), textarea, select, [contenteditable="true"], iframe',
          )
        ) {
          hide();
          return;
        }
        if (!visible) {
          gsap.set(follower, { x: position.x, y: position.y });
          visible = true;
          root.classList.add("is-visible");
          html.classList.add("custom-cursor-ready");
        }
        const next: CursorMode = dragging
          ? "drag"
          : target.closest(".comparison")
            ? "slide"
            : target.closest(".project")
              ? "view"
              : target.closest(".projects")
                ? "drag"
                : target.closest(
                      'a, button, [role="button"], summary, input[type="range"]',
                    )
                  ? "link"
                  : "idle";
        if (next !== mode) {
          mode = next;
          root.dataset.mode = mode;
          caption.current!.textContent =
            mode === "view"
              ? "VIEW"
              : mode === "drag"
                ? "DRAG"
                : mode === "slide"
                  ? "SLIDE"
                  : "";
        }
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") {
          hide();
          return;
        }
        position = { x: event.clientX, y: event.clientY };
        updateTarget(event.target instanceof Element ? event.target : null);
        dotX(position.x);
        dotY(position.y);
        xTo(position.x);
        yTo(position.y);
      };
      const over = (event: PointerEvent) => {
        if (visible && event.pointerType === "mouse")
          updateTarget(event.target instanceof Element ? event.target : null);
      };
      const down = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || !visible || event.button !== 0)
          return;
        root.classList.add("is-pressed");
        dragging = !!(event.target as Element).closest(".projects");
        updateTarget(event.target as Element);
      };
      const up = () => {
        dragging = false;
        root.classList.remove("is-pressed");
        if (visible)
          updateTarget(document.elementFromPoint(position.x, position.y));
      };
      const scroll = () => {
        if (visible)
          updateTarget(document.elementFromPoint(position.x, position.y));
      };
      const visibility = () => {
        if (document.hidden) hide();
      };
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      window.addEventListener("pointerdown", down, { passive: true });
      window.addEventListener("pointerup", up, { passive: true });
      window.addEventListener("pointercancel", hide);
      document.documentElement.addEventListener("pointerleave", hide);
      document.addEventListener("scroll", scroll, {
        passive: true,
        capture: true,
      });
      window.addEventListener("blur", hide);
      document.addEventListener("visibilitychange", visibility);
      return () => {
        hide();
        xTo.tween.kill();
        yTo.tween.kill();
        gsap.killTweensOf([follower, point]);
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", hide);
        document.documentElement.removeEventListener("pointerleave", hide);
        document.removeEventListener("scroll", scroll, true);
        window.removeEventListener("blur", hide);
        document.removeEventListener("visibilitychange", visibility);
      };
    });
    return () => media.revert();
  }, []);

  return createPortal(
    <div
      className="architectural-cursor"
      data-mode="idle"
      ref={layer}
      aria-hidden="true"
    >
      <div className="cursor-follower" ref={ring}>
        <div className="cursor-shell">
          <span className="cursor-axis cursor-axis-x" />
          <span className="cursor-axis cursor-axis-y" />
          <ArrowUpRight className="cursor-view-icon" size={19} />
          <MoveHorizontal className="cursor-slide-icon" size={19} />
          <span className="cursor-caption" ref={caption} />
        </div>
      </div>
      <div className="cursor-point" ref={dot} />
    </div>,
    document.body,
  );
}
