import * as React from 'react';
import type { FormFieldOptions } from '@aws-amplify/ui';
export interface FormFieldProps extends Omit<FormFieldOptions, 'label'> {
    label: string;
    name: string;
}
export declare function FormField({ autocomplete: autoComplete, dialCode, name, type, ...props }: FormFieldProps): React.JSX.Element;
