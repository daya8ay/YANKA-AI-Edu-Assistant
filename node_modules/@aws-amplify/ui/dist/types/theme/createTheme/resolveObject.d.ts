export declare function resolveObject<T>(object: Record<string, any>): T;
/**
 * Recursively traverses an object (slice) to resolve and uses
 * compileValue to replace any string references found within it
 */
export declare function traverseObject<T>({ slice, fullObj, currentContext, foundCirc, }: {
    slice: any;
    fullObj: any;
    currentContext: any;
    foundCirc: any;
}): T;
/**
 * Resolves references in a value, performing recursive lookups when references are nested.
 * value: The string that may contain references (e.g., {color.border.light}) that need to be replaced
 * stack: keeps track of the current chain of references to detect circular references
 * foundCirc: stores any detected circular references
 * fullObj: The full object where references are looked up, essentially the source of all values
 */
export declare function compileValue({ value, stack, foundCirc, fullObj }: {
    value: any;
    stack: any;
    foundCirc: any;
    fullObj: any;
}): any;
