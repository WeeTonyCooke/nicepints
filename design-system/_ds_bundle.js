/* @ds-bundle: {"format":3,"namespace":"NicePintsDesignSystem_572a4a","components":[{"name":"PintMark","sourcePath":"components/brand/BrandWordmark.jsx"},{"name":"BrandWordmark","sourcePath":"components/brand/BrandWordmark.jsx"},{"name":"DrinkChip","sourcePath":"components/brand/DrinkChip.jsx"},{"name":"EditorialRatingBlock","sourcePath":"components/brand/EditorialRatingBlock.jsx"},{"name":"RatingScore","sourcePath":"components/brand/RatingScore.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"SectionLabel","sourcePath":"components/core/SectionLabel.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"NavIcons","sourcePath":"components/navigation/NavBar.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"}],"sourceHashes":{"components/brand/BrandWordmark.jsx":"14d96f2566d9","components/brand/DrinkChip.jsx":"f8d652a81a21","components/brand/EditorialRatingBlock.jsx":"89bdf5992aa6","components/brand/RatingScore.jsx":"9e163b6adaae","components/core/Button.jsx":"24085df0c239","components/core/Card.jsx":"d59c98204628","components/core/Input.jsx":"bd4224ee38bd","components/core/SectionLabel.jsx":"0accf30d5c09","components/core/Tag.jsx":"ce777e325203","components/navigation/NavBar.jsx":"99877662f81f","ui_kits/app/data.js":"2f001335c179","ui_kits/app/primitives.jsx":"9690b3f17abd","ui_kits/app/screens.jsx":"803e456ceba1"},"inlinedExternals":[],"unexposedExports":[{"name":"ratingTone","sourcePath":"components/brand/RatingScore.jsx"}]} */

