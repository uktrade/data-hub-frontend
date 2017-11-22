/* eslint camelcase: 0 */
const { get } = require('lodash')
const dateFns = require('date-fns')
const { mediumDateTimeFormat } = require('../../../config')

/**
 * Transforms an audit log of changes into a common seperated list
 * summerizing the fields that were modified in the change.
 *
 * Note that the field name that changed is stripped of '_id', if it ends in it.
 * by convention the back end API includes the _id part of a fieldname in the
 * original table even though all of references to the field do not include it
 *
 *
 * @param {Array[Object]} changes
 * @param {Object} labels
 */
function transformChanges (changes, labels) {
  return Object.keys(changes)
    .map(key => labels[key] || labels[key.replace(/_id$/, '')] || key)
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

function transformAuditLogToListItem (labels = {}) {
  return function transformAuditLogItem (logEntry) {
    const changeCount = (logEntry.changes && Object.keys(logEntry.changes).length) || 0

    return {
      type: 'audit',
      name: dateFns.format(logEntry.timestamp, mediumDateTimeFormat),
      contentMetaModifier: 'stacked',
      meta: [{
        label: 'Adviser',
        value: get(logEntry, 'user.name') || 'Unknown adviser',
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
}

module.exports = {
  transformAuditLogToListItem,
  transformChanges,
}
