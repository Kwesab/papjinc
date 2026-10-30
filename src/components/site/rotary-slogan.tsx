import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RingStyle = "plain" | "outline" | "dashed" | "filled";

interface RotarySloganProps {
  /** Diameter on >= sm screens (px). */
  size?: number;
  /** Diameter on small screens (px). Defaults to 70% of `size`. */
  mobileSize?: number;
  text?: string;
  ringStyle?: RingStyle;
  className?: string;
  center?: ReactNode;
  reverse?: boolean;
  duration?: number;
}

export function RotarySlogan({
  size = 96,
  mobileSize,
  text = "THE FUTURE IS EXCITING",
  ringStyle = "plain",
  className,
  center,
  reverse = false,
  duration = 12,
}: RotarySloganProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const label = text.trim() || "THE FUTURE IS EXCITING";
  const repeated = `${label} \u2022 ${label} \u2022 `;
  const small = Math.max(24, Math.round(mobileSize ?? size * 0.7));

  const box = 100;
  const padding = ringStyle === "filled" || ringStyle === "outline" ? 16 : 12;
  const radius = (box - padding * 2) / 2;
  const circumference = Math.round(2 * Math.PI * radius);
  const cx = box / 2;
  const spin = Math.max(2, duration);

  const filled = ringStyle === "filled";

  return (
    <div
      data-rotary
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center align-middle",
        filled ? "text-primary-foreground" : "text-foreground/80",
        className,
      )}
      style={{
        width: `clamp(${small}px, ${size / 16}rem, ${size}px)`,
        height: `clamp(${small}px, ${size / 16}rem, ${size}px)`,
        maxWidth: "100%",
      }}
    >
      <svg viewBox={`0 0 ${box} ${box}`} className="absolute inset-0 size-full" aria-label={label}>
        {filled ? <circle cx={cx} cy={cx} r={box / 2 - 1} className="fill-primary" /> : null}
        {ringStyle === "outline" || ringStyle === "dashed" ? (
          <circle
            cx={cx}
            cy={cx}
            r={box / 2 - 2}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.45}
            strokeWidth={1.5}
            strokeDasharray={ringStyle === "dashed" ? "4 4" : undefined}
          />
        ) : null}
        <defs>
          <path
            id={`slogan-path-${uid}`}
            d={`M ${cx}, ${cx} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <g
          style={{
            animation: `rotary-spin ${spin}s linear infinite ${reverse ? "reverse" : ""}`,
            transformOrigin: `${cx}px ${cx}px`,
          }}
        >
          <text
            fill="currentColor"
            fontSize={9}
            fontFamily="var(--font-mono)"
            letterSpacing={1}
            textLength={circumference}
          >
            <textPath href={`#slogan-path-${uid}`} startOffset="0%" textLength={circumference}>
              {repeated}
            </textPath>
          </text>
        </g>
      </svg>

      {center ? (
        <div className="relative z-10 grid place-items-center text-center leading-none">{center}</div>
      ) : null}

      <style>{`
        @keyframes rotary-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-rotary] g { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
