'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var react = require('@xstate/react');
var auth = require('aws-amplify/auth');
var ui = require('@aws-amplify/ui');
var reactHookForm = require('react-hook-form');
var storage = require('aws-amplify/storage');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

/**
 * AuthenticatorContext serves static reference to the auth machine service.
 *
 * https://xstate.js.org/docs/recipes/react.html#context-provider
 */
const AuthenticatorContext = React__namespace["default"].createContext(null);

const createHubHandler = (options) => (data, service) => {
    ui.defaultAuthHubHandler(data, service, options);
};
function AuthenticatorProvider({ children, }) {
    // `authStatus` is exposed by `useAuthenticator` but should not be derived directly from the
    // state machine as the machine only updates on `Authenticator` initiated events, which
    // leads to scenarios where the state machine `authStatus` gets "stuck". For exmample,
    // if a user was to sign in using `Auth.signIn` directly rather than using `Authenticator`
    const [authStatus, setAuthStatus] = React__namespace["default"].useState('configuring');
    // only run on first render
    React__namespace["default"].useEffect(() => {
        auth.getCurrentUser()
            .then(() => {
            setAuthStatus('authenticated');
        })
            .catch(() => {
            setAuthStatus('unauthenticated');
        });
    }, []);
    /**
     * Based on use cases, developer might already have added another Provider
     * outside Authenticator. In that case, we sync the two providers by just
     * passing the parent value.
     *
     * TODO(BREAKING): enforce only one provider in App tree
     */
    const parentProviderVal = React.useContext(AuthenticatorContext);
    const service = react.useInterpret(ui.createAuthenticatorMachine);
    const value = React.useMemo(() => (!parentProviderVal ? { authStatus, service } : parentProviderVal), [authStatus, parentProviderVal, service]);
    const { service: activeService } = value;
    React.useEffect(() => {
        const onSignIn = () => {
            setAuthStatus('authenticated');
        };
        const onSignOut = () => {
            setAuthStatus('unauthenticated');
        };
        const unsubscribe = ui.listenToAuthHub(activeService, createHubHandler({ onSignIn, onSignOut }));
        return unsubscribe;
    }, [activeService]);
    return (React__namespace["default"].createElement(AuthenticatorContext.Provider, { value: value }, children));
}

const USE_AUTHENTICATOR_ERROR = '`useAuthenticator` must be used inside an `Authenticator.Provider`.';

const COMPONENT_ROUTE_KEYS = [
    'confirmResetPassword',
    'confirmSignIn',
    'confirmSignUp',
    'confirmVerifyUser',
    'forceNewPassword',
    'forgotPassword',
    'selectMfaType',
    'setupEmail',
    'setupTotp',
    'signIn',
    'signUp',
    'verifyUser',
];
const COMPONENT_ROUTE_NAMES = [
    'ConfirmResetPassword',
    'ConfirmSignIn',
    'ConfirmSignUp',
    'ConfirmVerifyUser',
    'ForceNewPassword',
    'ForgotPassword',
    'SelectMfaType',
    'SetupEmail',
    'SetupTotp',
    'SignIn',
    'SignUp',
    'VerifyUser',
];

const isComponentRouteKey = (route) => COMPONENT_ROUTE_KEYS.some((componentRoute) => componentRoute === route);
function resolveAuthenticatorComponents(defaults, overrides) {
    if (!overrides) {
        return defaults;
    }
    return COMPONENT_ROUTE_NAMES.reduce((components, route) => {
        const Default = defaults[route];
        const Override = overrides[route];
        if (typeof Override !== 'function') {
            return { ...components, [route]: Default };
        }
        const { Footer, FormFields, Header } = Default;
        // cast to allow assigning of component slots
        const Component = Override;
        Component.Footer = Footer;
        Component.FormFields = FormFields;
        Component.Header = Header;
        return { ...components, [route]: Component };
    }, {});
}

const defaultComparator = () => false;
/**
 * Does an ordering and shallow comparison of each array value,
 * plus a value equality check for empty objects and arrays.
 */
