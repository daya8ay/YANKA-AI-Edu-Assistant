import { isFunction } from '@aws-amplify/ui';

(typeof Symbol !== 'undefined' && isFunction(Symbol.for)
    ? Symbol.for('amplify_default')
    : '@@amplify_default');
const ERROR_SUFFIX = 'error';
const DESCRIPTION_SUFFIX = 'description';

export { DESCRIPTION_SUFFIX, ERROR_SUFFIX };
