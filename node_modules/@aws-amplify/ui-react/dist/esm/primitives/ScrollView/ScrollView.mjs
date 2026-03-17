import * as React from 'react';
import { classNames, ComponentClassName, classNameModifier } from '@aws-amplify/ui';
import { View } from '../View/View.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { useComposeRefsCallback } from '../../hooks/useComposeRefsCallback.mjs';

const ScrollViewPrimitive = ({ children, className, orientation, autoScroll, ...rest }, externalRef) => {
    const internalRef = React.useRef(null);
    const composedRefs = useComposeRefsCallback({
        externalRef,
        internalRef,
    });
    React.useEffect(() => {
        if (autoScroll) {
            internalRef.current?.scrollTo({
                top: internalRef.current?.scrollHeight,
                left: internalRef.current?.scrollWidth,
                behavior: autoScroll,
            });
        }
    }, [
        children,
        autoScroll,
    ]);
    return (React.createElement(View, { className: classNames(ComponentClassName.ScrollView, classNameModifier(ComponentClassName.ScrollView, orientation), className), ref: composedRefs, ...rest }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/scrollview)
 */
const ScrollView = primitiveWithForwardRef(ScrollViewPrimitive);
ScrollView.displayName = 'ScrollView';

export { ScrollView };
