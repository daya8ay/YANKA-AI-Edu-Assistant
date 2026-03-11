import * as React from 'react';
type DragState = 'accept' | 'reject' | 'inactive';
declare const DropZoneContext: React.Context<DragState>;
declare const DropZoneProvider: ({ value, children, }: {
    value: DragState;
    children?: React.ReactNode;
}) => React.JSX.Element;
export { DropZoneProvider, DropZoneContext };