function areSelectorDepsEqual(currentDeps, nextDeps) {
    if (currentDeps.length !== nextDeps.length) {
        return false;
    }
    return currentDeps.every((currentDep, index) => {
        const nextDep = nextDeps[index];
        if (ui.areEmptyArrays(currentDep, nextDep) ||
            ui.areEmptyObjects(currentDep, nextDep)) {
            return true;
        }
        return currentDep === nextDep;
    });
}
const getComparator = (selector) => (currentFacade, nextFacade) => {
    const currentSelectorDeps = selector(currentFacade);
    const nextSelectorDeps = selector(nextFacade);
    // Shallow compare the array values
    return areSelectorDepsEqual(currentSelectorDeps, nextSelectorDeps);
};
const getQRFields = (state) => ({
    ...ui.getActorContext(state)?.formFields?.setupTotp?.QR,
});
const flattenFormFields = (fields) => fields.flatMap(([name, options]) => ({ name, ...options }));
const convertContactMethodsToFields = (unverifiedUserAttributes = {}) => {
    return (unverifiedUserAttributes &&
        Object.entries(unverifiedUserAttributes).map(([name, value]) => {
            const valueIsString = ui.isString(value);
            if (!valueIsString || !name) {
                return {};
            }
            return { name, label: value, type: 'radio', value };
        }));
};
const convertAllowedMfaTypesToFields = (allowedMfaTypes = []) => {
    return allowedMfaTypes.map((mfaType) => ({
        name: 'mfa_type',
        label: ui.authenticatorTextUtil.getMfaTypeLabelByValue(mfaType),
        type: 'radio',
        value: mfaType,
    }));
};
/**
 * Retrieves default and custom (RWA only, to be updated) form field values from state machine
 * for subcomponent routes that render fields
 */
const getMachineFields = (route, state) => {
    if (isComponentRouteKey(route)) {
        if (route === 'verifyUser') {
            return convertContactMethodsToFields(ui.getActorContext(state).unverifiedUserAttributes);
        }
        if (route === 'selectMfaType') {
            return convertAllowedMfaTypesToFields(ui.getActorContext(state).allowedMfaTypes);
        }
        return flattenFormFields(ui.getSortedFormFields(route, state));
    }
    return [];
};

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/authenticator/headless#useauthenticator-hook)
 */
function useAuthenticator(selector) {
    const context = React__namespace["default"].useContext(AuthenticatorContext);
    if (!context) {
        throw new Error(USE_AUTHENTICATOR_ERROR);
    }
    const { service } = context;
    const { send } = service;
    const xstateSelector = React.useCallback((state) => ({ ...ui.getServiceFacade({ send, state }) }), [send]);
    const comparator = selector ? getComparator(selector) : defaultComparator;
    // the purpose of `context.authStatus`is to intentionally override `facade.authStatus`. `facade.authStatus` does
    // not update on external sign in events (for example when a user is not using the `Authenticator`).
    const { authStatus } = context;
    const facade = react.useSelector(service, xstateSelector, comparator);
    const { route, totpSecretCode, user, ...rest } = facade;
    // do not memoize output. `service.getSnapshot` reference remains stable preventing
    // `fields` from updating with current form state on value changes
    const serviceSnapshot = service.getSnapshot();
    // legacy `QRFields` values only used for SetupTotp page to retrieve issuer information, will be removed in future
    const QRFields = route === 'setupTotp' ? getQRFields(serviceSnapshot) : null;
    // legacy `formFields` values required until form state is removed from state machine
    const fields = getMachineFields(route, serviceSnapshot);
    return {
        ...rest,
        authStatus,
        route,
        totpSecretCode,
        user,
        /** @deprecated For internal use only */
        fields,
        QRFields,
    };
}

const DEFAULT_ERROR_MESSAGE$1 = '`useForm` must be called inside a `FormProvider`';
/**
 * Utility hook corresponding to `FormProvider`, must be used within a `FormProvider`
 *
 * @internal Extend for public export. `useForm` and `UseForm` are an abstraction layer
 * on top of `useFormContext` and `UseFormReturn`, imported from `react-hook-form`
 *
 * @param options optional parameters
 * @returns `Form` utilities
 */
