import type { GetUrlInput, GetUrlWithPathInput } from 'aws-amplify/storage';
export type UseGetUrlInput = (GetUrlInput | GetUrlWithPathInput) & {
    onError?: (error: Error) => void;
};
interface UseGetUrlOutput {
    isLoading: boolean;
    url: URL | undefined;
    expiresAt: Date | undefined;
}
export default function useGetUrl(input: UseGetUrlInput): UseGetUrlOutput;
export {};
