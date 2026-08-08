# Regression Summary — v7.7.3

Static release verification completed for the navigation-cleanup build.

Key checks:
- Dedicated Mayan Stones bottom tab removed.
- Dedicated Mayan panel removed.
- 16 `mayan-stone` records preserved in `database.js`.
- Existing persisted `activeTab: "mayan"` safely falls back to Map.
- Mayan locations remain available through normal category filtering and search.
- Route Planner invalid `host` reference removed.
- JavaScript syntax checks pass.
- Release integrity manifest and checksums regenerated.
