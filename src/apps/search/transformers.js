const { formatDateTime } = require('../../config/nunjucks/filters')

const COUNTRY_HISTORY_TYPE_TEXT = {
  insert: 'added to',
  delete: 'removed from',
}
const COUNTRY_TYPE_TEXT = {
  future_interest: 'future countries of interest',
  currently_exporting: 'currently exporting',
  not_interested: 'countries of no interest',
}

function getCountryText(country, historyType, status) {
  const historyTypeText = COUNTRY_HISTORY_TYPE_TEXT[historyType]
  const typeText = COUNTRY_TYPE_TEXT[status]

  return [country, historyTypeText, typeText].join(' ')
}

function createCountry(item) {
  return {
    headingText: getCountryText(
      item.country.name,
      item.history_type,
      item.status
    ),
    metadata: [
      { label: 'By', value: item.history_user.name },
      { label: 'Date', value: formatDateTime(item.history_date) },
    ],
  }
}

module.exports = {
  transformFullExportHistory: (data) => data.map(createCountry),
}
