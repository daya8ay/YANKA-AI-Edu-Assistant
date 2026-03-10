import * as React from 'react';
import { authenticatorTextUtil } from '@aws-amplify/ui';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { Flex } from '../../../primitives/Flex/Flex.mjs';
import { Heading } from '../../../primitives/Heading/Heading.mjs';
import { RadioGroupField } from '../../../primitives/RadioGroupField/RadioGroupField.mjs';
import { Radio } from '../../../primitives/Radio/Radio.mjs';
import { useCustomComponents } from '../hooks/useCustomComponents/useCustomComponents.mjs';
import { useFormHandlers } from '../hooks/useFormHandlers/useFormHandlers.mjs';
import { ConfirmSignInFooter } from '../shared/ConfirmSignInFooter.mjs';
import { RemoteErrorMessage } from '../shared/RemoteErrorMessage.mjs';
import { RouteContainer } from '../RouteContainer/RouteContainer.mjs';

const { getMfaTypeLabelByValue, getSelectMfaTypeByChallengeName, getSelectMfaTypeText, } = authenticatorTextUtil;
const SelectMfaType = ({ className, variation, }) => {
    const { isPending, allowedMfaTypes = [] } = useAuthenticator((context) => {
        return [context.isPending, context.allowedMfaTypes];
    });
    const { handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    SelectMfaType: { Header = SelectMfaType.Header, Footer = SelectMfaType.Footer, }, }, } = useCustomComponents();
    return (React.createElement(RouteContainer, { className: className, variation: variation },
        React.createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-select-mfa-type": "", method: "post", onChange: handleChange, onSubmit: handleSubmit },
            React.createElement(Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React.createElement(Header, null),
                React.createElement(Flex, { direction: "column" },
                    React.createElement(RadioGroupField, { name: "mfa_type", legend: getSelectMfaTypeText(), legendHidden: true, isDisabled: isPending, isRequired: true }, allowedMfaTypes.map((value, index) => (React.createElement(Radio, { name: "mfa_type", key: value, value: value, defaultChecked: index === 0 }, getMfaTypeLabelByValue(value))))),
                    React.createElement(RemoteErrorMessage, null)),
                React.createElement(ConfirmSignInFooter, null),
                React.createElement(Footer, null)))));
};
SelectMfaType.Header = function Header() {
    const { challengeName } = useAuthenticator((context) => {
        return [context.challengeName];
    });
    return (React.createElement(Heading, { level: 3 }, getSelectMfaTypeByChallengeName(challengeName)));
};
SelectMfaType.Footer = function Footer() {
    // @ts-ignore
    return null;
};

export { SelectMfaType };
