import * as React from 'react';
import { createGlobalCSS } from '@aws-amplify/ui';
interface GlobalStyleProps extends React.ComponentProps<'style'> {
    /**
     * Provide a server generated nonce which matches your CSP `style-src` rule.
     * This will be attached to the generated <style> tag.
     * @see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src
     */
    nonce?: string;
    styles: Parameters<typeof createGlobalCSS>[0];
}
export declare const GlobalStyle: {
    ({ styles, ...rest }: GlobalStyleProps): React.JSX.Element | null;
    displayName: string;
};
export {};
