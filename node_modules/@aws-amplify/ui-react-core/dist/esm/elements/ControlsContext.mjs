import React__default from 'react';
import { isComponent } from './utils.mjs';

/**
 * @internal @unstable
 */
const ControlsContext = React__default.createContext(undefined);
/**
 * @internal @unstable
 *
 * `ControlsProvider` provides the values contained in `ControlsContext`
 * to consumers. `ControlsContext` lookup is handled directly
 * by `Control` components returned by `withControls`.
 *
 * @example
 *
 * Add `ControlsContext` aware `Controls` components to a Connected
 * Component:
 *
 * ```tsx
 *  const DataList = withControls(function DataList<T>(data: T[]) {
 *    return <ScrollView>data.map(ListItem)</ScrollView>;
 *  }, 'DataList');
 *
 *  const DataListControl = () => {
 *    const data = useData();
 *    return <DataList data={data} />;
 *  }
 *
 *  interface ComponentControls {
 *    DataList: typeof DataListControl;
 *  }
 *
 *  function Component<T extends ComponentControls>(
 *    controls?: T
 *  ) {
 *    function ConnectedComponent({
 *      children,
 *    }: { children?: React.ReactNode }) {
 *      return (
 *        <ControlsProvider controls={controls}>
 *          {children}
 *        </ControlsProvider>
 *      );
 *    }
 *
 *    return ConnectedComponent;
 *  }
 * ```
 */
function ControlsProvider({ controls, ...props }) {
    return React__default.createElement(ControlsContext.Provider, { ...props, value: controls });
}
/**
 * @internal @unstable
 *
 * @note reference `ControlsProvider` for example usage
 */
function withControls(Default, name) {
    const Component = (props) => {
        const Override = React__default.useContext(ControlsContext)?.[name];
        if (isComponent(Override)) {
            return React__default.createElement(Override, { ...props });
        }
        return React__default.createElement(Default, { ...props });
    };
    Component.displayName = name;
    return Component;
}

export { ControlsContext, ControlsProvider, withControls };
