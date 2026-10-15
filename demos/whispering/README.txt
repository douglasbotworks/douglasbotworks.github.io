WHISPERING STONES — EVIDENCE WALK

A separate, short scripted browser vignette inspired by Jonathan Sirrine's
Whispering Stones investigation prototype. Original SVG graphics and original
preview code. No borrowed sprites, external asset packs, AI, account or backend.
This is not the full RPG campaign or a resolution of Maya's disappearance.

Start in the town square. Ask Grace for a clue. Visit the library and ask Sarah.
Visit the school courtyard and ask Elena. Read all three case notes, return to
town and choose a next lead. Wrong conclusions can be retried. Revisiting a
witness never duplicates a clue. Start over clears all progress; reload also
starts fresh. Progress is only in tab memory; the app does not persist it.
Use keyboard Tab/Enter or pointer/touch on the same labeled buttons. The map is
an illustration. No physical dragging or movement controls are required.

Live preview: https://douglasbotworks.github.io/demos/whispering/
To run a downloaded copy, serve this complete directory through a local HTTP
server (Python3: python3 -m http.server 8080 --bind 127.0.0.1) and open
http://127.0.0.1:8080/ . ES modules require HTTP; opening index.html through file://
is not supported. Stop your server when finished. Server uses local files only.

The app makes no network submissions, analytics calls, AI requests or storage
writes. Hosting/local server receives ordinary requests for the app files.
No human playtest, full mystery completion, AI experience or commercial demand
is claimed. Free development preview. License applies only to these original
preview files, not the main RPG or its asset packs.

OPTIONAL PORTABLE CHECKPOINTS
Download checkpoint requests a small JSON file through your browser. Confirm the
file was saved before leaving; the page cannot detect cancellation or blocking.
If preparation fails, retry guidance appears and your investigation stays intact. Load checkpoint
reads a selected file locally and replaces the current investigation only after
validation. Invalid files leave progress unchanged. Only location, ordered clues
and completion are saved; dialogue is regenerated. No automatic browser storage
or upload. Reload still starts fresh until you explicitly load your file. Start
over does not delete downloaded files. Checkpoints can be edited and are not
proof of play or completion. Maximum input file: 4096 bytes.

While a checkpoint is reading, Cancel checkpoint load keeps the current investigation.
Reads time out after ten seconds with retry guidance; late results cannot replace
progress after cancellation, timeout, new gameplay or a newer load. Cancellation
stops applying the result; it does not promise to abort the browser's file read.
If a restored checkpoint hides the focused deduction or ending, focus returns
to Load checkpoint. Focus elsewhere stays in place.
