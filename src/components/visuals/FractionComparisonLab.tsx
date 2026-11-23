import React, { useState } from 'react';
import { Language } from '../../types/domain';
import { FractionBarVisual } from './FractionBarVisual';

interface FractionComparisonLabProps {
  language: Language;
}

const COMPARISON_PRESETS = [
  { a: { numerator: 1, denominator: 3 }, b: { numerator: 1, denominator: 5 } },
  { a: { numerator: 1, denominator: 2 }, b: { numerator: 1, denominator: 4 } },
  { a: { numerator: 2, denominator: 3 }, b: { numerator: 3, denominator: 8 } },
];

export const FractionComparisonLab: React.FC<FractionComparisonLabProps> = ({ language }) => {
  const [presetIdx, setPresetIdx] = useState(0);
  const [denomA, setDenomA] = useState(3);
  const [numA, setNumA] = useState(1);
  const [denomB, setDenomB] = useState(5);
  const [numB, setNumB] = useState(1);

  const selectPreset = (idx: number) => {
    setPresetIdx(idx);
    const p = COMPARISON_PRESETS[idx];
    setNumA(p.a.numerator);
    setDenomA(p.a.denominator);
    setNumB(p.b.numerator);
    setDenomB(p.b.denominator);
  };

  const valA = numA / denomA;
  const valB = numB / denomB;
  const relation =
    Math.abs(valA - valB) < 0.0001 ? '=' : valA > valB ? '>' : '<';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h4 className="text-base font-bold text-slate-900">
            {language === 'kn'
              ? 'ಭಿನ್ನರಾಶಿ ಹೋಲಿಕೆ ಪ್ರಯೋಗಾಲಯ'
              : 'Interactive Fraction Comparison Strip & 1/2 Benchmark'}
          </h4>
          <p className="text-xs text-slate-500">
            {language === 'kn'
              ? 'ಒಂದೇ ಉದ್ದದ ಪಟ್ಟಿಗಳನ್ನು ಹೋಲಿಸಿ — ಛೇದ ಹೆಚ್ಚಾದಂತೆ ಪ್ರತಿ ತುಂಡು ಚಿಕ್ಕದಾಗುತ್ತದೆ.'
              : 'Compare equal-width strips against the 1/2 benchmark line.'}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          {COMPARISON_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectPreset(idx)}
              className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-semibold transition-colors whitespace-nowrap ${
                presetIdx === idx
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.a.numerator}/{p.a.denominator} vs {p.b.numerator}/{p.b.denominator}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-5 pt-6 space-y-4">
        {/* 1/2 Benchmark vertical guide cleanly anchored above the bars */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-10 border-l-2 border-dashed border-amber-500"
          aria-hidden="true"
        >
          <span className="-ml-4 inline-block rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-900">
            1/2
          </span>
        </div>

        <FractionBarVisual
          fraction={{ numerator: numA, denominator: denomA }}
          highlightColor="#3B82F6"
          label={`${language === 'kn' ? 'ಭಿನ್ನರಾಶಿ A' : 'Fraction A'}: ${numA}/${denomA} (${Math.round(valA * 100)}%)`}
        />

        <FractionBarVisual
          fraction={{ numerator: numB, denominator: denomB }}
          highlightColor="#101827"
          label={`${language === 'kn' ? 'ಭಿನ್ನರಾಶಿ B' : 'Fraction B'}: ${numB}/${denomB} (${Math.round(valB * 100)}%)`}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>{language === 'kn' ? 'A ಛೇದ (ಭಾಗಗಳು)' : 'Fraction A Denominator'}</span>
            <span className="font-mono tabular-nums">{denomA}</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            value={denomA}
            aria-label="Fraction A denominator"
            onChange={(e) => {
              const nextD = Number(e.target.value);
              setDenomA(nextD);
              if (numA > nextD) setNumA(nextD);
            }}
            className="mt-2 w-full accent-blue-600"
          />
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>{language === 'kn' ? 'A ಅಂಶ (ಬಣ್ಣ)' : 'Fraction A Numerator'}</span>
            <span className="font-mono tabular-nums">{numA}</span>
          </div>
          <input
            type="range"
            min={1}
            max={denomA}
            value={numA}
            aria-label="Fraction A numerator"
            onChange={(e) => setNumA(Number(e.target.value))}
            className="mt-2 w-full accent-blue-600"
          />
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>{language === 'kn' ? 'B ಛೇದ (ಭಾಗಗಳು)' : 'Fraction B Denominator'}</span>
            <span className="font-mono tabular-nums">{denomB}</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            value={denomB}
            aria-label="Fraction B denominator"
            onChange={(e) => {
              const nextD = Number(e.target.value);
              setDenomB(nextD);
              if (numB > nextD) setNumB(nextD);
            }}
            className="mt-2 w-full accent-slate-900"
          />
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>{language === 'kn' ? 'B ಅಂಶ (ಬಣ್ಣ)' : 'Fraction B Numerator'}</span>
            <span className="font-mono tabular-nums">{numB}</span>
          </div>
          <input
            type="range"
            min={1}
            max={denomB}
            value={numB}
            aria-label="Fraction B numerator"
            onChange={(e) => setNumB(Number(e.target.value))}
            className="mt-2 w-full accent-slate-900"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
        <span className="text-xs font-medium text-slate-300">
          {language === 'kn' ? 'ದೃಶ್ಯ ಹೋಲಿಕೆ ಫಲಿತಾಂಶ' : 'Exact Visual Comparison'}
        </span>
        <span className="font-mono text-base font-bold tabular-nums">
          {numA}/{denomA} {relation} {numB}/{denomB}
        </span>
      </div>
    </div>
  );
};
