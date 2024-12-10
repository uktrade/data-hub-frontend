const {
  formatDate,
  DATE_FORMAT_FULL,
  DATE_FORMAT_MONTH_YEAR,
} = require('./utils/date-utils')

const getDateLabel = (value) =>
  value ? formatDate(value, DATE_FORMAT_FULL) : ''
const getShortDateLabel = (value) =>
  value ? formatDate(value, DATE_FORMAT_MONTH_YEAR) : ''

export const buildOptionsFilter = ({
  options = [],
  value = [],
  categoryLabel = '',
}) => {
  const optionsFilter = options.filter((option) => value.includes(option.value))
  if (categoryLabel) {
    return optionsFilter.map(({ value, label }) => ({
      value,
      label,
      categoryLabel,
    }))
  } else {
    return optionsFilter
  }
}

export const buildInputFieldFilter = ({ value, categoryLabel }) =>
  value ? [{ value, label: value, categoryLabel }] : []

export const buildDatesFilter = ({
  value,
  categoryLabel = '',
  shortDate = false,
}) =>
  value
    ? [
        {
          label: shortDate ? getShortDateLabel(value) : getDateLabel(value),
          value,
          categoryLabel,
        },
      ]
    : []

export const sanitizeFilter = (filter, categoryLabel) =>
  filter
    ? {
        [filter.queryParam]: filter.options.map(
          (option) => option.categoryLabel || categoryLabel
        ),
      }
    : {}
