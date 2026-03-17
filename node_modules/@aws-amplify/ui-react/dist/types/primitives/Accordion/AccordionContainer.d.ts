import type { ForwardRefPrimitive } from '../types/view';
import type { BaseAccordionProps } from './types';
type BaseAccordionContainerProps = Omit<BaseAccordionProps, 'items'>;
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/accordion)
 */
export declare const AccordionContainer: ForwardRefPrimitive<BaseAccordionContainerProps, 'div'>;
export {};
