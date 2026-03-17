import * as React from 'react';
import { classNames, ComponentClassName, classNameModifier } from '@aws-amplify/ui';
import '../Field/FieldClearButton.mjs';
import { FieldDescription } from '../Field/FieldDescription.mjs';
import { FieldErrorMessage } from '../Field/FieldErrorMessage.mjs';
import '../Field/Field.mjs';
import { Flex } from '../Flex/Flex.mjs';
import { Label } from '../Label/Label.mjs';
import { splitPrimitiveProps } from '../utils/splitPrimitiveProps.mjs';
import { TextArea } from '../TextArea/TextArea.mjs';
import { AutoresizeTextArea } from '../TextArea/AutoresizeTextarea.mjs';
import { useStableId } from '../utils/useStableId.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { createSpaceSeparatedIds } from '../utils/createSpaceSeparatedIds.mjs';
import { ERROR_SUFFIX, DESCRIPTION_SUFFIX } from '../../helpers/constants.mjs';
import { getUniqueComponentId } from '../utils/getUniqueComponentId.mjs';

const DEFAULT_ROW_COUNT = 3;
const TextAreaFieldPrimitive = (props, ref) => {
    const { className, descriptiveText, errorMessage, hasError = false, id, label, labelHidden = false, rows, size, testId, inputStyles, autoResize, 
    // Destructuring the 'resize' style prop because while it is a style prop
    // it should go on the textarea element and not the wrapper div.
    resize, ..._rest } = props;
    const fieldId = useStableId(id);
    const stableId = useStableId();
    const descriptionId = descriptiveText
        ? getUniqueComponentId(stableId, DESCRIPTION_SUFFIX)
        : undefined;
    const errorId = hasError
        ? getUniqueComponentId(stableId, ERROR_SUFFIX)
        : undefined;
    const ariaDescribedBy = createSpaceSeparatedIds([errorId, descriptionId]);
    const { styleProps, rest } = splitPrimitiveProps(_rest);
    return (React.createElement(Flex, { className: classNames(ComponentClassName.Field, classNameModifier(ComponentClassName.Field, size), ComponentClassName.TextAreaField, className), testId: testId, ...styleProps },
        React.createElement(Label, { htmlFor: fieldId, visuallyHidden: labelHidden }, label),
        React.createElement(FieldDescription, { id: descriptionId, labelHidden: labelHidden, descriptiveText: descriptiveText }),
        autoResize ? (React.createElement(AutoresizeTextArea, { "aria-describedby": ariaDescribedBy, hasError: hasError, id: fieldId, ref: ref, rows: rows ?? DEFAULT_ROW_COUNT, size: size, resize: resize, ...rest, ...inputStyles })) : (React.createElement(TextArea, { "aria-describedby": ariaDescribedBy, hasError: hasError, id: fieldId, ref: ref, rows: rows ?? DEFAULT_ROW_COUNT, size: size, resize: resize, ...rest, ...inputStyles })),
        React.createElement(FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/textareafield)
 */
const TextAreaField = primitiveWithForwardRef(TextAreaFieldPrimitive);
TextAreaField.displayName = 'TextAreaField';

export { DEFAULT_ROW_COUNT, TextAreaField };
