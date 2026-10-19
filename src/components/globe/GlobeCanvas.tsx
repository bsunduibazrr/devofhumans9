"use client";

import { useEffect, useRef } from "react";
import type { Pose } from "@/lib/deck";

export default function GlobeCanvas({ poses }: { poses: Pose[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let disposed = false;
    let scene: { dispose(): void } | null = null;
    import("./GlobeScene").then(({ GlobeScene }) => {
      if (disposed || !ref.current) return;
      scene = new GlobeScene(ref.current, poses);
      ref.current.classList.add("is-ready");
    });
    return () => {
      disposed = true;
      scene?.dispose();
    };
  }, [poses]);

  return <canvas ref={ref} className="globe-canvas" aria-hidden />;
}
