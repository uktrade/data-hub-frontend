/* eslint camelcase: 0 */
const { isArray, isPlainObject } = require('lodash')
const dateFns = require('date-fns')
const { mediumDateFormat } = require('../../../config')

function transformChanges (changes, labels) {
  return Object.keys(changes)
    .map(key => labels[key] || key)
    .join(', ')
}

function transformAuditLogToListItem (logEntry, labels = {}) {
  const changeCount = (logEntry.changes && Object.keys(logEntry.changes).length) || 0

  return {
    type: 'audit',
    name: dateFns.format(logEntry.timestamp, `${mediumDateFormat}, HH:MMa`),
    contentMetaModifier: 'stacked',
    meta: [{
      label: 'Advisor',
      value: logEntry.user.name,
    }, {
      label: 'Change count',
      type: 'badge',
      value: changeCount > 0 ? `${changeCount} changes` : 'No changes saved',
    }, {
      label: 'Fields',
      value: transformChanges(logEntry.changes, labels),
    }],
  }
}

function transformAuditLogToCollection (auditData, labels = {}) {
  if (!isPlainObject(auditData)) { return }
  const resultItems = auditData.results
  if (!isArray(resultItems)) { return }

  const items = resultItems.map((resultItem) => {
    return transformAuditLogToListItem(resultItem, labels)
  })

  return {
    count: resultItems.length,
    items,
    pagination: null,
    countLabel: 'log entry',
  }
}

module.exports = {
  transformAuditLogToCollection,
}
