import type { DesignTokenProperties, OutputVariantKey } from '../types/designToken';
type AvatarVariationTokens<OutputType> = DesignTokenProperties<'backgroundColor' | 'color' | 'borderColor', OutputType>;
type AvatarSizeTokens<OutputType> = DesignTokenProperties<'fontSize' | 'width' | 'height', OutputType>;
type AvatarKey = 'backgroundColor' | 'borderRadius' | 'borderWidth' | 'borderColor' | 'color' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'height' | 'textAlign' | 'width';
export type AvatarTokens<OutputType extends OutputVariantKey> = DesignTokenProperties<AvatarKey, OutputType> & {
    large?: AvatarSizeTokens<OutputType>;
    small?: AvatarSizeTokens<OutputType>;
    error?: AvatarVariationTokens<OutputType>;
    info?: AvatarVariationTokens<OutputType>;
    success?: AvatarVariationTokens<OutputType>;
    warning?: AvatarVariationTokens<OutputType>;
};
export declare const avatar: Required<AvatarTokens<'default'>>;
export {};
