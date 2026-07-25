# Official Release Signing Procedure

A private signing key must never be committed to this repository or included in a release ZIP.

## Recommended owner procedure

1. Enable GitHub commit-signature verification using an SSH or GPG signing key.
2. Keep the private key only in the owner’s secure keychain or hardware security key.
3. Commit the final release using a signed commit.
4. Create a signed annotated tag, for example `v7.0.0`.
5. Build the release ZIP from that exact tag.
6. Generate a SHA-256 checksum for the release ZIP.
7. Optionally create a detached signature for the checksum file.
8. Publish the tag, ZIP, checksum, signature, and public-key fingerprint together in the official GitHub Release.

## Important distinction

The built-in integrity manifest proves that deployed files match the manifest. A signed Git tag or detached signature additionally connects the release to the owner’s signing identity. This package supplies the verification structure but intentionally contains no private signing key.
