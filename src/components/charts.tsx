"use client";

import type { CSSProperties } from "react";
import { Counter } from "./ui";

// ---------- Нарийн хэмжигдэхүүн бүхий цэвэр шугаман график ----------

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
  const W = 640;
  const H = 260;
  const padLeft = 20;
  const padRight = 24;
  const padTop = 38;
  const padBottom = 34;

  const x0 = points[0][0];
  const x1 = points[points.length - 1][0];
  const px = (x: number) => padLeft + ((x - x0) / (x1 - x0)) * (W - padLeft - padRight);
  const py = (y: number) => padTop + (1 - (y - min) / (max - min)) * (H - padTop - padBottom);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(" ");
  const area = `${line} L${px(x1)},${H - padBottom} L${px(x0)},${H - padBottom} Z`;
  const fmt = format ?? ((v: number) => `${v}${unit}`);

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Саруул хэвтээ шугам */}
      {[0, 0.33, 0.66, 1].map((k) => (
        <line
          key={k}
          x1={padLeft}
          x2={W - padRight}
          y1={padTop + k * (H - padTop - padBottom)}
          y2={padTop + k * (H - padTop - padBottom)}
          className="chart-grid"
        />
      ))}

      {/* Бүсийн дэвсгэр ба нарийн вектор зураас */}
      <path d={area} fill={`url(#${id}-fill)`} className="chart-area" />
      <path d={line} pathLength={1} className="chart-line" />

      {/* Өгөгдлийн цэгүүд ба утга */}
      {points.map(([x, y], i) => (
        <g key={x} className="chart-pt" style={{ "--i": i } as CSSProperties}>
          <circle cx={px(x)} cy={py(y)} r={4} />
          {(i % labelEvery === 0 || i === points.length - 1) && (
            <>
              <text x={px(x)} y={py(y) - 14} textAnchor="middle" className="chart-val">
                {fmt(y)}
              </text>
              <text x={px(x)} y={H - 12} textAnchor="middle" className="chart-year">
                {x}
              </text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

// ---------- Архитектурын цэвэр баганан график ----------

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
            <Counter to={d.value} prefix={prefix} delay={250 + i * 140} />
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
