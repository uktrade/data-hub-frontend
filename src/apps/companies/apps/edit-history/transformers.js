/* eslint-disable camelcase */
const { isArray, isEmpty } = require('lodash')

const unwrapFromArray = change =>
  isArray(change)
    ? isEmpty(change)
      ? null
      : change.pop()
    : change

const transformChanges = (changes) => {
  return Object.keys(changes).map(key => {
    return {
      fieldName: key,
      oldValue: unwrapFromArray(changes[key][0]),
      newValue: unwrapFromArray(changes[key][1]),
    }
  })
}

const transformCompanyAuditLogItem = ({
  timestamp,
  user,
  changes,
}) => {
  return {
    timestamp,
    adviserFullName: `${user.first_name} ${user.last_name}`,
    changes: transformChanges(changes),
  }
}

const transformCompanyAuditLog = (audit) => {
  return audit.map((item) => transformCompanyAuditLogItem(item))
}

module.exports = {
  transformCompanyAuditLog,
}
