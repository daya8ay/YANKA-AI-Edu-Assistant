import * as React from 'react';
import { classNames, ComponentClassName } from '@aws-amplify/ui';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { MenuButton } from './MenuButton.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';

const MENU_ITEM_TEST_ID = 'amplify-menu-item-test-id';
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/menu)
 */
const MenuItemPrimitive = ({ children, className, ...rest }, ref) => {
    return (React.createElement(DropdownMenuItem, { asChild: true, ref: ref },
        React.createElement(MenuButton, { className: classNames(ComponentClassName.MenuItem, className), testId: MENU_ITEM_TEST_ID, ...rest, variation: "menu" // ensures `menu` variation is not overwritten
         }, children)));
};
const MenuItem = primitiveWithForwardRef(MenuItemPrimitive);
MenuItem.displayName = 'MenuItem';

export { MENU_ITEM_TEST_ID, MenuItem };
