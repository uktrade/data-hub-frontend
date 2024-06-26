const {
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
  CONTACT_ACTIVITY_SORT_SEARCH_OPTIONS,
  EVENT_ATTENDEES_SORT_OPTIONS,
  EVENT_AVENTRI_ATTENDEES_STATUSES,
  EVENT_ATTENDEES_MAPPING,
} = require('./constants')

const { ACTIVITIES_PER_PAGE } = require('../../../contacts/constants')

const urls = require('../../../../lib/urls')
const { fetchActivityFeed, fetchMatchingDataHubContact } = require('./repos')
const config = require('../../../../config')

const {
  aventriAttendeeQuery,
  exportSupportServiceDetailQuery,
  aventriAttendeeRegistrationStatusQuery,
} = require('./es-queries')
const { contactActivityQuery } = require('./es-queries/contact-activity-query')

const { aventriEventQuery } = require('./es-queries/aventri-event-query')
const {
  transformAventriEventStatusCountsToEventStatusCounts,
} = require('./transformers')

async function fetchActivitiesForContact(req, res, next) {
  try {
    const { contact } = res.locals
    const { selectedSortBy } = req.query

    const from = (req.query.page - 1) * ACTIVITIES_PER_PAGE

    // istanbul ignore next: Covered by functional tests
    const results = await fetchActivityFeed(
      req,
      contactActivityQuery(
        from,
        ACTIVITIES_PER_PAGE,
        contact.email,
        contact.id,
        DATA_HUB_AND_EXTERNAL_ACTIVITY,
        CONTACT_ACTIVITY_SORT_SEARCH_OPTIONS[selectedSortBy]
      )
      // istanbul ignore next: Covered by functional tests
    ).catch((error) => {
      next(error)
    })

    const total = results.hits.total.value
    let activities = results.hits.hits.map((hit) => hit._source)

    const hasAventriData = activities.some((activity) =>
      isAventriAttendee(activity)
    )

    if (hasAventriData) {
      activities = await getAventriEvents(activities, req)
    }

    //Add Contact to Ess Record to render on card
    activities = activities.map((activity) => {
      if (isEssActivity(activity)) {
        activity = augmentEssActivity(activity, contact)
      }
      return activity
    })
    res.json({ activities, total })
  } catch (error) {
    next(error)
  }
}

const getAventriEvents = async (activities, req) => {
  const aventriAttendees = activities.filter((activity) =>
    isAventriAttendee(activity)
  )

  const eventIds = aventriAttendees
    .map((attendee) => attendee.object.attributedTo.id)
    .map((id) => `${id}:Create`)

  const aventriEventsResults = await fetchActivityFeed(
    req,
    aventriEventQuery(eventIds)
  )

  const aventriEvents = aventriEventsResults.hits.hits.map((hit) => hit._source)

  return activities.map((activity) => {
    if (isAventriAttendee(activity)) {
      const matchingEvent = aventriEvents.find(
        (event) => event.id === `${activity.object.attributedTo.id}:Create`
      )
      if (matchingEvent) {
        activity.eventName = matchingEvent.object.name
        activity.startDate = matchingEvent.object.startTime
        activity.endDate = matchingEvent.object.endTime
      }
    }
    return activity
  })
}

const isAventriAttendee = (attendee) =>
  attendee['dit:application'] === 'aventri'

const isEssActivity = (activity) =>
  activity.object.type === 'dit:directoryFormsApi:Submission' &&
  activity.object.attributedTo.id ===
    'dit:directoryFormsApi:SubmissionType:export-support-service'

function augmentEssActivity(activity, contact) {
  // Add additional fields to ESS Activity for Card Parsing
  activity.object.attributedTo = [
    activity.object.attributedTo,
    mapEssContacts(contact),
  ]
  return activity
}

function mapEssContacts(contact) {
  const mappedContact = contact
    ? {
        'dit:emailAddress': contact.email,
        id: contact.id,
        name: contact.name,
        type: ['dit:Contact'],
        url: urls.contacts.details(contact.id),
      }
    : []
  return mappedContact
}

