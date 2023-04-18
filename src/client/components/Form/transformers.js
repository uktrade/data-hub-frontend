const REQUIRED_ERROR = 'This field is required.'
const BLANK_ERROR = 'This field may not be blank.'

export const mapErrorMessages = (errors) =>
  errors &&
  Object.entries(errors).reduce((obj, [fieldName, errorMessages]) => {
    const displayFieldName = fieldName.replaceAll('_', ' ')

    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
      obj[fieldName] = errorMessages
        .map((errorMessage) => {
          if (errorMessage === REQUIRED_ERROR || errorMessage == BLANK_ERROR) {
            return `Enter a ${displayFieldName}`
          }
          return errorMessage
        })
        .join(' ')
    } else {
      obj[fieldName] = `An error occured on field ${displayFieldName}`
    }

    return obj
  }, {})
