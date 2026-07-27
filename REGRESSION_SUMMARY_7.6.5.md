# Regression Summary — Animus Companion 7.6.5

## Root cause confirmed
The production diagnostics showed the detail sheet open while its measured position was below the visible viewport, and source inspection found `.sheet-backdrop` at z-index 190 while `.detail-sheet` was at z-index 180. The backdrop therefore rendered above the sheet and captured touch interaction.

## Repairs verified statically
- Sheet backdrop now stacks below the detail sheet.
- Detail sheet and content explicitly accept pointer input.
- Detail content retains `overflow-y:auto`, iPhone momentum scrolling and vertical touch action.
- Sheet open/closed ARIA state is synchronized.
- JavaScript syntax passes.
- JSON files parse.
- Release identity, service-worker cache and cache-busting references use 7.6.5.
- Database remains 104 records.
- Integrity manifest hashes pass.
- No nested ZIP files.
- Deployable files are at ZIP root.

## Pending physical tests
- iPhone Safari vertical scrolling.
- Installed-PWA vertical scrolling.
- Backdrop tap closes the sheet.
- Handle drag and compact/half/full snap states.
- VoiceOver focus behavior.
