const { get } = require('lodash')
const { format, isValid } = require('date-fns')

function transformInteractionResponseToForm ({
  id,
  dit_team,
  subject,
  notes,
  contact,
  date,
  event,
  status,
  dit_adviser,
  service,
  uk_region,
  sector,
  country_of_interest,
} = {}) {
  if (!id) { return null }

  const isValidDate = isValid(new Date(date))

  return {
    subject,
    notes,
    date: {
      day: isValidDate ? format(date, 'DD') : '',
      month: isValidDate ? format(date, 'MM') : '',
      year: isValidDate ? format(date, 'YYYY') : '',
    },
    event: get(event, 'id'),
    status: get(status, 'id'),
    contact: get(contact, 'id'),
    dit_adviser: get(dit_adviser, 'id'),
    service: get(service, 'id'),
    uk_region: get(uk_region, 'id'),
    dit_team: get(dit_team, 'id'),
    sector: get(sector, 'id'),
    country_of_interest: get(country_of_interest, 'id'),
  }
}

module.exports = {
  transformInteractionResponseToForm,
}
