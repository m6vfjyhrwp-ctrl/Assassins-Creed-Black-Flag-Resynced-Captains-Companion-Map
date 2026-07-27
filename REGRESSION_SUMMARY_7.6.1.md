# Regression Summary — Animus Companion 7.6.1

## Root cause confirmed
The 7.6.0 stage contained only absolutely positioned children. Its runtime width and height were applied in one CSP-safe stylesheet rule, then unintentionally removed when a later transform-only rule replaced that same selector. The stage collapsed to zero dimensions, so neither map artwork nor markers rendered.

## Repairs validated
- Runtime stage rule now always includes width, height, transform, and marker scale together.
- Playable-map source aspect reports 1944/1665; outer canvas aspect is reported separately.
- Caribbean and extended-world image assets are present and decode with expected dimensions.
- Database count remains 104.
- Schema remains version 3.
- Service worker includes both map assets and uses a new cache identity.
- JavaScript syntax and JSON parsing pass.
- Integrity hashes and build checksums regenerated.

## Pending physical-device validation
Physical iPhone Safari, standalone PWA, browser-toolbar transitions, gestures, VoiceOver, and true offline relaunch remain pending after deployment.
