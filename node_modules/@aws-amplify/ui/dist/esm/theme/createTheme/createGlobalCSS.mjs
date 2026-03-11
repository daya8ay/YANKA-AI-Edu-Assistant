import { recursiveComponentCSS } from './createComponentCSS.mjs';

function createGlobalCSS(css) {
    let cssText = ``;
    for (const [selector, styles] of Object.entries(css)) {
        cssText += recursiveComponentCSS(selector, styles);
    }
    return cssText;
}

export { createGlobalCSS };
