# GitHub Public-Release Security Checklist

Complete these repository/account settings in GitHub; they cannot be configured by files inside a ZIP.

## Account

- Enable a passkey and authenticator-app two-factor authentication.
- Download and securely store recovery codes away from the phone.
- Use a unique password in a password manager.
- Review active sessions, SSH keys, deploy keys, GitHub Apps, and personal access tokens.
- Remove anything no longer required.

## Repository access

- Confirm only trusted accounts appear under collaborators and teams.
- Do not grant write access merely so someone can view or test the app.
- Keep the repository owner account as the only bypass authority unless another maintainer is genuinely required.

## Default-branch ruleset for `main`

- Restrict deletion.
- Block force pushes.
- Require a pull request before merging where practical.
- Require the `Verify public release` workflow to pass.
- Require signed commits where practical.
- Restrict bypass permissions.

## Pages and releases

- Deploy GitHub Pages only from the intended branch/folder or a controlled workflow.
- Create a signed `v7.0.0` tag.
- Publish the official ZIP and its SHA-256 checksum in a GitHub Release.
- State that only releases from the owner’s repository are official.

## Backups

- Keep a mirror clone containing all branches and tags.
- Keep the release ZIP in separate cloud storage and one offline location.
- Export app progress before destructive browser or repository maintenance.
