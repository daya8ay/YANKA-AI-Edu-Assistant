import * as React from 'react';
import type { WebTheme } from '@aws-amplify/ui';
import type { ColorMode } from './ThemeProvider';
export interface ThemeContextType {
    theme: WebTheme;
    colorMode?: ColorMode;
}
export declare const ThemeContext: React.Context<ThemeContextType>;
