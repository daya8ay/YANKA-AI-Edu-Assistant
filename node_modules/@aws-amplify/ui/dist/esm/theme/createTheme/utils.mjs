import kebabCase from 'lodash/kebabCase.js';
import '@aws-amplify/core/internals/utils';
import '../../utils/setUserAgent/constants.mjs';
import { has, isObject, isString } from '../../utils/utils.mjs';
import { usesReference } from '../../utils/references.mjs';

const CSS_VARIABLE_PREFIX = 'amplify';
/**
 * This will take an object like:
 * {paddingTop:'20px',color:'{colors.font.primary}'}
 * and turn it into a CSS string:
 * `padding-top:20px; color: var(--colors-font-primary);`
 */
function propsToString(props) {
    return Object.entries(props)
        .map(([key, value]) => {
        const _value = isDesignToken(value)
            ? value.toString()
            : // @ts-ignore
                cssValue({ value });
        return `${kebabCase(key)}:${_value}; `;
    })
        .join(' ');
}
function cssNameTransform({ path = [] }) {
    return `${kebabCase([CSS_VARIABLE_PREFIX, ...path].join(' '))}`;
}
// Important: these properties should not be altered in
// order to maintain the expected order of the CSS `box-shadow` property
const SHADOW_PROPERTIES = [
    'offsetX',
    'offsetY',
    'blurRadius',
    'spreadRadius',
    'color',
];
/**
 * Will take a design token in a theme and return its value as CSS
 *
 * @param token
 * @returns
 */
function cssValue(token) {
    const { value } = token;
    if (isString(value)) {
        return referenceValue(value);
    }
    if (isShadowTokenObject(value)) {
        return SHADOW_PROPERTIES.map((property) => {
            return referenceValue(
            // lookup property against `token` first for custom non-nested value, then lookup
            // property against `value` for design token value
            isShadowTokenObject(token) ? token[property] : value[property]);
        }).join(' ');
    }
    return value;
}
/**
 * Helper function to test if something is a design token or not.
 * Used in the React component style props.
 *
 * @param value - thing to test if it is a design token or not
 * @returns boolean
 */
function isDesignToken(value) {
    return isObject(value) && has(value, 'value');
}
function isShadowTokenObject(value) {
    return isObject(value) && has(value, 'offsetX');
}
/**
 * Function that sees if a string contains a design token reference
 * and if so will turn that into a CSS variable.
 *
 * @param {string} value
 * @returns string
 */
function referenceValue(value) {
    if (!value)
        return '';
    if (usesReference(value)) {
        const path = value.replace(/\{|\}/g, '').replace('.value', '').split('.');
        return `var(--${cssNameTransform({ path })})`;
    }
    return value;
}
/**
 * This will take a design token and add some data to it for it
 * to be used in JS/CSS. It will create its CSS var name and update
 * the value to use a CSS var if it is a reference. It will also
 * add a `.toString()` method to make it easier to use in JS.
 *
 * We should see if there is a way to share this logic with style dictionary...
 */
const setupToken = ({ token, path }) => {
    const name = `--${cssNameTransform({ path })}`;
    const { value: original } = token;
    const value = cssValue(token);
    return { name, original, path, value, toString: () => `var(${name})` };
};
/**
 * Recursive function that will walk down the token object
 * and perform the setupToken function on each token.
 * Similar to what Style Dictionary does.
 */
function setupTokens({ tokens, path = [], setupToken, }) {
    if (has(tokens, 'value')) {
        return setupToken({ token: tokens, path });
    }
    const output = {};
    for (const name in tokens) {
        if (has(tokens, name)) {
            const value = tokens[name];
            const nextTokens = isObject(value) ? value : { value };
            output[name] = setupTokens({
                tokens: nextTokens,
                path: path.concat(name),
                setupToken,
            });
        }
    }
    return output;
}
// Internal Style Dictionary methods
// copied from amzn/style-dictionary with the owner's permission
/**
 * Takes an plain javascript object and will make a flat array of all the leaf nodes.
 * A leaf node in this context has a 'value' property. Potentially refactor this to
 * be more generic.
 * @private
 * @param  {Object} properties - The plain object you want flattened into an array.
 * @param  {Array} [to_ret=[]] - Properties array. This function is recursive therefore this is what gets passed along.
 * @return {Array}
 */
function flattenProperties(properties, to_ret) {
    to_ret = to_ret || [];
    for (var name in properties) {
        if (has(properties, name)) {
            if (isObject(properties[name]) && 'value' in properties[name]) {
                to_ret.push(properties[name]);
            }
            else if (isObject(properties[name])) {
                flattenProperties(properties[name], to_ret);
            }
        }
    }
    return to_ret;
}
/**
 * Performs an deep extend on the objects, from right to left.
 * @private
 * @param {Object[]} objects - An array of JS objects
 * @param {Function} collision - A function to be called when a merge collision happens.
 * @param {string[]} path - (for internal use) An array of strings which is the current path down the object when this is called recursively.
 * @returns {Object}
 */
function deepExtend(objects, collision, path) {
    if (objects == null)
        return {};
    var src, copyIsArray, copy, name, options, clone, target = objects[0] || {}, i = 1, length = objects.length;
    path = path || [];
    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object') {
        target = {};
    }
    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = objects[i]) != null) {
            // Extend the base object
            for (name in options) {
                if (!has(options, name))
                    continue;
                if (name === '__proto__')
                    continue;
                src = target[name];
                copy = options[name];
                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging plain objects or arrays
                if (copy && (isObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    }
                    else {
                        clone = src && isObject(src) ? src : {};
                    }
                    var nextPath = path.slice(0);
                    nextPath.push(name);
                    // Never move original objects, clone them
                    target[name] = deepExtend([clone, copy], collision, nextPath);
                    // Don't bring in undefined values
                }
                else if (copy !== undefined) {
                    if (src != null && typeof collision == 'function') {
                        collision({ target: target, copy: options, path: path, key: name });
                    }
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

export { CSS_VARIABLE_PREFIX, cssNameTransform, cssValue, deepExtend, flattenProperties, isDesignToken, isShadowTokenObject, propsToString, referenceValue, setupToken, setupTokens };
