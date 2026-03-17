import React__default from 'react';
import { isUndefined } from '@aws-amplify/ui';
import useHasValueUpdated from './useHasValueUpdated.mjs';

function useControlledReducer(reducer, initialState, options) {
    const { controlledState, onStateChange } = options ?? {};
    const [uncontrolledState, dispatch] = React__default.useReducer(reducer, controlledState ?? initialState);
    const controlledStateRef = React__default.useRef();
    if (!isUndefined(controlledState)) {
        controlledStateRef.current = controlledState;
    }
    const hasUncontrolledStateChanged = useHasValueUpdated(uncontrolledState, true);
    React__default.useEffect(() => {
        // only run `onStateChange` if `uncontrolledState` has changed,
        // ignore reference change to `onStateChange`
        if (hasUncontrolledStateChanged) {
            onStateChange?.(uncontrolledState);
        }
    }, [hasUncontrolledStateChanged, onStateChange, uncontrolledState]);
    const state = controlledStateRef.current
        ? controlledStateRef.current
        : uncontrolledState;
    return React__default.useMemo(() => [state, dispatch], [state]);
}

export { useControlledReducer as default };
