import React from 'react'
import { capitalize, isEmpty, lowerCase } from 'lodash'

import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../utils/date-utils'
import { AUTOMATIC_UPDATE } from './constants'

export const transformFieldName = (fieldName) =>
  capitalize(lowerCase(fieldName))

const unwrapFromArray = (change) =>
  Array.isArray(change)
    ? change.length > 1
      ? change
      : change[0] || null
    : change

const transformChanges = (changes, fieldMapper, excludedFields) =>
  Object.keys(changes)
    .filter((fieldName) => !excludedFields.includes(fieldName))
    .map((fieldName) => ({
      fieldName: fieldMapper(fieldName),
      oldValue: unwrapFromArray(changes[fieldName][0]),
      newValue: unwrapFromArray(changes[fieldName][1]),
    }))

const getUpdatedBy = (timestamp, user) => {
  const formattedTime = formatDate(timestamp, DATE_FORMAT_MEDIUM_WITH_TIME)
  const changedBy = user
    ? isEmpty(user?.name)
      ? user?.email
      : user?.name
    : AUTOMATIC_UPDATE
  return changedBy === AUTOMATIC_UPDATE
    ? `Automatically updated on ${formattedTime}`
    : `Updated on ${formattedTime} by ${changedBy}`
}

const getBadgeText = (length) =>
  length == 1 ? '1 change' : length + ' changes'

const transformAuditLogItem = (
  logItem,
  valueTransformer,
  fieldMapper,
  excludedFields,
  auditType
) => {
  const changesSaved = !!Object.keys(logItem.changes).length
  const metadata = []
  const transformedChanges = transformChanges(
    logItem.changes,
    fieldMapper,
    excludedFields
  )

  changesSaved
    ? transformedChanges.map(
        (change, index) =>
          metadata.push({
            key: `${logItem.id}-${index}-field-name`,
            label: <strong>{change.fieldName}</strong>,
          }) &&
          metadata.push({
            key: `${logItem.id}-${index}-old-value`,
            label: 'Information before change: ',
            value: valueTransformer(change.oldValue, change.fieldName),
          }) &&
          metadata.push({
            label: 'Information after change: ',
            key: `${logItem.id}-${index}-new-value`,
            value: valueTransformer(change.newValue, change.fieldName),
          })
      )
    : metadata.push({
        label: `No changes were made to ${auditType} in this update`,
      })

  const badges = [
    {
      text: changesSaved ? getBadgeText(transformedChanges.length) : '',
    },
  ]

  return {
    id: logItem.id,
    metadata: metadata,
    badges: badges.filter((item) => item.text),
    headingText: getUpdatedBy(logItem.timestamp, logItem.user),
  }
}

export const transformAuditResponseToCollection = (
  results = [],
  valueTransformer,
  fieldMapper,
  excludedFields,
  auditType
) =>
  results.map((result) =>
    transformAuditLogItem(
      result,
      valueTransformer,
      fieldMapper,
      excludedFields,
      auditType
    )
  )
