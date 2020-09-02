const { get } = require('lodash')

const { saveInteraction } = require('../../../interactions/repos')
const { getContact } = require('../../../contacts/repos')
const { fetchEventAttendees } = require('../repos')

async function createAttendee(req, res, next) {
  try {
    const { user: adviser } = req.session
    const contactId = req.params.contactId
    const { event } = res.locals

    if (!event || !contactId) {
      throw new Error('Missing eventId or contactId')
    }

    const attendees = await fetchEventAttendees({
      req,
      contactId,
      eventId: event.id,
    })

    if (attendees.count > 0) {
      req.flash(
        'failure',
        'Event attendee not added - This contact has already been added as an event attendee'
      )
      return res.redirect(`/events/${event.id}/attendees`)
    }

    const contact = await getContact(req, contactId)

    const serviceDelivery = {
      contacts: [contact.id],
      company: get(contact, 'company.id'),
      date: event.start_date,
      dit_participants: [
        {
          adviser: adviser.id,
        },
      ],
      event: event.id,
      is_event: true,
      kind: 'service_delivery',
      theme: 'other',
      service: get(event, 'service.id'),
      subject: `Attended ${event.name}`,
      was_policy_feedback_provided: false,
      were_countries_discussed: false,
    }

    await saveInteraction(req, serviceDelivery)

    req.flash(
      'success',
      'Event attendee added - This has created a service delivery record. If required, you can view or edit the service delivery directly from the attendee record.'
    )
    return res.redirect(`/events/${event.id}/attendees`)
  } catch (error) {
    next(error)
  }
}

module.exports = { createAttendee }
