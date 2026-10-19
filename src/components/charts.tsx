"use client";

import type { CSSProperties } from "react";
import { Counter } from "./ui";

// ---------- Шугаман график (слайд идэвхжихэд зурагдана) ----------

export function LineChart({
  points,
  min,
  max,
  format,
  unit = "",
  labelEvery = 1,
  id,
}: {
  points: [number, number][];
  min: number;
  max: number;
  format?: (v: number) => string;
  unit?: string;
  labelEvery?: number;
  id: string;
}) {
  const W = 600;
  const H = 300;
  const padX = 24;
  const padTop = 46;
  const padBottom = 34;
  const x0 = points[0][0];
  const x1 = points[points.length - 1][0];
  const px = (x: number) => padX + ((x - x0) / (x1 - x0)) * (W - padX * 2);
  const py = (y: number) => padTop + (1 - (y - min) / (max - min)) * (H - padTop - padBottom);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(" ");
  const area = `${line} L${px(x1)},${H - padBottom} L${px(x0)},${H - padBottom} Z`;
  const fmt = format ?? ((v: number) => `${v}${unit}`);

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((k) => (
        <line
          key={k}
          x1={padX}
          x2={W - padX}
          y1={padTop + k * (H - padTop - padBottom)}
          y2={padTop + k * (H - padTop - padBottom)}
          className="chart-grid"
        />
      ))}
      <path d={area} fill={`url(#${id}-fill)`} className="chart-area" />
      <path d={line} pathLength={1} className="chart-line" filter={`url(#${id}-glow)`} />
      {points.map(([x, y], i) => (
        <g key={x} className="chart-pt" style={{ "--i": i } as CSSProperties}>
          <circle cx={px(x)} cy={py(y)} r={5} />
          {(i % labelEvery === 0 || i === points.length - 1) && (
            <>
              <text x={px(x)} y={py(y) - 16} textAnchor="middle" className="chart-val">
                {fmt(y)}
              </text>
              <text x={px(x)} y={H - 10} textAnchor="middle" className="chart-year">
                {x}
              </text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

// ---------- Баганан график ----------

export function Bars({
  data,
  prefix = "",
}: {
  data: { label: string; value: number }[];
  prefix?: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="bars">
      {data.map((d, i) => (
        <div className="bar" key={d.label} style={{ "--h": d.value / max, "--i": i } as CSSProperties}>
          <div className="bar-val">
            <Counter to={d.value} prefix={prefix} delay={300 + i * 180} />
          </div>
          <div className="bar-track">
            <div className="bar-fill" />
          </div>
          <div className="bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}
