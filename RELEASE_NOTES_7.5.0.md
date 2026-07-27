# Animus Companion 7.5.0 — Navigation First

## Scope
This production milestone implements only the approved Navigation First behavior on the authoritative 7.5 test baseline. It does not rebuild the application, alter the location database, move map markers, change the user-data schema, or replace established gameplay systems.

## Implemented
- Persistent five-destination navigation remains visible over the immersive map, including full-screen map mode.
- Header, map actions, status controls, drawers, detail sheets, menus, and toasts use the shared safe-interaction layout and remain layered around the navigation dock.
- iPhone visual-viewport changes, rotation, browser chrome, and Display Zoom continue to synchronize the safe layout.
- Navigation and map state remain compatible with the existing `acbf-companion-m3` storage key and user-data schema version 3.
- The runtime viewport-variable update was converted from inline style attributes to CSP-safe stylesheet rules, resolving the baseline regression failure.

## Preserved
Database version 9 and all 104 location records; location IDs and calibrated coordinates; completion, notes, favorites, routes, filters, Jackdaw and fleet data; backup/import compatibility; map gestures, clustering, route rendering, onboarding, diagnostics, integrity verification, and offline PWA behavior.
