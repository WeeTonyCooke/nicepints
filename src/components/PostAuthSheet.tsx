import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { savePendingDisplayName } from '../utils/user';

type PostAuthSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  returnPath?: string;
};

const PostAuthSheet = ({ isOpen, onClose, returnPath = '/add' }: PostAuthSheetProps) => {
  const { signInWithGoogle, sendLoginCode, verifyLoginCode } = useAuth();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (displayName.trim()) {
        savePendingDisplayName(displayName);
      }
      await signInWithGoogle(returnPath);
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Could not start Google sign-in.';
      setError(text);
      setIsSubmitting(false);
    }
  };

  const handleSendCode = async () => {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      savePendingDisplayName(displayName);
      await sendLoginCode(email);
      setCodeSent(true);
      setMessage('Check your email for a 6-digit code.');
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Could not send code.';
      setError(text);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await verifyLoginCode(email, code, displayName);
      setMessage('Signed in — posting your pint...');
      onClose();
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Could not verify code.';
      setError(text);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-stout/80 backdrop-blur-sm px-4 pb-safe-feed">
      <div
        role="dialog"
        aria-labelledby="post-auth-title"
        className="w-full max-w-md bg-graphite border border-cream/10 rounded-3xl p-5 shadow-2xl mb-4"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 id="post-auth-title" className="font-display font-black text-xl text-cream">
              Sign in to post
            </h2>
            <p className="text-sm text-cream/60 mt-1">
              One quick step — then your pint goes live.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-stout border border-cream/15 text-cream/70"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
            {message}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
              Name on pints
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ant"
              className="w-full bg-stout rounded-2xl py-3.5 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || !displayName.trim()}
            className="w-full py-3.5 rounded-2xl font-bold text-sm bg-cream text-stout disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-cream/10" />
            <span className="text-[10px] uppercase font-black tracking-widest text-cream/25">or</span>
            <div className="flex-1 h-px bg-cream/10" />
          </div>

          <div>
            <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-stout rounded-2xl py-3.5 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none"
            />
          </div>

          {codeSent && (
            <div>
              <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
                6-digit code
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-stout rounded-2xl py-3.5 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none tracking-widest"
              />
            </div>
          )}

          <button
            type="button"
            onClick={codeSent ? handleVerifyCode : handleSendCode}
            disabled={
              isSubmitting ||
              !displayName.trim() ||
              !email.trim() ||
              (codeSent && !code.trim())
            }
            className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gold text-stout disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {codeSent ? 'Verify and post' : 'Send email code'}
          </button>
        </div>

        <p className="text-[10px] text-cream/30 text-center mt-4 leading-relaxed">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PostAuthSheet;
