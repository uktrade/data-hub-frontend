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
  isBlank,
  isValidGuid,
  containsFormData,
}
