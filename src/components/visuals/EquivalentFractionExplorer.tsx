import React, { useState } from 'react';
import { Language } from '../../types/domain';
import { FractionBarVisual } from './FractionBarVisual';

interface EquivalentFractionExplorerProps {
  language: Language;
}

const BASE_FRACTIONS = [
  { numerator: 1, denominator: 2 },
  { numerator: 2, denominator: 3 },
  { numerator: 3, denominator: 4 },
];

export const EquivalentFractionExplorer: React.FC<EquivalentFractionExplorerProps> = ({
  language,
}) => {
  const [baseIdx, setBaseIdx] = useState(0);
  const [multiplier, setMultiplier] = useState(2);
  const [showAddTrap, setShowAddTrap] = useState(false);

  const base = BASE_FRACTIONS[baseIdx];
  const equivNum = base.numerator * multiplier;
  const equivDenom = base.denominator * multiplier;

  const trapNum = base.numerator + (multiplier - 1);
  const trapDenom = base.denominator + (multiplier - 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h4 className="text-base font-bold text-slate-900">
            {language === 'kn'
              ? 'ಸಮಾನ ಭಿನ್ನರಾಶಿ ಪ್ರಯೋಗಾಲಯ'
              : 'Interactive Equivalent Fraction Explorer'}
          </h4>
          <p className="text-xs text-slate-500">
            {language === 'kn'
              ? 'ಪ್ರತಿ ಭಾಗವನ್ನು ಸಮಾನವಾಗಿ ವಿಭಜಿಸಿ — ಒಟ್ಟು ಬಣ್ಣದ ಉದ್ದ ಒಂದೇ ಇರುತ್ತದೆ.'
              : 'Split each piece equally using the multiplier — notice the shaded length stays identical.'}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          {BASE_FRACTIONS.map((f, idx) => (
            <button
              key={`${f.numerator}/${f.denominator}`}
              type="button"
              onClick={() => setBaseIdx(idx)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-colors whitespace-nowrap ${
                baseIdx === idx
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.numerator}/{f.denominator}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <FractionBarVisual
          fraction={base}
          highlightColor="#101827"
          label={
            language === 'kn'
              ? `ಮೂಲ ಭಿನ್ನರಾಶಿ (${base.numerator}/${base.denominator})`
              : `Original Fraction (${base.numerator}/${base.denominator})`
          }
        />

        <FractionBarVisual
          fraction={{ numerator: equivNum, denominator: equivDenom }}
          highlightColor="#3B82F6"
          label={
            language === 'kn'
              ? `ಗುಣಕ ×${multiplier}: (${base.numerator}×${multiplier}) / (${base.denominator}×${multiplier}) = ${equivNum}/${equivDenom}`
              : `Multiply top & bottom by ×${multiplier}: ${equivNum}/${equivDenom}`
          }
        />

        {showAddTrap && multiplier > 1 && (
          <div className="rounded-lg border border-amber-300 bg-amber-50/80 p-3">
            <FractionBarVisual
              fraction={{ numerator: trapNum, denominator: trapDenom }}
              highlightColor="#D97706"
              label={
                language === 'kn'
                  ? `ತಪ್ಪು ವಿಧಾನ (+${multiplier - 1} ಕೂಡಿಸಿದರೆ): ${trapNum}/${trapDenom} ≠ ${base.numerator}/${base.denominator}`
                  : `Common Trap (Adding +${multiplier - 1} to both): ${trapNum}/${trapDenom} is NOT equal!`
              }
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">
            {language === 'kn' ? 'ವಿಭಜನೆ ಗುಣಕ:' : 'Split Multiplier:'}
          </span>
          {[1, 2, 3, 4].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMultiplier(m)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                multiplier === m
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ×{m}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowAddTrap((prev) => !prev)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {showAddTrap
            ? language === 'kn'
              ? 'ತಪ್ಪು ಉದಾಹರಣೆ ಮರೆಮಾಡಿ'
              : 'Hide "+Same Number" Trap'
            : language === 'kn'
            ? 'ಕೂಡಿಸುವ ತಪ್ಪು ಏಕೆ ತಪ್ಪಾಗುತ್ತದೆ ನೋಡಿ'
            : 'Compare With "+Same Number" Trap'}
        </button>
      </div>
    </div>
  );
};
