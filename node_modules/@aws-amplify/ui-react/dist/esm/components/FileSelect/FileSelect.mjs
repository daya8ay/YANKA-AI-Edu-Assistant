import React__default from 'react';
import { isFunction } from '@aws-amplify/ui';
import { useStableId } from '../../primitives/utils/useStableId.mjs';

// `FileSelect` input `type` must always be set to `file`
const INPUT_TYPE = 'file';
const TEST_ID = 'amplify-file-select';
const DEFAULT_PROPS = {
    style: { display: 'none' },
    type: 'file',
    'data-testid': TEST_ID,
};
/**
 * @internal @unstable
 */
const FileSelect = React__default.forwardRef(function FileSelect({ multiple = true, type = 'FILE', testId = 'amplify-file-select', ...props }, ref) {
    return (React__default.createElement("input", { ...DEFAULT_PROPS, ...props, ...(type === 'FOLDER' ? { webkitdirectory: '' } : undefined), "data-testid": testId, multiple: multiple, ref: ref, type: INPUT_TYPE }));
});
/**
 * @internal @unstable
 *
 * @usage
 * ```tsx
 *  function MyUploadButton() {
 *    const [files, setFiles] = React.useState<File[]>([]);
 *    const [fileSelect, handleFileSelect] = useFileSelect(setFiles);
 *    return (
 *      <>
 *        {fileSelect}
 *        <Button
 *          onClick={() => {
 *            handleFileSelect('file');
 *          }}
 *        />
 *      </>
 *    );
 *  }
 * ```
 */
const useFileSelect = (onSelect) => {
    const [inputProps, setInputProps] = React__default.useState(undefined);
    const id = useStableId();
    const ref = React__default.useRef(null);
    React__default.useEffect(() => {
        if (inputProps) {
            ref.current?.click();
        }
    }, [id, inputProps]);
    const handleFileSelect = React__default.useCallback((type, options) => {
        if (id !== ref.current?.id)
            return;
        setInputProps({ type, ...options });
    }, [id]);
    const fileSelect = (React__default.createElement(FileSelect, { ...inputProps, id: id, onChange: (event) => {
            if (isFunction(inputProps?.onChange))
                inputProps?.onChange(event);
            if (isFunction(onSelect) && !!event.target.files?.length) {
                onSelect?.([...event.target.files]);
            }
            // Reset the input value to allow re-selecting the same file
            if (ref.current) {
                ref.current.value = '';
            }
            // clean up
            setInputProps(undefined);
        }, ref: ref }));
    return [fileSelect, handleFileSelect];
};

export { DEFAULT_PROPS, FileSelect, useFileSelect };
