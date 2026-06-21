import { useState } from 'react';
import { confirmAge } from '../utils/ageGate';
import BrandSplash from './BrandSplash';

type AgeGateProps = {
  onConfirmed: () => void;
};

const AgeGate = ({ onConfirmed }: AgeGateProps) => {
  const [declined, setDeclined] = useState(false);

  const handleConfirm = () => {
    confirmAge();
    onConfirmed();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-stout flex items-center justify-center px-6" data-testid="age-gate">
      <div className="max-w-md w-full text-cream text-center">
        <BrandSplash className="mb-8" />

        {declined ? (
          <>
            <p className="text-cream/60 text-sm leading-relaxed mb-6">
              Nice Pints is for adults of legal drinking age. You need to meet the minimum age
              in your country to use this app.
            </p>
            <button
              type="button"
              onClick={() => setDeclined(false)}
              className="text-cream/70 text-sm font-bold underline"
            >
              Go back
            </button>
          </>
        ) : (
          <>
            <p className="text-cream/60 text-sm leading-relaxed mb-4">
              Nice Pints helps you discover and log pub pours. It is intended for users who are
              at least <strong className="text-cream">17 years old</strong> (or the legal
              drinking age where you live, if higher).
            </p>
            <p className="text-cream/40 text-xs leading-relaxed mb-8">
              Please drink responsibly. Do not drink and drive.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-4 rounded-2xl font-black text-lg bg-cream text-stout active:scale-95 transition-transform"
              >
                I meet the legal age
              </button>
              <button
                type="button"
                onClick={() => setDeclined(true)}
                className="w-full py-3 rounded-2xl text-sm font-bold text-cream/40"
              >
                I do not
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgeGate;
