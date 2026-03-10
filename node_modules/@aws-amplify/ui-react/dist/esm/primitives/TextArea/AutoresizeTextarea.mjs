import * as React from 'react';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { TextArea } from './TextArea.mjs';
import { useAutoresizeTextArea } from './useAutoresizeTextarea.mjs';
import { useComposeRefsCallback } from '../../hooks/useComposeRefsCallback.mjs';

const AutoresizeTextAreaPrimitive = ({ value, ...rest }, externalRef) => {
    const internalRef = React.useRef(null);
    useAutoresizeTextArea(internalRef.current, value);
    const composedRef = useComposeRefsCallback({
        externalRef,
        internalRef,
    });
    return React.createElement(TextArea, { ...rest, ref: composedRef, value: value });
};
const AutoresizeTextArea = primitiveWithForwardRef(AutoresizeTextAreaPrimitive);
AutoresizeTextArea.displayName = 'AutoresizeTextArea';

export { AutoresizeTextArea };
