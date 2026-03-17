import * as React from 'react';
import type { WebTheme } from '@aws-amplify/ui';
interface ThemeStyleProps extends React.ComponentProps<'style'> {
    /**
     * Provide a server generated nonce which matches your CSP `style-src` rule.
     * This will be attached to the generated <style> tag.
     * @see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src
     */
    nonce?: string;
    theme?: WebTheme;
}
export declare const ThemeStyle: {
    ({ theme, ...rest }: ThemeStyleProps): React.JSX.Element | null;
    displayName: string;
};
export {};
