function isComponent(component) {
    return typeof component === 'function';
}
function isForwardRefExoticComponent(component) {
    return (typeof component === 'object' &&
        typeof component.$$typeof ===
            'symbol' &&
        ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description));
}

export { isComponent, isForwardRefExoticComponent };
