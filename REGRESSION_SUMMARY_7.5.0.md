# Regression Summary — 7.5.0 Navigation First

**Result:** 25/25 static and structural checks passed.

## Automated checks

- PASS — Version metadata aligned
- PASS — Build metadata aligned
- PASS — Production channel
- PASS — Storage key preserved (acbf-companion-m3)
- PASS — User-data schema preserved (schema 3)
- PASS — Database version preserved (database 9)
- PASS — Database record count preserved (104 records)
- PASS — Navigation destination: map
- PASS — Navigation destination: jackdaw
- PASS — Navigation destination: progress
- PASS — Navigation destination: log
- PASS — Navigation destination: settings
- PASS — Persistent navigation rule present
- PASS — Persistent header rule present
- PASS — Safe-area dock positioning
- PASS — Sheets above navigation
- PASS — Drawers above navigation
- PASS — Toasts above navigation
- PASS — No static inline style attributes
- PASS — No runtime .style.setProperty calls
- PASS — CSP-safe dynamic style helper
- PASS — Regression check retained
- PASS — Service-worker core assets present (23 assets)
- PASS — Runtime integrity manifest valid (22 files)
- PASS — No nested ZIPs

## Browser execution status

Automated Chromium execution was attempted against a local isolated test server, but the environment blocked the local page with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore physical iPhone Safari, installed-PWA, gesture, rotation, VoiceOver, and live service-worker behavior remain pending device validation. The supplied iPhone recording was reviewed to confirm the Navigation First target behavior and identify the persistent dock/safe-layout scope.

## Compatibility conclusion

The production package keeps database version 9, user-data schema version 3, and the `acbf-companion-m3` storage key. No location IDs, calibrated coordinates, saved-state structures, or gameplay databases were intentionally changed.
