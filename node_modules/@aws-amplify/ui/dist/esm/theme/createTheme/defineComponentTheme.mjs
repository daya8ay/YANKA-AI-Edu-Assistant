import { createComponentCSS } from './createComponentCSS.mjs';
import { createComponentClasses } from './createComponentClasses.mjs';

/**
 * Use this to create the theme of a component. You can use this
 * to both completely customize built-in components and
 * build your own components!
 *
 *
 * ```ts
 * // built-in component styling
 * const alertTheme = defineComponentTheme({
 *   name: 'alert',
 *   theme: (tokens) => {
 *     return {
 *       padding: tokens.space.large
 *     }
 *   }
 * });
 *
 * // custom component styling
 * const avatarTheme = defineComponentTheme({
 *   name: 'avatar',
 *   theme: (tokens) => {
 *     return {
 *       padding: tokens.space.large
 *     }
 *   }
 * })
 *
 * const theme = createTheme({
 *   name: 'my-theme',
 *   components: [alertTheme, avatarTheme]
 * })
 * ```
 *
 * @param {Object} params
 * @param {string} params.name  - The name of the component. Use a built-in component name like button to theme buttons.
 * @returns
 */
function defineComponentTheme({ name, theme, overrides, }) {
    const prefix = 'amplify-';
    const className = createComponentClasses({
        name,
        prefix,
    });
    const cssText = (props) => {
        return createComponentCSS({
            theme: props.theme,
            components: [{ name, theme }],
        });
    };
    return {
        className,
        theme,
        overrides,
        name,
        cssText,
    };
}

export { defineComponentTheme };
