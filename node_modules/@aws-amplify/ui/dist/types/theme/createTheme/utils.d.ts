import type { WebDesignToken } from '../types';
import type { ShadowValue } from '../tokens/types/designToken';
import type { CSSProperties } from '../components/utils';
export declare const CSS_VARIABLE_PREFIX = "amplify";
interface NameTransformProps {
    path?: Array<string>;
}
/**
 * This will take an object like:
 * {paddingTop:'20px',color:'{colors.font.primary}'}
 * and turn it into a CSS string:
 * `padding-top:20px; color: var(--colors-font-primary);`
 */
export declare function propsToString(props: CSSProperties): string;
export declare function cssNameTransform({ path }: NameTransformProps): string;
type BaseDesignToken = {
    value: string | number;
};
/**
 * Will take a design token in a theme and return its value as CSS
 *
 * @param token
 * @returns
 */
export declare function cssValue(token: BaseDesignToken): string | number;
/**
 * Helper function to test if something is a design token or not.
 * Used in the React component style props.
 *
 * @param value - thing to test if it is a design token or not
 * @returns boolean
 */
export declare function isDesignToken(value: unknown): value is WebDesignToken;
export declare function isShadowTokenObject(value: unknown): value is ShadowValue & object;
/**
 * Function that sees if a string contains a design token reference
 * and if so will turn that into a CSS variable.
 *
 * @param {string} value
 * @returns string
 */
export declare function referenceValue(value?: string): string;
export type SetupToken<ReturnType = any> = (args: {
    token: BaseDesignToken;
    path: Array<string>;
}) => ReturnType;
/**
 * This will take a design token and add some data to it for it
 * to be used in JS/CSS. It will create its CSS var name and update
 * the value to use a CSS var if it is a reference. It will also
 * add a `.toString()` method to make it easier to use in JS.
 *
 * We should see if there is a way to share this logic with style dictionary...
 */
export declare const setupToken: SetupToken<WebDesignToken>;
type SetupTokensProps = {
    tokens?: Record<string | number, any>;
    path?: Array<string>;
    setupToken: SetupToken;
};
/**
 * Recursive function that will walk down the token object
 * and perform the setupToken function on each token.
 * Similar to what Style Dictionary does.
 */
export declare function setupTokens({ tokens, path, setupToken, }: SetupTokensProps): Record<string, any>;
/**
 * Takes an plain javascript object and will make a flat array of all the leaf nodes.
 * A leaf node in this context has a 'value' property. Potentially refactor this to
 * be more generic.
 * @private
 * @param  {Object} properties - The plain object you want flattened into an array.
 * @param  {Array} [to_ret=[]] - Properties array. This function is recursive therefore this is what gets passed along.
 * @return {Array}
 */
export declare function flattenProperties(properties: object, to_ret?: object[]): object[];
/**
 * Performs an deep extend on the objects, from right to left.
 * @private
 * @param {Object[]} objects - An array of JS objects
 * @param {Function} collision - A function to be called when a merge collision happens.
 * @param {string[]} path - (for internal use) An array of strings which is the current path down the object when this is called recursively.
 * @returns {Object}
 */
export declare function deepExtend<T>(objects?: (object | undefined)[], collision?: Function, path?: string[]): T;
export {};