function useForm(options = {}) {
    const formContext = reactHookForm.useFormContext();
    const { errorMessage, onSubmit: _onSubmit } = options;
    if (!formContext) {
        throw new Error(errorMessage ?? DEFAULT_ERROR_MESSAGE$1);
    }
    const { formState, getFieldState: _getFieldState, getValues, handleSubmit, register, reset, setValue, } = formContext;
    // Do not memoize, `formState` updates on all events
    const getFieldState = (name) => {
        const { error, ...fieldState } = _getFieldState(name, formState);
        const { message: errorMessage } = error ?? {};
        return { ...fieldState, errorMessage, hasError: !!errorMessage };
    };
    // memoize `registerField` and `setFormValue` together,
    // `register` and `setValue` maintain stable references
    const { registerField, setFormValue } = React__namespace["default"].useMemo(() => {
        return {
            registerField: ({ name, ...options }) => register(name, options),
            setFormValue: ({ name, value, ...options }) => setValue(name, value, options),
        };
    }, [register, setValue]);
    const onSubmit = React__namespace["default"].useCallback((event) => {
        const handler = _onSubmit ? handleSubmit(_onSubmit) : ui.noop;
        handler(event);
    }, [_onSubmit, handleSubmit]);
    return {
        getFieldState,
        getValues,
        isValid: formState.isValid,
        onSubmit,
        registerField,
        reset,
        setFormValue,
    };
}

const DEFAULT_ERROR_MESSAGE = '`useField` must be used within a `FormProvider`';
/**
 * `Field` integration hook for usage with React `Field` components.
 *
 * @param params Requires `name`, all additional params optional
 * @returns `Form` aware `Field` event handlers and state values
 */
function useField(params) {
    const { getFieldState, registerField } = useForm({
        errorMessage: DEFAULT_ERROR_MESSAGE,
    });
    return {
        ...registerField(params),
        ...getFieldState(params.name),
    };
}

const DEFAULT_MODE = 'onTouched';
const FormProvider = React__namespace["default"].forwardRef(function FormProvider({ children, defaultValues, mode = DEFAULT_MODE }, ref) {
    const formProviderProps = reactHookForm.useForm({
        defaultValues,
        mode,
    });
    const { getValues, reset } = formProviderProps;
    React__namespace["default"].useImperativeHandle(ref, () => ({ getValues, reset: () => reset(defaultValues) }), [defaultValues, getValues, reset]);
    return (React__namespace["default"].createElement(reactHookForm.FormProvider, { ...formProviderProps }, children));
});

/**
 * @param Child `Form` base component wrapped inside `FormProvider`
 * @returns Composed `Form` component exposing `FormContext` values to descendents
 */
function withFormProvider(Child) {
    return React__namespace["default"].forwardRef(function Form({ defaultValues, mode, ...props }, ref) {
        return (React__namespace["default"].createElement(FormProvider, { defaultValues: defaultValues, mode: mode, ref: ref },
            React__namespace["default"].createElement(Child, { ...props })));
    });
}

/**
 * Utility component for rendering nothing.
 */
function RenderNothing(_) {
    return null;
}

const EVENT_HANDLER_KEY_MAP = {
    updateBlur: 'handleBlur',
    updateForm: 'handleChange',
    submitForm: 'handleSubmit',
};
const COMMON_ROUTE_MACHINE_KEYS = [
    'error',
    'isPending',
    'submitForm',
    'updateBlur',
    'updateForm',
];
const CONFIRM_RESET_PASSWORD_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'hasValidationErrors',
    'resendCode',
    'validationErrors',
];
const CONFIRM_SIGN_IN_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'challengeName',
    'toSignIn',
];
const CONFIRM_SIGN_UP_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'codeDeliveryDetails',
    'resendCode',
];
const CONFIRM_VERIFY_USER_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'skipVerification',
];
const FORCE_NEW_PASSWORD_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'hasValidationErrors',
    'toSignIn',
    'validationErrors',
];
const RESET_PASSWORD_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toSignIn',
];
const SIGN_IN_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'socialProviders',
    'toFederatedSignIn',
    'toForgotPassword',
    'toSignUp',
];
const SIGN_UP_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'hasValidationErrors',
    'socialProviders',
    'toFederatedSignIn',
    'toSignIn',
    'validationErrors',
];
const SETUP_TOTP_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toSignIn',
    'totpSecretCode',
    'username',
];
const SETUP_EMAIL_MACHINE_KEY = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toSignIn',
];
const SELECT_MFA_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'challengeName',
    'toSignIn',
];
const VERIFY_USER_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'skipVerification',
];
const MACHINE_PROP_KEYS = {
    confirmResetPassword: CONFIRM_RESET_PASSWORD_MACHINE_KEYS,
    confirmSignIn: CONFIRM_SIGN_IN_MACHINE_KEYS,
    confirmSignUp: CONFIRM_SIGN_UP_MACHINE_KEYS,
    confirmVerifyUser: CONFIRM_VERIFY_USER_MACHINE_KEYS,
    forceNewPassword: FORCE_NEW_PASSWORD_MACHINE_KEYS,
    signIn: SIGN_IN_MACHINE_KEYS,
    signUp: SIGN_UP_MACHINE_KEYS,
    forgotPassword: RESET_PASSWORD_MACHINE_KEYS,
    selectMfaType: SELECT_MFA_MACHINE_KEYS,
    setupEmail: SETUP_EMAIL_MACHINE_KEY,
    setupTotp: SETUP_TOTP_MACHINE_KEYS,
    verifyUser: VERIFY_USER_MACHINE_KEYS,
};

