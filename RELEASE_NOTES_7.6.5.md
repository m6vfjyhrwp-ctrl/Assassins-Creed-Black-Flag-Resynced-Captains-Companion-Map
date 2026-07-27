# Animus Companion 7.6.5 — Location Detail Sheet Layering and Interaction Repair

## Summary
This focused production repair corrects the actual cause of the frozen, dimmed location detail window on iPhone. The sheet backdrop had a higher stacking level than the detail sheet, so the translucent backdrop covered the sheet and intercepted vertical touch input.

## Files changed
- `styles.css` — places the sheet backdrop below the detail sheet, restores pointer ownership to the sheet and its scrollable content, and preserves internal vertical scrolling.
- `app.js` — synchronizes `aria-hidden` with the visual open/closed state.
- `index.html`, release identity, manifest, service worker, provenance, integrity and checksum files — updated for 7.6.5.

## Compatibility
- Database remains version 9 with 104 records.
- User-data schema remains version 3.
- Storage key, routes, notes, favorites, completion data, calibration and backups are unchanged.
- Existing schema-version-3 backups remain compatible.

## Device validation still required
Physical iPhone Safari and installed-PWA testing must confirm that the location sheet is no longer gray or blocked and that long content scrolls vertically.
