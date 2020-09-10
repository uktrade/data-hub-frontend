const { get, isEmpty } = require('lodash')

const { search } = require('../../../../modules/search/services')
const {
  transformApiResponseToSearchCollection,
} = require('../../../../modules/search/transformers')
const { transformContactToListItem } = require('../../../contacts/transformers')
const { createContactItemToAttendeeSearchResult } = require('../transformers')
const { ENTITIES } = require('../../../search/constants')

async function renderFindAttendee(req, res, next) {
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

async function findAttendee(req, res, next) {
  try {
    const event = res.locals.event

    if (!event) {
      throw new Error('No event supplied')
    }

    const query = req.query
    const searchTerm = (res.locals.searchTerm = (query.term || '').trim())

    if (isEmpty(searchTerm)) {
      return next()
    }

    const transformListItemToAttendeeSearchResult = await createContactItemToAttendeeSearchResult(
      req,
      event
    )

    const contactsResponse = await search({
      req,
      searchEntity: 'contact',
      page: query.page,
      requestBody: {
        archived: false,
        original_query: searchTerm,
      },
      isAggregation: false,
    })

    const transformedContacts = transformApiResponseToSearchCollection(
      {
        searchTerm,
        query,
        userPermissions: get(res, 'locals.user.permissions'),
      },
      ENTITIES,
      transformContactToListItem,
      transformListItemToAttendeeSearchResult
    )(contactsResponse)

    res.locals.contacts = {
      ...transformedContacts,
      query,
      highlightTerm: searchTerm,
      countLabel: 'contact',
      listModifier: 'block-links',
      preventDoubleClick: true,
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
