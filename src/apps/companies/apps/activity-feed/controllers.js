const {
  FILTER_ITEMS,
  FILTER_KEYS,
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
  CONTACT_ACTIVITY_SORT_SEARCH_OPTIONS,
  EVENT_ACTIVITY_SORT_OPTIONS,
  EVENT_ATTENDEES_SORT_OPTIONS,
  EVENT_ALL_ACTIVITY,
  DATA_HUB_AND_AVENTRI_ACTIVITY,
  EVENT_AVENTRI_ATTENDEES_STATUSES,
  EVENT_ATTENDEES_MAPPING,
} = require('./constants')

const { ACTIVITIES_PER_PAGE } = require('../../../contacts/constants')

const { getGlobalUltimateHierarchy } = require('../../repos')
const urls = require('../../../../lib/urls')
const { fetchActivityFeed, fetchMatchingDataHubContact } = require('./repos')
const config = require('../../../../config')

const {
  myActivityQuery,
  externalActivityQuery,
  maxemailCampaignQuery,
  maxemailEmailSentQuery,
  aventriAttendeeForCompanyQuery,
  dataHubAndActivityStreamServicesQuery,
  aventriAttendeeQuery,
  exportSupportServiceQuery,
  exportSupportServiceDetailQuery,
  exportSupportServiceDetailQuery,
  aventriAttendeeRegistrationStatusQuery,
} = require('./es-queries')
const { contactActivityQuery } = require('./es-queries/contact-activity-query')
const allActivityFeedEventsQuery = require('./es-queries/activity-feed-all-events-query')

const { aventriEventQuery } = require('./es-queries/aventri-event-query')
const {
  transformAventriEventStatusToEventStatus,
  transformAventriEventStatusCountsToEventStatusCounts,
} = require('./transformers')

async function renderActivityFeed(req, res, next) {
  const { company, dnbHierarchyCount, dnbRelatedCompaniesCount } = res.locals

  res.locals.title = `Activities - ${company.name} - Companies`

  const breadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
    { link: urls.companies.detail(company.id), text: company.name },
    { text: 'Activity Feed' },
  ]

  try {
    const contentProps = company.archived
      ? {
          company,
          breadcrumbs,
          flashMessages: res.locals.getMessages(),
        }
      : {
          company,
          breadcrumbs,
          flashMessages: res.locals.getMessages(),
          activityTypeFilter: FILTER_KEYS.dataHubActivity,
          activityTypeFilters: FILTER_ITEMS,
          isGlobalUltimate: company.is_global_ultimate,
          dnbHierarchyCount,
          dnbRelatedCompaniesCount,
          showMatchingPrompt:
            !company.duns_number && !company.pending_dnb_investigation,
        }

    const props = {
      ...contentProps,
      apiEndpoint: urls.companies.activity.data(company.id),
    }

    res.render('companies/apps/activity-feed/views/client-container', { props })
  } catch (error) {
    next(error)
  }
}

function getQueries(options) {
  return {
    [FILTER_KEYS.myActivity]: myActivityQuery({
      ...options,
      types: DATA_HUB_ACTIVITY,
    }),
    [FILTER_KEYS.dataHubActivity]: dataHubAndActivityStreamServicesQuery({
      ...options,
      types: DATA_HUB_AND_AVENTRI_ACTIVITY,
    }),
    [FILTER_KEYS.externalActivity]: externalActivityQuery({
      ...options,
      types: EXTERNAL_ACTIVITY,
    }),
    [FILTER_KEYS.dataHubAndExternalActivity]: externalActivityQuery({
      ...options,
      types: DATA_HUB_AND_EXTERNAL_ACTIVITY,
    }),
  }
}

function isExternalFilter(activityTypeFilter) {
  return (
    activityTypeFilter === FILTER_KEYS.externalActivity ||
    activityTypeFilter === FILTER_KEYS.dataHubAndExternalActivity
  )
}

function isEssFilter(activityTypeFilter) {
  return (
    activityTypeFilter === FILTER_KEYS.dataHubActivity ||
    activityTypeFilter === FILTER_KEYS.dataHubAndExternalActivity
  )
}

function getContactFromEmailAddress(emailAddress, contacts) {
  const contact = contacts.find((contact) => contact.email === emailAddress)
  return contact
    ? {
        ...contact,
        url: urls.contacts.details(contact.id),
      }
    : null
}

