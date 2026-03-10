import * as React from 'react';
import { classNames, ComponentClassName, classNameModifier } from '@aws-amplify/ui';
import '../Field/FieldClearButton.mjs';
import { FieldDescription } from '../Field/FieldDescription.mjs';
import { FieldErrorMessage } from '../Field/FieldErrorMessage.mjs';
import '../Field/Field.mjs';
import { FieldGroup } from '../FieldGroup/FieldGroup.mjs';
import { Flex } from '../Flex/Flex.mjs';
import { Input } from '../Input/Input.mjs';
import { Label } from '../Label/Label.mjs';
import { splitPrimitiveProps } from '../utils/splitPrimitiveProps.mjs';
import { useStableId } from '../utils/useStableId.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { createSpaceSeparatedIds } from '../utils/createSpaceSeparatedIds.mjs';
import { DESCRIPTION_SUFFIX, ERROR_SUFFIX } from '../../helpers/constants.mjs';
import { getUniqueComponentId } from '../utils/getUniqueComponentId.mjs';

const TextFieldPrimitive = (props, ref) => {
    const { className, descriptiveText, errorMessage, hasError = false, id, innerEndComponent, innerStartComponent, label, labelHidden = false, outerEndComponent, outerStartComponent, size, testId, variation, inputStyles, ..._rest } = props;
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
    return (React.createElement(Flex, { className: classNames(ComponentClassName.Field, classNameModifier(ComponentClassName.Field, size), ComponentClassName.TextField, className), testId: testId, ...styleProps },
        React.createElement(Label, { htmlFor: fieldId, visuallyHidden: labelHidden }, label),
        React.createElement(FieldDescription, { id: descriptionId, labelHidden: labelHidden, descriptiveText: descriptiveText }),
        React.createElement(FieldGroup, { outerStartComponent: outerStartComponent, outerEndComponent: outerEndComponent, innerStartComponent: innerStartComponent, innerEndComponent: innerEndComponent, variation: variation },
            React.createElement(Input, { "aria-describedby": ariaDescribedBy, hasError: hasError, id: fieldId, ref: ref, size: size, variation: variation, ...inputStyles, ...rest })),
        React.createElement(FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/textfield)
 */
const TextField = primitiveWithForwardRef(TextFieldPrimitive);
TextField.displayName = 'TextField';

export { TextField };
