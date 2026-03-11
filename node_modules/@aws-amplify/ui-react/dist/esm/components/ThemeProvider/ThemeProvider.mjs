import * as React from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';
import { createTheme } from '@aws-amplify/ui';
import { ThemeContext } from './ThemeContext.mjs';
import { ThemeStyle } from './ThemeStyle.mjs';

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/theming)
 */
function ThemeProvider({ children, colorMode, direction = 'ltr', nonce, theme, }) {
    const value = React.useMemo(() => ({ theme: createTheme(theme), colorMode }), [theme, colorMode]);
    return (React.createElement(ThemeContext.Provider, { value: value },
        React.createElement(DirectionProvider, { dir: direction },
            React.createElement("div", { "data-amplify-theme": value.theme.name, "data-amplify-color-mode": colorMode, dir: direction }, children),
            theme ? React.createElement(ThemeStyle, { theme: value.theme, nonce: nonce }) : null)));
}

export { ThemeProvider };
