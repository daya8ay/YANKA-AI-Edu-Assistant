import type { BaseElement, BaseElementProps, BaseElementWithRef, BaseElementWithRefProps, ElementDisplayName, ElementRefType, ReactElementProps, ReactElementType } from './types';
/**
 * @internal @unstable
 */
export interface DefineBaseElementInput<T> {
    /**
     * `BaseElement` display name in React dev tools and stack traces
     */
    displayName: ElementDisplayName;
    /**
     * base HTML `element` type
     */
    type: T;
}
/**
 * @internal @unstable
 *
 * Defines a `ElementsContext` aware `BaseElement` UI component of the
 * provided `type` with an assigned `displayName`.
 *
 * If `BaseElement` is used as a child of an `ElementsProvider`, returns the
 * `BaseElement` value of the provided `displayName` of `ElementsContext`.
 *
 * When used outside of a  parent `ElementsProvider` or no `BaseElement`
 * of `displayName` is found in the `ElementsContext`, returns a stateless,
 * unstyled HTML element of the provided `type`.
 *
 * @param {DefineBaseElementInput} input `BaseElement` parameters
 * @returns {BaseElement} `ElementsContext` aware UI component
 */
export declare function defineBaseElement<T extends ReactElementType, K extends keyof U = never, V = string, U extends ReactElementProps<T> = ReactElementProps<T>, P extends BaseElementProps<K, V, U> = BaseElementProps<K, V, U>>(input: DefineBaseElementInput<T>): BaseElement<P>;
/**
 * @internal @unstable
 *
 * Defines a `ElementsContext` aware `BaseElement` UI component of the
 * provided `type` with an assigned `displayName` and element `ref`.
 *
 * If `BaseElement` is used as a child of an `ElementsProvider`, returns the
 * `BaseElement` value of the provided `displayName` of `ElementsContext`.
 *
 * When used outside of a  parent `ElementsProvider` or no `BaseElement`
 * of `displayName` is found in the `ElementsContext`, returns a stateless,
 * unstyled HTML element of the provided `type`.
 *
 * @param {DefineBaseElementInput} input `BaseElement` parameters
 * @returns {BaseElementWithRefProps} `ElementsContext` aware UI component
 */
export declare function defineBaseElementWithRef<T extends ReactElementType, K extends keyof U = never, V = string, U extends ReactElementProps<T> = ReactElementProps<T>, P extends BaseElementWithRefProps<K, V, U> = BaseElementWithRefProps<K, V, U>>(input: DefineBaseElementInput<T>): BaseElementWithRef<P, ElementRefType<P>>;