(() => {

const __ds_ns = (window.NicePintsDesignSystem_572a4a = window.NicePintsDesignSystem_572a4a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/BrandWordmark.jsx
try { (() => {
/** The canonical Nice Pints pint-glass mark, inlined so it needs no asset path.
 *  Cream head, warm-black body, white settle line. Guinness taper, no base line. */
function PintMark({
  size = 26,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 189.2",
    width: size,
    height: size * 189.2 / 100,
    style: {
      display: 'block',
      flexShrink: 0,
      ...style
    },
    role: "img",
    "aria-label": "Nice Pints"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M64.32 0 L84.32 2.16 L90.81 3.78 L92.97 5.41 L98.38 25.95 L99.46 35.14 L99.46 54.05 L96.22 75.14 L88.11 102.7 L83.24 129.19 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L17.3 140.54 L16.22 129.19 L11.89 105.41 L3.24 75.68 L0 54.59 L0.54 30.27 L2.16 20.54 L6.49 5.95 L9.73 3.78 L16.22 2.16 L37.3 0 Z",
    fill: "#F2E9D8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 37.84 L20 37.84 L27.57 37.84 L28.11 38.38 L41.62 38.38 L42.16 38.92 L58.92 38.92 L59.46 38.38 L70.81 38.38 L71.35 37.84 L78.92 37.84 L79.46 37.3 L99.46 37.3 L99.46 54.05 L97.84 67.03 L95.14 80 L88.11 102.7 L82.7 134.05 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L16.76 134.05 L11.89 105.41 L4.32 80 L1.62 67.57 L0 54.59 Z",
    fill: "#1B1815"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M64.32 0 L84.32 2.16 L90.81 3.78 L92.97 5.41 L98.38 25.95 L99.46 35.14 L99.46 54.05 L96.22 75.14 L88.11 102.7 L83.24 129.19 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L17.3 140.54 L16.22 129.19 L11.89 105.41 L3.24 75.68 L0 54.59 L0.54 30.27 L2.16 20.54 L6.49 5.95 L9.73 3.78 L16.22 2.16 L37.3 0 Z",
    fill: "none",
    stroke: "#F2E9D8",
    strokeWidth: "3.2",
    strokeLinejoin: "round"
  }));
}
const SIZES = {
  header: {
    fontSize: '20px',
    icon: 17
  },
  page: {
    fontSize: '24px',
    icon: 20
  },
  display: {
    fontSize: '30px',
    icon: 25
  }
};

/**
 * Nice Pints wordmark. Playfair black; "Pints" set gold italic. An optional
 * pint mark leads the lockup (default on for the `header` size).
 */
function BrandWordmark({
  size = 'header',
  showIcon,
  as: Tag = 'span',
  style = {}
}) {
  const s = SIZES[size] ?? SIZES.header;
  const withIcon = showIcon ?? size === 'header';
  if (size === 'compact') {
    return /*#__PURE__*/React.createElement(Tag, {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--muted)',
        lineHeight: 1,
        ...style
      }
    }, "Nice Pints");
  }
  return /*#__PURE__*/React.createElement(Tag, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      ...style
    }
  }, withIcon && /*#__PURE__*/React.createElement(PintMark, {
    size: s.icon
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: s.fontSize,
      letterSpacing: '-0.02em',
      lineHeight: 1,
      color: 'var(--cream)'
    }
  }, "Nice ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold)',
      fontStyle: 'italic'
    }
  }, "Pints")));
}
Object.assign(__ds_scope, { PintMark, BrandWordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/BrandWordmark.jsx", error: String((e && e.message) || e) }); }

// components/brand/DrinkChip.jsx
try { (() => {
const ACCENTS = {
  guinness: 'var(--drink-guinness)',
  'guinness-00': 'var(--drink-guinness-00)',
  beamish: 'var(--drink-beamish)',
  murphys: 'var(--drink-murphys)'
};

/**
 * Drink-category chip — the one place the drink-type accent system appears
 * (DESIGN-PRINCIPLES §6). 3px left border + text in the accent colour, on a
 * graphite chip. Never apply the accent to backgrounds, scrims, or photos.
 */
function DrinkChip({
  slug = 'other',
  children,
  style = {}
}) {
  const accent = ACCENTS[slug] ?? 'var(--drink-other)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      background: 'var(--graphite)',
      border: '1px solid var(--line)',
      borderLeft: `3px solid ${accent}`,
      color: accent,
      padding: '4px 9px',
      borderRadius: 'var(--radius-chip)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { DrinkChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/DrinkChip.jsx", error: String((e && e.message) || e) }); }

// components/brand/EditorialRatingBlock.jsx
try { (() => {
function verdict(score) {
  if (score >= 9) return 'Exceptional';
  if (score >= 8.5) return 'Excellent';
  if (score >= 7.5) return 'Very Good';
  if (score >= 6.5) return 'Good';
  return null;
}
const SIZES = {
  feed: '3rem',
  hero: '3.5rem'
};
const RULE = {
  feed: '86%',
  hero: '88%'
};

/**
 * The editorial rating block — the largest element on a feed/hero card.
 * Big Playfair numeral with the fraction as a superscript, a gold hairline
 * rule, and a one-word verdict (shown at 6.5+). Designed to sit over a photo.
 */
function EditorialRatingBlock({
  score,
  size = 'feed',
  style = {}
}) {
  const formatted = score.toFixed(1);
  const dot = formatted.indexOf('.');
  const whole = formatted.slice(0, dot);
  const frac = formatted.slice(dot);
  const v = verdict(score);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      textAlign: 'right',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: '-0.03em',
      color: 'var(--np-cream)',
      textShadow: 'var(--shadow-score)',
      fontSize: SIZES[size] ?? SIZES.feed
    },
    "aria-label": `${formatted} out of 10`
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, whole, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.34em',
      verticalAlign: '0.2em',
      marginLeft: '-0.03em',
      fontWeight: 700
    }
  }, frac))), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'block',
      height: '1px',
      background: 'var(--np-gold)',
      marginTop: '6px',
      marginLeft: 'auto',
      width: RULE[size] ?? RULE.feed
    }
  })), v && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: '13px',
      fontWeight: 500,
      color: 'var(--np-cream)',
      marginTop: '16px',
      letterSpacing: '0.01em',
      textShadow: 'var(--shadow-score)'
    }
  }, v));
}
Object.assign(__ds_scope, { EditorialRatingBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/EditorialRatingBlock.jsx", error: String((e && e.message) || e) }); }

// components/brand/RatingScore.jsx
try { (() => {
/** Tone by score band — matches utils/ratingColor in the app. */
function ratingTone(score) {
  if (score >= 9) return 'var(--rating-gold)';
  if (score >= 8) return 'var(--rating-amber)';
  if (score >= 7) return 'var(--rating-copper)';
  return 'var(--rating-stone)';
}
const SIZES = {
  sm: {
    padding: '3px 8px',
    fontSize: '10px'
  },
  md: {
    padding: '5px 10px',
    fontSize: '12px'
  },
  lg: {
    padding: '6px 12px',
    fontSize: '18px'
  }
};

/**
 * Compact rating pill — translucent dark backdrop with blur, score coloured
 * by band. Sits over photos (e.g. on Find-a-Pint result cards). Shows `/10`.
 * For the large hero/feed numeral use <EditorialRatingBlock>.
 */
function RatingScore({
  score,
  size = 'md',
  showMax = true,
  style = {}
}) {
  const s = SIZES[size] ?? SIZES.md;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
      color: ratingTone(score),
      background: 'rgba(0,0,0,0.55)',
      border: '1px solid rgba(243,239,230,0.10)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-sm)',
      ...s,
      ...style
    }
  }, score.toFixed(1), showMax ? '/10' : '');
}
Object.assign(__ds_scope, { ratingTone, RatingScore });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/RatingScore.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    padding: '8px 14px',
    fontSize: '12px'
  },
  md: {
    padding: '12px 20px',
    fontSize: '14px'
  },
  lg: {
    padding: '16px 24px',
    fontSize: '15px'
  }
};

