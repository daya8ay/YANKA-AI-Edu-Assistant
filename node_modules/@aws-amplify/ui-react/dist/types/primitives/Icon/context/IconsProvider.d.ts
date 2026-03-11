import * as React from 'react';
import type { IconsContextInterface } from './IconsContext';
interface IconProviderProps {
    children: React.ReactNode;
    icons?: IconsContextInterface;
}
export type { IconsContextInterface };
export declare function IconsProvider({ children, icons, }: IconProviderProps): React.JSX.Element;
