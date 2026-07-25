#!/usr/bin/env python3
import hashlib, json, pathlib, sys, zipfile
ROOT=pathlib.Path(__file__).resolve().parent
errors=[]
def digest(path):
    h=hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""):h.update(chunk)
    return h.hexdigest()
try:
    identity=json.loads((ROOT/"release-identity.json").read_text())
    version=json.loads((ROOT/"VERSION.json").read_text())
    manifest=json.loads((ROOT/"integrity-manifest.json").read_text())
except Exception as exc:
    print(f"Metadata error: {exc}");sys.exit(1)
if identity.get("version")!=version.get("version") or manifest.get("releaseVersion")!=version.get("version"):
    errors.append("Release versions do not match")
if identity.get("buildId")!=version.get("buildId") or manifest.get("buildId")!=version.get("buildId"):
    errors.append("Build IDs do not match")
for entry in manifest.get("files",[]):
    path=ROOT/entry["path"]
    if not path.is_file(): errors.append(f"Missing: {entry['path']}");continue
    if path.stat().st_size!=entry["size"]: errors.append(f"Size mismatch: {entry['path']}")
    if digest(path)!=entry["sha256"]: errors.append(f"Hash mismatch: {entry['path']}")
for path in ROOT.rglob("*.zip"):
    errors.append(f"Nested ZIP prohibited: {path.relative_to(ROOT)}")
required=["LICENSE","NOTICE.md","COPYRIGHT.md","SECURITY.md","SIGNING.md","GITHUB_SECURITY_CHECKLIST.md","RELEASE_PROVENANCE.json",".github/CODEOWNERS",".github/workflows/verify-release.yml"]
for item in required:
    if not (ROOT/item).is_file(): errors.append(f"Missing public-release file: {item}")
if errors:
    print("Release verification FAILED")
    for error in errors: print("-",error)
    sys.exit(1)
print(f"Release verification passed: Animus Companion {version['version']} ({version['buildId']})")
print(f"Verified {len(manifest.get('files',[]))} runtime files; no nested ZIP files found.")