/**
 * Nice Pints primary action button. Gold is reserved for the one primary
 * action per screen (Rams #1); use `secondary` / `ghost` for everything else.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon = null,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    lineHeight: 1,
    border: '1px solid transparent',
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    transition: 'transform var(--dur-fast) var(--ease-standard), background var(--dur-base), color var(--dur-base)',
    WebkitTapHighlightColor: 'transparent',
    ...SIZES[size]
  };
  const variants = {
    primary: {
      background: 'var(--gold)',
      color: 'var(--action-on)',
      borderColor: 'var(--gold)'
    },
    secondary: {
      background: 'var(--graphite)',
      color: 'var(--cream)',
      borderColor: 'var(--line)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--muted)',
      borderColor: 'transparent'
    },
    danger: {
      background: 'transparent',
      color: 'var(--rust)',
      borderColor: 'var(--line)'
    }
  };
  const opacity = disabled ? 0.45 : 1;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant],
      opacity,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.96)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Surface card — graphite on stout with a 1px line border so it lifts off
 * the page. `photo` mode is the feed card: 4:5 image with light scrim,
 * children render over the bottom of the image.
 */
function Card({
  children,
  as: Tag = 'div',
  interactive = false,
  noise = false,
  padding = '16px',
  radius = 'var(--radius-lg)',
  style = {},
  onClick,
  ...rest
}) {
  const base = {
    background: 'var(--graphite)',
    border: '1px solid var(--line)',
    borderRadius: radius,
    padding,
    color: 'var(--cream)',
    boxShadow: 'var(--shadow-card)',
    transition: 'transform var(--dur-fast) var(--ease-standard)',
    cursor: interactive ? 'pointer' : 'default',
    ...style
  };
  const press = interactive ? {
    onMouseDown: e => {
      e.currentTarget.style.transform = 'scale(0.985)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  } : {};
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: noise ? 'np-noise' : undefined,
    style: base,
    onClick: onClick
  }, press, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Form text input / search field — graphite fill, line border, gold focus ring. */
function Input({
  type = 'text',
  icon = null,
  fullWidth = true,
  style = {},
  ...rest
}) {
  const wrap = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: fullWidth ? '100%' : 'auto'
  };
  const field = {
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    // 16px min prevents iOS zoom-on-focus
    color: 'var(--cream)',
    background: 'var(--graphite)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius-lg)',
    padding: icon ? '14px 16px 14px 42px' : '14px 16px',
    outline: 'none',
    transition: 'box-shadow var(--dur-base), border-color var(--dur-base)',
    ...style
  };
  return /*#__PURE__*/React.createElement("span", {
    style: wrap
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--muted)',
      display: 'flex',
      pointerEvents: 'none'
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    style: field,
    onFocus: e => {
      e.currentTarget.style.borderColor = 'var(--gold)';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,162,39,0.18)';
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = 'var(--line)';
      e.currentTarget.style.boxShadow = 'none';
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionLabel.jsx
try { (() => {
/**
 * Uppercase section divider — small tracked label, a hairline rule, and an
 * optional right-aligned count. Used for "Latest · 12 pints" feed dividers.
 */
function SectionLabel({
  children,
  count = null,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-label)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--muted)',
      whiteSpace: 'nowrap'
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: '1px',
      background: 'var(--line)'
    }
  }), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-micro)',
      fontWeight: 500,
      color: 'var(--muted)',
      whiteSpace: 'nowrap'
    }
  }, count));
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: 'var(--graphite)',
    fg: 'var(--muted)',
    bd: 'var(--line)'
  },
  cream: {
    bg: 'var(--graphite)',
    fg: 'var(--cream)',
    bd: 'var(--line)'
  },
  gold: {
    bg: 'var(--gold-soft)',
    fg: 'var(--gold)',
    bd: 'var(--gold)'
  },
  sage: {
    bg: 'var(--sage-tint)',
    fg: 'var(--sage)',
    bd: 'var(--line)'
  },
  rust: {
    bg: 'var(--rust-tint)',
    fg: 'var(--rust)',
    bd: 'var(--line)'
  }
};

/**
 * Small status / meta tag. Uppercase, tracked, pill or chip radius.
 * For drink categories use <DrinkChip> instead (it carries the accent system).
 */
function Tag({
  children,
  tone = 'neutral',
  pill = true,
  style = {}
}) {
  const t = TONES[tone] ?? TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      background: t.bg,
      color: t.fg,
      border: `1px solid ${t.bd}`,
      borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-chip)',
      padding: '4px 10px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
