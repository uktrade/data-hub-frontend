// TODO: remove this in favour of a validation library like Joi or express validator

function isBlank(thing) {
  return !thing || thing.length === 0
}

function containsFormData(req) {
  return typeof req.body === 'object' && Object.keys(req.body).length > 0
}

function isValidGuid(string) {
  return /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.test(
    string
  )
}

function getDataLabels(data, labels) {
  if (!data) {
    return
  }
  if (!labels) {
    return data
  }

  return Object.keys(labels).reduce((obj, key) => {
    obj[labels[key]] = data[key]
    return obj
  }, {})
}

// Prevent XSS
// See: https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html
function isUrlSafe(req, url) {
  const baseUrl = `${req.encrypted ? 'https' : req.protocol}://${req.get(
    'host'
  )}`
  const parsedUrl = new URL(url, baseUrl)
  return url && parsedUrl.origin === baseUrl
}

module.exports = {
  getDataLabels,
  isBlank,
  isValidGuid,
  containsFormData,
  isUrlSafe,
}
