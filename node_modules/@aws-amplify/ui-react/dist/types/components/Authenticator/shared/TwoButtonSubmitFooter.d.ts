import React from 'react';
import type { AuthEventTypes } from '@aws-amplify/ui';
export interface TwoButtonSubmitFooterProps {
    cancelButtonSendType: AuthEventTypes;
    cancelButtonText: string;
    submitButtonText?: React.JSX.Element;
}
export declare const TwoButtonSubmitFooter: (props: TwoButtonSubmitFooterProps) => React.JSX.Element;
