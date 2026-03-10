import * as React from 'react';
import { Style } from './Style.mjs';

const ThemeStyle = ({ theme, ...rest }) => {
    if (!theme)
        return null;
    const { name, cssText } = theme;
    return React.createElement(Style, { ...rest, cssText: cssText, id: `amplify-theme-${name}` });
};
ThemeStyle.displayName = 'ThemeStyle';

export { ThemeStyle };
