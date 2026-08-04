import { memo, useId } from "react";

const R_PATH =
  "M7.32-16.80L10.22-16.80Q11.30-16.80 12.43-16.61Q13.56-16.42 14.50-15.92Q15.43-15.43 16.01-14.54Q16.58-13.66 16.58-12.26Q16.58-11.35 16.25-10.38Q15.91-9.41 15.08-8.68Q14.26-7.94 12.74-7.70Q13.75-7.42 14.50-6.72Q15.24-6.02 15.67-5.30Q15.72-5.23 15.91-4.90Q16.10-4.56 16.40-4.07Q16.70-3.58 17.04-3.05Q17.38-2.52 17.71-2.06Q18.26-1.32 18.67-0.94Q19.08-0.55 19.50-0.41Q19.92-0.26 20.50-0.24L20.50 0L17.50 0Q16.06 0 14.83-0.17Q13.61-0.34 12.64-0.91Q11.66-1.49 10.92-2.74Q10.66-3.17 10.49-3.60Q10.32-4.03 10.20-4.44Q10.08-4.85 10-5.22Q9.91-5.59 9.84-5.94Q9.77-6.29 9.67-6.60Q9.43-7.46 9.10-7.78Q8.76-8.09 8.42-8.21L8.42-8.45Q8.52-8.45 8.64-8.45Q8.76-8.45 8.81-8.45Q9.48-8.45 10.01-8.76Q10.54-9.07 10.90-9.72Q11.26-10.37 11.38-11.40Q11.40-11.59 11.42-11.82Q11.45-12.05 11.42-12.38Q11.33-14.16 10.55-14.86Q9.77-15.55 8.69-15.55Q8.57-15.55 8.38-15.55Q8.18-15.55 7.97-15.55Q7.75-15.55 7.56-15.55Q7.56-15.55 7.50-15.86Q7.44-16.18 7.38-16.49Q7.32-16.80 7.32-16.80M2.69-16.80L7.63-16.80L7.63 0L2.69 0L2.69-16.80M2.69-1.75L2.76-1.75L2.76 0L0.84 0L0.84-0.24Q0.89-0.24 1.01-0.24Q1.13-0.24 1.15-0.24Q1.78-0.24 2.22-0.68Q2.66-1.13 2.69-1.75M2.76-16.80L2.76-15.05L2.69-15.05Q2.66-15.67 2.22-16.12Q1.78-16.56 1.15-16.56Q1.13-16.56 1.01-16.56Q0.89-16.56 0.84-16.56L0.84-16.80L2.76-16.80M7.56 0L7.56-1.75L7.63-1.75Q7.63-1.13 8.09-0.68Q8.54-0.24 9.17-0.24Q9.22-0.24 9.32-0.24Q9.43-0.24 9.46-0.24L9.46 0";

const OUTER = "M32 2.5 61.5 32 32 61.5 2.5 32Z";
const INNER = "M32 10 54 32 32 54 10 32Z";

function Sigil({ className = "", title }) {
  const uid = useId().replace(/:/g, "");
  const iron = `iron-${uid}`;
  const molten = `molten-${uid}`;
  const rim = `rim-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      <defs>
        <linearGradient id={iron} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2333" />
          <stop offset="0.55" stopColor="#150f1d" />
          <stop offset="1" stopColor="#2a1410" />
        </linearGradient>
        <linearGradient id={molten} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3d6" />
          <stop offset="0.3" stopColor="#ffc061" />
          <stop offset="0.66" stopColor="#ff4d00" />
          <stop offset="1" stopColor="#8c2606" />
        </linearGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb066" />
          <stop offset="0.5" stopColor="#ff4d00" />
          <stop offset="1" stopColor="#7a1a06" />
        </linearGradient>
      </defs>

      <path className="sigil-body" d={OUTER} fill={`url(#${iron})`} />
      <path
        className="sigil-rim"
        d={OUTER}
        fill="none"
        stroke={`url(#${rim})`}
        strokeWidth="3"
      />
      <path
        className="sigil-facet"
        d="M2.5 32 32 2.5"
        fill="none"
        stroke="#ffd9a3"
        strokeWidth="1.4"
        strokeOpacity="0.5"
      />
      <path
        className="sigil-rule"
        d={INNER}
        fill="none"
        stroke="#ff4d00"
        strokeWidth="0.9"
        strokeOpacity="0.32"
      />

      <g className="sigil-letter" transform="translate(21.332 40.4)">
        <path d={R_PATH} fill={`url(#${molten})`} />
      </g>
    </svg>
  );
}

export default memo(Sigil);
