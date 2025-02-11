const { compact, get, pickBy } = require('lodash')

const { attendeeLabels } = require('./labels')

function transformServiceDeliveryToAttendeeListItem({
  contacts = [],
  companies = [],
  date,
  id,
}) {
  const metaItems = [
    {
      key: 'company',
      value: get(companies[0], 'name'),
      url: `/companies/${get(companies[0], 'id')}`,
    },
    {
      key: 'job_title',
      value: contacts.length ? contacts[0].job_title : 'Not available',
    },
    { key: 'attended_date', value: date, type: 'date' },
    {
      key: 'service_delivery',
      value: 'View or edit service delivery',
      url: `/interactions/${id}`,
    },
  ]
    .filter(({ value }) => value)
    .map(({ key, value, type, url }) => ({
      ...pickBy({ value, type, url }),
      label: attendeeLabels[key],
    }))

  const listItem = contacts.length
    ? {
        id: contacts[0].id,
        type: 'contact',
        name: contacts[0].name,
        meta: compact(metaItems),
      }
    : {
        id,
        type: 'interaction',
        name: 'No contact assigned',
        meta: compact(metaItems),
      }
  return listItem
}

module.exports = {
  transformServiceDeliveryToAttendeeListItem,
}
