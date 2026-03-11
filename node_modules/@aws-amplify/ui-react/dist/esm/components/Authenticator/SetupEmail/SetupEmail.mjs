import * as React from 'react';
import { authenticatorTextUtil } from '@aws-amplify/ui';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { Flex } from '../../../primitives/Flex/Flex.mjs';
import { Heading } from '../../../primitives/Heading/Heading.mjs';
import { useCustomComponents } from '../hooks/useCustomComponents/useCustomComponents.mjs';
import { useFormHandlers } from '../hooks/useFormHandlers/useFormHandlers.mjs';
import { ConfirmSignInFooter } from '../shared/ConfirmSignInFooter.mjs';
import { RemoteErrorMessage } from '../shared/RemoteErrorMessage.mjs';
import { FormFields } from '../shared/FormFields.mjs';
import { RouteContainer } from '../RouteContainer/RouteContainer.mjs';

const { getSetupEmailText } = authenticatorTextUtil;
const SetupEmail = ({ className, variation, }) => {
    const { isPending } = useAuthenticator((context) => [context.isPending]);
    const { handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    SetupEmail: { Header = SetupEmail.Header, Footer = SetupEmail.Footer }, }, } = useCustomComponents();
    return (React.createElement(RouteContainer, { className: className, variation: variation },
        React.createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-setup-email": "", method: "post", onChange: handleChange, onSubmit: handleSubmit },
            React.createElement(Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React.createElement(Header, null),
                React.createElement(Flex, { direction: "column" },
                    React.createElement(FormFields, null),
                    React.createElement(RemoteErrorMessage, null)),
                React.createElement(ConfirmSignInFooter, null),
                React.createElement(Footer, null)))));
};
SetupEmail.Header = function Header() {
    return React.createElement(Heading, { level: 3 }, getSetupEmailText());
};
SetupEmail.Footer = function Footer() {
    // @ts-ignore
    return null;
};

export { SetupEmail };
