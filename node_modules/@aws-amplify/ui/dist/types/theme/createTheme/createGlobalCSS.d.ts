import type { ComponentStyles } from '../components/utils';
type GlobalCSS = Record<string, ComponentStyles>;
export declare function createGlobalCSS(css: GlobalCSS): string;
export {};
