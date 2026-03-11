interface DragEvents {
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
}
export interface UseDropZoneParams extends Partial<DragEvents> {
    onDropComplete?: (props: {
        acceptedFiles: File[];
        rejectedFiles: File[];
    }) => void;
    /**
     * List of accepted File types, values of `['*']` or undefined allow any files
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
     */
    acceptedFileTypes?: string[];
}
type DragState = 'accept' | 'reject' | 'inactive';
interface UseDropZoneReturn extends DragEvents {
    dragState: DragState;
}
export default function useDropZone({ onDropComplete, onDragEnter: _onDragEnter, onDragLeave: _onDragLeave, onDragOver: _onDragOver, onDragStart: _onDragStart, onDrop: _onDrop, acceptedFileTypes, }: UseDropZoneParams): UseDropZoneReturn;
export {};
