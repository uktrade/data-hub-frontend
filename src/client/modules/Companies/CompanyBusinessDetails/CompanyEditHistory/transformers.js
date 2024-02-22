import { isBoolean, isNumber, isEmpty, capitalize, lowerCase } from 'lodash'

import { formatMediumDateTime, isDateValid } from '../../../../utils/date'
import {
  EXCLUDED_FIELDS,
  COMPANY_FIELD_NAME_TO_LABEL_MAP,
  AUTOMATIC_UPDATE,
  YES,
  NO,
  ARCHIVED,
  NOT_ARCHIVED,
  NOT_SET,
  HEADQUARTER_TYPES,
} from './constants'
import { currencyGBP } from '../../../../utils/number-utils'

const mapFieldNameToLabel = (fieldName) =>
  COMPANY_FIELD_NAME_TO_LABEL_MAP[fieldName] || capitalize(lowerCase(fieldName))

const unwrapFromArray = (change) =>
  Array.isArray(change)
    ? change.length > 1
      ? change
      : change[0] || null
    : change

const transformChanges = (changes) =>
  Object.keys(changes)
    .filter((fieldName) => !EXCLUDED_FIELDS.includes(fieldName))
    .map((fieldName) => ({
      fieldName: mapFieldNameToLabel(fieldName),
      oldValue: unwrapFromArray(changes[fieldName][0]),
      newValue: unwrapFromArray(changes[fieldName][1]),
    }))

const getUpdatedBy = (timestamp, user) => {
  const formattedTime = formatMediumDateTime(timestamp)
  const changedBy = user
    ? isEmpty(user?.name)
      ? user?.email
      : user?.name
    : AUTOMATIC_UPDATE
  return changedBy === AUTOMATIC_UPDATE
    ? `Automatically updated on ${formattedTime}`
    : `Updated on ${formattedTime} by ${changedBy}`
}

const getValueFromBoolean = (value, field) => {
  if (
    field === 'Is number of employees estimated' ||
    field === 'Is turnover estimated'
  ) {
    return value ? YES : NO
  }

  if (field === 'Archived') {
    return value ? ARCHIVED : NOT_ARCHIVED
  }
}

const getValue = (value, field) =>
  isBoolean(value)
    ? getValueFromBoolean(value, field)
    : isNumber(value)
      ? field === 'Turnover'
        ? currencyGBP(value, {
            maximumSignificantDigits: 2,
          })
        : value.toString()
      : isDateValid(value)
        ? formatMediumDateTime(value)
        : field === 'Headquarter type'
          ? HEADQUARTER_TYPES[value] || NOT_SET
          : value || NOT_SET

const getBadgeText = (length) =>
  length == 1 ? '1 change' : length + ' changes'

const transformCompanyAuditLogItem = (logItem) => {
  const changesSaved = !!Object.keys(logItem.changes).length
  const metadata = []
  const transformedChanges = transformChanges(logItem.changes)

  changesSaved
    ? transformedChanges.map(
        (change, index) =>
          metadata.push({
            key: `${logItem.id}-${index}-field-name`,
            value: change.fieldName,
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
        value: 'No changes were made to business details in this update',
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

export const transformResponseToCollection = (results = []) =>
  results.map((result) => transformCompanyAuditLogItem(result))
