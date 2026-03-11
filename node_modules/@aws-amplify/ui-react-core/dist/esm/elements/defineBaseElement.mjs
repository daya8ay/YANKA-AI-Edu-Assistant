import React__default from 'react';
import { ElementsContext } from './ElementsContext.mjs';

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
function defineBaseElement(input) {
    const { displayName, type } = input;
    const Element = ({ variant, ...props }) => {
        const Element = React__default.useContext(ElementsContext)?.[displayName];
        if (Element) {
            // only pass `variant` to provided `Element` values
            return React__default.createElement(Element, { ...props, variant });
        }
        return React__default.createElement(type, props);
    };
    Element.displayName = displayName;
    return Element;
}
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
function defineBaseElementWithRef(input) {
    const { displayName, type } = input;
    const Element = React__default.forwardRef(({ variant, ...props }, ref) => {
        const Element = React__default.useContext(ElementsContext)?.[displayName];
        if (Element) {
            // only pass `variant` to provided `Element` values
            return React__default.createElement(Element, { ...props, ref, variant });
        }
        return React__default.createElement(type, { ...props, ref });
    });
    Element.displayName = displayName;
    return Element;
}

export { defineBaseElement, defineBaseElementWithRef };
