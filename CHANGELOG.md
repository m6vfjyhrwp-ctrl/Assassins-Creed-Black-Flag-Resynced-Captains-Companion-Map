# v7.6.9 — Phase 1 Route Planner Finalization

- Enlarged route planner to show three route stops before scrolling on standard iPhone portrait viewports.

## 7.6.4 — Location Detail Sheet Scroll and Touch Repair

- Restored scrollable location descriptions on touch devices.
- Isolated sheet resize gestures to the drag handle.
- Added iOS momentum scrolling and overscroll containment.
- Preserved database, calibration, Navigation First, POI dropdown, routes, and saved-data compatibility.

# Changelog

## 7.6.3 — Constrained POI Dropdown Repair

- Constrained the POI dropdown to the Caribbean bubble width.
- Anchored it directly beneath the bubble with compact internal scrolling.
- Simplified actions to Edit Filters and Clear Filters.
- Updated accessibility and production cache identity.

## 7.6.2 — Expandable POI Summary Dropdown
- Added expandable map-context summary for active POI categories and filters.
- Added quick actions and accessible dismissal behavior.
- Preserved map calibration, data schema, and Navigation First layout.

# Animus Companion Changelog

## 7.6.1 — Extended World Canvas and Playable Boundary (Production)

- Promoted the approved persistent, safe-area-aware navigation layout to production.
- Preserved the complete map, database, user-data schema, routes, progress, and offline systems.
- Resolved the inline-style CSP regression by moving runtime viewport variables into the trusted stylesheet.
- Added required repository verification files and regenerated release integrity metadata.

## 7.6.1 — Universal Safe Interaction Layout
- Unified top, side, and bottom safe interaction zones.
- Reduced header and dock footprint while preserving 44-point touch targets.
- Repositioned floating controls and sheets to avoid the dock and screen edges.
- Added Developer Layout Overlay and explicit Feedback Capture export.
- Added visual-viewport synchronization for iPhone rotation and Display Zoom.

## 7.6.1 — Persistent Full-Screen Navigation Test

- Keeps the floating bottom navigation dock visible in full-screen map mode.
- Preserves iPhone safe-area spacing above the Home indicator.
- Replaces the large map card treatment with a compact map-information pill and separate floating actions.
- Raises drawers, sheets, menus, and toasts above the persistent navigation.
- Preserves the test.2 two-axis panning and camera behavior.

# Changelog

## 7.6.3 — Constrained POI Dropdown Repair

- Constrained the POI dropdown to the Caribbean bubble width.
- Anchored it directly beneath the bubble with compact internal scrolling.
- Simplified actions to Edit Filters and Clear Filters.
- Updated accessibility and production cache identity.

## 7.6.1 — Two-Axis Pan Reachability Hotfix

- Added guaranteed vertical map travel at minimum zoom.
- Introduced modest vertical overscan so locations can be moved above or below floating controls without exposing empty space.
- Preserved full-screen safe-area layout, horizontal panning, pinch zoom, markers, routes, saves, and existing test architecture.


## 7.6.1 — Immersive Full-Screen Map Test

- Converted the map screen to a true full-viewport layer.
- Extended map rendering behind the iPhone status and Home-indicator areas.
- Floated the header, toolbar, map controls, status pill, tab bar, and detail sheet over the map.
- Preserved source aspect ratio using cover-style camera framing rather than image distortion.
- Retained bounded horizontal and vertical panning, anchored pinch zoom, routes, markers, filters, and local saves.
- Marked this package as an isolated test release for a separate GitHub Pages repository.

## 7.4.1 — Jackdaw Accuracy and Full-Map Navigation

- Corrected Jackdaw upgrade limits for broadside cannons, heavy shot, chain shot/bow chaser, mortars, swivels, fire barrels, ram, crew quarters, harpoon strength, and diving bell.
- Renamed Cargo Capacity to Crew Quarters while migrating existing saved cargo values automatically.
- Added Rowboat Armor and Harpoon Storage tracking, both with three upgrade tiers.
- Changed Diving Bell control to Unequipped/Equipped.
- Changed the default map camera to fit the complete Caribbean source map without stretching.
- Enabled bounded panning on both horizontal and vertical axes, including a small navigation margin at overview scale.
- Preserved the existing storage key, database location IDs, routes, progress, notes, and backups.

