Floating bottom navigation — a graphite blurred pill with three tabs (Feed · Find · Profile) and a raised gold "+" lifted above the centre to log a pint. Active tab is gold. Designed to be fixed at the bottom of a max-width mobile column.

```jsx
<NavBar active="feed" onNavigate={setTab} onAdd={openAddPint} />
```

Three tabs is deliberate (Rams restraint) — Feed, Find, Profile, plus the central add action. Don't add a fourth tab.
