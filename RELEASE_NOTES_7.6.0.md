# Animus Companion 7.6.1 — Release Notes

## Extended World Canvas and Playable Boundary

- Preserved the original 1944×1665 calibrated Caribbean map as an unchanged inner playable area.
- Added a local, offline 2664×2265 surrounding world canvas with margins on all four sides.
- Added an antique-gold playable-area boundary and subdued non-playable surrounding region.
- Changed camera limits so users may pan across the playable boundary while retaining reasonable outer limits.
- Added safe objective focus that accounts for the header, bottom dock, right-side controls, and current viewport geometry.
- Reset Map continues to center the playable game area rather than the decorative extension.
- Preserved database version 9, all 104 location records, storage key `acbf-companion-m3`, and user-data schema version 3.
- Existing schema-version-3 backups remain importable. Legacy saved map views reset safely to the playable-area overview once; all progress and other state remain intact.
- Added the extended canvas asset to the offline service-worker cache and regenerated integrity metadata.

## Known limitations

The surrounding area uses a conservative locally generated nautical extension derived from the approved map artwork. It provides geographic breathing room without claiming new game locations or exact real-world cartographic detail. Physical iPhone Safari, installed-PWA, VoiceOver, and offline-device tests remain pending.
