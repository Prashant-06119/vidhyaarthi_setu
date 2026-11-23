import React from 'react';
import { FractionSpec } from '../../types/domain';

interface FractionCircleVisualProps {
  fraction: FractionSpec;
  highlightColor?: string;
  size?: number;
}

export const FractionCircleVisual: React.FC<FractionCircleVisualProps> = ({
  fraction,
  highlightColor = '#3B82F6',
  size = 136,
}) => {
  const denom = Math.max(1, fraction.denominator);
  const num = Math.min(Math.max(0, fraction.numerator), denom);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;

  if (denom === 1) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Fraction circle showing ${num} of 1`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={num > 0 ? highlightColor : '#F8FAFC'}
          stroke="#1E293B"
          strokeWidth="2"
        />
      </svg>
    );
  }

  const slices = Array.from({ length: denom }).map((_, i) => {
    const startAngle = (i * 2 * Math.PI) / denom - Math.PI / 2;
    const endAngle = ((i + 1) * 2 * Math.PI) / denom - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = 2 * Math.PI / denom > Math.PI ? 1 : 0;

    const d = [
      `M ${cx} ${cy}`,
      `L ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      'Z',
    ].join(' ');

    return { d, shaded: i < num };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Fraction circle showing ${num} out of ${denom} equal slices shaded`}
    >
      {slices.map((slice, idx) => (
        <path
          key={idx}
          d={slice.d}
          fill={slice.shaded ? highlightColor : '#F1F5F9'}
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};
