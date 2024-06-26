const {
  EVENT_ATTENDEES_SORT_OPTIONS,
  EVENT_AVENTRI_ATTENDEES_STATUSES,
  EVENT_ATTENDEES_MAPPING,
} = require('./constants')

const { fetchActivityFeed, fetchMatchingDataHubContact } = require('./repos')
const config = require('../../../../config')

const {
  aventriAttendeeQuery,
  exportSupportServiceDetailQuery,
  aventriAttendeeRegistrationStatusQuery,
} = require('./es-queries')

const { aventriEventQuery } = require('./es-queries/aventri-event-query')
const {
  transformAventriEventStatusCountsToEventStatusCounts,
} = require('./transformers')

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
  fetchAventriEvent,
  fetchAventriEventRegistrationStatusAttendees,
  getAventriRegistrationStatusCounts,
  fetchESSDetails,
}
