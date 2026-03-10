import * as React from 'react';
import { ComponentClassName, classNames, classNameModifier } from '@aws-amplify/ui';
import '../Field/FieldClearButton.mjs';
import { FieldDescription } from '../Field/FieldDescription.mjs';
import { FieldErrorMessage } from '../Field/FieldErrorMessage.mjs';
import '../Field/Field.mjs';
import { Fieldset } from '../Fieldset/Fieldset.mjs';
import '../Fieldset/useFieldset.mjs';
import { Flex } from '../Flex/Flex.mjs';
import { RadioGroupContext } from './context.mjs';
import { getUniqueComponentId } from '../utils/getUniqueComponentId.mjs';
import { useStableId } from '../utils/useStableId.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { createSpaceSeparatedIds } from '../utils/createSpaceSeparatedIds.mjs';
import { ERROR_SUFFIX, DESCRIPTION_SUFFIX } from '../../helpers/constants.mjs';

const RadioGroupFieldPrimitive = ({ children, className, defaultValue, descriptiveText, errorMessage, hasError = false, id, isDisabled, isRequired, isReadOnly, legend, legendHidden = false, labelPosition, onChange, name, size, testId, value, variation, ...rest }, ref) => {
    const fieldId = useStableId(id);
    const stableId = useStableId();
    const descriptionId = descriptiveText
        ? getUniqueComponentId(stableId, DESCRIPTION_SUFFIX)
        : undefined;
    const errorId = hasError
        ? getUniqueComponentId(stableId, ERROR_SUFFIX)
        : undefined;
    const ariaDescribedBy = createSpaceSeparatedIds([errorId, descriptionId]);
    const radioGroupTestId = getUniqueComponentId(testId, ComponentClassName.RadioGroup);
    const radioGroupContextValue = React.useMemo(() => ({
        currentValue: value,
        defaultValue,
        hasError,
        isRequired,
        isReadOnly,
        isGroupDisabled: isDisabled,
        onChange,
        size,
        name,
        labelPosition,
    }), [
        defaultValue,
        hasError,
        isDisabled,
        isRequired,
        isReadOnly,
        onChange,
        size,
        name,
        value,
        labelPosition,
    ]);
    return (React.createElement(Fieldset, { className: classNames(ComponentClassName.Field, classNameModifier(ComponentClassName.Field, size), ComponentClassName.RadioGroupField, className), isDisabled: isDisabled, legend: legend, legendHidden: legendHidden, ref: ref, role: "radiogroup", size: size, testId: testId, variation: variation, ...rest },
        React.createElement(FieldDescription, { id: descriptionId, labelHidden: legendHidden, descriptiveText: descriptiveText }),
        React.createElement(Flex, { "aria-describedby": ariaDescribedBy, className: ComponentClassName.RadioGroup, id: fieldId, testId: radioGroupTestId },
            React.createElement(RadioGroupContext.Provider, { value: radioGroupContextValue }, children)),
        React.createElement(FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/radiogroupfield)
 */
const RadioGroupField = primitiveWithForwardRef(RadioGroupFieldPrimitive);
RadioGroupField.displayName = 'RadioGroupField';

export { RadioGroupField };
