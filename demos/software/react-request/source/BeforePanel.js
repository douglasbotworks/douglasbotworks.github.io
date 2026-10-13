import React, {useEffect, useState} from 'react';

// Deliberately defective fictional reproduction: no effect cleanup or stale-response guard.
export function BeforePanel({query, load}) {
    const [state, setState] = useState({status: 'idle', value: ''});
    useEffect(() => {
        setState({status: 'loading', value: ''});
        Promise.resolve().then(() => load(query, {signal: new AbortController().signal})).then(
            (value) => setState({status: 'ready', value: String(value)}),
            (error) => setState({status: 'error', value: error instanceof Error ? error.message : 'Request failed'}),
        );
    }, [query, load]);
    return React.createElement('output', {'data-status': state.status, 'aria-live': 'polite'}, state.value);
}
