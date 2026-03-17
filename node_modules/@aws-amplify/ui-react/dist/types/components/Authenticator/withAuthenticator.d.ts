import React from 'react';
import type { AuthUser } from 'aws-amplify/auth';
import type { AuthenticatorProps, SignOut } from './Authenticator';
export type WithAuthenticatorOptions = Omit<AuthenticatorProps, 'children'>;
export interface WithAuthenticatorProps {
    signOut?: SignOut;
    user?: AuthUser;
}
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/authenticator)
 */
export declare function withAuthenticator<Props = {}>(Component: React.ComponentType<Props & WithAuthenticatorProps>, options?: WithAuthenticatorOptions): (props: Props) => React.JSX.Element;
