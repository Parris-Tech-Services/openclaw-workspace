# Multi-Layer Zoom Game

A small playable React + Parcel prototype with three zoom levels:

1. **World layer** — pan/zoom a stylised world map and choose a region.
2. **Region layer** — inspect location nodes inside that region.
3. **Detail layer** — enter a close-up scene, collect an item, and record a clue.

## Run locally

```bash
npm install
npm start
```

Or double-click `Run Multi-Layer Zoom Game.command` on macOS.

## Build

```bash
npm run build
```

## Gameplay loop

- Start on the World Map.
- Click Verdant Wood, Frostspine Peaks, or Sunscar Expanse.
- Click a location inside the region.
- Use the scene action button to collect an item/clue.
- Navigate back using breadcrumbs or zoom-out buttons.
- Inventory and recent log update as you explore.

## Main files

- `src/App.js` — the complete prototype logic and React components.
- `src/App.css` — visual styling, map nodes, panels, responsive layout, and scene effects.
- `index.html` — Parcel entry point.
