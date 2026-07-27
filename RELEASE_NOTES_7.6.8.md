# Animus Companion v7.6.8 — Route Planner Completion

## Phase 1 implementation

- Rebuilt each route stop as a compact, readable card with route number, drag handle, location name, coordinates, open action, and remove action.
- Added iPhone-compatible pointer dragging in addition to desktop HTML drag-and-drop.
- Route order, numbered map markers, distance, sailing estimate, and next route state update after reordering.
- Added a working Optimize action using the existing nearest-route and 2-opt route logic.
- Reverse and Clear Route remain functional and now provide confirmation messages.
- Added a Hide Route Planner control without deleting the route.
- Preserved marker-detail overlay isolation so the route planner does not cover an open marker sheet.

## Compatibility

Database version 9, user-data schema version 3, storage key `acbf-companion-m3`, map calibration, saved progress, routes, notes, filters, backups, and offline behavior remain compatible.
