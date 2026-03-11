import * as React from 'react';
import { createGlobalCSS } from '@aws-amplify/ui';
import { Style } from './Style.mjs';

const GlobalStyle = ({ styles, ...rest }) => {
    if (!styles) {
        return null;
    }
    const cssText = createGlobalCSS(styles);
    return React.createElement(Style, { ...rest, cssText: cssText });
};
GlobalStyle.displayName = 'GlobalStyle';

export { GlobalStyle };
