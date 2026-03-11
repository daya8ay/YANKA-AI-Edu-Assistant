import * as React from 'react';
import { classNames, ComponentClassName } from '@aws-amplify/ui';
import { View } from '../../View/View.mjs';

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconDocument = (props) => {
    const { className, ...rest } = props;
    return (React.createElement(View, { as: "span", width: "1em", height: "1em", className: classNames(ComponentClassName.Icon, className), ...rest },
        React.createElement("svg", { width: "24", height: "24", viewBox: "0 -960 960 960", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React.createElement("path", { d: "M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z", fill: "currentColor" }))));
};

export { IconDocument };
