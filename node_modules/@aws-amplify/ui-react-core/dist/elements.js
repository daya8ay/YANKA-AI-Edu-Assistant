'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function isComponent(component) {
    return typeof component === 'function';
}
function isForwardRefExoticComponent(component) {
    return (typeof component === 'object' &&
        typeof component.$$typeof ===
            'symbol' &&
        ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description));
}

/**
 * @internal @unstable
 */
const ControlsContext = React__default["default"].createContext(undefined);
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
    return React__default["default"].createElement(ControlsContext.Provider, { ...props, value: controls });
}
/**
 * @internal @unstable
 *
 * @note reference `ControlsProvider` for example usage
 */
function withControls(Default, name) {
    const Component = (props) => {
        const Override = React__default["default"].useContext(ControlsContext)?.[name];
        if (isComponent(Override)) {
            return React__default["default"].createElement(Override, { ...props });
        }
        return React__default["default"].createElement(Default, { ...props });
    };
    Component.displayName = name;
    return Component;
}

const ElementsContext = React__default["default"].createContext(undefined);
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
    return React__default["default"].createElement(ElementsContext.Provider, { ...props, value: elements });
}

/**
 * @internal @unstable
 *
 * Defines a `ElementsContext` aware `BaseElement` UI component of the
 * provided `type` with an assigned `displayName`.
 *
 * If `BaseElement` is used as a child of an `ElementsProvider`, returns the
 * `BaseElement` value of the provided `displayName` of `ElementsContext`.
 *
 * When used outside of a  parent `ElementsProvider` or no `BaseElement`
 * of `displayName` is found in the `ElementsContext`, returns a stateless,
 * unstyled HTML element of the provided `type`.
 *
 * @param {DefineBaseElementInput} input `BaseElement` parameters
 * @returns {BaseElement} `ElementsContext` aware UI component
 */
function defineBaseElement(input) {
    const { displayName, type } = input;
    const Element = ({ variant, ...props }) => {
        const Element = React__default["default"].useContext(ElementsContext)?.[displayName];
        if (Element) {
            // only pass `variant` to provided `Element` values
            return React__default["default"].createElement(Element, { ...props, variant });
        }
        return React__default["default"].createElement(type, props);
    };
    Element.displayName = displayName;
    return Element;
}
/**
 * @internal @unstable
 *
 * Defines a `ElementsContext` aware `BaseElement` UI component of the
 * provided `type` with an assigned `displayName` and element `ref`.
 *
 * If `BaseElement` is used as a child of an `ElementsProvider`, returns the
 * `BaseElement` value of the provided `displayName` of `ElementsContext`.
 *
 * When used outside of a  parent `ElementsProvider` or no `BaseElement`
 * of `displayName` is found in the `ElementsContext`, returns a stateless,
 * unstyled HTML element of the provided `type`.
 *
 * @param {DefineBaseElementInput} input `BaseElement` parameters
 * @returns {BaseElementWithRefProps} `ElementsContext` aware UI component
 */
function defineBaseElementWithRef(input) {
    const { displayName, type } = input;
    const Element = React__default["default"].forwardRef(({ variant, ...props }, ref) => {
        const Element = React__default["default"].useContext(ElementsContext)?.[displayName];
        if (Element) {
            // only pass `variant` to provided `Element` values
            return React__default["default"].createElement(Element, { ...props, ref, variant });
        }
        return React__default["default"].createElement(type, { ...props, ref });
    });
    Element.displayName = displayName;
    return Element;
}

/**
 * @internal @unstable
 *
 * Extend target `BaseElement` with `defaultProps`. `defaultProps`
 * are overidden by `props` provided to returned `BaseElement`.
 *
 * @example
 *
 * Extend `InputElement` with default `className` and `type`
 * ```tsx
 *
 * // define extended `props` on `BaseElement` interface
 * type InputElementPropKey = 'onChange' | 'type';
 *
 * // create `InputElement` base with `type` generic and extended `props` key
 * export const InputElement = defineBaseElementWithRef<"input", InputElementPropKey>({
 *   type: "input",
 *   displayName: "Input",
 * });
 *
 * // extend base `InputElement` with default input `type` of `checkbox`
 * const CheckboxElement = withBaseElementProps(Input, {
 *   className: 'submit-toggle__checkbox',
 *   type: 'checkbox',
 * });
 * ```
 *
 * @param Target `BaseElement` to extend
 * @param defaultProps `defaultProps` to apply to `Target`, accepts object or callback
 * @returns extended `BaseElement` with `defaultProps`
 */
function withBaseElementProps(Target, defaultProps) {
    const Component = React__default["default"].forwardRef((props, ref) => (React__default["default"].createElement(Target, { ...(typeof defaultProps === 'function'
            ? defaultProps(props)
            : defaultProps),
        ...props, ref: ref })));
    Component.displayName = Target.displayName;
    return Component;
}

exports.ControlsContext = ControlsContext;
exports.ControlsProvider = ControlsProvider;
exports.ElementsProvider = ElementsProvider;
exports.defineBaseElement = defineBaseElement;
exports.defineBaseElementWithRef = defineBaseElementWithRef;
exports.isComponent = isComponent;
exports.isForwardRefExoticComponent = isForwardRefExoticComponent;
exports.withBaseElementProps = withBaseElementProps;
exports.withControls = withControls;
