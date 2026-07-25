# Animus Companion 7.0.0 — Public Release

Animus Companion is an unofficial, fan-made, noncommercial Assassin’s Creed IV: Black Flag companion PWA with an offline map, objective tracking, routes, progress, notes, ship/fleet tools, backup and recovery, and runtime release-integrity verification.

## Official-source notice

The authoritative public repository is owned by **`m6vfjyhrwp-ctrl`**. Rehosted, modified, mirrored, or rebranded copies are not official releases unless the owner explicitly identifies them as such.

## Installation

Upload every deployable file in this package to the repository root. GitHub Pages should serve `index.html` from that root. The `.github` and `tools` directories support repository validation and do not affect the PWA at runtime.

## Verification

```bash
python tools/verify_release.py
```

The browser also performs a runtime SHA-256 integrity check of the production application files. A successful check displays **Official Release**. For authorship-level provenance, the repository owner should also sign the Git commit and version tag as described in `SIGNING.md`.

## User data

Progress, notes, favorites, routes, screenshots, filters, and settings remain local to each user’s device. Export a JSON backup before clearing browser data, removing the installed PWA, or performing major upgrades. Version 7.0.0 preserves storage key `acbf-companion-m3` and user-data schema version 3.

## Security and ownership

Review `LICENSE`, `NOTICE.md`, `COPYRIGHT.md`, `SECURITY.md`, `SIGNING.md`, and `GITHUB_SECURITY_CHECKLIST.md` before public launch. Repository settings such as 2FA, collaborators, branch protection, and signed commits must be configured by the owner in GitHub and cannot be embedded into a ZIP.

## Fan-project disclaimer

Animus Companion is not affiliated with, endorsed by, sponsored by, or officially connected with Ubisoft. Assassin’s Creed, Assassin’s Creed IV: Black Flag, related names, characters, logos, game artwork, and trademarks belong to their respective owners.
