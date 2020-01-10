const { isArray, isEmpty, lowerCase, capitalize } = require('lodash')

const {
  AUTOMATIC_UPDATE,
  EXCLUDED_FIELDS,
  COMPANY_FIELD_NAME_TO_LABEL_MAP,
} = require('./constants')

function mapFieldNameToLabel(fieldName) {
  return (
    COMPANY_FIELD_NAME_TO_LABEL_MAP[fieldName] ||
    capitalize(lowerCase(fieldName))
  )
}

const unwrapFromArray = (change) =>
  isArray(change)
    ? isEmpty(change)
      ? null
      : change.length === 1
      ? change.pop()
      : change
    : change

const transformChanges = (changes) => {
  return Object.keys(changes)
    .filter((fieldName) => !EXCLUDED_FIELDS.includes(fieldName))
    .map((fieldName) => ({
      fieldName: mapFieldNameToLabel(fieldName),
      oldValue: unwrapFromArray(changes[fieldName][0]),
      newValue: unwrapFromArray(changes[fieldName][1]),
    }))
}

const transformCompanyAuditLogItem = ({ timestamp, user, changes }) => {
  const changedBy = user
    ? isEmpty(user.name)
      ? user.email
      : user.name
    : AUTOMATIC_UPDATE

  return {
    timestamp,
    changedBy,
    changes: transformChanges(changes),
  }
}

const transformCompanyAuditLog = (auditLog) => {
  return auditLog.map((item) => transformCompanyAuditLogItem(item))
}

module.exports = {
  transformCompanyAuditLog,
}
