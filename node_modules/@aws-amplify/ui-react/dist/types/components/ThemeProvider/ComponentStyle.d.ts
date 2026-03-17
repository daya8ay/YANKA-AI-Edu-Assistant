import * as React from 'react';
import type { WebTheme } from '@aws-amplify/ui';
import type { BaseComponentTheme } from '@aws-amplify/ui';
interface ComponentStyleProps extends React.ComponentProps<'style'> {
    /**
     * Provide a server generated nonce which matches your CSP `style-src` rule.
     * This will be attached to the generated <style> tag.
     * @see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src
     */
    nonce?: string;
    theme: Pick<WebTheme, 'name' | 'breakpoints' | 'tokens'>;
    componentThemes: BaseComponentTheme[];
}
export declare const ComponentStyle: {
    ({ theme, componentThemes, ...rest }: ComponentStyleProps): React.JSX.Element | null;
    displayName: string;
};
export {};
