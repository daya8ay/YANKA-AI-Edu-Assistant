import React__default from 'react';
import { View } from '../../../primitives/View/View.mjs';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { useCustomComponents } from '../hooks/useCustomComponents/useCustomComponents.mjs';

function RouteContainer({ children, className, variation = 'default', }) {
    const { route } = useAuthenticator(({ route }) => [route]);
    const { 
    // @ts-ignore
    components: { Header, Footer }, } = useCustomComponents();
    return (React__default.createElement(View, { className: className, "data-amplify-authenticator": "", "data-variation": variation },
        React__default.createElement(View, { "data-amplify-container": "" },
            React__default.createElement(Header, null),
            React__default.createElement(View, { "data-amplify-router": "", "data-amplify-router-content": undefined  }, children),
            React__default.createElement(Footer, null))));
}

export { RouteContainer };
