# Animus Companion 7.6.1 — Regression Summary

## Passed automated checks

- JavaScript syntax validation for all runtime scripts.
- JSON parsing for release, manifest, and application metadata.
- Database record count remains 104; database version remains 9.
- User-data schema remains version 3 and storage key remains unchanged.
- Existing calibrated map asset dimensions and aspect ratio remain unchanged.
- Extended canvas has deterministic margins on all four sides.
- Marker and route layers remain inside the playable coordinate container.
- Safe-focus API is used by marker, cluster, search, route, and objective focus paths.
- Persistent five-item Navigation First dock remains present.
- Service worker includes both original and extended map assets.
- No nested ZIP files; production files are packaged at ZIP root.
- Integrity hashes and release checksum regenerated.

## Pending device validation

Physical iPhone Safari, standalone PWA, browser-toolbar transitions, rotation, pinch/pan gesture quality, VoiceOver, reduced-motion camera behavior, and true offline relaunch could not be physically validated in this environment.
