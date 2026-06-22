Text / search input — graphite fill, 1px line border, gold focus ring. Always 16px text to stop iOS zoom-on-focus.

```jsx
<Input placeholder="Search pub or town" icon={<Search size={16} />} type="search" />
```

Props: `icon` (leading node), `fullWidth`, plus all native `<input>` attributes.