/* Inlined Lucide-style stroke icons (the app uses lucide-react). */
const Icon = ({
  d,
  size = 20,
  strokeWidth = 2
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: {
    display: 'block'
  }
}, d);
const NavIcons = {
  feed: /*#__PURE__*/React.createElement(Icon, {
    d: /*#__PURE__*/React.createElement("polyline", {
      points: "22 12 18 12 15 21 9 3 6 12 2 12"
    })
  }),
  // Activity
  find: /*#__PURE__*/React.createElement(Icon, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "10",
      r: "3"
    }))
  }),
  // MapPin
  profile: /*#__PURE__*/React.createElement(Icon, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M20 21a8 8 0 0 0-16 0"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "7",
      r: "4"
    }))
  }) // User
};
const PlusIcon = /*#__PURE__*/React.createElement("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: {
    display: 'block'
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M12 5v14M5 12h14"
}));

/**
 * Bottom navigation — a floating graphite pill with three tabs and a raised
 * gold "+" action lifted above the centre. Active tab is gold. Mobile-first;
 * sits inside a max-width mobile column.
 */
function NavBar({
  active = 'feed',
  onNavigate = () => {},
  onAdd = () => {}
}) {
  const TABS = [{
    id: 'feed',
    label: 'Feed',
    icon: NavIcons.feed
  }, {
    id: 'find',
    label: 'Find',
    icon: NavIcons.find
  }, {
    id: 'profile',
    label: 'Profile',
    icon: NavIcons.profile
  }];
  const tabStyle = isActive => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: isActive ? 'var(--gold)' : 'var(--muted)',
    transition: 'color var(--dur-base)',
    WebkitTapHighlightColor: 'transparent'
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: '64px',
      background: 'rgba(30,27,23,0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-nav)',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: tabStyle(active === 'feed'),
    onClick: () => onNavigate('feed')
  }, TABS[0].icon, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '10px',
      fontWeight: 500,
      letterSpacing: '0.02em'
    }
  }, "Feed")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: tabStyle(active === 'find'),
    onClick: () => onNavigate('find')
  }, TABS[1].icon, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '10px',
      fontWeight: 500,
      letterSpacing: '0.02em'
    }
  }, "Find")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAdd,
    "aria-label": "Log a pint",
    style: {
      width: '48px',
      height: '48px',
      marginTop: '-32px',
      background: 'var(--gold)',
      color: 'var(--stout)',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'transform var(--dur-fast) var(--ease-standard)'
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = 'scale(0.9)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, PlusIcon)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: tabStyle(active === 'profile'),
    onClick: () => onNavigate('profile')
  }, TABS[2].icon, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '10px',
      fontWeight: 500,
      letterSpacing: '0.02em'
    }
  }, "Profile")));
}
Object.assign(__ds_scope, { NavIcons, NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// Nice Pints — sample feed data for the UI kit.
// Real pub names + photos from the codebase. Copy tone follows GUINNESS-LEXICON.
window.NP_PINTS = [{
  id: 'keoghs',
  pub: "Keogh's of Dublin",
  location: 'Dublin 2',
  country: 'Ireland',
  photo: '../../assets/photos/keoghs_dublin.jpeg',
  rating: 9.4,
  drink: 'Guinness',
  slug: 'guinness',
  serving: 'draught',
  note: 'Proper two-part pour, sat a full minute. The dome on it was a beauty — lacing all the way down.',
  user: 'Ant',
  time: '2h',
  founding: true,
  count: 14,
  thisMonth: 4
}, {
  id: 'sandymount',
  pub: 'The Sandymount House',
  location: 'Dublin 4',
  country: 'Ireland',
  photo: '../../assets/photos/sandymounthouse_dublin.jpeg',
  rating: 8.6,
  drink: 'Guinness',
  slug: 'guinness',
  serving: 'draught',
  note: 'Creamy as you like. A serious pint in a quiet snug.',
  user: 'Niamh',
  time: '5h',
  count: 9,
  thisMonth: 3
}, {
  id: 'joymay',
  pub: 'Joy May',
  location: 'Skerries',
  country: 'Ireland',
  photo: '../../assets/photos/joymay_skerries.jpeg',
  rating: 8.1,
  drink: 'Guinness 0.0',
  slug: 'guinness-00',
  serving: 'draught',
  note: 'Honestly close to the real thing. Draught 0.0 done right.',
  user: 'Cormac',
  time: '1d',
  count: 6,
  thisMonth: 2
}, {
  id: 'susies',
  pub: "Susie's",
  location: 'Moville',
  country: 'Ireland',
  photo: '../../assets/photos/susies_moville.jpeg',
  rating: 7.8,
  drink: 'Guinness',
  slug: 'guinness',
  serving: 'draught',
  note: 'Tidy pint, settled grand. Worth the trip up the peninsula.',
  user: 'Saoirse',
  time: '1d',
  count: 5,
  thisMonth: 1
}, {
  id: 'dubliner',
  pub: 'The Dubliner',
  location: 'Boston, MA',
  country: 'USA',
  photo: '../../assets/photos/thedubliner_boston.jpeg',
  rating: 7.2,
  drink: 'Guinness',
  slug: 'guinness',
  serving: 'draught',
  note: 'Good stick for stateside. Cold glass let it down a touch.',
  user: 'Liam',
  time: '2d',
  count: 11,
  thisMonth: 5
}, {
  id: 'emmets',
  pub: "Emmets",
  location: 'Boston, MA',
  country: 'USA',
  photo: '../../assets/photos/emmets_boston.jpeg',
  rating: 6.4,
  drink: 'Murphy\u2019s',
  slug: 'murphys',
  serving: 'draught',
  note: 'A loose head on it, but a fair drop all the same.',
  user: 'Maeve',
  time: '3d',
  count: 4,
  thisMonth: 1
}];
window.NP_FLAG = {
  Ireland: '\u{1F1EE}\u{1F1EA}',
  USA: '\u{1F1FA}\u{1F1F8}',
  UK: '\u{1F1EC}\u{1F1E7}'
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/app/primitives.jsx
try { (() => {
const {
  useState
} = React;
const PINTS = window.NP_PINTS;
const FLAG = window.NP_FLAG;

/* ---------- brand primitives ---------- */
function PintMark({
  size = 26
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 189.2",
    width: size,
    height: size * 1.892,
    style: {
      display: 'block',
      flexShrink: 0
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M64.32 0 L84.32 2.16 L90.81 3.78 L92.97 5.41 L98.38 25.95 L99.46 35.14 L99.46 54.05 L96.22 75.14 L88.11 102.7 L83.24 129.19 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L17.3 140.54 L16.22 129.19 L11.89 105.41 L3.24 75.68 L0 54.59 L0.54 30.27 L2.16 20.54 L6.49 5.95 L9.73 3.78 L16.22 2.16 L37.3 0 Z",
    fill: "#F2E9D8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 37.84 L20 37.84 L27.57 37.84 L28.11 38.38 L41.62 38.38 L42.16 38.92 L58.92 38.92 L59.46 38.38 L70.81 38.38 L71.35 37.84 L78.92 37.84 L79.46 37.3 L99.46 37.3 L99.46 54.05 L97.84 67.03 L95.14 80 L88.11 102.7 L82.7 134.05 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L16.76 134.05 L11.89 105.41 L4.32 80 L1.62 67.57 L0 54.59 Z",
    fill: "#1B1815"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M64.32 0 L84.32 2.16 L90.81 3.78 L92.97 5.41 L98.38 25.95 L99.46 35.14 L99.46 54.05 L96.22 75.14 L88.11 102.7 L83.24 129.19 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L17.3 140.54 L16.22 129.19 L11.89 105.41 L3.24 75.68 L0 54.59 L0.54 30.27 L2.16 20.54 L6.49 5.95 L9.73 3.78 L16.22 2.16 L37.3 0 Z",
    fill: "none",
    stroke: "#F2E9D8",
    strokeWidth: "3.2",
    strokeLinejoin: "round"
  }));
}
function Wordmark({
  size = 'header',
  icon
}) {
  const withIcon = icon ?? size === 'header';
  if (size === 'compact') return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.18em',
      color: 'var(--muted)'
    }
  }, "Nice Pints");
  const fs = size === 'display' ? '30px' : '20px';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, withIcon && /*#__PURE__*/React.createElement(PintMark, {
    size: size === 'display' ? 22 : 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: fs,
      letterSpacing: '-0.02em',
      color: 'var(--cream)',
      lineHeight: 1
    }
  }, "Nice ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold)',
      fontStyle: 'italic'
    }
  }, "Pints")));
}
const ACCENT = {
  guinness: 'var(--drink-guinness)',
  'guinness-00': 'var(--drink-guinness-00)',
  beamish: 'var(--drink-beamish)',
  murphys: 'var(--drink-murphys)'
};
function DrinkChip({
  slug,
  children,
  style
}) {
  const a = ACCENT[slug] || 'var(--drink-other)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      background: 'var(--graphite)',
      border: '1px solid var(--line)',
      borderLeft: `3px solid ${a}`,
      color: a,
      padding: '4px 9px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1,
      ...style
    }
  }, children);
}
function tone(s) {
  return s >= 9 ? 'var(--rating-gold)' : s >= 8 ? 'var(--rating-amber)' : s >= 7 ? 'var(--rating-copper)' : 'var(--rating-stone)';
}
function RatingPill({
  score,
  size = 'md'
}) {
  const S = {
    sm: ['3px 8px', '10px'],
    md: ['5px 10px', '12px'],
    lg: ['7px 14px', '22px']
  }[size];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
      color: tone(score),
      background: 'rgba(0,0,0,0.55)',
      border: '1px solid rgba(243,239,230,0.10)',
      backdropFilter: 'blur(4px)',
      borderRadius: '9999px',
      padding: S[0],
      fontSize: S[1]
    }
  }, score.toFixed(1), "/10");
}
function verdict(s) {
  return s >= 9 ? 'Exceptional' : s >= 8.5 ? 'Excellent' : s >= 7.5 ? 'Very Good' : s >= 6.5 ? 'Good' : null;
}
function EditorialScore({
  score,
  size = 'feed'
}) {
  const f = score.toFixed(1);
  const d = f.indexOf('.');
  const v = verdict(score);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: '-0.03em',
      color: 'var(--np-cream)',
      textShadow: 'var(--shadow-score)',
      fontSize: size === 'hero' ? '3.5rem' : '3rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, f.slice(0, d), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.34em',
      verticalAlign: '0.2em',
      marginLeft: '-0.03em'
    }
  }, f.slice(d)))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: '1px',
      background: 'var(--np-gold)',
      marginTop: '6px',
      marginLeft: 'auto',
      width: size === 'hero' ? '88%' : '86%'
    }
  })), v && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: '13px',
      fontWeight: 500,
      color: 'var(--np-cream)',
      marginTop: '14px',
      textShadow: 'var(--shadow-score)'
    }
  }, v));
}
function Avatar({
  name,
  size = 24
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '9999px',
      background: 'var(--elevated)',
      border: '1px solid var(--line)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: size * 0.38,
      fontWeight: 700,
      color: 'var(--cream)'
    }
  }, name.slice(0, 2).toUpperCase()));
}
function Author({
  name,
  founding
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '11px',
      color: 'var(--muted)',
      fontWeight: 500,
      whiteSpace: 'nowrap'
    }
  }, "logged by ", name, founding && /*#__PURE__*/React.createElement("span", {
    title: "Founding Taster",
    style: {
      color: 'var(--gold)',
      fontSize: '10px'
    }
  }, '\u2737'));
}

