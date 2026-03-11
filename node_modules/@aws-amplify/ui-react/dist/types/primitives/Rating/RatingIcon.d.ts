import * as React from 'react';
import type { Property } from 'csstype';
import type { StyleToken } from '../types/style';
interface RatingIconProps {
    icon: React.ReactNode;
    fill?: StyleToken<Property.Color>;
    className: string;
}
export declare const RatingIcon: React.FC<RatingIconProps>;
export {};
