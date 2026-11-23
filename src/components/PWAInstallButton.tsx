import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types/domain';

interface PWAInstallButtonProps {
  language: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <Download className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
        {language === 'kn' ? 'ಆಫ್‌ಲೈನ್ ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ' : 'Install Offline App'}
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
          {language === 'kn' ? 'ಸ್ಥಾಪಿಸಿ (iOS)' : 'Install App'}
        </button>

        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'kn' ? 'iPhone / iPad ನಲ್ಲಿ ಸ್ಥಾಪಿಸಿ' : 'Install for Offline Use'}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {language === 'kn'
                  ? 'Safari ಯಲ್ಲಿ Share ಬಟನ್ ಒತ್ತಿ ಮತ್ತು "Add to Home Screen" ಆಯ್ಕೆಮಾಡಿ.'
                  : 'Tap the Share button in Safari, then choose "Add to Home Screen" to use Vidyaarthi Setu offline.'}
              </p>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {language === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
