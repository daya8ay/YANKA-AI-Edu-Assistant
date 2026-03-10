import * as React from 'react';
import { classNames, ComponentClassName, classNameModifier } from '@aws-amplify/ui';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { View } from '../View/View.mjs';
import '../Icon/Icon.mjs';
import '../Icon/context/IconsContext.mjs';
import { useIcons } from '../Icon/context/useIcons.mjs';
import { IconUser } from '../Icon/icons/IconUser.mjs';
import { Image } from '../Image/Image.mjs';
import { Loader } from '../Loader/Loader.mjs';

const AvatarPrimitive = ({ className, children, variation, colorTheme, size, src, alt, isLoading, ...rest }, ref) => {
    const icons = useIcons('avatar');
    const icon = icons?.user ?? React.createElement(IconUser, null);
    const componentClasses = classNames(ComponentClassName.Avatar, className, classNameModifier(ComponentClassName.Avatar, variation), classNameModifier(ComponentClassName.Avatar, size), classNameModifier(ComponentClassName.Avatar, colorTheme));
    return (React.createElement(View, { as: "span", className: componentClasses, ref: ref, ...rest },
        src ? (React.createElement(Image, { className: ComponentClassName.AvatarImage, src: src, alt: alt })) : (children ?? (React.createElement(View, { as: "span", className: ComponentClassName.AvatarIcon, "aria-hidden": "true" }, icon))),
        isLoading ? (React.createElement(Loader, { className: ComponentClassName.AvatarLoader })) : null));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/avatar)
 */
const Avatar = primitiveWithForwardRef(AvatarPrimitive);
Avatar.displayName = 'Avatar';

export { Avatar };
