import { useState } from 'react';
import { Flag, Loader2, X } from 'lucide-react';
import { REPORT_REASONS, submitPintReport, type ReportReason } from '../data/moderation';
import { useAuth } from '../Context/AuthContext';
import { Link } from 'react-router-dom';

type ReportPintDialogProps = {
  pintId: string;
};

const ReportPintDialog = ({ pintId }: ReportPintDialogProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>('inappropriate_photo');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const close = () => {
    setIsOpen(false);
    setError(null);
    setSuccess(false);
    setDetails('');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await submitPintReport({ pintId, reason, details });
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not submit report.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-cream/30 text-xs font-bold uppercase tracking-widest active:opacity-70"
      >
        <Flag className="w-3.5 h-3.5" />
        Report
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-safe-nav">
          <div className="w-full max-w-md bg-graphite border border-cream/10 rounded-t-3xl rounded-b-2xl p-5 text-cream max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-black text-lg">Report this pint</h2>
              <button
                type="button"
                onClick={close}
                className="p-2 rounded-full bg-stout border border-cream/10"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <p className="text-cream/70 text-sm mb-4">
                  Thanks — we&apos;ll review this report.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="text-gold font-bold text-sm"
                >
                  Done
                </button>
              </div>
            ) : !user ? (
              <div className="text-sm text-cream/60 space-y-4">
                <p>Sign in to report inappropriate content.</p>
                <Link to="/profile" className="text-gold font-bold underline" onClick={close}>
                  Go to Profile
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded-xl border border-ember/30 bg-ember/10 px-3 py-2 text-sm text-ember/90">
                    {error}
                  </div>
                )}

                <label className="text-[10px] uppercase font-black tracking-widest text-cream/30 mb-2 block">
                  Reason
                </label>
                <div className="space-y-2 mb-4">
                  {REPORT_REASONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                        reason === option.value
                          ? 'border-gold/40 bg-gold/5'
                          : 'border-cream/5 bg-stout/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={option.value}
                        checked={reason === option.value}
                        onChange={() => setReason(option.value)}
                        className="accent-gold"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>

                <label className="text-[10px] uppercase font-black tracking-widest text-cream/30 mb-2 block">
                  Details (optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full bg-stout rounded-xl py-3 px-3 text-sm border border-cream/5 mb-4 resize-none"
                  placeholder="Anything else we should know?"
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl font-black bg-cream text-stout flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit report
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReportPintDialog;
