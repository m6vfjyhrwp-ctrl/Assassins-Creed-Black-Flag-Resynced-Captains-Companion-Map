# Known Issues and Beta Limitations

## Current limitations

- This build has not yet completed broad testing across many iPhone models, iPad models, operating-system versions, browsers, accessibility settings, and installed-PWA upgrade paths.
- User data is device-local. There is no automatic cloud synchronization or account recovery.
- Offline use depends on the service worker completing its first online installation. A first launch without connectivity may not work.
- Safari and installed Home Screen apps can temporarily retain an older service-worker cache after deployment. Testers may need to reopen Safari, refresh, or reinstall the Home Screen shortcut.
- Some location records are derived from legacy Black Flag information and may still need confirmation against the Resynced release. Verification labels should be respected.
- The health dashboard can describe the map engine as loading only when the map initializes. This is expected for lazy initialization unless the map itself fails to display or respond.
- Historical diagnostic logs can contain errors from earlier releases. Current-session errors and regression status should be used when judging the active build.

## Not yet certified

The following remain pending until the private beta provides broader evidence:

- Repeated clean-install and upgrade testing on multiple physical devices
- Extended offline and cache-update testing
- VoiceOver and large Dynamic Type acceptance testing
- Long-session performance and storage-pressure testing
- Backup restoration after app deletion or browser-data clearing
- External security review and formal penetration testing
- Comprehensive gameplay verification of all 104 database records

## Reporting

Export both **Diagnostics** and **Health Report** immediately after reproducing an issue. Keep safety backups private because they may include progress and personal notes.
