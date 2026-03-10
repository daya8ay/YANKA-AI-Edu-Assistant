import React__default from 'react';
import { isFunction } from '@aws-amplify/ui';

// async state constants
const INITIAL = { hasError: false, isLoading: false, message: undefined };
const LOADING = { hasError: false, isLoading: true, message: undefined };
const ERROR = { hasError: true, isLoading: false };
/**
 * @internal may be updated in future versions
 *
 * @description like `useReducer` but make it async
 *
 * @example
 * ```ts
 * import fetchData from './fetchData';
 *
 * type MyState = { data: string[] | undefined }
 * const initialState: MyState = { data: undefined }
 *
 * type MyAction = { type: 'fetch' | 'clear' }
 *
 * const asyncReducer = async (state: MyState, action: MyAction): Promise<MyState> => {
 *   switch(action.type) {
 *     case 'fetch':
 *       const data = await fetchData();
 *       return { data: state.data ? state.data.concat(data) : data }
 *     case 'clear':
 *       return { data: undefined }
 *   }
 * }
 *
 * const FetchDataButton = () => {
 *   const [state, dispatch] = useAsyncReducer(asyncReducer, initialState);
 *
 *   const { value: { data }, isLoading } = state;
 *
 *   return (
 *     <button onClick={() => isLoading ? null : dispatch({ type: 'fetch'})}>
 *       Fetch Data
 *     </button>
 *   )
 * }
 * ```
 */
function useAsyncReducer(reducer, initialValue, options) {
    const [state, setAsyncState] = React__default.useState(() => ({
        ...INITIAL,
        value: initialValue,
    }));
    const prevValue = React__default.useRef(initialValue);
    const pendingId = React__default.useRef();
    const { onSuccess, onError } = options ?? {};
    const dispatch = React__default.useCallback((input) => {
        const id = Symbol();
        pendingId.current = id;
        setAsyncState(({ value }) => ({ ...LOADING, value }));
        reducer(prevValue.current, input)
            .then((value) => {
            if (pendingId.current !== id)
                return;
            prevValue.current = value;
            if (isFunction(onSuccess))
                onSuccess(value);
            setAsyncState({ ...INITIAL, value });
        })
            .catch((error) => {
            if (pendingId.current !== id)
                return;
            if (isFunction(onError))
                onError(error);
            const { message } = error;
            setAsyncState(({ value }) => ({ ...ERROR, value, message }));
        });
    }, [onError, onSuccess, reducer]);
    return [state, dispatch];
}

export { useAsyncReducer as default };
