// TODO: remove this in favour of a validation library like Joi or express validator

function isValidGuid(string) {
  return /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.test(
    string
  )
}

module.exports = {
  isValidGuid,
}
