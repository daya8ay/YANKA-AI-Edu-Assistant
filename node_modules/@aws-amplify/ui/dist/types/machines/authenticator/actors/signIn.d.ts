import type { AuthEvent, SignInContext, AuthContext } from '../types';
export interface SignInMachineOptions {
    services?: AuthContext['services'];
}
export declare function signInActor({ services }: SignInMachineOptions): import("xstate").StateMachine<SignInContext, any, AuthEvent, {
    value: any;
    context: SignInContext;
}, import("xstate").BaseActionObject, import("xstate").ServiceMap, import("xstate").ResolveTypegenMeta<import("xstate").TypegenDisabled, AuthEvent, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;
