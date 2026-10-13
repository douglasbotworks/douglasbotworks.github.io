import React, {act, StrictMode} from 'react';
import {JSDOM} from 'jsdom';
import {createRoot} from 'react-dom/client';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'https://synthetic.invalid/'});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function deferred() {
    let resolve, reject;
    const promise = new Promise((yes, no) => {resolve = yes; reject = no;});
    return {promise, resolve, reject};
}

async function mount(Component, strict = false) {
    const element = document.createElement('div');
    document.body.append(element);
    const root = createRoot(element);
    const requests = [];
    const load = (query, {signal}) => {
        const request = {...deferred(), query, signal};
        requests.push(request);
        return request.promise;
    };
    let mounted = true;
    const render = async (query, loader = load) => {
        await act(async () => {
            const panel = React.createElement(Component, {query, load: loader});
            root.render(strict ? React.createElement(StrictMode, null, panel) : panel);
        });
    };
    const settle = async (request, value, rejected = false) => {
        await act(async () => request[rejected ? 'reject' : 'resolve'](value));
    };
    const state = () => ({status: element.querySelector('output')?.dataset.status,
        value: element.querySelector('output')?.textContent});
    const unmount = async () => {
        if (mounted) {await act(async () => root.unmount()); mounted = false;}
    };
    const close = async () => {await unmount(); element.remove();};
    await render('old');
    return {element, requests, render, settle, state, close, unmount};
}

export const scenarios = [
    {id: 'late-success', expected: {status: 'ready', value: 'new value'}, run: async (h) => {
        await h.render('new'); await h.settle(h.requests.at(-1), 'new value');
        await h.settle(h.requests[0], 'old value'); return h.state();
    }},
    {id: 'late-error', expected: {status: 'ready', value: 'new value'}, run: async (h) => {
        await h.render('new'); await h.settle(h.requests.at(-1), 'new value');
        await h.settle(h.requests[0], new Error('old failure'), true); return h.state();
    }},
    {id: 'current-pending', expected: {status: 'loading', value: ''}, run: async (h) => {
        await h.render('new'); await h.settle(h.requests[0], 'old value'); return h.state();
    }},
    {id: 'query-change-abort', expected: true, run: async (h) => {
        await h.render('new'); return h.requests[0].signal.aborted;
    }},
    {id: 'unmount-abort', expected: true, run: async (h) => {
        await h.unmount(); return h.requests[0].signal.aborted;
    }},
    {id: 'strict-effect-cleanup', strict: true, expected: 1, run: async (h) => h.requests.length},
    {id: 'loader-replacement', expected: {status: 'ready', value: 'replacement'}, run: async (h) => {
        await h.render('old', async () => 'replacement');
        await h.settle(h.requests[0], 'old value'); return h.state();
    }},
    {id: 'current-success', expected: {status: 'ready', value: 'current'}, run: async (h) => {
        await h.settle(h.requests[0], 'current'); return h.state();
    }},
    {id: 'current-error', expected: {status: 'error', value: 'current failure'}, run: async (h) => {
        await h.settle(h.requests[0], new Error('current failure'), true); return h.state();
    }},
    {id: 'synchronous-loader-error', expected: {status: 'error', value: 'sync failure'}, run: async (h) => {
        await h.render('new', () => {throw new Error('sync failure');}); return h.state();
    }},
    {id: 'inert-result-text', expected: {value: '<img src=x onerror=alert(1)>', imageCount: 0}, run: async (h) => {
        await h.settle(h.requests[0], '<img src=x onerror=alert(1)>');
        return {value: h.state().value, imageCount: h.element.querySelectorAll('img').length};
    }},
];

export async function runScenarios(Component) {
    const results = [];
    for (const scenario of scenarios) {
        const harness = await mount(Component, scenario.strict);
        try {
            const actual = await scenario.run(harness);
            results.push({id: scenario.id, expected: scenario.expected, actual,
                passed: JSON.stringify(actual) === JSON.stringify(scenario.expected)});
        } finally {await harness.close();}
    }
    return results;
}
