# Regression Summary — v7.6.8

## Passed static checks

- JavaScript syntax validation
- JSON metadata parsing
- Release identity and service-worker cache alignment
- Integrity-manifest verification
- Root-level production packaging
- No nested ZIP archives
- Existing database and storage schema preserved
- Existing marker-sheet/route-overlay isolation retained

## Route planner checks

- Route stop open and remove controls are wired
- Reverse, Optimize, Clear, and Hide controls are wired
- Desktop drag-and-drop handlers are present
- iPhone pointer-drag handlers and touch-safe drag handles are present
- Route redraw and marker renumbering occur after reorder

## Device validation still required

Physical iPhone Safari and installed-PWA testing should confirm drag feel, auto-scroll, button spacing, and long multi-stop routes.
