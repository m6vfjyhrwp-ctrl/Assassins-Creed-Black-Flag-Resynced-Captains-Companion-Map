# Animus Companion v7.7.3 — Navigation Cleanup & Runtime Repair

- Removed the dedicated **Mayan Stones** bottom navigation tab and its standalone panel.
- Preserved all 16 Mayan Stone records in the main database, map, search, filters, progress, completion tracking, favorites, notes, routing, and backups.
- Added navigation migration so saved sessions that previously had the Mayan tab active safely return to the Map tab.
- Removed the obsolete Mayan-tab renderer that referenced the retired `data.completed` schema.
- Repaired the Route Planner reordering handler by removing an invalid leftover `host.appendChild(fragment)` reference.
- Added regression checks confirming there is no dedicated Mayan tab and exactly 16 Mayan Stone database records remain available.
- Bumped the offline service-worker cache and release identity to v7.7.3.
