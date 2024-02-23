import React from 'react'
import { capitalize, isBoolean, isNumber, lowerCase } from 'lodash'

import { NOT_SET, PROJECT_FIELD_NAME_TO_LABEL_MAP } from './constants'
import {
  formatMediumDate,
  formatMediumDateTime,
  isDateValid,
} from '../../../../utils/date'
import { currencyGBP } from '../../../../utils/number-utils'
import {
  NO,
  YES,
} from '../../../Companies/CompanyBusinessDetails/CompanyEditHistory/constants'

const CURRENCY_FIELDS = [
  'Total investment',
  'Foreign equity investment',
  'Gross Value Added (GVA)',
]

const INVERTED_BOOL_FIELDS = [
  'Can client provide total investment value?',
  'Can client provide capital expenditure value?',
]

const mapFieldNameToLabel = (fieldName) =>
  PROJECT_FIELD_NAME_TO_LABEL_MAP[fieldName] || capitalize(lowerCase(fieldName))

const unwrapFromArray = (change) => {
  if (Array.isArray(change)) {
    return change.length > 1 ? change : change[0] || null
  }
  return change
}

const transformChanges = (changes) =>
  Object.keys(changes).map((fieldName) => ({
    fieldName: mapFieldNameToLabel(fieldName),
    oldValue: unwrapFromArray(changes[fieldName][0]),
    newValue: unwrapFromArray(changes[fieldName][1]),
  }))

const getValue = (value, field) =>
  CURRENCY_FIELDS.includes(field) && isNumber(value)
    ? currencyGBP(value)
    : isBoolean(value) && INVERTED_BOOL_FIELDS.includes(field)
      ? value
        ? NO
        : YES
      : isBoolean(value)
        ? value
          ? YES
          : NO
        : isNumber(value)
          ? value.toString()
          : Array.isArray(value)
            ? value.join(', ')
            : isDateValid(value)
              ? formatMediumDate(value)
              : value || NOT_SET

const getBadgeText = (length) =>
  length == 1 ? '1 change' : length + ' changes'

const transformProjectAuditLogItem = (logItem) => {
  const changesSaved = !!Object.keys(logItem.changes).length
  const metadata = []
  const transformedChanges = transformChanges(logItem.changes)

  changesSaved
    ? transformedChanges.map(
        (change, index) =>
          metadata.push({
            key: `${logItem.id}-${index}-field-name`,
            value: <strong>{change.fieldName}</strong>,
          }) &&
          metadata.push({
            key: `${logItem.id}-${index}-old-value`,
            label: 'Information before change: ',
            value: getValue(change.oldValue, change.fieldName),
          }) &&
          metadata.push({
            label: 'Information after change: ',
            key: `${logItem.id}-${index}-new-value`,
            value: getValue(change.newValue, change.fieldName),
          })
      )
    : metadata.push({
        value: 'No changes were made to the project in this update',
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
    headingText: `Updated on ${formatMediumDateTime(logItem.timestamp)} by ${logItem.user.name ? logItem.user.name : logItem.user.email}`,
  }
}

export const transformAuditResponseToCollection = (results = []) =>
  results.map((result) => transformProjectAuditLogItem(result))
