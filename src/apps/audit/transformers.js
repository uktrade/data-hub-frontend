/* eslint camelcase: 0 */
const { isArray, isPlainObject } = require('lodash')
const dateFns = require('date-fns')
const { mediumDateTimeFormat } = require('../../../config')
const { buildPagination } = require('../../lib/pagination')

function transformChanges (changes, labels) {
  return Object.keys(changes)
    .map(key => labels[key] || key)
    .join(', ')
}

function getChangeCountDisplay (changeCount) {
  if (changeCount === 0) {
    return 'No changes saved'
  }

  if (changeCount === 1) {
    return `${changeCount} change`
  }

  return `${changeCount} changes`
}

function transformAuditLogToListItem (logEntry, labels = {}) {
  const changeCount = (logEntry.changes && Object.keys(logEntry.changes).length) || 0

  return {
    type: 'audit',
    name: dateFns.format(logEntry.timestamp, mediumDateTimeFormat),
    contentMetaModifier: 'stacked',
    meta: [{
      label: 'Adviser',
      value: logEntry.user.name,
    }, {
      label: 'Change count',
      type: 'badge',
      value: getChangeCountDisplay(changeCount),
    }, {
      label: 'Fields',
      value: transformChanges(logEntry.changes, labels),
    }],
  }
}

function transformAuditLogToCollection (auditData, labels = {}, options = {}) {
  if (!isPlainObject(auditData)) { return }
  const resultItems = auditData.results
  if (!isArray(resultItems)) { return }

  const items = resultItems.map((resultItem) => {
    return transformAuditLogToListItem(resultItem, labels)
  })

  return {
    items,
    count: items.length,
    countLabel: 'log entry',
    pagination: buildPagination(options.query, auditData),
  }
}

module.exports = {
  transformAuditLogToCollection,
}
