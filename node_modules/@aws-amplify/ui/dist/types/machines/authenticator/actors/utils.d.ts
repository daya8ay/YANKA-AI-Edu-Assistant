import type { Step } from '../types';
export declare const getFederatedSignInState: (target: 'signIn' | 'signUp') => {
    entry: string[];
    invoke: {
        src: string;
        onDone: {
            target: "signIn" | "signUp";
        };
        onError: {
            actions: string;
            target: "signIn" | "signUp";
        };
    };
};
export declare const getConfirmSignInFormValuesKey: (signInStep: Step) => 'confirmation_code' | 'mfa_type' | 'email';
