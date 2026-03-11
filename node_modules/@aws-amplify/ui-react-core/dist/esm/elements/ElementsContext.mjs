import React__default from 'react';

const ElementsContext = React__default.createContext(undefined);
/**
 * @internal @unstable
 *
 * `ElementsProvider` provides the values contained in `ElementsContext`
 * to its `children`. `ElementsContext` lookup is handled directly
 * by `BaseElement`components returned by `defineBaseElement` and
 * `defineBaseElementWithRef`.
 *
 * @example
 *
 * Add `ElementsContext` aware `BaseElement` components to a Connected
 * Component
 *
 * ```tsx
 * // `BaseElement`, renders custom or default element defintion
 * const ViewElement = defineBaseElementWithRef({
 *   displayName: "View",
 *   type: "div",
 * });
 *
 * // `BaseElement` components to be provided through `ElementsContext`
 * interface ConnectedComponentElements {
 *   View: typeof ViewElement;
 * }
 *
 * function createConnectedComponent<T extends ConnectedComponentElements>(
 *   elements?: T
 * ) {
 *   const Provider = ({ children }: { children?: React.ReactNode }) => (
 *     <ElementsProvider elements={elements}>
 *       <Children />
 *     </ElementsProvider>
 *   );
 *
 *   function ConnectedComponent() {
 *     return (
 *       <Provider>
 *         <ConnectedComponentContent />
 *       </Provider>
 *     );
 *   }
 *
 *   ConnectedComponent.Provider = Provider;
 *
 *   return ConnectedComponent;
 * }
 * ```
 */
function ElementsProvider({ elements, ...props }) {
    return React__default.createElement(ElementsContext.Provider, { ...props, value: elements });
}

export { ElementsContext, ElementsProvider };
