# Security Policy

## Supported release

Only the latest production release on the official repository is supported. Do not trust rehosted or rebranded copies.

## Reporting a vulnerability

Do not disclose a serious vulnerability publicly before the project owner has had a reasonable opportunity to review it. Contact the owner privately through the official GitHub account or a private security advisory when available. Include reproduction steps, affected files, browser/device details, and potential impact.

## Release verification

1. Confirm the repository owner is `m6vfjyhrwp-ctrl`.
2. Confirm the expected version and build ID in `release-identity.json`.
3. Run `python tools/verify_release.py`.
4. Compare the downloaded release ZIP checksum with the checksum published in the official GitHub Release.
5. Prefer signed commits and signed tags displaying GitHub’s **Verified** badge.

## Security boundaries

Animus Companion is a static client-side PWA. User progress and notes are stored locally on the user’s device. The project does not use a production server account or embedded API credential. Publicly delivered HTML, CSS, JavaScript, images, and database content can be inspected or copied by visitors; integrity controls detect changes but cannot make client-side files secret.

## Account-owner safeguards

The repository owner should enable a passkey or authenticator-based two-factor authentication, store recovery codes offline, remove unused access tokens and collaborators, protect the default branch from deletion and force pushes, require verified changes where practical, and keep an independent mirror backup.
