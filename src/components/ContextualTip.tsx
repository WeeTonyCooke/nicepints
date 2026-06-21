import { useState } from 'react';
import { X } from 'lucide-react';
import {
  dismissContextualTip,
  hasSeenContextualTip,
  type ContextualTipId,
} from '../utils/contextualTips';

type ContextualTipProps = {
  tipId: ContextualTipId;
  children: React.ReactNode;
  className?: string;
};

const ContextualTip = ({ tipId, children, className = '' }: ContextualTipProps) => {
  const [visible, setVisible] = useState(() => !hasSeenContextualTip(tipId));

  if (!visible) {
    return null;
  }

  const handleDismiss = () => {
    dismissContextualTip(tipId);
    setVisible(false);
  };

  return (
    <div
      className={`rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold leading-relaxed flex gap-3 items-start ${className}`}
      role="note"
    >
      <p className="flex-1">{children}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 p-0.5 text-gold/70 active:text-gold"
        aria-label="Dismiss tip"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ContextualTip;
