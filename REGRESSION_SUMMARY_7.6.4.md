# Regression Summary — Animus Companion 7.6.4

## Repair verified statically
- The detail body now has the `detail-content` class expected by the stylesheet.
- The sheet is a constrained flex column with a scrollable `min-height: 0` content region.
- Vertical scrolling uses `overflow-y: auto`, `touch-action: pan-y`, iOS momentum scrolling, and overscroll containment.
- Sheet resize swipe detection is attached only to the 44-pixel handle, not the entire sheet.
- The backdrop remains below the sheet in the z-index stack and cannot cover its content.
- Opening a location resets its detail scroll position to the top.

## Automated checks completed
- JavaScript syntax validation passed.
- JSON and web-manifest parsing passed.
- Release version/build identity consistency passed.
- Integrity hashes passed.
- Root-level packaging passed with no nested ZIP files.
- Database record count remains 104.
- Database version remains 9 and user-data schema remains 3.
- No inline HTML event handlers or inline style attributes were introduced.

## Preserved systems
Map rendering, Extended World Canvas, playable boundary, markers, clusters, filters, constrained POI dropdown, routes, Navigation First, Jackdaw, Progress, Log, Settings, diagnostics, backup compatibility, and offline asset coverage were not structurally redesigned.

## Pending device verification
Physical iPhone Safari and standalone-PWA tests are still required for momentum scrolling, handle gestures, browser toolbar states, VoiceOver, Dynamic Type, and true offline relaunch.
