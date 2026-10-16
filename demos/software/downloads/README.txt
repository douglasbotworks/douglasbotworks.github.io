DOUGLAS BOT WORKS — RUNNABLE FICTIONAL REPAIR SAMPLES

These two free examples contain original and repaired standalone JavaScript,
the identical acceptance fixture, actual report, informational diff, runner,
worker and file manifest. They are fictional demonstrations, not client work.
No dependencies, API account, payment or network service is required.

Before execution, inspect the supplied Python verifier and JavaScript source.
Archive verification requires Python 3.9+ on a POSIX system (macOS or Linux).
Native Windows Python is unsupported. JavaScript reruns require Node.js 22+.
The verifier
checks bytes and fixed inventory without extracting or executing archive code.
The JavaScript workers have current-user privileges; use only trusted code.
Hashes supplied alongside a file establish consistency, not sender identity.
Obtain an independently trusted hash/verifier when sender authenticity matters.

ORDER-TOTAL
Archive SHA256: 25ed6182d7db52f3914126e9c4fc53886fb67f72bb55635f0692aca1506ee0ff
Contract SHA256: e962965f5a4615f0ac067ab5c6d704879960a5ac54e723d1e9231d385a3ebffa
From this downloads directory, before extraction:
python3 handoff_archive.py verify order-total.zip 25ed6182d7db52f3914126e9c4fc53886fb67f72bb55635f0692aca1506ee0ff
Expected: exit 0, contentConsistent=true, executionPerformed=false.
Extract this ZIP into its own new directory. Inspect DELIVERY.md and source.
From that extracted directory run the following on ONE line:
node contract-review.js --contract-sha256 e962965f5a4615f0ac067ab5c6d704879960a5ac54e723d1e9231d385a3ebffa contract.json before/module.mjs after/module.mjs > recipient-report.json
Expected: exit 0; beforeFailures=3, afterPasses=3, caseCount=3, executionErrors=false.
Compare fixture/module hashes and every case with report.json. Node-version
metadata can differ across runtimes. Do not mix the two extraction directories.

REQUEST-STATE
Archive SHA256: 6aa14e9778a5545497bb6727f70c2abae2d3299025bd5d67239d19227f33522b
Contract SHA256: 669c602d28c8615572a28307d697fc6b238489fbc8e26f320f53c55bc17c98ce
From this downloads directory, before extraction:
python3 handoff_archive.py verify request-state.zip 6aa14e9778a5545497bb6727f70c2abae2d3299025bd5d67239d19227f33522b
Expected: exit 0, contentConsistent=true, executionPerformed=false.
Extract this ZIP into its own new directory. Inspect DELIVERY.md and source.
From that extracted directory run the following on ONE line:
node contract-review.js --contract-sha256 669c602d28c8615572a28307d697fc6b238489fbc8e26f320f53c55bc17c98ce contract.json before/module.mjs after/module.mjs > recipient-report.json
Expected: exit 0; beforeFailures=5, afterPasses=8, caseCount=8, executionErrors=false.
Compare fixture/module hashes and every case with report.json. Node-version
metadata can differ across runtimes. Do not mix the two extraction directories.

Verifier SHA256: 0188ca29c7d01346a0dcef5e09028dc948854c24b7f020de14f51cf49d73c9f1

Order-total: decimal string contract, shipping per line. No taxes, discounts,
refunds, multiple currencies or payment processing.
Request-state: fictional callback JSON, no React/fetch/render/abort integration.
Callers allocate increasing positive safe-integer IDs within one stream.
Neither sample establishes browser, application, deployment or client acceptance.
change.diff is informational; do not apply it blindly to a real repository.
These free examples do not contain the paid Catalog Change Guard source.
See LICENSE.txt for permission to use the example code and verifier.
