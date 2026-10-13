Catalog Change Guard review

Open report.html first. report.json contains the full structured comparison.
changed-cells.csv contains only edited cells in matched variants, not all findings.
It is a review sheet, not an import file. Spreadsheet protection prefixes change
exported text; JSON/HTML retain exact values. counts.json omits source strings but
counts can still reveal business information. Keep the complete folder private.

REVIEW.json is written last after all reports complete; without it this folder
is incomplete. Its SHA256 entries detect changed output bytes only when checked
against a trusted copy; they do not authenticate the sender or prove import safety.
No inputs are copied or modified. This tool does not connect to Shopify.
Review all findings and current import guidance before making store changes.
