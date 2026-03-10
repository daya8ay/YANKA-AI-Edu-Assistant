import type React from 'react';
export declare function isComponent<T>(component?: React.ComponentType<T> | React.ForwardRefExoticComponent<T>): component is React.ComponentType<T>;
export declare function isForwardRefExoticComponent<T>(component: React.ComponentType<T> | React.ForwardRefExoticComponent<T>): component is React.ForwardRefExoticComponent<T>;