// only select `route` from machine context
const routeSelector$1 = ({ route }) => [route];
const createSelector = (selectorKeys) => (context) => {
    const dependencies = selectorKeys.map((key) => context[key]);
    // route should always be part of deps, so hook knows when route changes.
    return [...dependencies, context.route];
};
const getRouteMachineSelector = (route) => isComponentRouteKey(route)
    ? createSelector(MACHINE_PROP_KEYS[route])
    : routeSelector$1;
const isFormEventHandlerKey = (key) => ['updateBlur', 'updateForm', 'submitForm'].includes(key);
const convertEventHandlerKey = (key) => EVENT_HANDLER_KEY_MAP[key];
const getConvertedMachineProps = (route, context) => MACHINE_PROP_KEYS[route].reduce((acc, key) => ({
    ...acc,
    [isFormEventHandlerKey(key) ? convertEventHandlerKey(key) : key]: context[key],
}), {});
function resolveConfirmResetPasswordRoute(Component, props) {
    return {
        Component,
        props: {
            ...Component,
            ...getConvertedMachineProps('confirmResetPassword', props),
        },
    };
}
function resolveConfirmSignInRoute(Component, props) {
    const { challengeName, ...machineProps } = getConvertedMachineProps('confirmSignIn', props);
    return { Component, props: { ...Component, ...machineProps, challengeName } };
}
function resolveConfirmSignUpRoute(Component, props) {
    return {
        Component,
        props: {
            ...Component,
            ...getConvertedMachineProps('confirmSignUp', props),
        },
    };
}
function resolveConfirmVerifyUserRoute(Component, props) {
    return {
        Component,
        props: {
            ...Component,
            ...getConvertedMachineProps('confirmVerifyUser', props),
        },
    };
}
function resolveForceNewPasswordRoute(Component, props) {
    return {
        Component,
        props: {
            ...Component,
            ...getConvertedMachineProps('forceNewPassword', props),
        },
    };
}
function resolveForgotPasswordRoute(Component, props) {
    return {
        Component,
        props: {
            ...Component,
            ...getConvertedMachineProps('forgotPassword', props),
        },
    };
}
function resolveSetupTotpRoute(Component, props) {
    return {
        Component,
        props: {
            ...Component,
            ...getConvertedMachineProps('setupTotp', props),
        },
    };
}
function resolveSetupEmailRoute(Component, props) {
    return {
        Component,
        props: {
            ...Component,
            ...getConvertedMachineProps('setupEmail', props),
        },
    };
}
function resolveSelectMfaTypeRoute(Component, props) {
    return {
        Component,
        props: {
            ...Component,
            ...getConvertedMachineProps('selectMfaType', props),
        },
    };
}
function resolveSignInRoute(Component, props) {
    // default `hideSignUp` to false
    const hideSignUp = false;
    return {
        Component,
        props: {
            ...Component,
            ...getConvertedMachineProps('signIn', props),
            hideSignUp,
        },
    };
}
function resolveSignUpRoute(Component, props) {
    return {
        Component,
        props: { ...Component, ...getConvertedMachineProps('signUp', props) },
    };
}
function resolveVerifyUserRoute(Component, props) {
    return {
        Component,
        props: {
            ...Component,
            ...getConvertedMachineProps('verifyUser', props),
        },
    };
}
function resolveDefault() {
    return {
        Component: RenderNothing,
        props: {},
    };
}

