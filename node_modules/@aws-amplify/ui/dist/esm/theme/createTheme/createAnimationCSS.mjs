import '@aws-amplify/core/internals/utils';
import '../../utils/setUserAgent/constants.mjs';
import { isFunction } from '../../utils/utils.mjs';
import { propsToString } from './utils.mjs';

function createAnimationCSS({ animations, tokens, }) {
    let cssText = '';
    Object.entries(animations).forEach(([key, value]) => {
        cssText += `\n  @keyframes ${key} {`;
        Object.entries(value).forEach(([step, properties]) => {
            cssText += `\n    ${step} {\n`;
            const animationProperties = isFunction(properties)
                ? properties(tokens)
                : properties;
            cssText += propsToString(animationProperties);
            cssText += `\n    }`;
        });
        cssText += `\n  }`;
    });
    return cssText;
}

export { createAnimationCSS };
