Catalog batch review

Open index.html, then every linked report. Each pair is independent; cross-pair
SKU duplicates and product relationships are not checked. Totals count findings,
not unique products. IDs and counts may be commercially sensitive. Full reports
contain source values. No CSV is copied, changed, uploaded or imported.

BATCH.json is written last. Without it the batch is incomplete, even if some
individual reviews completed. Retry into a new directory after correcting errors.
It records summary-file hashes and each REVIEW.json pin. Retain its SHA256 through
a separately trusted channel. Hashes prove consistency only, not sender identity
or import safety. Each review can be checked with verify-review.mjs using its pin.
