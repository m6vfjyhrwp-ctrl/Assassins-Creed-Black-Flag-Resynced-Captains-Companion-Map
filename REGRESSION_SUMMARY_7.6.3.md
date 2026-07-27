# Regression Summary — Animus Companion 7.6.3

## Passed static and repository checks

- JavaScript syntax validation.
- JSON and web-manifest parsing.
- Release/version/cache identity consistency.
- Exactly one POI summary button and dropdown in the document.
- Dropdown defaults hidden with `aria-expanded="false"`.
- Dropdown width is constrained to `100%` of its summary control rather than the viewport.
- Mobile full-width and fixed-position dropdown rules are removed.
- Viewport-aware maximum height and internal scrolling are present.
- Edit Filters reuses the existing filter drawer.
- Clear Filters reuses existing application state and does not alter saved progress records.
- No static inline event handlers or style attributes were added.
- Service-worker references and cache identity updated to 7.6.3.
- Integrity hashes and root-level packaging verified.
- No nested ZIP files.

## Preserved by code inspection

- Database version 9 and 104 records.
- User-data schema version 3 and storage key.
- Extended World Canvas and playable-area geometry.
- Marker, cluster, route, Navigation First, backup, and offline systems.

## Pending physical-device validation

- iPhone Safari portrait and landscape at all requested widths.
- Installed standalone PWA behavior.
- VoiceOver and enlarged Dynamic Type.
- Safari browser toolbar expanded/collapsed transitions.
- True offline relaunch after device-level caching.
