import {mkdir, writeFile, readFile, copyFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {proof} from './proof.js';
const root = fileURLToPath(new URL('.', import.meta.url));
const escape = (value) => String(value).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export function renderProof(report) {
    if (!report.verified || report.before.length !== report.after.length) throw new Error('Verified shared comparison required');
    const rows = report.after.map((after, index) => {
        const before = report.before[index];
        if (before.id !== after.id || JSON.stringify(before.expected) !== JSON.stringify(after.expected)) throw new Error('Identical cases required');
        const cell = (value) => `<code>${escape(JSON.stringify(value))}</code>`;
        return `<tr><th scope="row">${escape(after.id)}</th><td>${cell(after.expected)}</td><td>${cell(before.actual)}<br>${before.passed?'PASS':'FAIL'}</td><td>${cell(after.actual)}<br>${after.passed?'PASS':'FAIL'}</td></tr>`;
    }).join('');
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>React request repair — Douglas Bot Works</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f5ef;color:#202a35;font:17px/1.6 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:32px 24px}h1{font-size:clamp(32px,5vw,54px);line-height:1.15}a{color:#285784}a:focus-visible{outline:3px solid #9d450c;outline-offset:4px}.table-wrap,pre{overflow-x:auto}table{border-collapse:collapse;width:100%;background:white;font-size:14px}th,td{padding:14px;text-align:left;vertical-align:top;border:1px solid #ccd2d6}code{overflow-wrap:anywhere}pre{background:#202a35;color:white;padding:20px}p{max-width:850px}
</style></head><body><main><a href="#main">Skip to content</a><p><a href="../index.html">Return to software repair examples</a></p><h1 id="main" tabindex="-1">The old request finishes last.<br>The current result stays.</h1><p><strong>Synthetic React example by Douglas Bot Works. No client work represented.</strong></p><p>The original component lets an old success or failure overwrite the current query. The repair closes each effect handler and signals cancellation during cleanup. Controlled promises exercise actual React DOM renders.</p><p><strong>${report.summary.beforeFailed} original failures; ${report.summary.afterPassed} repaired passes across ${report.summary.cases} shared cases.</strong></p><div class="table-wrap"><table><caption>Expected and observed values from the same executed scenarios</caption><thead><tr><th scope="col">Case</th><th scope="col">Expected</th><th scope="col">Original</th><th scope="col">Repair</th></tr></thead><tbody>${rows}</tbody></table></div><h2>Reproduce the evidence</h2><p><a href="report.json" download>Complete actual report</a> · <a href="source/README.md">Source instructions</a> · <a href="source/MANIFEST.json" download>Source hashes</a></p><p>Download the source directory with its structure intact. Inspect it before execution. MIT licensed; install locked dependencies from the npm registry:</p><pre><code>npm ci --ignore-scripts
node --test tests/*.test.js
node proof.js</code></pre><p>Use Node 22.22.2+, 24.15.0+ or 26+. File hashes establish consistency, not sender identity. Dependencies are installed separately.</p><h2>Scope and limits</h2><p>${escape(report.scope)}. A loader may ignore abort; cleanup still suppresses late values. Transport stops only if the loader honors the signal. React also discards unmounted state writes in the original; that case establishes the abort signal only.</p><p>React 18.3.1 development build with jsdom. No native browser, screenshots, layout, live fetch, mobile Safari or client acceptance. A client patch requires its own reproduction and agreed integration checks.</p><p>Proposed $150 pilot: one agreed JavaScript/React defect after scope review. No booking or payment enabled. AI-assisted development; no customer or earned revenue claimed.</p></main></body></html>\n`;
}
export async function buildProof(destination) {
    const report = await proof();
    const html = renderProof(report);
    const output = resolve(destination);
    await mkdir(output);
    await mkdir(join(output, 'source', 'tests'), {recursive:true});
    const files = ['BeforePanel.js','ResultPanel.js','scenarios.js','proof.js','build-proof.js','README.md','LICENSE','package.json','package-lock.json','tests/repair.test.js','tests/marketing.test.js'];
    const hashes = {};
    for (const name of files) {
        const bytes = await readFile(join(root, name));
        hashes[name] = createHash('sha256').update(bytes).digest('hex');
        await copyFile(join(root, name), join(output, 'source', name));
    }
    await writeFile(join(output, 'source', 'MANIFEST.json'), JSON.stringify({schemaVersion:1,files:hashes},null,2)+'\n');
    await writeFile(join(output, 'report.json'), JSON.stringify(report,null,2)+'\n');
    await writeFile(join(output, 'index.html'), html);
    return report;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        if (process.argv.length !== 3) throw new Error('Usage: node build-proof.js NEW_DIRECTORY');
        process.stdout.write(JSON.stringify((await buildProof(process.argv[2])).summary)+'\n');
    } catch (error) {process.stderr.write(error.message+'\n');process.exitCode=1;}
}
