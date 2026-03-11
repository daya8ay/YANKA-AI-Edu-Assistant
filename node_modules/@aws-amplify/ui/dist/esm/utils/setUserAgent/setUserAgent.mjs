import { setCustomUserAgent } from '@aws-amplify/core/internals/utils';
import { STORAGE_BROWSER_INPUT_BASE, STORAGE_MANAGER_INPUT_BASE, MAP_VIEW_INPUT_BASE, LOCATION_SEARCH_INPUT_BASE, IN_APP_MESSAGING_INPUT_BASE, FILE_UPLOADER_BASE_INPUT, ACCOUNT_SETTINGS_INPUT_BASE, AUTHENTICATOR_INPUT_BASE, AI_INPUT_BASE } from './constants.mjs';
import { noop } from '../utils.mjs';

/**
 * @example
 * ```ts
 * // set user agent options
 * const clear = setUserAgent(input);
 *
 * // clear user agent options
 * clear();
 * ```
 */
const setUserAgent = ({ componentName, packageName, version, }) => {
    const packageData = [`ui-${packageName}`, version];
    switch (componentName) {
        case 'AIConversation': {
            setCustomUserAgent({
                ...AI_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'Authenticator': {
            setCustomUserAgent({
                ...AUTHENTICATOR_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'ChangePassword':
        case 'DeleteUser': {
            setCustomUserAgent({
                ...ACCOUNT_SETTINGS_INPUT_BASE,
                additionalDetails: [['AccountSettings'], packageData],
            });
            break;
        }
        case 'FileUploader': {
            setCustomUserAgent({
                ...FILE_UPLOADER_BASE_INPUT,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'InAppMessaging': {
            setCustomUserAgent({
                ...IN_APP_MESSAGING_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'LocationSearch': {
            setCustomUserAgent({
                ...LOCATION_SEARCH_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'MapView': {
            setCustomUserAgent({
                ...MAP_VIEW_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'StorageManager': {
            setCustomUserAgent({
                ...STORAGE_MANAGER_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
        case 'StorageBrowser': {
            setCustomUserAgent({
                ...STORAGE_BROWSER_INPUT_BASE,
                additionalDetails: [[componentName], packageData],
            });
            break;
        }
    }
    return noop;
};

export { setUserAgent };
