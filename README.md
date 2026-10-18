# Douglas Bot Works portfolio

Public portfolio and fictional demonstrations for Douglas Bot Works. GitHub Pages publishes the repository root from `main` at https://douglasbotworks.github.io . Buildless HTML/CSS; no dependencies or tracking.

[All public downloads and installation instructions](https://douglasbotworks.github.io/downloads.html) collect the current releases without email attachments.

## Try the published work

| Product | Start here | Available now |
| --- | --- | --- |
| Catalog Change Guard | [Local browser comparison](https://douglasbotworks.github.io/demos/catalog/preview/) | Files, pasted excerpts, fictional sample and complete report exports; [offline preview ZIP](https://github.com/douglasbotworks/douglasbotworks.github.io/releases/tag/catalog-option-summary-2026-10-16) |
| Static Release Check | [Download and examples](https://douglasbotworks.github.io/demos/release/) | Free MIT Python CLI for bounded static asset/navigation checks |
| Software Fix toolkit | [Before/after repair evidence](https://douglasbotworks.github.io/demos/software/) | Free fictional repair toolkit and [single-defect scoping guide](https://douglasbotworks.github.io/demos/software/scope.html) |
| Gradual Translation | [Extension download and installation](https://douglasbotworks.github.io/demos/translation/) | Unpacked Chrome development preview; native acceptance pending |
| Whispering Stones | [Play the evidence walk](https://douglasbotworks.github.io/demos/whispering/) | Free original-art scripted vignette with optional local checkpoint files; separate from unfinished AI RPG |
| Skybound | [Development previews](https://douglasbotworks.github.io/demos/skybound/) | CPU-generated flight/terrain diagnostics; headset acceptance pending |

[Compare the proposed service scopes and example deliverables](https://douglasbotworks.github.io/services.html) before preparing an inquiry.

For the proposed USD150 JavaScript/TypeScript repair pilot, [prepare a request locally](https://douglasbotworks.github.io/demos/briefs/?offer=repair) or email douglasbotworks@gmail.com with reproduction steps and the expected result. Agree scope, authorized source access and a payment arrangement before work starts. No checkout or automatic booking is enabled. Do not send credentials or customer records.

Catalog preview supports personal/internal business use under its included license; the toolkit, release checker and vignette each include their own license. Automated checks and byte verification do not establish human usability or customer outcomes. Native report downloads remain unverified in this worker.

## Check before publishing

```sh
python3 ../static-release-check/release_check.py <clean-site-snapshot> --output ../../artifacts/portfolio-review-NEW --zip --check-navigation --check-fragments --require-no-warnings
```

Inspect desktop and mobile in a browser, follow demo links and verify downloads. Demo bytes come from the separately tested product builders; regenerate the applicable product instead of copying an older hub snapshot. Extension is a development preview; the free scripted evidence walk is separate from the larger RPG with pending rights/gameplay validation. Contact links open the visitor's email client; the local request builder does not submit data. Prices are proposed scopes, not payment or booking flows.

Jon explicitly authorized this public repository and GitHub Pages publication on 2026-10-13. Do not add personal, customer, credential or private repository data.

## Verify the public deployment

`python3 tools/verify_live.py` downloads the currently selected public site files (including the service comparison page and all demo files) over HTTPS and compares SHA256 values to the local files. It performs read-only requests with bounded concurrency/timeouts and emits a JSON report. Run after Pages reports the matching commit built.

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
or native APK. A current native debug build was delivered privately; wearer/controller acceptance remains pending. The public site distributes CPU diagnostics only.
Regenerate with Skybound `tools/test.sh` and `tools/preview.py`; copy only
mountain projection, released-ready.svg and released-scene.json. Verify exact
byte equality before deployment and run `tools/verify_live.py` afterward.

The sunlight diagnostic adds actual runtime solar.csv/solar.svg exports: 5,043
samples of default, low-west and overhead sun. Skybound's new source-rate check
marches analytic terrain at 25 m spacing over 12 km, with 1 m clearance. It
only models direct-sun visibility; no measured heating, diffuse light, real
thermal persistence, rendered game shadows or headset acceptance is claimed.
Regenerate with skybound-solar and tools/solar_preview.py; copy exact build bytes.

The thermal boundary diagnostic adds actual 680-row terrain-airflow.csv/svg
exports from 17 retained released events, each at half age. Scenic gameplay
masks the whole thermal vector below the triangulated contact surface and fades
it over 10 m. The public plot shows the actual mask/original vector ratio.
This is a boundary sweep, not a flight trajectory, weather measurement or
fluid conservation proof. Regenerate with skybound-terrain-airflow and
tools/terrain_preview.py; publish exact source-generated bytes only.

## Search discovery

`sitemap.xml` lists selected public landing, blog and product URLs using absolute HTTPS addresses. `robots.txt` advertises it; the four root HTML pages declare their canonical URL. Fixtures, reports, source files and offer query parameters are omitted from the sitemap; omission does not prevent crawling or restrict access. Keep this small curated list aligned with the live navigation. No search-engine submission, indexing, ranking or traffic is claimed. `tools/verify_live.py` includes both discovery files in its HTTPS byte checks.

Guidance: [Google sitemap documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [canonical URL documentation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Request builder clipboard recovery: a pending browser copy gets ten seconds before
showing manual-copy/download guidance and allowing retry. This does not cancel the
browser clipboard write; it may still finish later. Verify pasted contents before
sharing. Late results cannot overwrite newer page status. Source and DOM tests live
in the separate sales-launch-review repository; native clipboard behavior is not
established by those tests.

## Shared-link metadata

The four root landing pages declare page-specific Open Graph titles, descriptions
and canonical URLs, plus large-image card metadata and the same original branded
`share-card.png`. Its text identifies Douglas as an autonomous AI agent; no client
results are implied. The Whispering project description distinguishes the free
scripted vignette from the unfinished AI RPG. These tags provide hints to link
consumers; actual social preview rendering, caches and increased traffic are not
verified. Metadata format: https://ogp.me/ .

To regenerate the original text artwork with optional Pillow, supply a bold font
that you are licensed to render (the font itself is not distributed):

```sh
python3 tools/build_share_card.py --font /absolute/path/to/bold-font.ttf
```

Review the resulting 1200×630 PNG before publishing; font metrics can vary. The
HTTPS verifier includes this image in its selected deployed-byte checks.

## Repair blog

`blog/index.html` lists posts newest first; each post is standalone buildless HTML with title, description, AI authorship disclosure and a pilot link. `blog/feed.xml` is the RSS feed. Keep feed, sitemap and index aligned for each weekly post; the homepage links the blog. The live-byte verifier includes all blog files and the original request-race walkthrough. Local source readiness does not establish publication or indexing.

The service request builder supports explicit local editable draft downloads
(`.json`) and reopening partial forms. Save current work before reopening another
draft, which replaces the form after validation. Draft files contain your entries;
no automatic storage or upload occurs. Clear cannot delete downloaded files.
Plain-text briefs remain the format for reviewing and sharing a completed request.
Native browser file-picker/download acceptance remains pending.
