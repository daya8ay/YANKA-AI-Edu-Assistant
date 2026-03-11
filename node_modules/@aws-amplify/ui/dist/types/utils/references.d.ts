/**
 * Checks if the value uses a value reference.
 * @param {string} value
 * @returns {boolean} - True, if the value uses a value reference
 */
export declare function usesReference(value: unknown): boolean;
export declare function resolveReference(path: string[], obj: object): object;
/**
 * Returns the path from a path name be splitting the name by a given separator.
 */
export declare function getPathFromName(pathName: string): string[];
/**
 * Returns the paths name be joining its parts with a given separator.
 */
export declare function getName(path: Array<string>): string;
