import type { ForwardRefPrimitive } from '../types';
import type { BaseDropZoneProps } from './types';
import type { AcceptedType, DefaultType, RejectedType } from './DropZoneChildren';
type DropZoneType = ForwardRefPrimitive<BaseDropZoneProps, 'div'> & {
    Accepted: AcceptedType;
    Rejected: RejectedType;
    Default: DefaultType;
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/dropzone)
 */
declare const DropZone: DropZoneType;
export { DropZone };