function useAuthenticatorRoute({ components, }) {
    const { route } = useAuthenticator(routeSelector$1);
    const routeMachineSelector = React.useMemo(() => getRouteMachineSelector(route), [route]);
    // `useAuthenticator` exposes both state machine (example: `toSignIn`) and non-state machine
    // props (example: `getTotpSecretCode`). `routeSelector` specifies which state machine props
    // should be returned for a specific route.
    // Only state machine props specified by the current `routeSelector` will have their current value
    // returned by `useAuthenticator`, non-machine props returned will always be the current value
    const routeSelectorProps = useAuthenticator(routeMachineSelector);
    const { ConfirmResetPassword, ConfirmSignIn, ConfirmSignUp, ConfirmVerifyUser, ForceNewPassword, ForgotPassword, SelectMfaType, SetupEmail, SetupTotp, SignIn, SignUp, VerifyUser, } = components;
    switch (route) {
        case 'confirmResetPassword': {
            return resolveConfirmResetPasswordRoute(ConfirmResetPassword, routeSelectorProps);
        }
        case 'confirmSignIn': {
            return resolveConfirmSignInRoute(ConfirmSignIn, routeSelectorProps);
        }
        case 'confirmSignUp': {
            return resolveConfirmSignUpRoute(ConfirmSignUp, routeSelectorProps);
        }
        case 'confirmVerifyUser': {
            return resolveConfirmVerifyUserRoute(ConfirmVerifyUser, routeSelectorProps);
        }
        case 'forceNewPassword': {
            return resolveForceNewPasswordRoute(ForceNewPassword, routeSelectorProps);
        }
        case 'forgotPassword': {
            return resolveForgotPasswordRoute(ForgotPassword, routeSelectorProps);
        }
        case 'selectMfaType': {
            return resolveSelectMfaTypeRoute(SelectMfaType, routeSelectorProps);
        }
        case 'setupEmail': {
            return resolveSetupEmailRoute(SetupEmail, routeSelectorProps);
        }
        case 'setupTotp': {
            return resolveSetupTotpRoute(SetupTotp, routeSelectorProps);
        }
        case 'signIn': {
            return resolveSignInRoute(SignIn, routeSelectorProps);
        }
        case 'signUp': {
            return resolveSignUpRoute(SignUp, routeSelectorProps);
        }
        case 'verifyUser': {
            return resolveVerifyUserRoute(VerifyUser, routeSelectorProps);
        }
        default: {
            return resolveDefault();
        }
    }
}

// only select `route` from machine context
const routeSelector = ({ route }) => [route];
function useAuthenticatorInitMachine(data) {
    const { route, initializeMachine } = useAuthenticator(routeSelector);
    const hasInitialized = React__namespace["default"].useRef(false);
    React__namespace["default"].useEffect(() => {
        if (!hasInitialized.current && route === 'setup') {
            initializeMachine(data);
            hasInitialized.current = true;
        }
    }, [initializeMachine, route, data]);
}

function usePreviousValue(value) {
    const previous = React.useRef(undefined);
    // update ref post render
    React.useEffect(() => {
        previous.current = value;
    }, [value]);
    // return previous ref
    return previous.current;
}

/**
 * @param value `value` to track for updates
 * @param ignoreFirstRender whether to ignore initial render. defaults to `false`
 * @returns a boolean representing whether the tracked `value` has updated between renders
 *
 * Returns `false`:
 * - on initial render when ignoring first render
 * - current and previous `value` are equal
 *
 * Returns `true`:
 * - on initial render when not ignoring first render (default behavior)
 * - current and previous `value` are not equal
 */
function useHasValueUpdated(value, ignoreFirstRender = false) {
    const previous = usePreviousValue(value);
    const shouldIgnoreChange = ui.isUndefined(previous) && ignoreFirstRender;
    if (shouldIgnoreChange) {
        return false;
    }
    return previous !== value;
}

function useControlledReducer(reducer, initialState, options) {
    const { controlledState, onStateChange } = options ?? {};
    const [uncontrolledState, dispatch] = React__namespace["default"].useReducer(reducer, controlledState ?? initialState);
    const controlledStateRef = React__namespace["default"].useRef();
    if (!ui.isUndefined(controlledState)) {
        controlledStateRef.current = controlledState;
    }
    const hasUncontrolledStateChanged = useHasValueUpdated(uncontrolledState, true);
    React__namespace["default"].useEffect(() => {
        // only run `onStateChange` if `uncontrolledState` has changed,
        // ignore reference change to `onStateChange`
        if (hasUncontrolledStateChanged) {
            onStateChange?.(uncontrolledState);
        }
    }, [hasUncontrolledStateChanged, onStateChange, uncontrolledState]);
    const state = controlledStateRef.current
        ? controlledStateRef.current
        : uncontrolledState;
    return React__namespace["default"].useMemo(() => [state, dispatch], [state]);
}

