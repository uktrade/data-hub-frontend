/* eslint-disable camelcase */
const { compact, get, pickBy } = require('lodash')

const { attendeeLabels } = require('./labels')
const { fetchEventAttendees } = require('./repos')

function transformServiceDeliveryToAttendeeListItem({
  contacts = [],
  company,
  date,
  id,
}) {
  const metaItems = [
    {
      key: 'company',
      value: get(company, 'name'),
      url: `/companies/${get(company, 'id')}`,
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

async function createContactItemToAttendeeSearchResult(req, event) {
  const attendees = await fetchEventAttendees({
    req,
    eventId: event.id,
    limit: 9999,
  })

  return (contact) => {
    const isExistingAttendee = existingAttendee(contact, attendees)

    if (!isExistingAttendee) {
      return {
        ...contact,
        url: `/events/${event.id}/attendees/create/${contact.id}`,
      }
    }

    const meta = contact.meta.filter((metaItem) => metaItem.type !== 'badge')
    meta.push({
      label: 'Existing',
      type: 'badge',
      value: 'Existing attendee',
    })

    return {
      ...contact,
      meta,
      isLinkDisabled: true,
    }
  }
}

function existingAttendee({ id }, attendees) {
  return attendees.results.find((attendee) => {
    const contact = attendee.contacts && attendee.contacts[0]
    return contact ? contact.id === id : false
  })
}

module.exports = {
  transformServiceDeliveryToAttendeeListItem,
  createContactItemToAttendeeSearchResult,
}
