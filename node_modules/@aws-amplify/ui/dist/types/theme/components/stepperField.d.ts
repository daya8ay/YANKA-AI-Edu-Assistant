import type { Modifiers, ComponentStyles, Elements, ColorTheme } from './utils';
export type StepperFieldTheme<Required extends boolean = false> = ComponentStyles & Modifiers<ColorTheme, Required> & Elements<{
    'button--increase'?: ComponentStyles & Modifiers<'quiet' | 'disabled', Required>;
    'button--decrease'?: ComponentStyles & Modifiers<'quiet' | 'disabled', Required>;
    input?: ComponentStyles;
}, Required>;
