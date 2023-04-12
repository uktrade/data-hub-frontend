const REQUIRED_ERROR = 'This field is required.'

export const mapErrorMessages = (errors) =>
  Object.entries(errors).reduce((obj, [fieldName, errorMessages]) => {
    const displayFieldName = fieldName.replaceAll('_', ' ')

    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
      obj[fieldName] = errorMessages
        .map((errorMessage) => {
          if (errorMessage === REQUIRED_ERROR) {
            return `The ${displayFieldName} field is required.`
          }
          return errorMessage
        })
        .join(' ')
    } else {
      obj[fieldName] = `An error occured on field ${displayFieldName}`
    }

    return obj
  }, {})
