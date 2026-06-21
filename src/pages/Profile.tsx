import { useEffect, useMemo, useState } from 'react';
import { LogOut, Share2, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { claimMyPints, deleteMyPint, fetchOwnTrustSignal, fetchPintsByUser, renamePintsByUserName, type Pint } from '../data';
import type { UserTrustSignal } from '../data';
import { useAuth } from '../Context/AuthContext';
import BrandWordmark from '../components/BrandWordmark';
import EmptyState from '../components/EmptyState';
import RatingScore from '../components/RatingScore';
import AuthorAttribution from '../components/AuthorAttribution';
import { savePendingDisplayName } from '../utils/user';

const Profile = () => {
  const navigate = useNavigate();
  const { user, displayName, isLoading, sendLoginCode, verifyLoginCode, updateDisplayName, deleteMyAccount, signOut } = useAuth();

  const [email, setEmail] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [renameFromName, setRenameFromName] = useState('');
  const [nameSaveMessage, setNameSaveMessage] = useState<string | null>(null);
  const [nameSaveError, setNameSaveError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myPints, setMyPints] = useState<Pint[]>([]);
  const [isLoadingPints, setIsLoadingPints] = useState(false);
  const [isManagingPints, setIsManagingPints] = useState(false);
  const [pintToDelete, setPintToDelete] = useState<Pint | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeletingPint, setIsDeletingPint] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [ownTrustSignal, setOwnTrustSignal] = useState<UserTrustSignal | null>(null);

  useEffect(() => {
    if (displayName) {
      setEditDisplayName(displayName);
    }
  }, [displayName]);

  useEffect(() => {
    if (!displayName) {
      setMyPints([]);
      return;
    }

    const loadPints = async () => {
      setIsLoadingPints(true);
      try {
        await claimMyPints();
        const pints = await fetchPintsByUser(displayName);
        setMyPints(pints);
      } catch (error) {
        console.error('Failed to load profile pints:', error);
        setMyPints([]);
      } finally {
        setIsLoadingPints(false);
      }
    };

    void loadPints();
  }, [displayName]);

  useEffect(() => {
    if (!user?.id) {
      setOwnTrustSignal(null);
      return;
    }

    const loadTrustSignal = async () => {
      try {
        const signal = await fetchOwnTrustSignal(user.id);
        setOwnTrustSignal(signal);
      } catch (error) {
        console.error('Failed to load trust signal:', error);
        setOwnTrustSignal(null);
      }
    };

    void loadTrustSignal();
  }, [user?.id]);

  const stats = useMemo(() => {
    const pubsVisited = new Set(myPints.map((pint) => pint.pubId)).size;
    const countries = Array.from(new Set(myPints.map((pint) => pint.country))).sort();
    const avgRating =
      myPints.length > 0
        ? myPints.reduce((sum, pint) => sum + pint.rating, 0) / myPints.length
        : 0;

    return {
      totalPints: myPints.length,
      avgRating,
      pubsVisited,
      countries,
    };
  }, [myPints]);

  const handleSendCode = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    setAuthMessage(null);

    try {
      savePendingDisplayName(displayNameInput);
      await sendLoginCode(email);
      setCodeSent(true);
      setAuthMessage('Check your email.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not send code.';
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    setAuthMessage(null);

    try {
      await verifyLoginCode(email, code, displayNameInput);
      setAuthMessage('Signed in successfully.');
      setCode('');
      setCodeSent(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not verify code.';
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDisplayName = async () => {
    if (!displayName) {
      return;
    }

    setIsSubmitting(true);
    setNameSaveError(null);
    setNameSaveMessage(null);

    const previousName = displayName;
    const nextName = editDisplayName.trim();
    const legacyName = renameFromName.trim();

    try {
      await updateDisplayName(nextName);

      let renamed = 0;
      if (previousName !== nextName) {
        renamed += await renamePintsByUserName(previousName, nextName);
      }
      if (legacyName && legacyName !== nextName && legacyName !== previousName) {
        renamed += await renamePintsByUserName(legacyName, nextName);
      }

      const pints = await fetchPintsByUser(nextName);
      setMyPints(pints);

      setNameSaveMessage(
        renamed > 0
          ? `Name updated. ${renamed} pint${renamed === 1 ? '' : 's'} on the feed now show this name.`
          : 'Name updated on your profile and future pints.'
      );
      setRenameFromName('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not update name.';
      setNameSaveError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDeleteDialog = () => {
    setPintToDelete(null);
    setDeleteError(null);
  };

  const handleConfirmDeletePint = async () => {
    if (!pintToDelete) {
      return;
    }

    setIsDeletingPint(true);
    setDeleteError(null);

    try {
      await claimMyPints();
      await deleteMyPint(pintToDelete.id);
      setMyPints((current) => current.filter((pint) => pint.id !== pintToDelete.id));
      closeDeleteDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not delete pint.';
      setDeleteError(message);
    } finally {
      setIsDeletingPint(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signOut();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not sign out.';
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    setDeleteAccountError(null);

    try {
      const { pintsDeleted } = await deleteMyAccount();
      setShowDeleteAccount(false);
      setMyPints([]);
      setAuthMessage(
        pintsDeleted > 0
          ? `Account deleted. Removed ${pintsDeleted} pint${pintsDeleted === 1 ? '' : 's'}.`
          : 'Account deleted.'
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not delete account.';
      setDeleteAccountError(message);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
        <p className="font-display italic text-cream/50 text-base">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 pt-safe-header-compact pb-safe-feed text-cream">
        <BrandWordmark size="compact" className="mb-0.5" />
        <h1 className="font-display font-black text-2xl tracking-tight text-cream">Sign in</h1>
        <p className="text-sm text-cream/50 mb-5 leading-relaxed">
          Log pints under your name and build your pint passport.
        </p>

        {codeSent && !authError && (
          <div className="mb-4 rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold leading-relaxed">
            Check your email. Tap <strong>Log in</strong>, or enter the code if your email shows one.
          </div>
        )}

        {authError && (
          <div className="mb-4 rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember/90">
            {authError}
          </div>
        )}
        {authMessage && (
          <div className="mb-4 rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">
            {authMessage}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="sign-in-email"
              className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/40 mb-2 block"
            >
              Email
            </label>
            <input
              id="sign-in-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-graphite rounded-2xl py-3.5 px-4 text-cream border border-cream/10 focus:ring-2 focus:ring-gold/40 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="sign-in-name"
              className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/40 mb-2 block"
            >
              Name on pints
            </label>
            <input
              id="sign-in-name"
              type="text"
              autoComplete="nickname"
              value={displayNameInput}
              onChange={(e) => setDisplayNameInput(e.target.value)}
              placeholder="Ant"
              className="w-full bg-graphite rounded-2xl py-3.5 px-4 text-cream border border-cream/10 focus:ring-2 focus:ring-gold/40 outline-none"
            />
          </div>

          {codeSent && (
            <div>
              <label
                htmlFor="sign-in-code"
                className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/40 mb-2 block"
              >
                6-digit code (only if your email shows one)
              </label>
              <input
                id="sign-in-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-graphite rounded-2xl py-3.5 px-4 text-cream border border-cream/10 focus:ring-2 focus:ring-gold/40 outline-none tracking-[0.3em]"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={isSubmitting || !code.trim()}
                className="w-full mt-3 py-3.5 rounded-2xl font-bold text-sm bg-graphite border border-cream/10 text-cream disabled:opacity-40"
              >
                {isSubmitting ? 'Verifying...' : 'Verify with code'}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleSendCode}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-black text-lg bg-cream text-stout active:scale-95 transition-transform disabled:opacity-60"
          >
            {isSubmitting ? 'Please wait...' : codeSent ? 'Resend sign-in email' : 'Send sign-in email'}
          </button>

          <p className="text-[10px] text-cream/35 text-center leading-relaxed pb-2">
            By continuing you agree to our{' '}
            <button
              type="button"
              onClick={() => navigate('/legal?section=terms')}
              className="text-gold underline"
            >
              Terms
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => navigate('/legal?section=privacy')}
              className="text-gold underline"
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  const initials = (displayName ?? 'NP').slice(0, 2).toUpperCase();

  return (
    <div className="max-w-md mx-auto text-cream">
      <header className="px-5 pt-safe-header pb-7 border-b border-line">
        <div className="flex justify-between items-center mb-6">
          <BrandWordmark size="compact" />
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSubmitting}
            className="p-2 bg-elevated rounded-full border border-line"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4 text-muted" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-7">
          <div className="w-16 h-16 rounded-full border border-line shrink-0 bg-elevated flex items-center justify-center">
            <span className="font-sans font-bold text-lg text-cream">{initials}</span>
          </div>
          <div>
            <AuthorAttribution
              name={displayName ?? 'NP'}
              isFoundingTaster={ownTrustSignal?.isFoundingTaster ?? false}
              isRecognized={ownTrustSignal?.isRecognized ?? false}
              nameClassName="font-display font-black text-2xl tracking-tight leading-tight"
              asHeading
            />
            <p className="text-sm text-muted mt-0.5">
              {stats.totalPints > 0
                ? `${stats.totalPints} pint${stats.totalPints === 1 ? '' : 's'} logged`
                : 'No pints logged yet'}
            </p>
            {ownTrustSignal?.isRecognized && (
              <p className="text-xs text-sage mt-2 leading-relaxed max-w-xs">
                Your ratings have been consistently in line with what others report for the same pints.
              </p>
            )}
            {(ownTrustSignal?.favouriteCount ?? 0) > 0 && (
              <p className="text-xs text-muted mt-2">
                {ownTrustSignal?.favouriteCount} {ownTrustSignal?.favouriteCount === 1 ? 'person has' : 'people have'} saved your profile.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Total Pints', value: stats.totalPints, score: null as number | null },
            {
              label: 'Avg Rating',
              value: stats.avgRating > 0 ? stats.avgRating : null,
              score: stats.avgRating > 0 ? stats.avgRating : null,
            },
            { label: 'Pubs Visited', value: stats.pubsVisited, score: null },
            { label: 'Countries', value: stats.countries.length, score: null },
          ].map(({ label, value, score }) => (
            <div key={label} className="bg-graphite p-4 rounded-2xl border border-line">
              <p className="text-[11px] uppercase font-medium tracking-wider text-muted mb-1">
                {label}
              </p>
              {score !== null ? (
                <RatingScore score={score} size="lg" className="font-bold" />
              ) : (
                <p className="text-3xl font-bold leading-none text-cream">{value}</p>
              )}
            </div>
          ))}
        </div>
      </header>

      <section className="px-5 pt-7 pb-7 border-b border-line">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] uppercase font-semibold tracking-wider text-muted">
            Pint passport
          </h2>
          <button className="flex items-center gap-1.5 bg-graphite border border-line px-3 py-1.5 rounded-full text-xs font-medium text-cream active:scale-95 transition-transform">
            <Share2 className="w-3 h-3" />
            Share
          </button>
        </div>

        {stats.countries.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-3">
            {stats.countries.map((country) => (
              <span
                key={country}
                className="bg-graphite border border-cream/10 text-cream/60 px-3 py-1.5 rounded-full text-xs font-bold"
              >
                {country}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-cream/25 mb-3">No countries logged yet.</p>
        )}

        <p className="text-xs text-cream/25 font-medium">
          {stats.pubsVisited} pubs across {stats.countries.length} countries
        </p>
      </section>

      <section className="px-5 pt-7 pb-safe-feed">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] uppercase font-semibold tracking-wider text-muted">
            My pints
          </h2>
          {myPints.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsManagingPints((current) => !current);
                closeDeleteDialog();
              }}
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                isManagingPints ? 'text-gold' : 'text-muted'
              }`}
            >
              {isManagingPints ? 'Done' : 'Edit'}
            </button>
          )}
        </div>

        {isManagingPints && (
          <p className="text-xs text-cream/50 mb-3">Tap the bin on a pint to remove it from the feed.</p>
        )}

        {isLoadingPints ? (
          <p className="text-sm text-cream/40">Loading your pints...</p>
        ) : myPints.length === 0 ? (
          <EmptyState
            title="No pints logged yet"
            description="Log your first pint — photo, drink, rating, pub."
            actionLabel="Log a pint"
            onAction={() => navigate('/add')}
            secondaryLabel="Find a Pint"
            onSecondary={() => navigate('/map')}
          />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {myPints.map((pint) => (
              <div
                key={pint.id}
                onClick={() => {
                  if (!isManagingPints) {
                    navigate(`/pint/${pint.id}`);
                  }
                }}
                className={`relative aspect-square rounded-xl overflow-hidden bg-graphite border border-line ${
                  isManagingPints ? '' : 'cursor-pointer active:scale-95 transition-transform'
                }`}
              >
                <img src={pint.photo} className="w-full h-full object-cover" alt={pint.pubName} />
                <div className="absolute inset-0 photo-scrim-base" />
                <div className="absolute inset-0 photo-scrim-gradient" />
                <div className="absolute bottom-1.5 right-1.5">
                  <RatingScore score={pint.rating} size="sm" chip />
                </div>
                {isManagingPints && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setPintToDelete(pint);
                      setDeleteError(null);
                    }}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-stout/90 border border-ember/30 text-ember"
                    aria-label={`Delete pint at ${pint.pubName}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {pintToDelete && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 px-5"
          onClick={closeDeleteDialog}
          role="presentation"
        >
          <div
            className="w-full max-w-sm bg-graphite border border-cream/15 rounded-3xl p-6 text-cream shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-pint-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-3 mb-5">
              <div>
                <h2
                  id="delete-pint-title"
                  className="font-display font-black text-xl text-cream leading-tight"
                >
                  Delete this pint?
                </h2>
                <p className="text-base text-cream/90 font-bold mt-2">{pintToDelete.pubName}</p>
              </div>
              <button
                type="button"
                onClick={closeDeleteDialog}
                className="p-2 rounded-full bg-stout border border-cream/15 text-cream/70 shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-cream/70 leading-relaxed mb-6">
              This removes it from the feed permanently. It cannot be undone.
            </p>

            {deleteError && (
              <div className="mb-5 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember/90 leading-relaxed">
                {deleteError}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleConfirmDeletePint}
                disabled={isDeletingPint}
                className="w-full min-h-[48px] py-3.5 rounded-2xl font-black text-base bg-ember text-cream disabled:opacity-50"
              >
                {isDeletingPint ? 'Deleting...' : 'Delete pint'}
              </button>
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={isDeletingPint}
                className="w-full min-h-[48px] py-3.5 rounded-2xl font-bold text-base bg-stout border border-cream/20 text-cream disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="px-5 pt-4 pb-4 border-t border-cream/5">
        <h2 className="text-[9px] uppercase font-black tracking-[0.18em] text-cream/30 mb-3">
          Settings
        </h2>

        <div className="mb-4 space-y-3">
          <div>
            <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
              Account email
            </label>
            <p className="w-full bg-stout rounded-2xl py-3.5 px-4 text-cream/50 text-sm border border-cream/5">
              {user.email}
            </p>
            <p className="text-[10px] text-cream/25 mt-1.5">
              Private — only used to sign in. Not shown on pints.
            </p>
          </div>

          <div>
            <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
              Name on pints
            </label>
            <input
              type="text"
              value={editDisplayName}
              onChange={(e) => setEditDisplayName(e.target.value)}
              placeholder="Ant"
              className="w-full bg-graphite rounded-2xl py-3.5 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none"
            />
            <p className="text-[10px] text-cream/25 mt-1.5">
              Changing this updates your name on all pints you have logged.
            </p>
          </div>

          <div>
            <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
              Also rename pints posted as (optional)
            </label>
            <input
              type="text"
              value={renameFromName}
              onChange={(e) => setRenameFromName(e.target.value)}
              placeholder="e.g. old name from feed"
              className="w-full bg-graphite rounded-2xl py-3.5 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none"
            />
            <p className="text-[10px] text-cream/25 mt-1.5">
              Use if older pints still show a different name on the feed.
            </p>
          </div>

          {nameSaveError && (
            <p className="text-sm text-ember">{nameSaveError}</p>
          )}
          {nameSaveMessage && (
            <p className="text-sm text-gold">{nameSaveMessage}</p>
          )}

          <button
            type="button"
            onClick={handleSaveDisplayName}
            disabled={isSubmitting || !editDisplayName.trim()}
            className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gold text-stout disabled:opacity-40"
          >
            {isSubmitting ? 'Saving...' : 'Save name'}
          </button>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => navigate('/legal?section=privacy')}
            className="w-full text-left py-3 px-4 bg-graphite rounded-xl border border-cream/5 text-sm text-cream/60"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => navigate('/legal?section=terms')}
            className="w-full text-left py-3 px-4 bg-graphite rounded-xl border border-cream/5 text-sm text-cream/60"
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => navigate('/legal?section=responsible')}
            className="w-full text-left py-3 px-4 bg-graphite rounded-xl border border-cream/5 text-sm text-cream/60"
          >
            Drink responsibly
          </button>
          <button
            type="button"
            onClick={() => navigate('/request-pub')}
            className="w-full text-left py-3 px-4 bg-graphite rounded-xl border border-cream/5 text-sm text-cream/60"
          >
            Report a listing
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleteAccountError(null);
              setShowDeleteAccount(true);
            }}
            className="w-full text-left py-3 px-4 bg-graphite rounded-xl border border-ember/25 text-sm text-ember"
          >
            Delete account
          </button>
        </div>
      </section>

      {showDeleteAccount && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-stout/85 backdrop-blur-sm px-5">
          <div
            role="dialog"
            aria-labelledby="delete-account-title"
            className="w-full max-w-sm bg-graphite border border-cream/10 rounded-3xl p-5 shadow-2xl"
          >
            <h2 id="delete-account-title" className="font-display font-black text-xl text-cream mb-2">
              Delete your account?
            </h2>
            <p className="text-sm text-cream/70 leading-relaxed mb-6">
              This permanently deletes all pints linked to your account and signs you out. Your
              sign-in email will be removed from active use within 30 days.
            </p>

            {deleteAccountError && (
              <div className="mb-5 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember/90">
                {deleteAccountError}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="w-full min-h-[48px] py-3.5 rounded-2xl font-black text-base bg-ember text-cream disabled:opacity-50"
              >
                {isDeletingAccount ? 'Deleting...' : 'Delete account'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteAccount(false)}
                disabled={isDeletingAccount}
                className="w-full min-h-[48px] py-3.5 rounded-2xl font-bold text-base bg-stout border border-cream/20 text-cream disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