async function fetchAventriEvent(req, res, next) {
  try {
    const id = req.params.aventriEventId
    const formattedAventriEventId = `dit:aventri:Event:${id}:Create`

    const aventriEventResults = await fetchActivityFeed(
      req,
      aventriEventQuery([formattedAventriEventId])
    )
    const aventriEventData = aventriEventResults.hits.hits[0]._source

    const aventriStatusCounts = await getAventriRegistrationStatusCounts(
      req,
      id
    )

    const statusCounts =
      transformAventriEventStatusCountsToEventStatusCounts(aventriStatusCounts)

    return res.json({ ...aventriEventData, registrationStatuses: statusCounts })
  } catch (error) {
    next(error)
  }
}

async function fetchESSDetails(req, res, next) {
  try {
    const essInteractionId = req.params.essInteractionId
    const essQuery = exportSupportServiceDetailQuery(essInteractionId)

    const essInteractionResults = await fetchActivityFeed(req, essQuery)

    const essInteractionDetail = essInteractionResults.hits.hits.map(
      (hit) => hit._source
    )

    return res.json(...essInteractionDetail)
  } catch (error) {
    next(error)
  }
}

async function getAventriRegistrationStatusCounts(req, eventId) {
  const registrationStatusResults = await fetchActivityFeed(
    req,
    aventriAttendeeRegistrationStatusQuery({
      eventId,
      registrationStatuses: EVENT_AVENTRI_ATTENDEES_STATUSES,
    })
  )

  const statusCounts = registrationStatusResults.aggregations.countfield.buckets
    .map((result) => ({
      status: result.key,
      count: result.doc_count,
    }))
    .filter(
      (status) =>
        EVENT_AVENTRI_ATTENDEES_STATUSES.includes(status.status) &&
        status.count > 0
    )

  return statusCounts
}

async function fetchAventriEventRegistrationStatusAttendees(req, res, next) {
  try {
    const eventId = req.params.aventriEventId
    const {
      page,
      size = config.activityFeed.paginationSize,
      registrationStatus,
      sortBy,
    } = req.query
    if (!registrationStatus) {
      throw new Error('Missing registration status')
    }

    const matchingStatus = EVENT_ATTENDEES_MAPPING[registrationStatus]
    if (!matchingStatus) {
      throw new Error('Invalid status')
    }

    const sort = EVENT_ATTENDEES_SORT_OPTIONS[sortBy]
    const from = (page - 1) * size

    //get the attendees
    const aventriAttendeeResults = await fetchActivityFeed(
      req,
      aventriAttendeeQuery({
        eventId,
        sort,
        from,
        size,
        registrationStatuses: matchingStatus.statuses,
      })
    )

    const totalAttendees = aventriAttendeeResults.hits.total.value

    let aventriAttendees = aventriAttendeeResults.hits.hits.map(
      (hit) => hit._source
    )

    // add the datahub ID to aventri attendees object
    const addDataHubUrlToAttendee = async (attendee) => {
      const attendeeEmail = attendee.object['dit:aventri:email']
      let attendeeContactUrl = null
      if (attendeeEmail) {
        const dataHubContactResults = await fetchMatchingDataHubContact(
          req,
          attendeeEmail
        )
        const dataHubContactId = dataHubContactResults?.results[0]?.id
        attendeeContactUrl = dataHubContactId
          ? `/contacts/${dataHubContactId}/details`
          : null
      }
      attendee.datahubContactUrl = attendeeContactUrl
      return attendee
    }
    aventriAttendees = await Promise.all(
      aventriAttendees.map(async (attendee) => {
        return await addDataHubUrlToAttendee(attendee)
      })
    )

    res.json({
      totalAttendees,
      aventriAttendees,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  fetchActivitiesForContact,
  fetchAventriEvent,
  fetchAventriEventRegistrationStatusAttendees,
  getAventriRegistrationStatusCounts,
  fetchESSDetails,
  isEssActivity,
  augmentEssActivity,
}
