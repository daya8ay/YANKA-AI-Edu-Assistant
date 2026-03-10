import type { DesignTokenProperties, OutputVariantKey } from '../types/designToken';
export interface AIConversationTokens<OutputType extends OutputVariantKey> {
    message?: DesignTokenProperties<'backgroundColor' | 'borderRadius' | 'paddingBlock' | 'paddingInline' | 'gap', OutputType> & {
        sender?: DesignTokenProperties<'gap', OutputType> & {
            username?: DesignTokenProperties<'color' | 'fontSize' | 'fontWeight', OutputType>;
            timestamp?: DesignTokenProperties<'color' | 'fontSize' | 'fontWeight', OutputType>;
        };
        actions?: DesignTokenProperties<'gap', OutputType>;
        body?: DesignTokenProperties<'gap', OutputType>;
        user?: DesignTokenProperties<'backgroundColor', OutputType>;
        assistant?: DesignTokenProperties<'backgroundColor', OutputType>;
    };
    form?: DesignTokenProperties<'gap' | 'padding', OutputType>;
    attachment?: DesignTokenProperties<'borderColor' | 'borderWidth' | 'borderRadius' | 'fontSize' | 'paddingBlock' | 'paddingInline' | 'gap', OutputType> & {
        list?: DesignTokenProperties<'paddingBlockStart' | 'padding' | 'gap', OutputType>;
        image?: DesignTokenProperties<'width' | 'height', OutputType>;
        size?: DesignTokenProperties<'color' | 'fontSize' | 'fontWeight', OutputType>;
        name?: DesignTokenProperties<'color' | 'fontSize' | 'fontWeight', OutputType>;
        remove?: DesignTokenProperties<'padding', OutputType>;
    };
}
export declare const aiConversation: Required<AIConversationTokens<'default'>>;
