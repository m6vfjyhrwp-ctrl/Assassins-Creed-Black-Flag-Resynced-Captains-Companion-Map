# Animus Companion v7.3.4 — Private Beta Guide

This package is intended for a small, invitation-only testing group. Animus Companion is an unofficial, noncommercial fan-made companion for Assassin’s Creed IV: Black Flag and is not affiliated with or endorsed by Ubisoft.

## Before testing

1. Open the currently installed app, go to **Settings → Developer Console**, and export a **Safety Backup**.
2. Keep that JSON file somewhere outside the app, such as Files, iCloud Drive, or email.
3. Upload every file and folder in this package to the repository root. Preserve hidden files and folders, including `.github` and `.nojekyll` when present.
4. Wait for GitHub Pages and the verification workflow to finish before opening the site.
5. On iPhone, first open the site in Safari. After confirming the new version, reinstall or refresh the Home Screen app if Safari continues to show an older cached build.

## Suggested test coverage

Testers should try the following on a clean installation and, when possible, an upgrade from the previous release:

- First launch and onboarding
- Map loading, panning, pinch zoom, reset, and marker selection
- Search, filters, completion status, favorites, notes, and route planning
- Jackdaw and Fleet screens
- Progress and Captain’s Log
- Offline launch after one successful online visit
- Safety backup export and restore
- Diagnostic and health-report export
- Home Screen installation and relaunch
- Portrait and landscape orientation
- Reduced Motion and common iPhone text-size settings

## Reporting a bug

Include:

- A short description of what happened
- Exact steps that reproduce it
- What you expected instead
- Device model and operating-system version
- Whether the app was opened in Safari or from the Home Screen
- A screenshot or screen recording when useful
- The exported diagnostics JSON
- The exported health report JSON

Do not post a safety backup publicly. It may contain personal notes and gameplay progress.

## Data and privacy

Animus Companion stores progress locally in the browser or installed PWA. It does not provide account synchronization. Clearing website data, deleting the Home Screen app, changing browsers, or some operating-system storage actions can remove local progress. Regular safety-backup exports are strongly recommended during beta testing.

## Release identification

- Version: **7.3.4**
- Build ID: **animus-v7.3.4-20260726**
- Database version: **9**
- User-data schema: **3**
- Intended status: **Private Beta Candidate**
