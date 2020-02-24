import React from 'react'

import { InputField } from 'govuk-react'
import multiInstance from '../utils/multiinstance'
import { VALIDATED_INPUT__CHANGE } from '../actions'

/**
 * Input field with added validation mechanism.
 * @description wraps the govuk-react InputField component, accepts the same
 * props and adds two more.
 * @param {Object} props - Props
 * @param {string} props.id - Id under which the state of the component is
 * stored.validatedInput.
 * @param {(value: string) => falsy | string} props.validator
 * - A function which takes a value and should return a string describing the
 * error if the value if invalid.
 */
export default multiInstance({
  name: 'ValidatedInput',
  reducer: (state = {}, { type, ...action }) =>
    type === VALIDATED_INPUT__CHANGE ? action : state,
  component: ({
    dispatch,
    validationError,
    id,
    validator,
    error,
    ...props
  }) => (
    <InputField
      {...props}
      meta={{ touched: true, error: validationError || error }}
      onChange={(e) => {
        const validationError = validator(e.target.value)
        dispatch({
          type: VALIDATED_INPUT__CHANGE,
          ...(validationError ? { validationError } : {}),
        })
        props.onChange && props.onChange(e)
      }}
    />
  ),
})
