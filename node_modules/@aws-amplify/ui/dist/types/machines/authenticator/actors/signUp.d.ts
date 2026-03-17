import type { AuthContext, AuthEvent, SignUpContext } from '../types';
export type SignUpMachineOptions = {
    services?: AuthContext['services'];
};
export declare function signUpActor({ services }: SignUpMachineOptions): import("xstate").StateMachine<SignUpContext, any, AuthEvent, {
    value: any;
    context: SignUpContext;
}, import("xstate").BaseActionObject, import("xstate").ServiceMap, import("xstate").ResolveTypegenMeta<import("xstate").TypegenDisabled, AuthEvent, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;
