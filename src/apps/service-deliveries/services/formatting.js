const { formatLongDate } = require('../../../../common/date')
const { newlineToBr, getContactLink } = require('../../../lib/text-formatting')
const { getPropertyName } = require('../../../lib/property-helpers')

function getDisplayServiceDelivery (serviceDelivery) {
  if (!serviceDelivery) {
    return null
  }
  const result = {
    company: `<a href="/companies/${serviceDelivery.company.id}">${serviceDelivery.company.name}</a>`,
    dit_team: getPropertyName(serviceDelivery, 'dit_team'),
    service: getPropertyName(serviceDelivery, 'service'),
    status: getPropertyName(serviceDelivery, 'status'),
    subject: serviceDelivery.subject,
    notes: newlineToBr(serviceDelivery.notes),
    date: formatLongDate(serviceDelivery.date),
    dit_adviser: getPropertyName(serviceDelivery, 'dit_adviser'),
    uk_region: getPropertyName(serviceDelivery, 'uk_region'),
    sector: getPropertyName(serviceDelivery, 'sector'),
    contact: getContactLink(serviceDelivery),
    country_of_interest: getPropertyName(serviceDelivery, 'country_of_interest'),
  }

  return result
}

module.exports = { getDisplayServiceDelivery }
