import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, ChevronDown } from 'lucide-react';
import { PINT_TYPES, type PintType } from '../data';

const RATING_LABELS = ['', 'Awful', 'Poor', 'Decent', 'Good', 'Deadly'];

const AddPint = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [pintType, setPintType] = useState<PintType | ''>('');
  const [comment, setComment] = useState('');
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const canPost = rating > 0;

  return (
    <div className="max-w-md mx-auto px-5 pt-12 pb-24">

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-0.5">Nice<span className="text-gold">Pints</span></p>
          <h1 className="font-display font-black text-2xl">Log a Pint</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-cream/40 text-sm font-medium px-3 py-1.5 rounded-xl bg-graphite border border-cream/5 active:scale-95 transition-transform"
        >
          Cancel
        </button>
      </header>

      <div className="space-y-7">

        {/* 1. Photo */}
        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">1</span>Photo
          </label>
          <div className="aspect-[4/5] bg-graphite rounded-2xl border-2 border-dashed border-cream/10 flex flex-col items-center justify-center active:border-gold/40 transition-colors cursor-pointer group">
            <div className="w-16 h-16 rounded-2xl bg-stout flex items-center justify-center mb-3 group-active:bg-gold/10 transition-colors">
              <Camera className="w-7 h-7 text-gold" />
            </div>
            <p className="text-sm font-bold text-cream/40">Snap the pint</p>
            <p className="text-xs text-cream/20 mt-1">Tap to open camera</p>
          </div>
        </div>

        {/* 2. Rating — BEFORE pub, as per spec */}
        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-3 block">
            <span className="text-gold mr-1.5">2</span>How was it?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all active:scale-90
                  ${rating === s
                    ? 'bg-gold border-gold'
                    : s < rating
                    ? 'bg-gold/15 border-gold/25'
                    : 'bg-graphite border-cream/5'
                  }`}
              >
                <span className={`text-xl font-black leading-none ${rating === s ? 'text-stout' : s < rating ? 'text-gold' : 'text-cream/25'}`}>
                  {s}
                </span>
                <span className={`text-[8px] font-black uppercase tracking-wide leading-none ${rating === s ? 'text-stout/60' : s < rating ? 'text-gold/50' : 'text-cream/15'}`}>
                  {RATING_LABELS[s]}
                </span>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs text-cream/40 mt-2 text-center font-display italic">
              "{RATING_LABELS[rating]}" — {rating === 5 ? 'Fair play.' : rating >= 4 ? 'Solid pour.' : rating >= 3 ? 'Could be worse.' : 'Wouldn\'t rush back.'}
            </p>
          )}
        </div>

        {/* 3. Pub */}
        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">3</span>Pub
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
            <input
              type="text"
              placeholder="Search for the pub…"
              className="w-full bg-graphite rounded-2xl py-4 pl-11 pr-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none placeholder:text-cream/20 transition-all"
            />
          </div>
        </div>

        {/* 4. Pint type */}
        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">4</span>What are you drinking?
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="w-full bg-graphite rounded-2xl py-4 px-4 text-left border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none flex items-center justify-between transition-all"
            >
              <span className={pintType ? 'text-cream text-sm font-bold' : 'text-cream/20 text-sm'}>
                {pintType || 'Select pint type…'}
              </span>
              <ChevronDown className={`w-4 h-4 text-cream/30 transition-transform ${showTypeMenu ? 'rotate-180' : ''}`} />
            </button>

            {showTypeMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-graphite border border-cream/10 rounded-2xl overflow-hidden shadow-2xl z-10">
                {PINT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setPintType(type); setShowTypeMenu(false); }}
                    className={`w-full px-4 py-3.5 text-left text-sm font-medium border-b border-cream/5 last:border-0 transition-colors
                      ${pintType === type ? 'text-gold font-bold bg-gold/5' : 'text-cream/70 active:bg-cream/5'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 5. Comment */}
        <div>
          <label className="text-[10px] uppercase font-black tracking-[0.18em] text-cream/30 mb-2 block">
            <span className="text-gold mr-1.5">5</span>Anything to add?
            <span className="text-cream/20 normal-case font-normal ml-1">optional</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was it, honestly?"
            maxLength={120}
            rows={3}
            className="w-full bg-graphite rounded-2xl py-4 px-4 text-cream text-sm border border-cream/5 focus:ring-2 focus:ring-gold/40 outline-none placeholder:text-cream/20 resize-none transition-all font-display italic placeholder:not-italic placeholder:font-sans"
          />
          <p className="text-right text-[10px] text-cream/20 mt-1">{comment.length}/120</p>
        </div>

        {/* Post */}
        <button
          onClick={() => navigate('/')}
          disabled={!canPost}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95
            ${canPost
              ? 'bg-cream text-stout shadow-lg shadow-cream/10'
              : 'bg-graphite text-cream/20 cursor-not-allowed border border-cream/5'
            }`}
        >
          {canPost ? 'Post Pint' : 'Select a rating to post'}
        </button>
      </div>
    </div>
  );
};

export default AddPint;
