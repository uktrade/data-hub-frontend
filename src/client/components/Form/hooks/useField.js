import { useEffect } from 'react'
import { isEmpty, castArray } from 'lodash'

import { useFormContext } from './useFormContext'

function useField({
  name,
  initialValue = '',
  validate = null,
  required = null,
}) {
  const {
    registerField,
    deregisterField,
    setFieldTouched,
    setFieldValue,
    getFieldState,
  } = useFormContext()

  function prepareValidators() {
    const validators = castArray(validate).filter((v) => v)

    if (required) {
      validators.unshift((value) => {
        if (typeof value === 'number') {
          return
        }

        return isEmpty(value) ? required : null
      })
    }

    return validators
  }

  useEffect(() => {
    registerField({ name, initialValue, validate: prepareValidators() })

    return () => {
      deregisterField(name)
    }
  }, [name])

  const fieldState = getFieldState(name, initialValue)

  return {
    name,
    value: fieldState.value,
    error: fieldState.error,
    touched: fieldState.touched,
    onChange: (e) => setFieldValue(name, e.target.value),
    onChangeFileUpload: (e) => setFieldValue(name, e.target.files),
    onBlur: () => setFieldTouched(name, true),
  }
}

export default useField
