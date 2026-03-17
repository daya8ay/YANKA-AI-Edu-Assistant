type ClassNamesInput = string | number | boolean | undefined | null | Record<string, unknown> | ClassNamesArgs;
export type ClassNamesArgs = Array<ClassNamesInput>;
export declare const classNames: (...args: ClassNamesArgs) => string;
export {};