function filterAllowedFiles(files, acceptedFileTypes) {
    // Allow any files if acceptedFileTypes is undefined, empty array, or contains '*'
    if (!acceptedFileTypes ||
        acceptedFileTypes.length === 0 ||
        acceptedFileTypes.includes('*')) {
        return { acceptedFiles: files, rejectedFiles: [] };
    }
    const acceptedFiles = [];
    const rejectedFiles = [];
    function filterFile(file) {
        const { type = '', name = '' } = file;
        const mimeType = type.toLowerCase();
        const baseMimeType = mimeType.split('/')[0];
        return acceptedFileTypes.some((type) => {
            const validType = type.trim().toLowerCase();
            // if the accepted file type is a file extension
            // it will start with '.', check against the file name
            if (validType.charAt(0) === '.') {
                return name.toLowerCase().endsWith(validType);
            }
            // This is something like a image/* mime type
            if (validType.endsWith('/*')) {
                return baseMimeType === validType.split('/')[0];
            }
            return mimeType === validType;
        });
    }
    files.forEach((file) => {
        (filterFile(file) ? acceptedFiles : rejectedFiles).push(file);
    });
    return { acceptedFiles, rejectedFiles };
}

// Helper function to convert FileSystemFileEntry to File
const getFileFromEntry = (fileEntry) => {
    return new Promise((resolve) => {
        fileEntry.file(resolve);
    });
};
// Helper function to read all entries in a directory
const readAllDirectoryEntries = async (dirReader) => {
    const entries = [];
    let readBatch = [];
    do {
        readBatch = await new Promise((resolve, reject) => {
            try {
                dirReader.readEntries(resolve, reject);
            }
            catch (error) {
                reject(error);
            }
        });
        entries.push(...readBatch);
    } while (readBatch.length > 0);
    return entries;
};
// Helper function to process files and folder contents
async function processDroppedItems(dataTransferItems) {
    const files = [];
    const processFileSystemEntry = async (entry) => {
        if (entry.isFile) {
            const file = await getFileFromEntry(entry);
            // drag and dropped files do not have a webkitRelativePath property,
            // but they do have a fullPath property which has the same information
            // https://github.com/ant-design/ant-design/issues/16426
            if (entry.fullPath && !file.webkitRelativePath) {
                Object.defineProperties(file, {
                    webkitRelativePath: {
                        writable: true,
                    },
                });
                // intentionally overwriting webkitRelativePath
                // @ts-expect-error
                file.webkitRelativePath = entry.fullPath.replace(/^\//, '');
                Object.defineProperties(file, {
                    webkitRelativePath: {
                        writable: false,
                    },
                });
            }
            files.push(file);
        }
        else if (entry.isDirectory) {
            const dirReader = entry.createReader();
            const dirEntries = await readAllDirectoryEntries(dirReader);
            await Promise.all(dirEntries.map(processFileSystemEntry));
        }
    };
    // Filter out and process files from the data transfer items
    await Promise.all(dataTransferItems
        .reduce((acc, item) => {
        const entry = item.webkitGetAsEntry();
        return item.kind === 'file' && entry ? [...acc, entry] : acc;
    }, [])
        .map(processFileSystemEntry));
    return files;
}

function useDropZone({ onDropComplete, onDragEnter: _onDragEnter, onDragLeave: _onDragLeave, onDragOver: _onDragOver, onDragStart: _onDragStart, onDrop: _onDrop, acceptedFileTypes = [], }) {
    const [dragState, setDragState] = React.useState('inactive');
    const onDragStart = (event) => {
        event.dataTransfer.clearData();
        if (ui.isFunction(_onDragStart)) {
            _onDragStart(event);
        }
    };
    const onDragEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (ui.isFunction(_onDragEnter)) {
            _onDragEnter(event);
        }
    };
    const onDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragState('inactive');
        if (ui.isFunction(_onDragLeave)) {
            _onDragLeave(event);
        }
    };
    const onDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
        if (ui.isFunction(_onDragOver)) {
            _onDragOver(event);
        }
        const files = Array.from(event.dataTransfer.items).map(({ kind, type }) => ({
            kind,
            type,
        }));
        const { rejectedFiles } = filterAllowedFiles(files, acceptedFileTypes);
        setDragState(rejectedFiles.length > 0 ? 'reject' : 'accept');
    };
    const onDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragState('inactive');
        const { files, items } = event.dataTransfer;
        if (ui.isFunction(_onDrop)) {
            _onDrop(event);
        }
        const completeDrop = (files) => {
            const { acceptedFiles, rejectedFiles } = filterAllowedFiles(files, acceptedFileTypes);
            if (ui.isFunction(onDropComplete)) {
                onDropComplete({ acceptedFiles, rejectedFiles });
            }
        };
        if (!items) {
            completeDrop(Array.from(files));
        }
        else {
            processDroppedItems(Array.from(items)).then(completeDrop);
        }
    };
    return {
        onDragStart,
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDrop,
        dragState,
    };
}

