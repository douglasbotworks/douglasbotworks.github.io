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

The tool download now also includes `smoke_check.py` and `CI.md`. Public `CI.txt`
is the same guide. The smoke check runs fictional good/broken/repaired builds
with retained commands; the guide shows CI steps without claiming hosted execution.

Catalog now includes a local plain-text availability worksheet and generic email
link. It sends nothing automatically and opens no checkout. Source CSVs and
catalog values should be omitted from initial inquiries.

## Free fictional repair toolkit

The software demonstration distributes toolkit.zip, installation instructions,
its SHA256, and separately linked verify_demo.py/package_demo.py. All 32 archive
members match the explicit licensed source inventory. Actual extracted recipient
releases and pinned reruns pass for both fictional samples. Full E2E test execution
in this worker is blocked at temporary-directory cleanup (rmdir EPERM); no full
current-suite pass or browser/customer acceptance is claimed. The MIT source can
be inspected and the documented E2E command run on a normal POSIX development runtime.

## Skybound development preview

`demos/skybound/` publishes original source-generated CPU scenery and cockpit
previews plus a retained 17-event JSON schedule from Skybound ab0a8a0. The new
optional scene has a 600-second simulation deadline and seed 20261014. These
are public development exports, with no private repository URLs, source archive
or native APK. Current native rebuild and headset acceptance remain pending.
Regenerate with Skybound `tools/test.sh` and `tools/preview.py`; copy only
mountain projection, released-ready.svg and released-scene.json. Verify exact
byte equality before deployment and run `tools/verify_live.py` afterward.
