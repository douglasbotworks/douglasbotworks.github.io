import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {buildProof, renderProof} from '../build-proof.js';
test('marketing page preserves actual evidence, escapes markup and ships exact source', async () => {
    const scratch = await mkdtemp(join(process.cwd(), '.marketing-test-'));
    try {
        const output = join(scratch,'public');
        const report = await buildProof(output);
        assert.deepEqual(JSON.parse(await readFile(join(output,'report.json'))),report);
        const doc = new JSDOM(await readFile(join(output,'index.html'),'utf8')).window.document;
        assert.equal(doc.querySelectorAll('tbody tr').length,11);
        assert.equal(doc.querySelectorAll('img').length,0);
        assert.match(doc.body.textContent,/<img src=x onerror=alert\(1\)>/);
        assert.match(doc.body.textContent,/7 original failures; 11 repaired passes/);
        for (const [index,row] of [...doc.querySelectorAll('tbody tr')].entries()) {
            assert.equal(row.querySelector('th').textContent,report.after[index].id);
            assert.deepEqual([...row.querySelectorAll('td code')].map((c)=>JSON.parse(c.textContent)),
                [report.after[index].expected,report.before[index].actual,report.after[index].actual]);
        }
        const manifest = JSON.parse(await readFile(join(output,'source','MANIFEST.json')));
        for (const [name,hash] of Object.entries(manifest.files)) {
            const bytes = await readFile(join(output,'source',name));
            assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);
            assert.deepEqual(bytes,await readFile(join(process.cwd(),name)));
        }
        const retained = await readFile(join(output,'index.html'));
        await assert.rejects(buildProof(output),{code:'EEXIST'});
        assert.deepEqual(await readFile(join(output,'index.html')),retained);
        const wrong = structuredClone(report);wrong.before[0].id='different';
        assert.throws(()=>renderProof(wrong),/Identical cases/);
        const failed = structuredClone(report);failed.verified=false;
        assert.throws(()=>renderProof(failed),/Verified shared comparison/);
    } finally { /* Workspace fixtures retained for inspection; no recursive deletion. */ }
});
