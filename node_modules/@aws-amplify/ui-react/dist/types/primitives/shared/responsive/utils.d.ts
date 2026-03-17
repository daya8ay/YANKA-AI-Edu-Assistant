import type { Breakpoint, Breakpoints, ValueBreakpoints } from '../../types/responsive';
export declare const getValueAtCurrentBreakpoint: <Value = string | number>({ breakpoint, breakpoints, values, }: {
    values: Partial<Record<"base" | "small" | "large" | "medium" | "xl" | "xxl", Value>> | Value[];
    breakpoint: Breakpoint;
    breakpoints: Breakpoints;
}) => string | number | Value | null;
