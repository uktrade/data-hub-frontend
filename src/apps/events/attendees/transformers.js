/* eslint-disable camelcase */
const { compact, get, pickBy } = require('lodash')

const { attendeeLabels } = require('./labels')
const { fetchEventAttendees } = require('./repos')

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

async function createContactItemToAttendeeSearchResult(req, event) {
  const attendees = await fetchEventAttendees({
    req,
    eventId: event.id,
    limit: 9999,
  })

  return (contact) => {
    const isExistingAttendee = existingAttendee(contact, attendees)

    //so this basically just creates an item to be displayed that just links to the attendee creation page
    //it doesn't necessarily create an attendee unless the user goes out of their way to click the link
    //so to test this we'll need to
    // - Make an attendee that doesn't yet exist, from a contact that does exist
    // - Click the displayed link
    // - This should cause the get to be triggered on either v4 or v3 depending on our flag
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
