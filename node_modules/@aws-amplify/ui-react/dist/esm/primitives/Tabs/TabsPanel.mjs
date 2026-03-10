import * as React from 'react';
import { classNames, ComponentClassName, classNameModifierByFlag } from '@aws-amplify/ui';
import { View } from '../View/View.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { TabsContext } from './TabsContext.mjs';
import { WHITESPACE_VALUE } from './constants.mjs';

const TabPanelPrimitive = ({ className, value, children, role = 'tabpanel', ...rest }, ref) => {
    const { activeTab, isLazy, groupId } = React.useContext(TabsContext);
    if (isLazy && activeTab !== value)
        return null;
    let idValue = value;
    if (typeof idValue === 'string') {
        idValue = idValue.replace(' ', WHITESPACE_VALUE);
    }
    return (React.createElement(View, { ...rest, role: role, id: `${groupId}-panel-${idValue}`, "aria-labelledby": `${groupId}-tab-${idValue}`, className: classNames(ComponentClassName.TabsPanel, classNameModifierByFlag(ComponentClassName.TabsPanel, 'active', activeTab === value), className), ref: ref }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/tabs)
 */
const TabPanel = primitiveWithForwardRef(TabPanelPrimitive);
TabPanel.displayName = 'Tabs.Panel';

export { TabPanel };
