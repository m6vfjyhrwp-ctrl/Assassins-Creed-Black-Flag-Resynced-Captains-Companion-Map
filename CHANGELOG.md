# Changelog

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
