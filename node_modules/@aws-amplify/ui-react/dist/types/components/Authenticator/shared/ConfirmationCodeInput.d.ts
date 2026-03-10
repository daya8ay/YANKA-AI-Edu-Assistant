import React from 'react';
export interface ConfirmationCodeInputProps {
    errorText?: string;
    labelHidden?: boolean;
    label?: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
}
export declare const ConfirmationCodeInput: (props: ConfirmationCodeInputProps) => React.JSX.Element;