async function getMaxemailCampaigns(req, next, contacts) {
  try {
    // Fetch Maxemail campaigns
    const campaignQuery = maxemailCampaignQuery()
    const campaignsResults = await fetchActivityFeed(req, campaignQuery)
    const campaignActivities = campaignsResults.hits.hits.map(
      (hit) => hit._source
    )

    // Fetch all Maxemail emails sent to Data Hub company contacts as part of a campaign
    const emailSentQuery = maxemailEmailSentQuery(contacts)
    const emailSentResults = await fetchActivityFeed(req, emailSentQuery)
    const emailSentActivities = emailSentResults.hits.hits.map(
      (hit) => hit._source
    )

    // Group Data Hub company contacts to a campaign
    campaignActivities.forEach((campaign) => {
      campaign.object.contacts = []
      const campaignId = campaign.object['dit:maxemail:Campaign:id']
      emailSentActivities.forEach((emailSent) => {
        const sentEmailCampaignId =
          emailSent.object.attributedTo['dit:maxemail:Campaign:id']
        if (campaignId === sentEmailCampaignId) {
          const emailAddress = emailSent.object['dit:emailAddress']
          const contact = getContactFromEmailAddress(emailAddress, contacts)
          if (contact) {
            campaign.object.contacts.push(contact)
          }
        }
      })
    })

    // We only want campaigns that have at least one contact
    return campaignActivities.filter(
      (campaign) => campaign.object.contacts.length
    )
  } catch (error) {
    next(error)
  }
}

async function getExportSupportActivities(req, next, company) {
  try {
    const { from, size } = req.query

    // Fetch ESS  Activities
    const essQuery = exportSupportServiceQuery(from, size, company.contacts)

    const essQueryResults = await fetchActivityFeed(req, essQuery)
    const essActivities = essQueryResults.hits.hits.map((hit) => hit._source)

    //Add Ess contacts to each Activity
    const essActivitiesWithContact = essActivities.map((activity) => {
      if (
        activity.object.attributedTo.id ==
        'dit:directoryFormsApi:SubmissionType:export-support-service'
      ) {
        const essContactEmail = activity.actor['dit:emailAddress']
        const essContact = getContactFromEmailAddress(essContactEmail, contacts)

        activity.object.attributedTo = [
          activity.object.attributedTo,
          mapEssContacts(essContact),
          mapEssCompany(company),
        ]
      }
      return activity
    })

    return essActivitiesWithContact
  } catch (error) {
    next(error)
  }
}

async function getAventriEventsAttendedByCompanyContacts(req, next, contacts) {
  try {
    // Fetch aventri attendee info for company contacts
    const aventriQuery = aventriAttendeeForCompanyQuery(contacts)
    const aventriResults = await fetchActivityFeed(req, aventriQuery)
    const aventriAttendees = aventriResults.hits.hits.map((hit) => hit._source)

    const groupedEventsWithContactsObj = aventriAttendees.reduce(
      (obj, attendee) => {
        const eventId = `${attendee.object.attributedTo.id}:Create`
        const event = obj[eventId]

        const contact = contacts.find(
          (contact) => contact.email == attendee.object['dit:emailAddress']
        )
        const mappedContact = contact
          ? [
              {
                'dit:emailAddress': contact.email,
                id: contact.id,
                name: contact.name,
                type: ['dit:Contact'],
                url: urls.contacts.details(contact.id),
                registrationStatus: transformAventriEventStatusToEventStatus(
                  attendee.object['dit:registrationStatus']
                ),
              },
            ]
          : []
        if (event) {
          event.push(...mappedContact)
        } else {
          obj[eventId] = mappedContact
        }
        return obj
      },
      {}
    )

    return groupedEventsWithContactsObj
  } catch (error) {
    next(error)
  }
}

