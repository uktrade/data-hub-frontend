const guid = require('@uktrade/trade_elements').guid

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

function encodeQueryData (data) {
  const ret = []
  for (const key in data) {
    const item = data[key]

    if (Array.isArray(item)) {
      for (const innerValue of item) {
        ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(innerValue))
      }
    } else {
      ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(item))
    }
  }
  return ret.join('&')
}

function convertAutosuggestCollection (form, targetFieldName) {
  const lowerTargetFieldName = targetFieldName.toLocaleLowerCase()
  const fieldNames = Object.keys(form)

  form[targetFieldName] = []

  for (const fieldName of fieldNames) {
    if (fieldName.toLocaleLowerCase().substr(0, targetFieldName.length) === lowerTargetFieldName) {
      form[targetFieldName].push({
        id: form[fieldName],
        name: form[`${fieldName}-display`]
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
          .filter(item =>
            ((item && item.id && item.id !== null && item.id.length > 0) || (item !== null && item.length > 0)))
          .map(item => item.id)
      } else if (typeof fieldValue === 'object' && 'id' in fieldValue) {
        data[fieldName] = fieldValue.id
      }
    }
  }
}

function nullEmptyFields (data) {
  const fieldNames = Object.keys(data)
  for (const fieldName of fieldNames) {
    const fieldValue = data[fieldName]
    if (fieldValue !== null && fieldValue.length === 0) {
      data[fieldName] = null
    }
  }
}

function genCSRF (req, res) {
  const token = guid()
  req.session.csrfToken = token
  res.locals.csrfToken = token
  return token
}

function isBlank (thing) {
  return (!thing || thing.length === 0)
}

function toQueryString (obj) {
  const parts = []
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}`)
    }
  }
  return parts.join('&')
}

module.exports = {
  transformErrors,
  encodeQueryData,
  convertAutosuggestCollection,
  flattenIdFields,
  nullEmptyFields,
  genCSRF,
  isBlank,
  toQueryString
}
