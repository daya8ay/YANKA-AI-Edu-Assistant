import * as React from 'react';
import { classNames, ComponentClassName, classNameModifierByFlag, isFunction } from '@aws-amplify/ui';
import { View } from '../View/View.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { TabsContext } from './TabsContext.mjs';
import { WHITESPACE_VALUE } from './constants.mjs';

const TabsItemPrimitive = ({ className, value, children, onClick, as = 'button', role = 'tab', ...rest }, ref) => {
    const { activeTab, setActiveTab, groupId } = React.useContext(TabsContext);
    let idValue = value;
    if (typeof idValue === 'string') {
        idValue = idValue.replace(' ', WHITESPACE_VALUE);
    }
    const isActive = activeTab === value;
    const handleOnClick = (e) => {
        if (isFunction(onClick)) {
            onClick?.(e);
        }
        setActiveTab(value);
    };
    return (React.createElement(View, { ...rest, role: role, as: as, id: `${groupId}-tab-${idValue}`, "aria-selected": isActive, "aria-controls": `${groupId}-panel-${idValue}`, tabIndex: !isActive ? -1 : undefined, className: classNames(ComponentClassName.TabsItem, classNameModifierByFlag(ComponentClassName.TabsItem, 'active', activeTab === value), className), ref: ref, onClick: handleOnClick }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/tabs)
 */
const TabsItem = primitiveWithForwardRef(TabsItemPrimitive);
TabsItem.displayName = 'Tabs.Item';

export { TabsItem };
