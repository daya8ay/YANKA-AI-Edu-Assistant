import * as React from 'react';
interface StyleProps extends React.ComponentProps<'style'> {
    cssText?: string;
}
export declare const Style: {
    ({ cssText, ...rest }: StyleProps): React.JSX.Element | null;
    displayName: string;
};
export {};
