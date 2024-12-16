const { subMonths } = require('date-fns')

const {
  formatDate,
  DATE_FORMAT_INTERACTION_TIMESTAMP,
} = require('../../../client/utils/date-utils')

function getInteractionTimestamp({ offset }) {
  const date = new Date()

  if (offset > 0) {
    subMonths(date, offset)
  }

  return formatDate(date, DATE_FORMAT_INTERACTION_TIMESTAMP)
}

module.exports = {
  getInteractionTimestamp,
}
