# Changelog

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
