import React, { useState } from 'react';
import { Language } from '../../types/domain';
import { FractionBarVisual } from './FractionBarVisual';
import { FractionCircleVisual } from './FractionCircleVisual';

interface PartWholeBuilderProps {
  language: Language;
}

export const PartWholeBuilder: React.FC<PartWholeBuilderProps> = ({ language }) => {
  const [denominator, setDenominator] = useState(5);
  const [numerator, setNumerator] = useState(3);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h4 className="text-base font-bold text-slate-900">
        {language === 'kn' ? 'ಭಾಗ ಮತ್ತು ಪೂರ್ಣ ನಿರ್ಮಾಣಕಾರ' : 'Interactive Part & Whole Builder'}
      </h4>
      <p className="mt-1 text-xs text-slate-500">
        {language === 'kn'
          ? 'ಅಂಶ (ಮೇಲೆ) ಮತ್ತು ಛೇದ (ಕೆಳಗೆ) ಬದಲಾಯಿಸಿ ವೃತ್ತ ಮತ್ತು ಪಟ್ಟಿ ಹೇಗೆ ಬದಲಾಗುತ್ತದೆ ನೋಡಿ.'
          : 'Adjust total equal parts (denominator) and shaded parts (numerator) to inspect both bar and circle models.'}
      </p>

      <div className="mt-5 grid grid-cols-1 items-center gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center">
          <FractionCircleVisual fraction={{ numerator, denominator }} />
        </div>
        <div className="md:col-span-2 space-y-4">
          <FractionBarVisual
            fraction={{ numerator, denominator }}
            label={`${numerator}/${denominator}`}
          />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{language === 'kn' ? 'ಅಂಶ (Numerator)' : 'Numerator (Shaded)'}</span>
                <span className="font-mono">{numerator}</span>
              </div>
              <input
                type="range"
                min={1}
                max={denominator}
                value={numerator}
                aria-label="Numerator"
                onChange={(e) => setNumerator(Number(e.target.value))}
                className="mt-1.5 w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{language === 'kn' ? 'ಛೇದ (Denominator)' : 'Denominator (Total Parts)'}</span>
                <span className="font-mono">{denominator}</span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                value={denominator}
                aria-label="Denominator"
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setDenominator(next);
                  if (numerator > next) setNumerator(next);
                }}
                className="mt-1.5 w-full accent-slate-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
