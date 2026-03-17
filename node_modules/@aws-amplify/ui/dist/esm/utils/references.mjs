import { has } from './utils.mjs';
import { OPTIONS, REFERENCE_REGEX } from '../theme/createTheme/constants.mjs';

/**
 * Checks if the value uses a value reference.
 * @param {string} value
 * @returns {boolean} - True, if the value uses a value reference
 */
function usesReference(value) {
    const regex = new RegExp(REFERENCE_REGEX);
    if (typeof value === 'string') {
        return regex.test(value);
    }
    if (typeof value === 'object') {
        let hasReference = false;
        // iterate over each property in the object,
        // if any element passes the regex test,
        // the whole thing should be true
        for (const key in value) {
            if (has(value, key)) {
                const element = value[key];
                let reference = usesReference(element);
                if (reference) {
                    hasReference = true;
                    break;
                }
            }
        }
        return hasReference;
    }
    return false;
}
function resolveReference(path, obj) {
    let ref = obj;
    if (!Array.isArray(path)) {
        return;
    }
    for (let i = 0; i < path.length; i++) {
        // Check for undefined as 0 is a valid, truthy value
        if (typeof ref[path[i]] !== 'undefined') {
            ref = ref[path[i]];
        }
        else {
            // set the reference as undefined if we don't find anything
            ref = undefined;
            break;
        }
    }
    return ref;
}
/**
 * Returns the path from a path name be splitting the name by a given separator.
 */
function getPathFromName(pathName) {
    if (typeof pathName !== 'string') {
        throw new Error('Getting path from name failed. Name must be a string');
    }
    return pathName.split(OPTIONS.separator);
}
/**
 * Returns the paths name be joining its parts with a given separator.
 */
function getName(path) {
    if (!path || !(path instanceof Array)) {
        throw new Error('Getting name for path failed. Path must be an array');
    }
    return path.join(OPTIONS.separator);
}

export { getName, getPathFromName, resolveReference, usesReference };
