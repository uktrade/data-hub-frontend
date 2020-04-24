const { capitalize, lowerCase } = require('lodash')

// TODO: when receive updated list of edit history labels from users,
// add EXCLUDED_FIELDS and FIELD_NAME_TO_LABEL_MAP
// see example in src/apps/companies/apps/edit-history/controller.js

function mapFieldNameToLabel(fieldName) {
  return capitalize(lowerCase(fieldName))
}

const unwrapFromArray = (change) => {
  if (Array.isArray(change)) {
    return change.length > 1 ? change : change[0] || null
  }
  return change
}

const transformChanges = (changes) => {
  return Object.keys(changes).map((fieldName) => ({
    fieldName: mapFieldNameToLabel(fieldName),
    oldValue: unwrapFromArray(changes[fieldName][0]),
    newValue: unwrapFromArray(changes[fieldName][1]),
  }))
}

const transformAuditLogItem = ({ timestamp, user, changes }) => {
  const changedBy = user ? user.name || user.email : null

  return {
    timestamp,
    changedBy,
    changes: transformChanges(changes),
  }
}

const transformAuditLog = (auditLog) => {
  return auditLog.map(transformAuditLogItem)
}

module.exports = { transformAuditLog }
