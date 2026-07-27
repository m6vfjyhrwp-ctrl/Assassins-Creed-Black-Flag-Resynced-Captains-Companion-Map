# Animus Companion 7.6.2 — Expandable POI Summary Dropdown

## Changes
- Converted the compact map context bar into an accessible expandable dropdown.
- Added full lists of applied POI categories and active filters.
- Added Show All, Clear Filters, and Open Filters actions using the existing filter state and drawer.
- Added outside-tap, marker-selection, tab-change, drawer-opening, and Escape-key dismissal.
- Added internal scrolling and safe-area-aware mobile placement.

## Compatibility
Database version 9, all existing location IDs, user-data schema version 3, storage key, map calibration, routes, progress, notes, favorites, Jackdaw, fleet, log, backups, and extended-world behavior are unchanged.

## Offline
The service-worker cache identity is now `acbf-v7.6.2-poi-summary-dropdown`. No remote dependencies were added.
