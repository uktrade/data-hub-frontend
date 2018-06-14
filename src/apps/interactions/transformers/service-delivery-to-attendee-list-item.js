/* eslint-disable camelcase */
const { compact, pickBy } = require('lodash')

const labels = require('../labels')

function transformServiceDeliveryToAttendeeListItem ({ contact, company, date, id }) {
  if (!contact || !company) { return }

  const { attendeeLabels } = labels

  const {
    id: contactId,
    name,
    job_title,
  } = contact

  const metaItems = [
    { key: 'company', value: company.name, url: `/companies/${company.id}` },
    { key: 'job_title', value: job_title },
    { key: 'attended_date', value: date, type: 'date' },
    { key: 'service_delivery', value: 'View service delivery', url: `/interactions/${id}` },
  ]
    .filter(({ value }) => value)
    .map(({ key, value, type, url }) => ({
      ...pickBy({ value, type, url }),
      label: attendeeLabels[key],
    }))

  return {
    id: contactId,
    type: 'contact',
    name,
    meta: compact(metaItems),
  }
}

module.exports = transformServiceDeliveryToAttendeeListItem
