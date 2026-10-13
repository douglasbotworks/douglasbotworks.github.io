import test from 'node:test';
import assert from 'node:assert/strict';
import {proof} from '../proof.js';

test('same actual React scenarios reproduce original defect and verify replacement', async () => {
    const result = await proof();
    assert.equal(result.synthetic, true);
    assert.equal(result.summary.cases, 11);
    assert.equal(result.summary.beforeFailed, 7);
    assert.equal(result.summary.afterPassed, 11);
    assert.equal(result.verified, true);
    assert.deepEqual(result.before.map((r) => [r.id, r.expected]), result.after.map((r) => [r.id, r.expected]));
    for (const row of result.after) assert.deepEqual(row.actual, row.expected, row.id);
    for (const id of ['late-success', 'late-error', 'current-pending', 'query-change-abort',
        'unmount-abort', 'strict-effect-cleanup', 'loader-replacement']) {
        assert.equal(result.before.find((r) => r.id === id).passed, false, id);
    }
    for (const id of ['current-success', 'current-error', 'synchronous-loader-error', 'inert-result-text']) {
        assert.equal(result.before.find((r) => r.id === id).passed, true, id);
    }
});
