import { getActorContext, getSortedFormFields, areEmptyArrays, areEmptyObjects, isString, authenticatorTextUtil } from '@aws-amplify/ui';
import { isComponentRouteKey } from '../utils.mjs';

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
        if (areEmptyArrays(currentDep, nextDep) ||
            areEmptyObjects(currentDep, nextDep)) {
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
    ...getActorContext(state)?.formFields?.setupTotp?.QR,
});
const flattenFormFields = (fields) => fields.flatMap(([name, options]) => ({ name, ...options }));
const convertContactMethodsToFields = (unverifiedUserAttributes = {}) => {
    return (unverifiedUserAttributes &&
        Object.entries(unverifiedUserAttributes).map(([name, value]) => {
            const valueIsString = isString(value);
            if (!valueIsString || !name) {
                return {};
            }
            return { name, label: value, type: 'radio', value };
        }));
};
const convertAllowedMfaTypesToFields = (allowedMfaTypes = []) => {
    return allowedMfaTypes.map((mfaType) => ({
        name: 'mfa_type',
        label: authenticatorTextUtil.getMfaTypeLabelByValue(mfaType),
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
            return convertContactMethodsToFields(getActorContext(state).unverifiedUserAttributes);
        }
        if (route === 'selectMfaType') {
            return convertAllowedMfaTypesToFields(getActorContext(state).allowedMfaTypes);
        }
        return flattenFormFields(getSortedFormFields(route, state));
    }
    return [];
};

export { areSelectorDepsEqual, defaultComparator, getComparator, getMachineFields, getQRFields };