# Animus Companion Changelog

## 7.4.0 — Apple Maps Experience

- Rebuilt the mobile map as an immersive, map-first surface that extends beneath the floating header and above the bottom navigation.
- Replaced letterboxed fit framing with aspect-correct cover framing so the Caribbean fills the available screen without stretching.
- Centered reset framing and retained bounded panning, anchored pinch zoom, and coordinate alignment.
- Converted the map toolbar into a translucent floating control surface and reduced surrounding card chrome.
- Kept location details as an Apple Maps-style bottom sheet layered above the map.
- Reduced initial marker clutter through smarter low-zoom clustering and more compact marker geometry.
- Preserved all existing data, routes, filters, progress, backup compatibility, and map coordinates.

# Changelog

## 7.6.3 — Constrained POI Dropdown Repair

- Constrained the POI dropdown to the Caribbean bubble width.
- Anchored it directly beneath the bubble with compact internal scrolling.
- Simplified actions to Edit Filters and Clear Filters.
- Updated accessibility and production cache identity.

## 7.3.5 — Map Framing & Coordinate Integrity

- Preserves the source Caribbean map’s native 1944×1665 aspect ratio instead of stretching it to the viewport.
- Fits and centers the complete map at reset with clean letterboxing where necessary.
- Constrains panning to the rendered map surface at every zoom level.
- Keeps marker, cluster, and route geometry on one shared aspect-correct coordinate surface.
- Clamps rendered marker centers inside the visible map boundary while retaining stored coordinates.
- Corrects map-center calculations used by Nearest Objective and planning features.
- Adds regression checks for map geometry, aspect ratio, finite transforms, and database marker bounds.
- Restores repository governance and release-verification files in `.github`.

## 7.3.4 — Private Beta Candidate Packaging
- Restored `.github/CODEOWNERS` and `.github/workflows/verify-release.yml`.
- Added private-beta installation, testing, backup, and reporting guidance.
- Added an explicit known-issues and pending-certification record.
- Regenerated repository checksums and verified the complete root-level package.

## 7.3.4 — CSP Hardening and Regression Expansion
- Removed runtime inline style attributes in favor of CSP-safe stylesheet rules.
- Added post-render CSP and uncaught-error regression checks.
- Removed obsolete Encyclopedia bookmark data from loaded and imported saves.
- Separated current-session diagnostics from historical logs.

# Changelog

## 7.6.3 — Constrained POI Dropdown Repair

- Constrained the POI dropdown to the Caribbean bubble width.
- Anchored it directly beneath the bubble with compact internal scrolling.
- Simplified actions to Edit Filters and Clear Filters.
- Updated accessibility and production cache identity.

## 7.3.4 — Encyclopedia Removal & Regression Guard (2026-07-26)

- Removed the incomplete Encyclopedia tab, renderer, search controls, bookmark state, and all startup render references.
- Added a startup regression suite covering required application functions, core data globals, and critical DOM surfaces.
- Publishes regression results through `window.ANIMUS_REGRESSION_STATUS` and the `animus:regression-complete` event.
- Synchronized HTML asset versions, release identity, service-worker cache, and integrity metadata to 7.3.4.

## 7.3.2 — Regression Repair (2026-07-26)

- Restored the location-detail correction control and local correction capture.
- Restored Fleet rendering, status changes, and vessel removal.
- Added required-function regression validation before the first application render.
- Synchronized release identity, cache keys, and asset versions to 7.3.2.

## 7.3.2 — Developer Console Health Dashboard

