function transformErrors (sourceErrors) {
  if (!sourceErrors) {
    return null
  }
  const errors = {}
  const keys = Object.keys(sourceErrors)
  if (keys.length === 0) {
    return null
  }

  for (const key of keys) {
    errors[key] = [sourceErrors[key].msg]
  }

  return errors
}

function convertAutosuggestCollection (form, targetFieldName) {
  const lowerTargetFieldName = targetFieldName.toLocaleLowerCase()
  const fieldNames = Object.keys(form)

  form[targetFieldName] = []

  for (const fieldName of fieldNames) {
    if (fieldName.toLocaleLowerCase().substr(0, targetFieldName.length) === lowerTargetFieldName) {
      form[targetFieldName].push({
        id: form[fieldName],
        name: form[`${fieldName}-display`],
      })
      delete form[`${fieldName}-display`]
      delete form[fieldName]
    }
  }
}

// Scans the properties of an object (forms) and turns data.x = {id:123, name:'y'} into data.x=123
// This is used so that when a forms posts back an nested object (in the same format it was given the data
// it is flattened in to the alternative format used by the server.

function flattenIdFields (data) {
  const fieldNames = Object.keys(data)
  for (const fieldName of fieldNames) {
    const fieldValue = data[fieldName]
    if (fieldValue !== null) {
      if (Array.isArray(fieldValue)) {
        // Scan through the array of values, strip out any that are null, empty or have a null or empty id
        data[fieldName] = fieldValue
          .filter(item => (item && item.id))
          .map(item => item.id)
      } else if (typeof fieldValue === 'object' && 'id' in fieldValue) {
        data[fieldName] = fieldValue.id
      }
    }
  }
}

// TODO: remove this in favour of a validation library like Joi or express validator
function isBlank (thing) {
  return (!thing || thing.length === 0)
}

function containsFormData (req) {
  return (typeof req.body === 'object' && Object.keys(req.body).length > 0)
}

function isValidGuid (string) {
  return /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.test(string)
}

function getDataLabels (data, labels) {
  if (!data) { return }
  if (!labels) { return data }

  return Object.keys(labels).reduce((obj, key) => {
    obj[labels[key]] = data[key]
    return obj
  }, {})
}

module.exports = {
  getDataLabels,
  transformErrors,
  convertAutosuggestCollection,
  flattenIdFields,
  isBlank,
  isValidGuid,
  containsFormData,
}
