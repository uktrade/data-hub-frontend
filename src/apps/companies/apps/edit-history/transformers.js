const { isEmpty, capitalize, lowerCase } = require('lodash')

const { AUTOMATIC_UPDATE } = require('./constants')

const {
  EXCLUDED_FIELDS,
  COMPANY_FIELD_NAME_TO_LABEL_MAP,
} = require('./constants')

function mapFieldNameToLabel(fieldName) {
  return (
    COMPANY_FIELD_NAME_TO_LABEL_MAP[fieldName] ||
    capitalize(lowerCase(fieldName))
  )
}

const unwrapFromArray = (change) => {
  if (Array.isArray(change)) {
    return change.length > 1 ? change : change[0] || null
  }
  return change
}

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
  return auditLog.map(transformCompanyAuditLogItem)
}

module.exports = { transformCompanyAuditLog }