// async state constants
const INITIAL = { hasError: false, isLoading: false, message: undefined };
const LOADING = { hasError: false, isLoading: true, message: undefined };
const ERROR = { hasError: true, isLoading: false };
/**
 * @internal may be updated in future versions
 *
 * @description like `useReducer` but make it async
 *
 * @example
 * ```ts
 * import fetchData from './fetchData';
 *
 * type MyState = { data: string[] | undefined }
 * const initialState: MyState = { data: undefined }
 *
 * type MyAction = { type: 'fetch' | 'clear' }
 *
 * const asyncReducer = async (state: MyState, action: MyAction): Promise<MyState> => {
 *   switch(action.type) {
 *     case 'fetch':
 *       const data = await fetchData();
 *       return { data: state.data ? state.data.concat(data) : data }
 *     case 'clear':
 *       return { data: undefined }
 *   }
 * }
 *
 * const FetchDataButton = () => {
 *   const [state, dispatch] = useAsyncReducer(asyncReducer, initialState);
 *
 *   const { value: { data }, isLoading } = state;
 *
 *   return (
 *     <button onClick={() => isLoading ? null : dispatch({ type: 'fetch'})}>
 *       Fetch Data
 *     </button>
 *   )
 * }
 * ```
 */
function useAsyncReducer(reducer, initialValue, options) {
    const [state, setAsyncState] = React__namespace["default"].useState(() => ({
        ...INITIAL,
        value: initialValue,
    }));
    const prevValue = React__namespace["default"].useRef(initialValue);
    const pendingId = React__namespace["default"].useRef();
    const { onSuccess, onError } = options ?? {};
    const dispatch = React__namespace["default"].useCallback((input) => {
        const id = Symbol();
        pendingId.current = id;
        setAsyncState(({ value }) => ({ ...LOADING, value }));
        reducer(prevValue.current, input)
            .then((value) => {
            if (pendingId.current !== id)
                return;
            prevValue.current = value;
            if (ui.isFunction(onSuccess))
                onSuccess(value);
            setAsyncState({ ...INITIAL, value });
        })
            .catch((error) => {
            if (pendingId.current !== id)
                return;
            if (ui.isFunction(onError))
                onError(error);
            const { message } = error;
            setAsyncState(({ value }) => ({ ...ERROR, value, message }));
        });
    }, [onError, onSuccess, reducer]);
    return [state, dispatch];
}

/**
 * Logs a deprecation warning message.
 *
 * @important Please use the React/React Native specific platform implementations.
 * This version of the hook is a base implementation that the others extend from due
 * to env differences between running in RN or the browser
 */
const useDeprecationWarning = ({ shouldWarn, message, }) => {
    React__namespace.useEffect(() => {
        if (shouldWarn) {
            // eslint-disable-next-line no-console
            console.warn(message);
        }
    }, [shouldWarn, message]);
};

const INIT_STATE = {
    url: undefined,
    expiresAt: undefined,
    isLoading: true,
};
function useGetUrl(input) {
    const [result, setResult] = React__namespace.useState(() => INIT_STATE);
    React__namespace.useEffect(() => {
        const { onError, ...getUrlInput } = input;
        let ignore = false;
        storage.getUrl(getUrlInput)
            .then((response) => {
            if (ignore) {
                return;
            }
            setResult({ ...response, isLoading: false });
        })
            .catch((error) => {
            if (ignore) {
                return;
            }
            if (ui.isFunction(onError)) {
                onError(error);
            }
            setResult({ ...INIT_STATE, isLoading: false });
        });
        return () => {
            ignore = true;
        };
    }, [input]);
    return result;
}

function useSetUserAgent({ componentName, packageName, version, }) {
    React.useEffect(() => {
        const clearUserAgent = ui.setUserAgent({
            componentName,
            packageName,
            version,
        });
        return clearUserAgent;
    }, [componentName, packageName, version]);
}

