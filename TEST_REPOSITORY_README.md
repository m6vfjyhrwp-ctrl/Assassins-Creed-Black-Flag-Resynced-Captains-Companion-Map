# Animus Companion 7.6.1 Test Repository

This package is an isolated test build for the immersive full-screen iPhone map architecture. Upload every file in this ZIP to the root of a new GitHub repository and enable GitHub Pages from the main branch root.

## Test priorities

- Map extends behind the iPhone status area and all floating controls.
- Header, map toolbar, controls, tab bar, and detail sheet remain within safe areas.
- Map preserves its source aspect ratio and fills the viewport without stretching.
- One-finger pan works horizontally and vertically.
- Pinch zoom, double-tap zoom, route display, markers, filters, details, and saved data remain functional.
- Jackdaw upgrade limits from 7.4.1 remain preserved.

Do not replace the production repository until this test build has been accepted on physical iPhone Safari and as an installed PWA.

## Test 2 pan correction

The map now includes guaranteed up/down travel at the overview zoom so markers hidden beneath the floating header, controls, or bottom navigation can be moved into reach.
