import '@aws-amplify/core/internals/utils';
import '../../utils/setUserAgent/constants.mjs';
import { isString, isObject } from '../../utils/utils.mjs';
import { classNames } from '../../utils/classNames.mjs';

function createComponentClasses({ name, prefix = 'amplify-' }) {
    const className = (props = {}, extraClassnames = []) => {
        const baseComponentClassName = `${prefix}${name}`;
        // get the element if there is one
        // the _element argument can be a string
        // like { _element: 'icon' }
        // or it could be an object where the key is
        // the element name and the value is the modifiers
        // like { _element: { icon: [size] } }
        const element = isString(props._element)
            ? props._element
            : isObject(props._element)
                ? Object.keys(props._element)[0]
                : undefined;
        const className = element
            ? `${baseComponentClassName}__${element}`
            : baseComponentClassName;
        const names = [className];
        if (element) {
            const modifiers = props._element[element];
            names.push(...modifierClassnames({ className, modifiers }));
        }
        else {
            names.push(...modifierClassnames({
                className,
                modifiers: props._modifiers,
            }));
        }
        return classNames([...names, ...extraClassnames]);
    };
    return className;
}
function modifierClassnames({ className, modifiers, }) {
    if (Array.isArray(modifiers)) {
        return modifiers.map((modifier) => {
            if (!modifier || !isString(modifier)) {
                return;
            }
            return `${className}--${modifier}`;
        });
    }
    if (isObject(modifiers)) {
        return Object.entries(modifiers).map(([key, value]) => {
            if (value) {
                return `${className}--${key}`;
            }
        });
    }
    if (isString(modifiers)) {
        return [`${className}--${modifiers}`];
    }
    return [];
}

export { createComponentClasses };
