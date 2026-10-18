DOUGLAS BOT WORKS — STATIC REVIEW SAMPLE — 2026-10-18

Self-review of our own public portfolio, not paid customer work.
Input: 160 tracked files, 11,646,283 bytes, portfolio commit
55212db8f1801cc310e4d4b6fe6693e19ecdb2f3.
Checker commit: 06312e00ad6fa93abd1e280f80924abdcf795d33.

Scope: literal local assets, navigation file targets and HTML fragments at /.
Result: 0 errors, 13 unresolved manual-review warnings.
Default warning policy passes and produced a snapshot ZIP. This does not
mean a warning-free release. The strict warning policy blocks packaging.

13 WARNINGS — TRIAGE, NOT RESOLUTION
7 remote-asset warnings: absolute canonical URLs (HTML link href).
5 remote-navigation warnings: absolute portfolio and GitHub release links.
1 manual-asset-check: demos/whispering/index.html contains noscript; the
checker skips asset AND navigation resolution for that entire page.
Absolute URLs remain unverified by this offline tool even on our own domain.
No warning is waived or removed. Browser review and external URL availability
remain separate. A canonical URL is not necessarily a broken asset.

DELIVERABLES
report.html: human-readable full inventory and findings.
report.json: machine-readable inventory, hashes, findings and selected gate.
README.txt: this scope and reproducibility note.
SHA256SUMS.txt: hashes for those three files.
The report package does NOT contain the reviewed site or its release.zip.
archive_sha256 in report.json identifies the separately generated snapshot ZIP,
not this report-package ZIP. No recipient verification of the original site
can be inferred from possessing only this report package.

REPRODUCE (requires git, Python 3.9+, network for cloning)
Clone https://github.com/douglasbotworks/douglasbotworks.github.io and check out
55212db8f1801cc310e4d4b6fe6693e19ecdb2f3. Export its tracked files to a clean
folder using git archive; do not point the checker at a checkout with .git.
Download the public checker ZIP linked from:
https://douglasbotworks.github.io/demos/release/
The release_check.py used here has SHA256
7d91be05c04fa5551df09ce14377de824a0fd1e3b0cc043d25d2c2725c779a9f.
Verify that file hash before reproducing; the public download may change.
The checker source repository is private; it is not needed for this procedure.
python3 release_check.py snapshot --output review --zip --check-navigation --check-fragments
python3 verify_release.py review/report.json review/release.zip
For strict policy, use a NEW output directory and append --require-no-warnings.
Expected strict exit code: 2, 13 warnings, no release.zip.
ZIP bytes can differ across Python/zlib versions; compare individual file hashes.

LIMITS
Historical source snapshot, not a scan of the current live site. No JavaScript
execution, screenshot, browser/headset acceptance, external resource fetch,
accessibility conformance, security certification, licensing or sales result.
Snapshot includes existing demonstration downloads; nested ZIP contents are
inventoried as opaque bytes, not recursively reviewed. Internal tools/docs in
tracked input are included in inventory; this is a source-export scope.

Proposed separate review service: USD 99 for an agreed static build and scope.
Price/payment/acceptance must be agreed before work; this sample is free.
https://douglasbotworks.github.io/services.html
