import { useEffect, useState } from 'react';
import { renamePintsByUserName } from '../data';
import { useAuth } from '../Context/AuthContext';
import { formatAuthorName, getEmailPrefix, hasCustomDisplayName } from '../utils/user';

const ChooseNamePrompt = () => {
  const { user, displayName, isLoading, updateDisplayName } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const shouldShow = !isLoading && user && !hasCustomDisplayName(user);

  useEffect(() => {
    if (!shouldShow) {
      return;
    }

    const suggested = formatAuthorName(displayName ?? getEmailPrefix(user) ?? '');
    setName(suggested);
  }, [shouldShow, displayName, user]);

  if (!shouldShow) {
    return null;
  }

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Enter a name to show on your pints.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const previousName = displayName ?? getEmailPrefix(user) ?? '';
      await updateDisplayName(trimmed);

      if (previousName && previousName !== trimmed) {
        await renamePintsByUserName(previousName, trimmed);
      }

      const legacyWithAt = `@${previousName}`;
      if (legacyWithAt !== trimmed && previousName) {
        await renamePintsByUserName(legacyWithAt, trimmed);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save your name.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 px-4 pb-safe-nav">
      <div className="w-full max-w-md bg-graphite border border-cream/10 rounded-t-3xl rounded-b-2xl p-6 text-cream">
        <p className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2">
          Welcome
        </p>
        <h2 className="font-display font-black text-2xl mb-2">What should we call you?</h2>
        <p className="text-sm text-cream/50 mb-5 leading-relaxed">
          This is the name shown on pints you log. Real name or nickname — your choice.
        </p>

        <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
          Name on pints
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ant"
          className="w-full bg-stout rounded-2xl py-4 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none mb-4"
        />

        {error && (
          <p className="text-sm text-ember mb-3">{error}</p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !name.trim()}
          className="w-full py-4 rounded-2xl font-black text-lg bg-cream text-stout disabled:opacity-40"
        >
          {isSaving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default ChooseNamePrompt;