function useTimeout({ callback, delay, }) {
    const storedCallback = React__namespace["default"].useRef(callback);
    React__namespace["default"].useLayoutEffect(() => {
        storedCallback.current = callback;
    }, [callback]);
    React__namespace["default"].useEffect(() => {
        if (!ui.isFunction(storedCallback.current) || !delay) {
            return;
        }
        const timeoutId = setTimeout(() => {
            storedCallback.current?.();
        }, delay);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [delay]);
}

const INVALID_OPTIONS_MESSAGE = 'an `errorMessage` or a `defaultValue` must be provided in `options`';
/**
 * Uses `ContextType`/`Name` generics and `options` to create:
 * - `${Name}Context`: React Context of type `ContextType`
 * - `Provider${Name}`: React Context `Provider` component exposing the `ContextType`
 *   as optional props
 * - `use${Name}`: Utility Hook exposing the values of `ContextType`. Allows
 *   params with `errorMessage` for granular error messaging
 *
 * @template ContextType Type definition of the Context.
 * > For most use cases the keys of `ContextType` should not be optional in
 * preference of explicit `undefined` to avoid optional types on the
 * Utility Hook return
 *
 * @param options Context utility options. Requires a `contextName`, and
 * either a `defaultValue` of `ContextType` **or** an `errorMessage`
 * allowing for differing behaviors of the Utility Hook when used outside a
 * parent `Provider`:
 *
 * - `defaultValue`: Ensures the Utility Hook returns a default value for
 *   scenarios **where the missing context values should not impact usage**
 * - `errorMessage`: Ensures the Utility Hook throws an error for
 *   scenarios **where the missing context values should prevent** usage
 *
 * @returns `Context`, `Provider` Component and `useContext` Utility Hook
 *
 * @usage
 * ```ts
 * interface StuffContextType {
 *   things: number;
 * }
 *
 * // with `defaultValue`
 * const defaultValue: StuffContextType = { things: 7 };
 *
 * const { StuffProvider, useStuff } = createContextUtilities({
 *   contextName: 'Stuff',
 *   defaultValue,
 * });
 *
 * // with `errorMessage`
 * const { StuffProvider, useStuff } = createContextUtilities<StuffContextType>({
 *   contextName: 'Stuff',
 *   errorMessage: '`useStuff` must be used in a `StuffProvider`'
 * });
 * ```
 */
function createContextUtilities(options) {
    const { contextName, defaultValue, errorMessage } = options ?? {};
    if (ui.isUndefined(defaultValue) && !ui.isString(errorMessage)) {
        throw new Error(INVALID_OPTIONS_MESSAGE);
    }
    const contextDisplayName = `${contextName}Context`;
    const providerDisplayName = `${contextName}Provider`;
    const Context = React__namespace["default"].createContext(defaultValue);
    Context.displayName = contextDisplayName;
    function Provider(props) {
        const { children, ...context } = props;
        const value = React__namespace["default"].useMemo(() => context, 
        // Unpack `context` for the dep array; using `[context]` results in
        // evaluation on every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
        Object.values(context));
        return React__namespace["default"].createElement(Context.Provider, { value: value }, children);
    }
    Provider.displayName = providerDisplayName;
    return {
        [`use${contextName}`]: function (params) {
            const context = React__namespace["default"].useContext(Context);
            if (ui.isUndefined(context)) {
                throw new Error(params?.errorMessage ?? errorMessage);
            }
            return context;
        },
        [providerDisplayName]: Provider,
        [contextDisplayName]: Context,
    };
}

exports.AuthenticatorProvider = AuthenticatorProvider;
exports.FormProvider = FormProvider;
exports.RenderNothing = RenderNothing;
exports.createContextUtilities = createContextUtilities;
exports.isAuthenticatorComponentRouteKey = isComponentRouteKey;
exports.resolveAuthenticatorComponents = resolveAuthenticatorComponents;
exports.useAsyncReducer = useAsyncReducer;
exports.useAuthenticator = useAuthenticator;
exports.useAuthenticatorInitMachine = useAuthenticatorInitMachine;
exports.useAuthenticatorRoute = useAuthenticatorRoute;
exports.useControlledReducer = useControlledReducer;
exports.useDeprecationWarning = useDeprecationWarning;
exports.useDropZone = useDropZone;
exports.useField = useField;
exports.useForm = useForm;
exports.useGetUrl = useGetUrl;
exports.useHasValueUpdated = useHasValueUpdated;
exports.usePreviousValue = usePreviousValue;
exports.useSetUserAgent = useSetUserAgent;
exports.useTimeout = useTimeout;
exports.withFormProvider = withFormProvider;
