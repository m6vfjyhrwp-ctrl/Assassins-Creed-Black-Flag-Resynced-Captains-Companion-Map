# Regression Summary — Animus Companion v7.6.8.1

## Verified statically

- Route planner remains fixed above the bottom navigation dock.
- Route list retains independent vertical scrolling and iPhone momentum scrolling.
- Three-stop viewport sizing is applied on standard iPhone portrait layouts.
- Reverse, Optimize, Clear Route, drag reorder, open stop, and remove stop code paths remain unchanged.
- Marker detail overlay isolation remains intact.
- Database count, storage key, schema versions, map assets, and offline files remain unchanged.

## Device validation required

Confirm on iPhone Safari and installed PWA that three complete route cards are visible before scrolling and that the planner does not overlap the header or navigation dock.
