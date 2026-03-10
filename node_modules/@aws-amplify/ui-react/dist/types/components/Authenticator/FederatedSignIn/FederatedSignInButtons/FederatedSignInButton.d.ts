import React from 'react';
import type { FederatedIdentityProviders, SocialProvider } from '@aws-amplify/ui';
export interface FederatedSignInButtonProps {
    icon?: SocialProvider;
    provider: FederatedIdentityProviders;
    text: string;
}
export declare const FederatedSignInButton: (props: FederatedSignInButtonProps) => React.JSX.Element;
