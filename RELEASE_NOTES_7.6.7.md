# Animus Companion v7.6.7 — Marker Sheet and Route Overlay Repair

## Corrected

- Fixed the remaining gray, non-interactive marker detail window by placing the dimming backdrop below the detail sheet in the final CSS cascade.
- Preserved backdrop tap-to-close while allowing all detail controls and vertical scrolling to receive touch input.
- Hides the inline route summary while a marker detail sheet is open, preventing route controls from being covered by or competing with the marker window.
- Restores the route summary automatically after the marker sheet closes.

## Preserved

- Route data and route markers
- 104-location database
- Saved progress, notes, backups, calibration, filters, and storage compatibility
- Offline PWA behavior
