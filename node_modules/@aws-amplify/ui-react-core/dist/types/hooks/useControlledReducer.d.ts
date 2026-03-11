import React from 'react';
export default function useControlledReducer<R extends React.Reducer<any, any>, S extends React.ReducerState<R>>(reducer: R, initialState: S, options?: {
    controlledState?: S;
    onStateChange?: (state: S) => void;
}): [S, React.Dispatch<React.ReducerAction<R>>];
