const { isArray, isEmpty } = require('lodash')

const { AUTOMATIC_UPDATE } = require('./constants')

const EXCLUDED_FIELDS = [
  'global_ultimate_duns_number',
  'dnb_modified_on',
  'archived_on',
  'archived_by',
]

const unwrapFromArray = change =>
  isArray(change)
    ? isEmpty(change)
      ? null
      : change.length === 1
        ? change.pop()
        : change
    : change

const transformChanges = (changes) => {
  return Object.keys(changes)
    .filter(fieldName => !EXCLUDED_FIELDS.includes(fieldName))
    .map(fieldName => ({
      fieldName,
      oldValue: unwrapFromArray(changes[fieldName][0]),
      newValue: unwrapFromArray(changes[fieldName][1]),
    }))
}

const transformCompanyAuditLogItem = ({
  timestamp,
  user,
  changes,
}) => {
  const changedBy =
    user
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
  return auditLog
    .map((item) => transformCompanyAuditLogItem(item))
    .filter(({ changes }) => changes.length)
}

module.exports = {
  transformCompanyAuditLog,
}
