# Animus Companion v7.6.6 — Responsive Overlay and Map Action Repair

## Changes

- Repositioned the active route summary as a centered, polished overlay above the navigation dock instead of an uneven panel in the middle of the map.
- Added responsive vertical placement so the route summary moves above an open location detail sheet.
- Centered toast/status messages within the visible app screen and prevented left-edge clipping.
- Repaired the POI summary actions: **Edit Filters** now opens the filter drawer and **Clear Filters** resets category, region, search, and advanced filters.
- Removed the full-screen map button, full-screen menu entry, exit-full-screen control, and tap-map-to-enter-full-screen behavior.
- Updated the service-worker cache identity so iPhone Safari and installed PWA sessions receive the corrected interface files.

## Compatibility

Database version 9, user-data schema version 3, storage key `acbf-companion-m3`, map calibration, saved progress, notes, routes, backups, and screenshots remain compatible.
