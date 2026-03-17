import type { ClassNamesArgs } from '../../utils';
import type { ComponentThemeFromName } from '../components';
import type { BaseTheme } from '../components/utils';
type ElementNames<T extends unknown> = T extends {
    _element?: any;
} ? keyof Required<T['_element']> : never;
type ModifierNames<T extends unknown> = T extends {
    _modifiers?: any;
} ? Arrayify<keyof Required<T['_modifiers']> | {
    [key in keyof Required<T['_modifiers']>]?: boolean | null | undefined;
} | undefined> : never;
type Arrayify<T> = T | T[];
export type ClassNameArgs<T extends BaseTheme> = {
    _element?: ElementNames<Required<T>> | {
        [Key in ElementNames<Required<T>>]?: ModifierNames<Required<Required<Required<T>['_element']>[Key]>>;
    };
    _modifiers?: ModifierNames<Required<T>>;
};
export type ClassNameFunction<T extends BaseTheme = BaseTheme, NameType extends string = string> = (props?: ClassNameArgs<UnwrapTheme<ComponentThemeFromName<NameType, T>>>, extraClassnames?: ClassNamesArgs) => string;
type UnwrapTheme<ThemeType extends BaseTheme = BaseTheme> = ThemeType extends (...args: any) => any ? ReturnType<ThemeType> : ThemeType;
export declare function createComponentClasses<ThemeType extends BaseTheme, NameType extends string = string>({ name, prefix }: {
    name: NameType;
    prefix?: string;
}): ClassNameFunction<ThemeType, NameType>;
export {};