- Added live module health and startup timeline panels.
- Added navigation, paint, and resource performance readings.
- Added detailed error, promise rejection, CSP, and network logging.
- Added richer diagnostics v2 export with stacks, modules, performance, service worker, caches, storage, and validation.
- Added safe cache inventory and confirmed obsolete Animus cache cleanup while preserving the current cache.
- Preserved database version 9, schema 3, onboarding, and saved-data compatibility.

# Changelog

## 7.6.3 — Constrained POI Dropdown Repair

- Constrained the POI dropdown to the Caribbean bubble width.
- Anchored it directly beneath the bubble with compact internal scrolling.
- Simplified actions to Edit Filters and Clear Filters.
- Updated accessibility and production cache identity.

## 7.2.2 — Startup escape hardening
- Moved the startup guard into the document head so it starts before application modules.
- Added versioned cache-busting URLs for critical HTML, CSS, JavaScript, manifest, and release assets.
- Added a CSS-only six-second splash escape that works even if JavaScript fails.
- Added early startup error capture for Diagnostics.
- Corrected the release identity global alias used by application and developer-console code.
- Removed the retired Developer Mode click handler that conflicted with the new Developer Console.

## 7.2.1 — Startup Reliability Hotfix

- Fixed the startup-blocking references to retired legacy diagnostics elements.
- Preserved the v7.2 Developer Console and first-launch walkthrough.
- Added an independent startup guard that dismisses the splash after a bounded timeout if an optional module fails.
- Added a visible recovery notice instead of leaving users trapped on the loading screen.
- Added `startup-guard.js` to offline caching and integrity verification.

## 7.0.0 — Public Release Security & Ownership Hardening

- Established the production repository as the sole authoritative release source.
- Added a restrictive source-available, all-rights-reserved notice for original project material.
- Added copyright, third-party-rights, fan-project, security, signing, GitHub-hardening, and release-provenance documentation.
- Added a visible in-app public-release and non-affiliation notice.
- Added CODEOWNERS and an automated GitHub Actions integrity/structure validator.
- Strengthened browser policy metadata while preserving the self-only content security model.
- Preserved all database records, marker IDs, calibration, storage key, routes, progress, settings, and user-data schema compatibility.
- Updated service-worker cache identity to `acbf-v7.0.0`.

# 6.0.3 — More Actions Layering Reliability Fix

- Preserved the existing five-item More Map Actions menu.
- Portaled the open menu to the document body so iOS Safari cannot paint the transformed map above it.
- Raised the menu to a dedicated top-level stacking layer.
- No database, marker ID, calibration, route, or saved-data changes.


## 6.0.3 — 2026-07-24
- Preserved the 104-record database, marker IDs, calibration, interface, branding, routes, and storage schema.
- Added guarded local-storage persistence so storage failures do not interrupt application interaction.
- Consolidated production release identity, service-worker cache identity, integrity records, and release-candidate packaging.

## 7.1.0 — Developer Console & Maintenance Hardening
- Added hidden seven-tap local Developer Console with salted PIN hash.
- Added read-only system, database, storage, and runtime-log inspection.
- Added database validation, diagnostic export, safety backup, cache cleanup, service-worker update check, protected maintenance mode, and confirmed local reset.
- Developer sessions auto-lock after 30 minutes of inactivity and contain no remote credentials or private signing keys.

## 7.2.0 — First-Launch Walkthrough & Mobile Overlay Repair
- Rebuilt onboarding as a true top-level modal above the header, map, drawers, and fixed bottom navigation.
- Added safe-area-aware sizing, internal scrolling, focus containment, keyboard handling, and small-screen adaptations.
- Expanded onboarding into a four-step introduction covering the app purpose, map gestures, planning tools, local storage, backups, offline use, and replay access.
- Preserved Developer Console v1, all 104 records, marker IDs, routes, progress, calibration, database version 9, user-data schema 3, and storage-key compatibility.

## 7.6.9
- Completed the route-stop card interface and iPhone-compatible manual reordering.
- Added Optimize Route and cleaned up route actions.

## 7.6.9
- Finalized Phase 1 route cards with unified descriptive drag controls and full labels.
