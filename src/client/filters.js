const { formatLongDate, formatShortDate } = require('./utils/date')

const getDateLabel = (value) => (value ? formatLongDate(value) : '')
const getShortDateLabel = (value) => (value ? formatShortDate(value) : '')

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
