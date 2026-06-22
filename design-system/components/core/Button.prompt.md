Pill action button — gold `primary` is reserved for the single primary action per screen; use `secondary` (graphite + line border) and `ghost` for everything else.

```jsx
<Button variant="primary" size="lg" fullWidth>Post Pint</Button>
<Button variant="secondary">Find a Pint</Button>
<Button variant="ghost" size="sm">Cancel</Button>
```

Props: `variant` (primary · secondary · ghost · danger), `size` (sm · md · lg), `fullWidth`, `disabled`, `icon` (leading node). Press feedback is a built-in scale(0.96). Never use two gold buttons on one screen.
