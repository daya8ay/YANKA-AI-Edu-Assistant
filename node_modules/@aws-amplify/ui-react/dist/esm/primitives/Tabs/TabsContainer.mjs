import * as React from 'react';
import { isFunction, classNames, ComponentClassName } from '@aws-amplify/ui';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { View } from '../View/View.mjs';
import { TabsContext } from './TabsContext.mjs';
import { useStableId } from '../utils/useStableId.mjs';

const TabsContainerPrimitive = ({ children, defaultValue, className, value: controlledValue, onValueChange, isLazy, ...rest }, ref) => {
    const groupId = useStableId(); // groupId is used to ensure uniqueness between Tab Groups in IDs
    const isControlled = controlledValue !== undefined;
    const [localValue, setLocalValue] = React.useState(() => isControlled ? controlledValue : defaultValue);
    const activeTab = isControlled ? controlledValue : localValue ?? '';
    const setActiveTab = React.useCallback((newValue) => {
        if (isFunction(onValueChange)) {
            onValueChange(newValue);
        }
        if (!isControlled) {
            setLocalValue(newValue);
        }
    }, [onValueChange, isControlled]);
    const _value = React.useMemo(() => {
        return {
            activeTab,
            isLazy,
            setActiveTab,
            groupId,
        };
    }, [activeTab, setActiveTab, isLazy, groupId]);
    return (React.createElement(TabsContext.Provider, { value: _value },
        React.createElement(View, { ...rest, ref: ref, className: classNames(className, ComponentClassName.Tabs) }, children)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/tabs)
 */
const TabsContainer = primitiveWithForwardRef(TabsContainerPrimitive);
TabsContainer.displayName = 'Tabs.Container';

export { TabsContainer };
