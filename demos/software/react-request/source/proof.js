import {pathToFileURL} from 'node:url';
import {runScenarios} from './scenarios.js';
import {BeforePanel} from './BeforePanel.js';
import {ResultPanel} from './ResultPanel.js';

export async function proof() {
    const before = await runScenarios(BeforePanel);
    const after = await runScenarios(ResultPanel);
    return {schemaVersion: 1, synthetic: true, environment: 'React 18.3.1 development build + jsdom; Node',
        scope: 'Real component renders and controlled injected promises; no fetch, native browser, layout, customer code or integration acceptance',
        before, after, summary: {beforeFailed: before.filter((r) => !r.passed).length,
            afterPassed: after.filter((r) => r.passed).length, cases: after.length},
        verified: before.some((r) => !r.passed) && after.every((r) => r.passed)};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        if (process.argv.length !== 2) throw new Error('Usage: node proof.js');
        const report = await proof();
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
        if (!report.verified) process.exitCode = 2;
    } catch (error) {process.stderr.write(`${error.message}\n`); process.exitCode = 1;}
}
