# Animus Companion 7.6.4 — Location Detail Sheet Scroll and Touch Repair

## Summary
Restores vertical scrolling and reliable touch interaction inside the location description sheet while preserving the map, constrained POI dropdown, Navigation First layout, database, routes, and saved user data.

## Files changed
- `index.html`: applies the existing scroll-content class and accessibility semantics to the location detail body; updates release references.
- `styles.css`: converts the sheet to a bounded flex layout, enables iOS momentum scrolling, vertical pan gestures, overscroll containment, and a 44-pixel drag-handle target.
- `app.js`: limits resize/swipe gestures to the sheet handle so normal swipes inside the description scroll the content; resets scroll position when a location opens.
- Release, service-worker, manifest, provenance, integrity, and checksum files updated for 7.6.4.

## Compatibility
- Database version remains 9.
- User-data schema remains 3.
- Storage key remains `acbf-companion-m3`.
- No migration was introduced.
- Existing backups, completion data, favorites, notes, routes, Jackdaw data, and calibration remain unchanged.

## Known limitation
Physical iPhone Safari, installed-PWA, VoiceOver, Dynamic Type, and true offline-device verification remain pending and should be confirmed in the test repository before production promotion.
