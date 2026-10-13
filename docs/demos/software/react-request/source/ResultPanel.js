import React, {useEffect, useState} from 'react';

export function ResultPanel({query, load}) {
    const [state, setState] = useState({status: 'idle', value: ''});
    useEffect(() => {
        let active = true;
        const controller = new AbortController();
        setState({status: 'loading', value: ''});
        // A microtask also converts a synchronous loader throw into the error path.
        Promise.resolve().then(() => {
            if (!active) return undefined;
            return load(query, {signal: controller.signal});
        }).then((value) => {
            if (active) setState({status: 'ready', value: String(value)});
        }, (error) => {
            if (active) setState({status: 'error', value: error instanceof Error ? error.message : 'Request failed'});
        });
        return () => {
            active = false;
            controller.abort();
        };
    }, [query, load]);
    return React.createElement('output', {'data-status': state.status, 'aria-live': 'polite'}, state.value);
}
