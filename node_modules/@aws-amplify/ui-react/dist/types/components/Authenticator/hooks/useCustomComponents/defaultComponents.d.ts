interface Components {
    Footer?: () => React.JSX.Element | null;
    FormFields?: () => React.JSX.Element | null;
    Header?: () => React.JSX.Element | null;
}
export interface DefaultComponents extends Omit<Components, 'FormFields'> {
    ConfirmSignIn?: Omit<Components, 'FormFields'>;
    ConfirmSignUp?: Omit<Components, 'FormFields'>;
    ConfirmResetPassword?: Omit<Components, 'FormFields'>;
    ConfirmVerifyUser?: Omit<Components, 'FormFields'>;
    ForceNewPassword?: Components;
    ForgotPassword?: Omit<Components, 'FormFields'>;
    SelectMfaType?: Omit<Components, 'FormFields'>;
    SetupEmail?: Omit<Components, 'FormFields'>;
    SetupTotp?: Omit<Components, 'FormFields'>;
    SignIn?: Omit<Components, 'FormFields'>;
    SignUp?: Components;
    VerifyUser?: Omit<Components, 'FormFields'>;
}
export declare const defaultComponents: DefaultComponents;
export {};
