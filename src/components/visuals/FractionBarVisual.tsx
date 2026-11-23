import React from 'react';
import { FractionSpec } from '../../types/domain';

interface FractionBarVisualProps {
  fraction: FractionSpec;
  highlightColor?: string;
  label?: string;
  compact?: boolean;
}

export const FractionBarVisual: React.FC<FractionBarVisualProps> = ({
  fraction,
  highlightColor = '#3B82F6',
  label,
  compact = false,
}) => {
  const safeDenom = Math.max(1, fraction.denominator);
  const safeNum = Math.min(Math.max(0, fraction.numerator), safeDenom);

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-700">
          <span>{label}</span>
          <span className="font-mono font-semibold text-slate-900 tabular-nums">
            {safeNum}/{safeDenom}
          </span>
        </div>
      )}
      <div
        className={`flex w-full overflow-hidden rounded-lg border border-slate-300 bg-white ${
          compact ? 'h-8' : 'h-11'
        }`}
        role="img"
        aria-label={`Fraction bar showing ${safeNum} out of ${safeDenom} equal parts shaded`}
      >
        {Array.from({ length: safeDenom }).map((_, index) => {
          const isShaded = index < safeNum;
          return (
            <div
              key={index}
              className={`flex-1 border-r border-slate-300 last:border-r-0 transition-colors duration-150 flex items-center justify-center text-xs font-mono ${
                isShaded ? 'text-white font-semibold' : 'bg-slate-50 text-slate-400'
              }`}
              style={isShaded ? { backgroundColor: highlightColor } : undefined}
            >
              {!compact && safeDenom <= 8 ? `1/${safeDenom}` : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};
