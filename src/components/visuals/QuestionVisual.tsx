import React from 'react';
import { VisualSpec } from '../../types/domain';
import { FractionBarVisual } from './FractionBarVisual';
import { FractionCircleVisual } from './FractionCircleVisual';

interface QuestionVisualProps {
  visualSpec: VisualSpec;
}

export const QuestionVisual: React.FC<QuestionVisualProps> = ({ visualSpec }) => {
  if (visualSpec.type === 'none' || !visualSpec.primary) {
    return null;
  }

  if (visualSpec.type === 'circle') {
    return (
      <div className="my-4 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <FractionCircleVisual fraction={visualSpec.primary} />
      </div>
    );
  }

  if (visualSpec.type === 'bar') {
    return (
      <div className="my-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <FractionBarVisual fraction={visualSpec.primary} />
      </div>
    );
  }

  if (visualSpec.type === 'pair_bars' && visualSpec.secondary) {
    return (
      <div className="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <FractionBarVisual
          fraction={visualSpec.primary}
          label={`${visualSpec.primary.numerator}/${visualSpec.primary.denominator}`}
          highlightColor="#3B82F6"
        />
        <FractionBarVisual
          fraction={visualSpec.secondary}
          label={`${visualSpec.secondary.numerator}/${visualSpec.secondary.denominator}`}
          highlightColor="#101827"
        />
      </div>
    );
  }

  return null;
};
