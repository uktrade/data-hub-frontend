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
// V2 source errors come in a fairly useless format, which we have to fix here
function transformV2Errors (sourceErrors) {
  if (!sourceErrors) {
    return null
  }

  const errors = {}
  const req = ' is required'
  const typeMatcher = new RegExp(/.*type': '(.*)'}}.*/)

  sourceErrors.forEach((err) => {
    // deal with errors which do not contain a source for the error
    if (typeof err.detail === 'string') {
      if (err.source.pointer === '/data/attributes/subject') {
        errors.subject = 'Subject' + req
      }

      if (err.source.pointer === '/data/attributes/notes') {
        errors.notes = 'Notes are required'
      }
      // this error only occurs if the service delivery exists and there are no other errors
      if (err.detail === 'This combination of service and service provider does not exist.') {
        errors.Alert = 'This combination of service and service provider does not exist.'
      }

      // most errors come in this form: {"errors":[{"detail":"{'data': {'type': 'UKRegion'}} has no key id",
      if (err.detail.startsWith('{\'data')) {
        let type = typeMatcher.exec(err.detail)
        if (type.length > 1) {
          if (type[1] === 'Country') {
            errors.country_of_interest = type[1] + req
          } else if (type[1] === 'ServiceDeliveryStatus') {
            errors.status = 'Status ' + req
          } else if (type[1] === 'Team') {
            errors.dit_team = 'Service provider ' + req
          } else if (type[1] === 'UKRegion') {
            errors.uk_region = 'UK Region ' + req
          } else {
            errors[type[1].toLowerCase()] = type[1] + req
          }
        }
      }
    }
  })
  return errors
}

// TODO this is very similar to /src/lib/url-helpers.buildQueryString Maybe time for a common folder?
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

function containsFormData (req) {
  return (typeof req.body === 'object' && Object.keys(req.body).length > 0)
}

function isValidGuid (string) {
  return /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.test(string)
}

module.exports = {
  transformErrors,
  transformV2Errors,
  encodeQueryData,
  convertAutosuggestCollection,
  flattenIdFields,
  isBlank,
  isValidGuid,
  toQueryString,
  containsFormData,
}