/* ---------- icons ---------- */
const I = {
  search: /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })),
  pin: /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  nav: /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "3 11 22 2 13 21 11 13 3 11"
  })),
  back: /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m15 18-6-6 6-6"
  })),
  feed: /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "22 12 18 12 15 21 9 3 6 12 2 12"
  })),
  find: /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  user: /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 21a8 8 0 0 0-16 0"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "4"
  })),
  plus: /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  })),
  flag: /*#__PURE__*/React.createElement("svg", {
    width: "3",
    height: "3"
  })
};
const Scrim = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "np-photo-scrim-base",
  style: {
    position: 'absolute',
    inset: 0
  }
}), /*#__PURE__*/React.createElement("div", {
  className: "np-photo-scrim-gradient",
  style: {
    position: 'absolute',
    inset: 0
  }
}));
window.NP = {
  PintMark,
  Wordmark,
  DrinkChip,
  RatingPill,
  EditorialScore,
  Avatar,
  Author,
  tone,
  I,
  Scrim,
  PINTS,
  FLAG
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/screens.jsx
try { (() => {
const {
  useState
} = window.React ? window : window;
const {
  Wordmark,
  DrinkChip,
  RatingPill,
  EditorialScore,
  Avatar,
  Author,
  I,
  Scrim,
  PINTS,
  FLAG
} = window.NP;

/* ================= FEED ================= */
function Feed({
  go
}) {
  const hero = [...PINTS].sort((a, b) => b.rating - a.rating)[0];
  const rest = PINTS.filter(p => p.id !== hero.id);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: '120px'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      padding: '20px 20px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: "header"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('profile'),
    style: btnReset
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Ant",
    size: 28
  }))), /*#__PURE__*/React.createElement("section", {
    className: "np-noise",
    onClick: () => go('pint', hero),
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '4/5',
      overflow: 'hidden',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: hero.photo,
    alt: hero.pub,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement(Scrim, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(EditorialScore, {
    score: hero.rating,
    size: "hero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '0 24px 30px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '13px'
    }
  }, FLAG[hero.country]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: 'var(--muted)',
      fontWeight: 500,
      letterSpacing: '0.02em'
    }
  }, hero.location)), /*#__PURE__*/React.createElement(DrinkChip, {
    slug: hero.slug,
    style: {
      marginBottom: '12px'
    }
  }, hero.drink, hero.serving === 'draught' ? ' \u00B7 Draught' : ''), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '34px',
      fontWeight: 900,
      lineHeight: 1.1,
      color: 'var(--cream)',
      margin: '0 0 12px',
      textShadow: 'var(--shadow-score)'
    }
  }, hero.pub), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(243,239,230,0.82)',
      fontSize: '16px',
      lineHeight: 1.4,
      margin: '0 0 16px',
      maxWidth: '90%'
    }
  }, "\"", hero.note, "\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: hero.user,
    size: 24
  }), /*#__PURE__*/React.createElement(Author, {
    name: hero.user,
    founding: hero.founding
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px 20px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '0.12em',
      color: 'var(--muted)'
    }
  }, "Latest"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: '1px',
      background: 'var(--line)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      color: 'var(--muted)',
      fontWeight: 500
    }
  }, rest.length, " pints")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: '12px',
      rowGap: '32px'
    }
  }, rest.map((p, i) => /*#__PURE__*/React.createElement("article", {
    key: p.id,
    onClick: () => go('pint', p),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "np-noise",
    style: {
      position: 'relative',
      aspectRatio: '4/5',
      borderRadius: '16px',
      overflow: 'hidden',
      background: 'var(--graphite)',
      border: '1px solid var(--line)',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.photo,
    alt: p.pub,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement(Scrim, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '14px',
      right: '14px',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(EditorialScore, {
    score: p.rating,
    size: "feed"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '14px',
      bottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '13px'
    }
  }, FLAG[p.country]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      color: 'rgba(243,239,230,0.7)',
      fontWeight: 500
    }
  }, p.location))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '8px',
      marginBottom: '6px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '17px',
      fontWeight: 700,
      lineHeight: 1.15,
      color: 'var(--cream)',
      margin: 0
    }
  }, p.pub), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      color: 'var(--muted)',
      fontWeight: 500,
      marginTop: '3px',
      flexShrink: 0
    }
  }, p.time)), /*#__PURE__*/React.createElement(DrinkChip, {
    slug: p.slug,
    style: {
      marginBottom: '8px'
    }
  }, p.drink), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--muted)',
      fontSize: '13px',
      lineHeight: 1.4,
      margin: '0 0 8px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, "\"", p.note, "\""), /*#__PURE__*/React.createElement(Author, {
    name: p.user,
    founding: p.founding
  })))));
}

