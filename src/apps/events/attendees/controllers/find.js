const { get } = require('lodash')

const { search } = require('../../../search/services')
const { transformApiResponseToSearchCollection } = require('../../../search/transformers')
const { transformContactToListItem } = require('../../../contacts/transformers')

async function renderFindAttendee (req, res, next) {
  try {
    const event = res.locals.event

    if (!event) {
      throw new Error('Missing event')
    }

    res
      .breadcrumb(event.name, `/events/${event.id}/attendees`)
      .breadcrumb('Add attendee')
      .title(event.name)
      .render('events/attendees/views/find')
  } catch (error) {
    next(error)
  }
}

async function findAttendee (req, res, next) {
  try {
    const event = res.locals.event

    if (!event) {
      throw new Error('No event supplied')
    }

    const query = req.query
    const searchTerm = res.locals.searchTerm = get(req, 'body.term', '').trim()

    const contacts = await search({
      searchTerm,
      searchEntity: 'contact',
      token: req.session.token,
      page: query.page,
    })
      .then(transformApiResponseToSearchCollection(
        {
          searchTerm,
          query,
          userPermissions: get(res, 'locals.user.permissions'),
        },
        transformContactToListItem,
        (contact) => {
          return {
            ...contact,
            url: `/events/${event.id}/attendees/create/${contact.id}`,
          }
        }
      ))

    res.locals.contacts = {
      ...contacts,
      query,
      highlightTerm: searchTerm,
      countLabel: 'contact',
      listModifier: 'block-links',
    }

    return next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderFindAttendee,
  findAttendee,
}
