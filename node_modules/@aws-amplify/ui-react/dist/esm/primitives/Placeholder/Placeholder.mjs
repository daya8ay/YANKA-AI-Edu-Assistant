import * as React from 'react';
import { classNames, ComponentClassName, classNameModifier } from '@aws-amplify/ui';
import { View } from '../View/View.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';

const CSS_VAR_START_COLOR = '--amplify-components-placeholder-start-color';
const CSS_VAR_END_COLOR = '--amplify-components-placeholder-end-color';
const PlaceholderPrimitive = ({ className, children, endColor, isLoaded, size, startColor, ...rest }, ref) => {
    if (isLoaded) {
        return React.createElement(React.Fragment, null, children);
    }
    return (React.createElement(View, { className: classNames(ComponentClassName.Placeholder, classNameModifier(ComponentClassName.Placeholder, size), className), ref: ref, style: {
            [CSS_VAR_START_COLOR]: startColor && `${startColor}`,
            [CSS_VAR_END_COLOR]: endColor && `${endColor}`,
        }, ...rest }));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/placeholder)
 */
const Placeholder = primitiveWithForwardRef(PlaceholderPrimitive);
Placeholder.displayName = 'Placeholder';

export { CSS_VAR_END_COLOR, CSS_VAR_START_COLOR, Placeholder };