/* ================= FIND A PINT ================= */
function Find({
  go
}) {
  const [preset, setPreset] = useState('00');
  const [recency, setRecency] = useState('30');
  const [min8, setMin8] = useState(true);
  const [q, setQ] = useState('');
  const PRESETS = [{
    id: '00',
    label: 'Guinness 0.0 on Draught',
    hl: true
  }, {
    id: 'g',
    label: 'Guinness'
  }, {
    id: 'all',
    label: 'All pints'
  }];
  let res = PINTS.filter(p => preset === 'all' ? true : preset === '00' ? p.slug === 'guinness-00' : p.slug === 'guinness');
  if (min8) res = res.filter(p => p.rating >= 8 || preset === '00');
  if (q) res = res.filter(p => (p.pub + p.location).toLowerCase().includes(q.toLowerCase()));
  res = [...res].sort((a, b) => b.rating - a.rating);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: '120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 16px'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: "compact"
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '26px',
      fontWeight: 900,
      letterSpacing: '-0.02em',
      color: 'var(--cream)',
      margin: '4px 0 0'
    }
  }, "Find a Pint"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      color: 'rgba(243,239,230,0.5)',
      margin: '6px 0 0',
      lineHeight: 1.4
    }
  }, "Choose a drink and we'll show you the best-rated places nearby.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px 16px',
      display: 'flex',
      gap: '8px',
      overflowX: 'auto'
    }
  }, PRESETS.map(it => {
    const on = preset === it.id;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => setPreset(it.id),
      style: {
        ...chip,
        whiteSpace: 'nowrap',
        color: on ? 'var(--gold)' : 'var(--muted)',
        borderColor: on ? 'var(--gold)' : 'var(--line)',
        background: on ? 'var(--gold-soft)' : 'var(--graphite)'
      }
    }, it.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--muted)',
      display: 'flex'
    }
  }, I.search), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search pub or town",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      background: 'var(--graphite)',
      border: '1px solid var(--line)',
      borderRadius: '16px',
      padding: '14px 16px 14px 42px',
      color: 'var(--cream)',
      fontSize: '16px',
      fontFamily: 'var(--font-sans)',
      outline: 'none'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px 16px',
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      background: 'var(--graphite)',
      padding: '4px',
      borderRadius: '16px',
      border: '1px solid var(--line)'
    }
  }, [['7', 'This week'], ['30', '30 days'], ['90', '90 days']].map(([d, l]) => {
    const on = recency === d;
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: () => setRecency(d),
      style: {
        flex: 1,
        padding: '8px 0',
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        background: on ? 'var(--gold-soft)' : 'transparent',
        color: on ? 'var(--gold)' : 'var(--muted)'
      }
    }, l);
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMin8(v => !v),
    style: {
      ...chip,
      background: min8 ? 'var(--gold-soft)' : 'var(--graphite)',
      color: min8 ? 'var(--gold)' : 'var(--muted)',
      borderColor: min8 ? 'var(--gold)' : 'var(--line)'
    }
  }, "8+")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex'
    }
  }, I.nav), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px'
    }
  }, "Sorted by rating"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(243,239,230,0.2)'
    }
  }, '\u00B7'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px'
    }
  }, res.length, " pub", res.length === 1 ? '' : 's', " with matching pints")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }
  }, res.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    onClick: () => go('pint', p),
    style: {
      background: 'var(--graphite)',
      borderRadius: '16px',
      border: '1px solid var(--line)',
      overflow: 'hidden',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '144px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.photo,
    alt: p.pub,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement(Scrim, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(DrinkChip, {
    slug: p.slug
  }, p.drink), p.serving === 'draught' && /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(19,17,15,0.8)',
      color: 'var(--cream)',
      padding: '4px 9px',
      borderRadius: '9999px',
      fontSize: '10px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      border: '1px solid var(--line)'
    }
  }, "Draught")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: '12px',
      right: '12px'
    }
  }, /*#__PURE__*/React.createElement(RatingPill, {
    score: p.rating,
    size: "md"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '17px',
      fontWeight: 700,
      color: 'var(--cream)',
      margin: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, p.pub), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '10px',
      color: 'var(--muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
      margin: '4px 0 0',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  }, I.pin, p.location), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '10px',
      color: 'var(--muted)',
      margin: '5px 0 0'
    }
  }, p.count, " pints logged ", '\u00B7', " ", p.thisMonth, " this month")))))));
}

