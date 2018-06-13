const { saveInteraction } = require('../../../interactions/repos')
const { getContact } = require('../../../contacts/repos')

async function createAttendee (req, res, next) {
  try {
    const adviser = req.session.user
    const token = req.session.token
    const contactId = req.params.contactId
    const event = res.locals.event

    if (!event || !contactId) {
      throw new Error('Missing eventId or contactId')
    }

    const contact = await getContact(token, contactId)

    const serviceDelivery = {
      contact: contactId,
      company: contact.company.id,
      date: event.start_date,
      dit_adviser: adviser.id,
      dit_team: event.lead_team.id,
      event: event.id,
      is_event: true,
      kind: 'service_delivery',
      service: event.service.id,
      subject: `Attended ${event.name}`,
    }

    await saveInteraction(token, serviceDelivery)

    req.flash('success', 'Event attendee added - This has created a service delivery. You can view or edit the service delivery record, for example, to change the title or add notes')
    return res.redirect(`/events/${event.id}/attendees`)
  } catch (error) {
    next(error)
  }
}

module.exports = { createAttendee }
