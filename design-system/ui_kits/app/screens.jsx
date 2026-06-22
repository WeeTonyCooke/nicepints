const { useState } = window.React ? window : window;
const { Wordmark, DrinkChip, RatingPill, EditorialScore, Avatar, Author, I, Scrim, PINTS, FLAG } = window.NP;

/* ================= FEED ================= */
function Feed({ go }) {
  const hero = [...PINTS].sort((a, b) => b.rating - a.rating)[0];
  const rest = PINTS.filter((p) => p.id !== hero.id);
  return (
    <div style={{ paddingBottom: '120px' }}>
      <header style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Wordmark size="header" />
        <button onClick={() => go('profile')} style={btnReset}><Avatar name="Ant" size={28} /></button>
      </header>

      {/* hero */}
      <section className="np-noise" onClick={() => go('pint', hero)} style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', cursor: 'pointer' }}>
        <img src={hero.photo} alt={hero.pub} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <Scrim />
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 2 }}><EditorialScore score={hero.rating} size="hero" /></div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 24px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px' }}>{FLAG[hero.country]}</span>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.02em' }}>{hero.location}</span>
          </div>
          <DrinkChip slug={hero.slug} style={{ marginBottom: '12px' }}>{hero.drink}{hero.serving === 'draught' ? ' \u00B7 Draught' : ''}</DrinkChip>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 900, lineHeight: 1.1, color: 'var(--cream)', margin: '0 0 12px', textShadow: 'var(--shadow-score)' }}>{hero.pub}</h2>
          <p style={{ color: 'rgba(243,239,230,0.82)', fontSize: '16px', lineHeight: 1.4, margin: '0 0 16px', maxWidth: '90%' }}>"{hero.note}"</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Avatar name={hero.user} size={24} /><Author name={hero.user} founding={hero.founding} /></div>
        </div>
      </section>

      {/* section divider */}
      <div style={{ padding: '32px 20px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--muted)' }}>Latest</span>
        <span style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
        <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 500 }}>{rest.length} pints</span>
      </div>

      {/* grid */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '12px', rowGap: '32px' }}>
        {rest.map((p, i) => (
          <article key={p.id} onClick={() => go('pint', p)} style={{ cursor: 'pointer' }}>
            <div className="np-noise" style={{ position: 'relative', aspectRatio: '4/5', borderRadius: '16px', overflow: 'hidden', background: 'var(--graphite)', border: '1px solid var(--line)', marginBottom: '12px' }}>
              <img src={p.photo} alt={p.pub} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <Scrim />
              <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 2 }}><EditorialScore score={p.rating} size="feed" /></div>
              <div style={{ position: 'absolute', left: '14px', bottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px' }}>{FLAG[p.country]}</span>
                <span style={{ fontSize: '10px', color: 'rgba(243,239,230,0.7)', fontWeight: 500 }}>{p.location}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.15, color: 'var(--cream)', margin: 0 }}>{p.pub}</h3>
              <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 500, marginTop: '3px', flexShrink: 0 }}>{p.time}</span>
            </div>
            <DrinkChip slug={p.slug} style={{ marginBottom: '8px' }}>{p.drink}</DrinkChip>
            <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.4, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{p.note}"</p>
            <Author name={p.user} founding={p.founding} />
          </article>
        ))}
      </div>
    </div>
  );
}

