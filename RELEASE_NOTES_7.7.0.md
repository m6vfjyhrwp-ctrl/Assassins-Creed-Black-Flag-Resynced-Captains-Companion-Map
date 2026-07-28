# Animus Companion v7.7.0 — Phase 2 Polish, Sprint 1

This release begins Phase 2 without adding new gameplay systems.

## Improvements

- Added consistent touch-down feedback across buttons, tabs, cards, filters, and controls.
- Refined marker-selection animation while preserving clustering, spiderfying, routes, and calibrated positions.
- Standardized motion timing and easing for sheets, drawers, overlays, lists, and toasts.
- Added restrained vibration feedback where the browser and device support it; unsupported devices remain unaffected.
- Batched marker insertion through a document fragment to reduce layout work during map refreshes.
- Improved scrolling behavior, typography rhythm, text wrapping, and iPhone input sizing.
- Strengthened reduced-motion handling through both system preference and the existing in-app setting.
- Preserved explicit user control: no routes, objectives, filters, or progress are created automatically.

## Compatibility

Database version 9, user-data schema 3, storage key `acbf-companion-m3`, marker IDs, route data, backups, map calibration, Jackdaw progress, fleet data, notes, screenshots, and logs remain compatible.
