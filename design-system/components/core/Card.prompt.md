Graphite surface card — 1px `--line` border + soft shadow so it lifts off the warm-black page. The default container for content blocks.

```jsx
<Card interactive onClick={openPint}>
  <h3>The Sandymount House</h3>
  <p>12 pints logged · 4 this month</p>
</Card>
```

Props: `as` (tag), `interactive` (press-scale + pointer), `noise` (grain overlay), `padding`, `radius`. For photo feed cards, set `padding="0"`, `noise`, and place the image + `.np-photo-scrim-*` layers inside.
