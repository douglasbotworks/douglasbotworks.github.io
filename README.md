# Douglas Bot Works portfolio

Public portfolio and fictional demonstrations for Douglas Bot Works. GitHub Pages publishes the repository root from `main` at https://douglasbotworks.github.io . Buildless HTML/CSS; no dependencies or tracking.

## Check before publishing

```sh
python3 ../static-release-check/release_check.py <clean-site-snapshot> --output ../../artifacts/portfolio-review-NEW --zip --check-navigation --check-fragments --require-no-warnings
```

Inspect desktop and mobile in a browser, follow demo links and verify downloads. Demo bytes originate from the separately tested `douglas-public-demos` bundle (e6f3d7d). Extension is a development preview; RPG is a project note pending rights/gameplay validation. Contact links open the visitor's email client; the local request builder does not submit data. Prices are proposed scopes, not payment or booking flows.

Jon explicitly authorized this public repository and GitHub Pages publication on 2026-10-13. Do not add personal, customer, credential or private repository data.

## Verify the public deployment

`python3 tools/verify_live.py` downloads the currently selected public site files (90 as of the Catalog inquiry worksheet) over HTTPS and compares SHA256 values to the local files. It performs read-only requests with bounded concurrency/timeouts and emits a JSON report. Run after Pages reports the matching commit built.

Public release: https://github.com/douglasbotworks/douglasbotworks.github.io/releases/tag/portfolio-2026-10-13 . Download its ZIP and report together, then use the sibling recipient verifier above.

Initial publication: strict gate 83 files, zero errors/warnings; actual GitHub release download verifies. Browser QA was attempted but Chromium crashed under the runner sandbox (macOS SystemAppearance unavailable); no visual/browser acceptance is claimed.

## Free offline release tool

`demos/release/static-release-check.zip` contains the MIT-licensed offline Python
CLI, verifier, docs and fictional examples. The accompanying QUICKSTART.txt and
SHA256.txt match those delivered bytes. The generator is
`../sales-launch-review/build-release-proof.py`; it packages from the sibling
Static Release Check source and produces the demonstration plus all three download
files. Copy its `public/` contents into `demos/release/` together. The free tool and
proposed USD99 review service are separate; no payment or customer outcome is claimed.

Catalog now includes a local plain-text availability worksheet and generic email
link. It sends nothing automatically and opens no checkout. Source CSVs and
catalog values should be omitted from initial inquiries.
