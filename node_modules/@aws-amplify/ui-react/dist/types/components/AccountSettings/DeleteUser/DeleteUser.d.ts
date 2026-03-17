import React from 'react';
import type { DeleteUserProps } from './types';
declare function DeleteUser({ components, displayText: overrideDisplayText, handleDelete, onError, onSuccess, }: DeleteUserProps): React.JSX.Element | null;
declare namespace DeleteUser {
    var ErrorMessage: import("../types").ErrorMessageComponent;
    var DeleteButton: import("../types").ButtonComponent;
    var WarningView: import("./types").WarningViewComponent<{}>;
}
export default DeleteUser;
