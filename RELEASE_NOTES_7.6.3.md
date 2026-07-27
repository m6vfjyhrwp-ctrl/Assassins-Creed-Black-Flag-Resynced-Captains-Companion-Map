# Animus Companion 7.6.3 — Constrained POI Dropdown Repair

## Changed

- Kept the map-context dropdown exactly the same width as the Caribbean summary bubble.
- Removed the mobile full-width/fixed-position dropdown behavior.
- Anchored the dropdown directly below the bubble so it opens over the map without shifting layout.
- Limited the panel to a compact viewport-aware height with internal scrolling.
- Simplified the action row to **Edit Filters** and **Clear Filters**, reusing existing filter logic.
- Added an updated accessible label reporting category count, additional filter count, and expanded/collapsed state.
- Clearing filters now also clears the active search, closes the dropdown, and restores focus safely.
- Updated release identity, cache identity, manifest metadata, integrity records, and checksums.

## Preserved

The 104-location database, map calibration, Extended World Canvas, playable boundary, marker and clustering systems, routes, progress, favorites, notes, Navigation First dock, backup schema, and offline PWA behavior remain unchanged.

## Files changed

`index.html`, `styles.css`, `app.js`, `service-worker.js`, `manifest.webmanifest`, `VERSION.json`, `release-identity.js`, `release-identity.json`, release documentation, integrity manifest, and checksum files.

## Known limitation

Physical iPhone Safari, installed-PWA, VoiceOver, Dynamic Type, browser-toolbar transition, and true offline-device testing remain pending.