async function fetchActivitiesForContact(req, res, next) {
  try {
    const { contact } = res.locals
    const { selectedSortBy } = req.query

    const from = (req.query.page - 1) * ACTIVITIES_PER_PAGE

    // istanbul ignore next: Covered by functional tests
    let results = await fetchActivityFeed(
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

async function fetchActivityFeedHandler(req, res, next) {
  try {
    const { company, user } = res.locals
    const {
      from = 0,
      size = config.activityFeed.paginationSize,
      activityTypeFilter = FILTER_KEYS.dataHubActivity,
      showDnbHierarchy = false,
    } = req.query

    let dnbHierarchyIds = []
    if (company.is_global_ultimate && showDnbHierarchy) {
      const { results } = await getGlobalUltimateHierarchy(
        req,
        company.global_ultimate_duns_number
      )
      dnbHierarchyIds = results
        .filter((company) => !company.is_global_ultimate)
        .map((company) => company.id)
    }

    const aventriEvents = await getAventriEventsAttendedByCompanyContacts(
      req,
      next,
      company.contacts
    )
    const aventriEventIds = Object.keys(aventriEvents)

    const queries = getQueries({
      from,
      size,
      companyIds: [company.id, ...dnbHierarchyIds],
      contacts: company.contacts,
      user,
      aventriEventIds,
    })

    const results = await fetchActivityFeed(
      req,
      queries[activityTypeFilter] || queries[FILTER_KEYS.dataHubActivity]
    )

    let activities = results.hits.hits.map((hit) => hit._source)
    let total = results.hits.total.value

    if (isExternalFilter(activityTypeFilter)) {
      const campaigns = await getMaxemailCampaigns(req, next, company.contacts)
      activities = [...activities, ...campaigns]
      total += campaigns.length
    }

    // Get Export Support Service Activites
    if (isEssFilter(activityTypeFilter)) {
      const essActivities = await getExportSupportActivities(req, next, company)
      activities = [...activities, ...essActivities]
      total += essActivities.length
    }

    //loop over all aventri results, set the contact to be the matching contact from the contacts array
    activities = activities.map((activity) => {
      if (activity.type == 'dit:aventri:Event' && aventriEvents[activity.id]) {
        activity.object.attributedTo = [
          activity.object.attributedTo,
          ...aventriEvents[activity.id],
        ]
      }
      return activity
    })

    res.json({
      total,
      activities,
    })
  } catch (error) {
    next(error)
  }
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

function mapEssCompany(company) {
  const mappedCompany = company
    ? {
        id: company.id,
        name: company.name,
        type: 'dit:Company',
      }
    : []
  return mappedCompany
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
    const { page, size, registrationStatus, sortBy } = req.query

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

const eventsColListQueryBuilder = ({
  name,
  earliestStartDate,
  latestStartDate,
  aventriId,
  addressCountry,
  ukRegion,
  organiser,
  eventType,
}) => {
  const eventNameFilter = name
    ? {
        match_phrase_prefix: {
          'object.name': name,
        },
      }
    : null

  const dateFilter =
    earliestStartDate || latestStartDate
      ? {
          range: {
            'object.startTime': {
              gte: earliestStartDate,
              lte: latestStartDate,
            },
          },
        }
      : null

  const countryFilter = addressCountry
    ? {
        bool: {
          should: [
            {
              terms: {
                'object.dit:address_country.name': addressCountry,
              },
            },
            {
              terms: {
                'object.dit:aventri:location_country': addressCountry,
              },
            },
          ],
        },
      }
    : null

  const aventriIdFilter = aventriId
    ? {
        term: {
          id: `dit:aventri:Event:${aventriId}:Create`,
        },
      }
    : null

  const ukRegionFilter = ukRegion
    ? {
        terms: {
          'object.dit:ukRegion.id': ukRegion,
        },
      }
    : null

  const organiserFilter = organiser
    ? {
        terms: {
          'object.dit:organiser.id': organiser,
        },
      }
    : null

  const eventTypeFilter = eventType
    ? {
        terms: {
          'object.dit:eventType.id': eventType,
        },
      }
    : null

  const filtersArray = [
    eventNameFilter,
    dateFilter,
    aventriIdFilter,
    countryFilter,
    ukRegionFilter,
    organiserFilter,
    eventTypeFilter,
  ]

  const cleansedFiltersArray = filtersArray.filter((filter) => filter)

  const queryBuilder = [EVENT_ALL_ACTIVITY, ...cleansedFiltersArray]
  return queryBuilder
}

async function fetchAllActivityFeedEvents(req, res, next) {
  try {
    const {
      sortBy,
      name,
      earliestStartDate,
      latestStartDate,
      aventriId,
      ukRegion,
      organiser,
      page,
      addressCountry,
      eventType,
    } = req.query

    const from = (page - 1) * ACTIVITIES_PER_PAGE

    const allActivityFeedEventsResults = await fetchActivityFeed(
      req,
      allActivityFeedEventsQuery({
        fullQuery: eventsColListQueryBuilder({
          name,
          earliestStartDate,
          latestStartDate,
          aventriId,
          addressCountry,
          ukRegion,
          organiser,
          eventType,
        }),
        from,
        size: ACTIVITIES_PER_PAGE,
        sort:
          EVENT_ACTIVITY_SORT_OPTIONS[sortBy] ||
          EVENT_ACTIVITY_SORT_OPTIONS['modified_on:desc'],
      })
    )

    const total = allActivityFeedEventsResults.hits.total.value
    const allActivityFeedEvents = allActivityFeedEventsResults.hits.hits.map(
      (hit) => hit._source
    )

    res.json({
      allActivityFeedEvents,
      total,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderActivityFeed,
  fetchActivityFeedHandler,
  fetchActivitiesForContact,
  fetchAventriEvent,
  fetchAllActivityFeedEvents,
  eventsColListQueryBuilder,
  getAventriEventsAttendedByCompanyContacts,
  fetchAventriEventRegistrationStatusAttendees,
  getAventriRegistrationStatusCounts,
  transformAventriEventStatusToEventStatus,
  fetchESSDetails,
}
