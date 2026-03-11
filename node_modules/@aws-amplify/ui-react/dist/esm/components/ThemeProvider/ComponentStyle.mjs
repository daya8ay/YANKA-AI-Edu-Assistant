import * as React from 'react';
import { createComponentCSS } from '@aws-amplify/ui';
import { Style } from './Style.mjs';

const ComponentStyle = ({ theme, componentThemes = [], ...rest }) => {
    if (!theme || !componentThemes.length) {
        return null;
    }
    const cssText = createComponentCSS({
        theme,
        components: componentThemes,
    });
    return React.createElement(Style, { ...rest, cssText: cssText });
};
ComponentStyle.displayName = 'ComponentStyle';

export { ComponentStyle };
