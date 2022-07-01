const {
  FILTER_ITEMS,
  FILTER_KEYS,
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
  CONTACT_ACTIVITY_SORT_SEARCH_OPTIONS,
} = require('./constants')

const { getGlobalUltimateHierarchy } = require('../../repos')
const urls = require('../../../../lib/urls')
const { fetchActivityFeed } = require('./repos')
const config = require('../../../../config')

const {
  myActivityQuery,
  dataHubActivityQuery,
  externalActivityQuery,
  maxemailCampaignQuery,
  maxemailEmailSentQuery,
} = require('./es-queries')
const { contactActivityQuery } = require('./es-queries/contact-activity-query')
const allActivityFeedEventsQuery = require('./es-queries/activity-feed-all-events-query')
const { ACTIVITIES_PER_PAGE } = require('../../../contacts/constants')
const { aventriEventQuery } = require('./es-queries/aventri-event-query')
const { aventriAttendeeQuery } = require('./es-queries/aventri-attendee-query')

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
    [FILTER_KEYS.dataHubActivity]: dataHubActivityQuery({
      ...options,
      types: DATA_HUB_ACTIVITY,
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

async function fetchActivitiesForContact(req, res, next) {
  try {
    const { contact } = res.locals
    const { selectedSortBy } = req.query

    const from = (req.query.page - 1) * ACTIVITIES_PER_PAGE

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

    const queries = getQueries({
      from,
      size,
      companyIds: [company.id, ...dnbHierarchyIds],
      contacts: company.contacts,
      user,
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

    res.json({
      total,
      activities,
    })
  } catch (error) {
    next(error)
  }
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

    return res.json({ ...aventriEventData })
  } catch (error) {
    next(error)
  }
}

async function fetchAventriAttendees(req, res, next) {
  const aventriEventId = req.params.aventriEventId
  try {
    //get the attendees
    const aventriAttendeeResults = await fetchActivityFeed(
      req,
      aventriAttendeeQuery(aventriEventId)
    )

    const aventriAttendees = aventriAttendeeResults.hits.hits.map(
      (hit) => hit._source
    )

    //get the event
    const formattedAventriEventId = `dit:aventri:Event:${aventriEventId}:Create`

    const aventriEventResults = await fetchActivityFeed(
      req,
      aventriEventQuery([formattedAventriEventId])
    )
    const aventriEventData = aventriEventResults.hits.hits[0]._source

    res.json({
      aventriEventData,
      aventriAttendees,
    })
  } catch (error) {
    next(error)
  }
}

async function fetchAllActivityFeedEvents(req, res, next) {
  try {
    const allActivityFeedEventsResults = await fetchActivityFeed(
      req,
      allActivityFeedEventsQuery()
    )

    const allActivityFeedEvents = allActivityFeedEventsResults.hits.hits.map(
      (hit) => hit._source
    )

    res.json({
      allActivityFeedEvents,
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
  fetchAventriAttendees,
}
