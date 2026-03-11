import * as React from 'react';
import { getUrl } from 'aws-amplify/storage';
import { isFunction } from '@aws-amplify/ui';

const INIT_STATE = {
    url: undefined,
    expiresAt: undefined,
    isLoading: true,
};
function useGetUrl(input) {
    const [result, setResult] = React.useState(() => INIT_STATE);
    React.useEffect(() => {
        const { onError, ...getUrlInput } = input;
        let ignore = false;
        getUrl(getUrlInput)
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
            if (isFunction(onError)) {
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

export { useGetUrl as default };
