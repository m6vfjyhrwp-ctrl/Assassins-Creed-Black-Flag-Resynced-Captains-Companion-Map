# Animus Companion 7.6.1 — Emergency Map Rendering Repair

## Repair
- Restores the extended world background, calibrated Caribbean map, route layer, marker layer, and playable-area boundary.
- Fixes a zero-size extended canvas caused when the CSP-safe dynamic stylesheet rule replaced runtime width and height with transform-only declarations.
- Preserves the 7.6 extended canvas architecture and all Navigation First behavior.
- Corrects diagnostics so source-aspect validation measures the unchanged 1944 × 1665 playable map rather than the decorative outer canvas.

## Compatibility
- Database version 9 and all 104 records preserved.
- User-data schema version 3 and storage key `acbf-companion-m3` preserved.
- Existing 7.5 and 7.6 safety backups remain compatible.
- No marker coordinates, IDs, completion data, notes, filters, routes, Jackdaw data, fleet data, or logs were changed.

## Deployment
Upload the contents of the production ZIP to the repository root. The service-worker cache changes to `acbf-v7.6.1-map-render-repair`, forcing replacement of the broken 7.6.0 cached shell.