/* ================= PINT DETAIL ================= */
function PintDetail({
  pint,
  go
}) {
  const p = pint || PINTS[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: '40px',
      color: 'var(--cream)'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '4/5'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.photo,
    alt: p.pub,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement(Scrim, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      right: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go('feed'),
    style: {
      ...iconBtn
    }
  }, I.back), /*#__PURE__*/React.createElement(RatingPill, {
    score: p.rating,
    size: "lg"
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      padding: '28px 20px'
    }
  }, /*#__PURE__*/React.createElement(DrinkChip, {
    slug: p.slug,
    style: {
      marginBottom: '16px'
    }
  }, p.drink, p.serving === 'draught' ? ' \u00B7 Draught' : ''), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '34px',
      fontWeight: 900,
      lineHeight: 1.1,
      margin: '0 0 8px'
    }
  }, p.pub), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      color: 'var(--muted)',
      margin: '0 0 28px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", null, FLAG[p.country]), I.pin, /*#__PURE__*/React.createElement("span", null, p.location)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '21px',
      lineHeight: 1.5,
      color: 'rgba(243,239,230,0.9)',
      margin: '0 0 32px'
    }
  }, "\"", p.note, "\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '24px',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'var(--muted)',
      margin: '0 0 4px'
    }
  }, "Logged by"), /*#__PURE__*/React.createElement(Author, {
    name: p.user,
    founding: p.founding
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'var(--muted)',
      margin: '0 0 4px'
    }
  }, "When"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      fontWeight: 600,
      margin: 0
    }
  }, p.time, " ago"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('find'),
    style: {
      marginTop: '28px',
      width: '100%',
      background: 'var(--graphite)',
      border: '1px solid var(--line)',
      padding: '16px',
      borderRadius: '16px',
      fontWeight: 600,
      fontSize: '14px',
      color: 'rgba(243,239,230,0.8)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, "See all pints at ", p.pub, " ", '\u2192')));
}

/* shared inline style objects */
const btnReset = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer'
};
const chip = {
  flexShrink: 0,
  padding: '10px 16px',
  borderRadius: '9999px',
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  border: '1px solid var(--line)',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)'
};
const iconBtn = {
  padding: '10px',
  background: 'rgba(19,17,15,0.7)',
  backdropFilter: 'blur(8px)',
  borderRadius: '9999px',
  color: 'var(--cream)',
  border: '1px solid var(--line)',
  cursor: 'pointer',
  display: 'flex'
};
window.NP_SCREENS = {
  Feed,
  Find,
  PintDetail
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.PintMark = __ds_scope.PintMark;

__ds_ns.BrandWordmark = __ds_scope.BrandWordmark;

__ds_ns.DrinkChip = __ds_scope.DrinkChip;

__ds_ns.EditorialRatingBlock = __ds_scope.EditorialRatingBlock;

__ds_ns.RatingScore = __ds_scope.RatingScore;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.NavIcons = __ds_scope.NavIcons;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
