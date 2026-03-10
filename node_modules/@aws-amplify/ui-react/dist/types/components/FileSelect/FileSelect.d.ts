import React from 'react';
export type SelectType = 'FILE' | 'FOLDER';
/**
 * @internal @unstable
 */
export interface FileSelectProps {
    accept?: string;
    id?: string;
    multiple?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    type?: SelectType;
    testId?: string;
}
/**
 * @internal @unstable
 */
export interface FileSelectOptions extends Omit<FileSelectProps, 'type'> {
}
export type HandleFileSelect = (selectType: SelectType, options?: FileSelectOptions) => void;
/**
 * @internal @unstable
 */
export type UseFileSelect = [
    fileSelect: React.ReactNode,
    handleFileSelect: HandleFileSelect
];
export declare const DEFAULT_PROPS: {
    style: {
        display: string;
    };
    type: string;
    'data-testid': string;
};
/**
 * @internal @unstable
 */
export declare const FileSelect: React.ForwardRefExoticComponent<FileSelectProps & React.RefAttributes<HTMLInputElement>>;
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
export declare const useFileSelect: (onSelect?: ((files: File[]) => void) | undefined) => UseFileSelect;
