import * as React from 'react';
/**
 * These are syntactic sugar components that make it easy to compose children
 * in DropZone without having to expose the DropZoneContext.
 */
export type AcceptedType = (props: {
    children?: React.ReactNode;
}) => React.JSX.Element | null;
/**
 * This component renders when the user is dragging ONLY accepted files on the DropZone.
 */
export declare const Accepted: AcceptedType;
export type RejectedType = (props: {
    children?: React.ReactNode;
}) => React.JSX.Element | null;
/**
 * This component renders when the user is dragging ANY rejected files on the DropZone.
 */
export declare const Rejected: RejectedType;
export type DefaultType = (props: {
    children?: React.ReactNode;
}) => React.JSX.Element | null;
/**
 * This component renders by default when the user is not dragging.
 */
export declare const Default: DefaultType;