/* ================= FIND A PINT ================= */
function Find({ go }) {
  const [preset, setPreset] = useState('00');
  const [recency, setRecency] = useState('30');
  const [min8, setMin8] = useState(true);
  const [q, setQ] = useState('');
  const PRESETS = [{ id: '00', label: 'Guinness 0.0 on Draught', hl: true }, { id: 'g', label: 'Guinness' }, { id: 'all', label: 'All pints' }];
  let res = PINTS.filter((p) => preset === 'all' ? true : preset === '00' ? p.slug === 'guinness-00' : p.slug === 'guinness');
  if (min8) res = res.filter((p) => p.rating >= 8 || preset === '00');
  if (q) res = res.filter((p) => (p.pub + p.location).toLowerCase().includes(q.toLowerCase()));
  res = [...res].sort((a, b) => b.rating - a.rating);

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '20px 20px 16px' }}>
        <Wordmark size="compact" />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--cream)', margin: '4px 0 0' }}>Find a Pint</h1>
        <p style={{ fontSize: '14px', color: 'rgba(243,239,230,0.5)', margin: '6px 0 0', lineHeight: 1.4 }}>Choose a drink and we'll show you the best-rated places nearby.</p>
      </div>

      <div style={{ padding: '0 20px 16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {PRESETS.map((it) => {
          const on = preset === it.id;
          return <button key={it.id} onClick={() => setPreset(it.id)} style={{ ...chip, whiteSpace: 'nowrap', color: on ? 'var(--gold)' : 'var(--muted)', borderColor: on ? 'var(--gold)' : 'var(--line)', background: on ? 'var(--gold-soft)' : 'var(--graphite)' }}>{it.label}</button>;
        })}
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>{I.search}</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pub or town" style={{ width: '100%', boxSizing: 'border-box', background: 'var(--graphite)', border: '1px solid var(--line)', borderRadius: '16px', padding: '14px 16px 14px 42px', color: 'var(--cream)', fontSize: '16px', fontFamily: 'var(--font-sans)', outline: 'none' }} />
        </div>
      </div>

      <div style={{ padding: '0 20px 16px', display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1, display: 'flex', background: 'var(--graphite)', padding: '4px', borderRadius: '16px', border: '1px solid var(--line)' }}>
          {[['7', 'This week'], ['30', '30 days'], ['90', '90 days']].map(([d, l]) => { const on = recency === d; return <button key={d} onClick={() => setRecency(d)} style={{ flex: 1, padding: '8px 0', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', borderRadius: '12px', border: 'none', cursor: 'pointer', background: on ? 'var(--gold-soft)' : 'transparent', color: on ? 'var(--gold)' : 'var(--muted)' }}>{l}</button>; })}
        </div>
        <button onClick={() => setMin8((v) => !v)} style={{ ...chip, background: min8 ? 'var(--gold-soft)' : 'var(--graphite)', color: min8 ? 'var(--gold)' : 'var(--muted)', borderColor: min8 ? 'var(--gold)' : 'var(--line)' }}>8+</button>
      </div>

      <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)' }}>
        <span style={{ display: 'flex' }}>{I.nav}</span>
        <span style={{ fontSize: '12px' }}>Sorted by rating</span>
        <span style={{ color: 'rgba(243,239,230,0.2)' }}>{'\u00B7'}</span>
        <span style={{ fontSize: '12px' }}>{res.length} pub{res.length === 1 ? '' : 's'} with matching pints</span>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {res.map((p) => (
          <div key={p.id} onClick={() => go('pint', p)} style={{ background: 'var(--graphite)', borderRadius: '16px', border: '1px solid var(--line)', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'relative', height: '144px' }}>
              <img src={p.photo} alt={p.pub} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <Scrim />
              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <DrinkChip slug={p.slug}>{p.drink}</DrinkChip>
                {p.serving === 'draught' && <span style={{ background: 'rgba(19,17,15,0.8)', color: 'var(--cream)', padding: '4px 9px', borderRadius: '9999px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid var(--line)' }}>Draught</span>}
              </div>
              <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}><RatingPill score={p.rating} size="md" /></div>
            </div>
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--cream)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.pub}</h3>
                <p style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>{I.pin}{p.location}</p>
                <p style={{ fontSize: '10px', color: 'var(--muted)', margin: '5px 0 0' }}>{p.count} pints logged {'\u00B7'} {p.thisMonth} this month</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= PINT DETAIL ================= */
function PintDetail({ pint, go }) {
  const p = pint || PINTS[0];
  return (
    <div style={{ paddingBottom: '40px', color: 'var(--cream)' }}>
      <section style={{ position: 'relative', width: '100%', aspectRatio: '4/5' }}>
        <img src={p.photo} alt={p.pub} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <Scrim />
        <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <button onClick={() => go('feed')} style={{ ...iconBtn }}>{I.back}</button>
          <RatingPill score={p.rating} size="lg" />
        </div>
      </section>
      <main style={{ padding: '28px 20px' }}>
        <DrinkChip slug={p.slug} style={{ marginBottom: '16px' }}>{p.drink}{p.serving === 'draught' ? ' \u00B7 Draught' : ''}</DrinkChip>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 900, lineHeight: 1.1, margin: '0 0 8px' }}>{p.pub}</h2>
        <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 28px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>{FLAG[p.country]}</span>{I.pin}<span>{p.location}</span></p>
        <p style={{ fontSize: '21px', lineHeight: 1.5, color: 'rgba(243,239,230,0.9)', margin: '0 0 32px' }}>"{p.note}"</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid var(--line)' }}>
          <div>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted)', margin: '0 0 4px' }}>Logged by</p>
            <Author name={p.user} founding={p.founding} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted)', margin: '0 0 4px' }}>When</p>
            <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{p.time} ago</p>
          </div>
        </div>
        <button onClick={() => go('find')} style={{ marginTop: '28px', width: '100%', background: 'var(--graphite)', border: '1px solid var(--line)', padding: '16px', borderRadius: '16px', fontWeight: 600, fontSize: '14px', color: 'rgba(243,239,230,0.8)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>See all pints at {p.pub} {'\u2192'}</button>
      </main>
    </div>
  );
}

/* shared inline style objects */
const btnReset = { background: 'none', border: 'none', padding: 0, cursor: 'pointer' };
const chip = { flexShrink: 0, padding: '10px 16px', borderRadius: '9999px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid var(--line)', cursor: 'pointer', fontFamily: 'var(--font-sans)' };
const iconBtn = { padding: '10px', background: 'rgba(19,17,15,0.7)', backdropFilter: 'blur(8px)', borderRadius: '9999px', color: 'var(--cream)', border: '1px solid var(--line)', cursor: 'pointer', display: 'flex' };

window.NP_SCREENS = { Feed, Find, PintDetail };
