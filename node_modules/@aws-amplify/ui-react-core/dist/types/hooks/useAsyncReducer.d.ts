import React from 'react';
export interface AsyncReducerState<T> {
    /**
     * current value
     */
    value: T;
    hasError: boolean;
    isLoading: boolean;
    /**
     * error message, if any
     */
    message: string | undefined;
}
export type AsyncReducer<S, A> = (prevValue: S, action: A) => Promise<S>;
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
export default function useAsyncReducer<T, K>(reducer: AsyncReducer<T, K>, initialValue: T, options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}): [AsyncReducerState<T>, React.Dispatch<K>];
