"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Lenis from "lenis";
import GlobeCanvas from "./globe/GlobeCanvas";
import { GoToContext, SLIDES } from "./slides";
import { ActiveContext, SlideIndexContext } from "./ui";
import { deck } from "@/lib/deck";

const POSES = SLIDES.map((s) => s.pose);
const N = SLIDES.length;

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function Deck() {
  const [active, setActive] = useState(0);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const snapping = useRef(false);

  const goTo = useCallback((i: number) => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const target = clamp(Math.round(i), 0, N - 1);
    const dist = Math.abs(target - lenis.scroll / window.innerHeight);
    snapping.current = true;
    lenis.scrollTo(target * window.innerHeight, {
      duration: 1.15 + Math.min(dist, 10) * 0.09,
      easing: easeInOut,
      force: true,
      onComplete: () => {
        snapping.current = false;
      },
    });
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.6 });
    lenisRef.current = lenis;

    // Хаягийн #-аас эхлэх слайдыг сэргээх
    const fromHash = parseInt(window.location.hash.replace("#", ""), 10);
    if (fromHash >= 1 && fromHash <= N) lenis.scrollTo((fromHash - 1) * window.innerHeight, { immediate: true, force: true });

    let raf = 0;
    let lastActive = -1;
    const vis: boolean[] = [];
    const mouse = { x: 0, y: 0, cx: -100, cy: -100, rx: -100, ry: -100 };

    const frame = (time: number) => {
      lenis.raf(time);
      const vh = window.innerHeight;
      const p = lenis.scroll / vh;
      deck.progress = p;
      deck.velocity = lenis.velocity;
      deck.mouseX += (mouse.x - deck.mouseX) * 0.05;
      deck.mouseY += (mouse.y - deck.mouseY) * 0.05;

      // Слайдуудын 3D шилжилт
      for (let i = 0; i < N; i++) {
        const el = slideRefs.current[i];
        if (!el) continue;
        const t = p - i;
        const show = Math.abs(t) < 0.999;
        if (show !== vis[i]) {
          el.style.visibility = show ? "visible" : "hidden";
          vis[i] = show;
        }
        if (!show) continue;
        let y: number, z: number, rx: number, op: number, blur: number, sc: number;
        if (t >= 0) {
          // Гарч буй слайд — камерын хажуугаар нисэн өнгөрнө
          y = -t * 12;
          z = t * 420;
          rx = -t * 12;
          sc = 1 + t * 0.08;
          op = clamp(1 - t * 1.3);
          blur = t * 10;
        } else {
          // Орж ирж буй слайд — гүнээс гарч ирнэ
          const e = -t;
          y = e * 16;
          z = -e * 950;
          rx = e * 20;
          sc = 1;
          op = clamp(1 - e * 1.1);
          blur = e * 12;
        }
        el.style.transform = `translate3d(0, ${y.toFixed(3)}vh, ${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
        el.style.opacity = op.toFixed(3);
        el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
        el.style.setProperty("--t", t.toFixed(4));
      }

      const a = clamp(Math.round(p), 0, N - 1);
      if (a !== lastActive) {
        slideRefs.current.forEach((el, i) => el?.classList.toggle("is-active", i === a));
        lastActive = a;
        setActive(a);
        document.documentElement.style.setProperty("--accent", SLIDES[a].pose.color);
        history.replaceState(null, "", `#${a + 1}`);
      }

      if (barRef.current) barRef.current.style.transform = `scaleX(${clamp(p / (N - 1))})`;

      // Курсор
      mouse.rx += (mouse.cx - mouse.rx) * 0.16;
      mouse.ry += (mouse.cy - mouse.ry) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mouse.cx}px, ${mouse.cy}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${mouse.rx}px, ${mouse.ry}px, 0)`;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Гүйлгэлт зогсоход хамгийн ойрын слайд руу наалдах
    let snapTimer = 0;
    let lastTarget = lenis.targetScroll;
    const snap = () => {
      const vh = window.innerHeight;
      const p = lenis.targetScroll / vh;
      const base = Math.floor(p);
      const frac = p - base;
      if (frac < 0.001 || frac > 0.999) return;
      const target = lenis.direction >= 0 ? (frac > 0.1 ? base + 1 : base) : frac < 0.9 ? base : base + 1;
      goTo(target);
    };
    lenis.on("scroll", () => {
      if (snapping.current) return;
      if (lenis.targetScroll !== lastTarget) {
        lastTarget = lenis.targetScroll;
        window.clearTimeout(snapTimer);
        snapTimer = window.setTimeout(snap, 150);
      }
    });
    const userInput = () => {
      if (snapping.current) {
        snapping.current = false;
      }
    };
    window.addEventListener("wheel", userInput, { passive: true });
    window.addEventListener("touchstart", userInput, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      const cur = Math.round(lenis.scroll / window.innerHeight);
      const next = ["ArrowDown", "ArrowRight", "PageDown", " "];
      const prev = ["ArrowUp", "ArrowLeft", "PageUp", "Backspace"];
      if (next.includes(e.key)) {
        e.preventDefault();
        goTo(cur + 1);
      } else if (prev.includes(e.key)) {
        e.preventDefault();
        goTo(cur - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(N - 1);
      } else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);

    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      mouse.cx = e.clientX;
      mouse.cy = e.clientY;
    };
    const onOver = (e: PointerEvent) => {
      const hit = (e.target as HTMLElement).closest?.("[data-cursor], button, a");
      ringRef.current?.classList.toggle("is-hover", !!hit);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);

    const onResize = () => {
      lenis.scrollTo(Math.round(deck.progress) * window.innerHeight, { immediate: true, force: true });
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(snapTimer);
      window.removeEventListener("wheel", userInput);
      window.removeEventListener("touchstart", userInput);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [goTo]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  return (
    <ActiveContext.Provider value={active}>
      <GoToContext.Provider value={goTo}>
        <GlobeCanvas poses={POSES} />
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />

        <main className="stage">
          {SLIDES.map(({ Comp, nav }, i) => (
            <section
              key={i}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="slide"
              style={{ "--accent": SLIDES[i].pose.color } as CSSProperties}
              aria-label={`${i + 1}. ${nav}`}
              aria-hidden={active !== i}
            >
              <SlideIndexContext.Provider value={i}>
                <div className="slide-inner">
                  <Comp />
                </div>
              </SlideIndexContext.Provider>
            </section>
          ))}
        </main>
        <div style={{ height: `${N * 100}vh` }} aria-hidden />

        {/* HUD */}
        <div className="hud-progress" aria-hidden>
          <div ref={barRef} className="hud-progress-bar" />
        </div>
        <div className="hud-count" aria-live="polite">
          <span className="hud-count-cur" key={active}>
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="hud-count-sep">/</span>
          <span>{N}</span>
          <span className="hud-count-nav">{SLIDES[active].nav}</span>
        </div>
        <nav className="hud-dots" aria-label="Слайдууд">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              className={`hud-dot ${i === active ? "is-on" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`${i + 1}. ${s.nav}`}
            >
              <span className="hud-dot-label">
                {String(i + 1).padStart(2, "0")} · {s.nav}
              </span>
            </button>
          ))}
        </nav>
        <div className="hud-tools">
          <button className="hud-btn" onClick={() => goTo(active - 1)} aria-label="Өмнөх слайд" disabled={active === 0}>
            ↑
          </button>
          <button className="hud-btn" onClick={() => goTo(active + 1)} aria-label="Дараагийн слайд" disabled={active === N - 1}>
            ↓
          </button>
          <button className="hud-btn hud-btn-wide" onClick={toggleFullscreen} aria-label="Бүтэн дэлгэц (F)">
            ⤢ F
          </button>
        </div>

        <div ref={dotRef} className="cursor-dot" aria-hidden />
        <div ref={ringRef} className="cursor-ring" aria-hidden />
        <div className="curtain" aria-hidden>
          <span>ДАЯАРШИЛ</span>
        </div>
      </GoToContext.Provider>
    </ActiveContext.Provider>
  );
}
