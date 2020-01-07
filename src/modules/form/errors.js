const { compact, map, reduce } = require('lodash')

const validators = require('./validators')

const getErrorMessages = (validations, requestBody, fieldName) => {
  return compact(
    map(validations || [], (validation) => {
      const canValidate = !validation.when || validation.when(requestBody)
      const hasPassedValidation = validators[validation.type](
        requestBody[fieldName]
      )
      if (canValidate && !hasPassedValidation) {
        return validation.message
      }
    })
  )
}

const getErrors = (children, requestBody) => {
  const errors = reduce(
    children,
    (obj, { name, validations, options }) => {
      const fieldErrorMessages = getErrorMessages(
        validations,
        requestBody,
        name
      )
      const subFieldErrors = reduce(
        options,
        (option, { children }) => getErrors(children, requestBody),
        {}
      )

      return {
        ...obj,
        ...(fieldErrorMessages.length
          ? { [name]: fieldErrorMessages }
          : undefined),
        ...subFieldErrors,
      }
    },
    {}
  )

  return errors || {}
}

module.exports = {
  getErrors,
}
