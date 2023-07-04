var { isEqual, startsWith, get } = require('lodash')

// External activities
var externalActivities = require('../../../fixtures/v4/activity-feed/external/external-activities.json')
var maxemailCampaignActivities = require('../../../fixtures/v4/activity-feed/external/maxemail-campaign-activities.json')
var maxemailEmailSentQuery = require('../../../fixtures/v4/activity-feed/external/maxemail-email-sent-query.json')
var maxemailEmailSentActivities = require('../../../fixtures/v4/activity-feed/external/maxemail-email-sent-activities.json')

// Data Hub and external activities
var dataHubAndExternalActivities = require('../../../fixtures/v4/activity-feed/data-hub-and-external-activities.json')
var companyActivities = require('../../../fixtures/v4/activity-feed/company-activity-feed-activities.json')
var companyRecentActivities = require('../../../fixtures/v4/activity-feed/company-recent-activity-feed-activities.json')
var companyUpcomingActivities = require('../../../fixtures/v4/activity-feed/company-upcoming-activity-feed-activities.json')
var contactDataHubAndExternalActivities = require('../../../fixtures/v4/activity-feed/contact-data-hub-and-external-activities.json')

// My activities
var myActivities = require('../../../fixtures/v4/activity-feed/my-activities.json')

// Data Hub activities
var noActivity = require('../../../fixtures/v4/activity-feed/no-activity.json')
var dataHubEvents = require('../../../fixtures/v4/activity-feed/data-hub-events.json')

//Aventri events
////This order is correct when sorted by: First Name A-Z, Last name A-Z and Company name A-Z
var aventriAttendeesAToZOrder = require('../../../fixtures/v4/activity-feed/aventri-attendees-sort-a-z.json')
var aventriRegistrationStatusWithAggregations = require('../../../fixtures/v4/activity-feed/aventri-registration-status-with-aggregation-counts.json')

//ESS Interactions
var essInteractionsNoTitle = require('../../../fixtures/v4/activity-feed/ess-interaction-no-title.json')
var essInteractionDetail = require('../../../fixtures/v4/activity-feed/ess-interaction.json')

////This order is correct when sorted by: First Name Z-A, Last name Z-A and Company name Z-A
var aventriAttendeesZToAOrder = require('../../../fixtures/v4/activity-feed/aventri-attendees-sort-z-a.json')
//All Activitiy feed events
var allActivityFeedEvents = require('../../../fixtures/v4/activity-feed/all-activity-feed-events.json')
const {
  generateAventriEventESResponse,
} = require('../../../fixtures/v4/activity-feed/aventri-events')
const {
  generateDataHubActivitiesESResponse,
} = require('../../../fixtures/v4/activity-feed/data-hub-activities')
const {
  generateAventriAttendeeESResponse,
} = require('../../../fixtures/v4/activity-feed/aventri-attendees')

let aventriEvents = generateAventriEventESResponse()
let dataHubActivities = generateDataHubActivitiesESResponse()
let aventriAttendees = generateAventriAttendeeESResponse()

const DATA_HUB_ACTIVITY = [
  'dit:Interaction',
  'dit:ServiceDelivery',
  'dit:InvestmentProject',
  'dit:OMISOrder',
  'dit:CompanyReferral',
  'dit:aventri:Event',
]

const EXTERNAL_ACTIVITY = ['dit:Accounts', 'dit:Company', 'dit:Export']

const DATA_HUB_AND_EXTERNAL_ACTIVITY = [
  ...DATA_HUB_ACTIVITY,
  ...EXTERNAL_ACTIVITY,
]

const ALL_ACTIVITY_STREAM_EVENTS = ['dit:aventri:Event', 'dit:dataHub:Event']

const ALL_ACTIVITIES_PER_PAGE = 10

const VENUS_LTD = 'dit:DataHubCompany:0f5216e0-849f-11e6-ae22-56b6b6499611'
const NO_COMPANY_DETAILS =
  'dit:DataHubCompany:1111ae21-2895-47cf-90ba-9273c94dab88'
const BEST_EVER_COMPANY =
  'dit:DataHubCompany:c79ba298-106e-4629-aa12-61ec6e2e47ce'

const BEST_EVER_COMPANY_2 =
  'dit:DataHubCompany:c79ba298-106e-4629-aa12-61ec6e2e47be'
const COMPANY_WITH_MANY_CONTACTS =
  'dit:DataHubCompany:57c41268-26be-4335-a873-557e8b0deb29'
const MAX_EMAIL_CAMPAIGN =
  'dit:DataHubCompany:6df487c5-7c75-4672-8907-f74b49e6c635'
exports.activityFeed = function (req, res) {
  const size = get(req.body, 'size')
  // Activities by contact
  var isContactActivityQuery = get(
    req.body,
    "query.bool.must[0].bool.should[1].bool.must[1].term['object.dit:emailAddress']"
  )

  if (isContactActivityQuery) {
    const from = get(req.body, 'from')

    const contactId = get(
      req.body,
      'query.bool.must[0].bool.should[0].bool.must[1].terms["object.attributedTo.id"][0]'
    )

    // if there is an error
    if (
      contactId === 'dit:DataHubContact:f3d19ea7-d4cf-43e0-8e97-755c57cae313'
    ) {
      return res.status(500).send('something went wrong')
    }

    //if page 2
    if (from == 10) {
      return res.json(dataHubActivities)
    }

    //if the sort by is newest
    if (req.body.sort._script.order === 'desc') {
      return res.json(contactDataHubAndExternalActivities)
    }
    //if the story by is oldest
    if (req.body.sort._script.order === 'asc') {
      return res.json(dataHubActivities)
    }
  }
  var allActivityStreamEventTypes = get(
    req.body,
    "query.bool.must[0].terms['object.type']"
  )

  var isAllActivityStreamEvents = isEqual(
    allActivityStreamEventTypes,
    ALL_ACTIVITY_STREAM_EVENTS
  )

  if (isAllActivityStreamEvents) {
    const { sort, from } = req.body

    //if page 2
    if (from == ALL_ACTIVITIES_PER_PAGE) {
      return res.json(allActivityFeedEvents)
    }

    // if the sort by is recently updated (modified_on:desc)
    if (sort['object.updated']?.order === 'desc') {
      return res.json(allActivityFeedEvents)
    }

    //if the story by is LEAST recently updated (modified_on:asc)
    if (sort['object.updated']?.order === 'asc') {
      return res.json(aventriEvents)
    }

    //if sorting by name
    if (sort['object.name.raw']) {
      return res.json(dataHubEvents)
    }
  }

  var isAventriEventQuery =
    get(req.body, "query.bool.must[0].term['object.type']") ===
    'dit:aventri:Event'

  if ((size === undefined || size == 10) && isAventriEventQuery) {
    var aventriEventIdQuery = req.body.query.bool.must[1]
    var aventriId = aventriEventIdQuery.terms.id[0]

    //event not found
    if (aventriId === 'dit:aventri:Event:404:Create') {
      return res.json(noActivity)
    }

    //network error
    if (aventriId == 'dit:aventri:Event:500:Create') {
      return res.status(500).send('something went wrong')
    }

    //happy path
    const foundEvent = aventriEvents.hits.hits.find(
      (e) => e._source.id == aventriId
    )
    const updatedHits = Object.assign({}, aventriAttendees, {
      hits: {
        total: {
          value: foundEvent ? 1 : 0,
        },
        hits: foundEvent ? [foundEvent] : [],
      },
    })
    return res.json(updatedHits)
  }

  var isAventriAttendeeQuery =
    get(req.body, "query.bool.must[0].term['object.type']") ===
    'dit:aventri:Attendee'

  if (isAventriAttendeeQuery) {
    var isCompanyQuery = get(
      req.body,
      "query.bool.must[1].terms['object.dit:emailAddress']"
    )

    if (isCompanyQuery) {
      return res.json(aventriAttendees)
    }

    var isRegistrationStatusQuery = get(req.body, 'aggs.countfield.terms.field')
    if (isRegistrationStatusQuery) {
      return res.json(aventriRegistrationStatusWithAggregations)
    }

    var aventriId = get(
      req.body,
      "query.bool.must[1].term['object.attributedTo.id']"
    )
    // network error
    if (aventriId === 'dit:aventri:Event:500') {
      return res.status(500).send('something went wrong')
    }
    //sort by first name desc
    var firstNameOrder = req.body.sort['object.dit:firstName']?.order
    var lastNameOrder = req.body.sort['object.dit:lastName']?.order
    var companyNameOrder = req.body.sort['object.dit:companyName']?.order

    if (lastNameOrder === 'asc' || companyNameOrder === 'asc') {
      return res.json(aventriAttendeesAToZOrder)
    }

    if (
      firstNameOrder === 'desc' ||
      lastNameOrder === 'desc' ||
      companyNameOrder === 'desc'
    ) {
      return res.json(aventriAttendeesZToAOrder)
    }

    const registrationStatus = get(
      req.body,
      "query.bool.must[2].terms['object.dit:registrationStatus']"
    )

    //filter the attendees to only return the ones matching the registration status in the ES query
    if (Array.isArray(registrationStatus) && registrationStatus.length > 0) {
      const filteredHits = aventriAttendees.hits.hits.filter((h) =>
        registrationStatus.includes(h._source.object['dit:registrationStatus'])
      )

      const paginated = filteredHits.slice(
        req.body.from,
        req.body.from + req.body.size
      )

      const updatedHits = Object.assign({}, aventriAttendees, {
        hits: {
          total: {
            value: filteredHits.length,
          },
          hits: paginated,
        },
      })

      return res.json(updatedHits)
    }

    // happy path
    return res.json(aventriAttendees)
  }

  var isDataHubEventQuery =
    get(req.body, "query.bool.must[0].term['object.type']") ===
    'dit:dataHub:Event'
  if (isDataHubEventQuery) {
    return res.json(dataHubEvents)
  }

  // Data Hub activity
  var dataHubTypes = get(
    req.body,
    "query.bool.filter.bool.should[0].bool.must[0].terms['object.type']"
  )

  var company = get(
    req.body,
    "query.bool.filter.bool.should[0].bool.must[1].terms['object.attributedTo.id'][0]"
  )
  if (company == MAX_EMAIL_CAMPAIGN) {
    return res.json(maxemailCampaignActivities)
  }
  if (
    (size != 10 && isEqual(dataHubTypes, DATA_HUB_AND_EXTERNAL_ACTIVITY)) ||
    isEqual(dataHubTypes, DATA_HUB_ACTIVITY) ||
    company == COMPANY_WITH_MANY_CONTACTS
  ) {
    const filteredSortHits = dataHubActivities.hits.hits
      .filter((hit) => hit._source.object.startTime)
      .sort((a, b) =>
        b._source.object.startTime.localeCompare(a._source.object.startTime)
      )

    if (size == 3) {
      switch (company) {
        case VENUS_LTD:
          return res.json(companyActivities)
          break
        case NO_COMPANY_DETAILS:
          return res.json(noActivity)
          break
        default:
          return res.json(companyRecentActivities)
          break
      }
    }
    if (size == 2) {
      return res.json(
        company === NO_COMPANY_DETAILS ? noActivity : companyUpcomingActivities
      )
    }
    const updatedHits = Object.assign({}, dataHubActivities, {
      hits: {
        total: {
          value: filteredSortHits.length,
        },
        hits: filteredSortHits,
      },
    })

    return res.json(company === VENUS_LTD ? noActivity : updatedHits)
  }

  // External activity
  var externalActivityTypes = get(
    req.body,
    "query.bool.filter.bool.should[0].bool.must[0].terms['object.type']"
  )
  if (isEqual(externalActivityTypes, EXTERNAL_ACTIVITY)) {
    return res.json(externalActivities)
  }

  // My activity
  var adviser = get(
    req.body,
    "query.bool.must[1].term['object.attributedTo.id']"
  )
  if (startsWith(adviser, 'dit:DataHubAdviser')) {
    return res.json(myActivities)
  }

  // Data Hub and external activity
  if (isEqual(externalActivityTypes, DATA_HUB_AND_EXTERNAL_ACTIVITY)) {
    var company = get(
      req.body,
      "query.bool.filter.bool.should[0].bool.must[1].terms['object.attributedTo.id'][0]"
    )
    const activities =
      company === BEST_EVER_COMPANY
        ? companyActivities
        : company === BEST_EVER_COMPANY_2
        ? essInteractionsNoTitle
        : dataHubAndExternalActivities

    return res.json(activities)
  }

  // ESS Interactions
  var essDetails = get(req.body, "query.bool.must[0].term['id']")
  if (startsWith(essDetails, 'dit:directoryFormsApi:Submission:1111'))
    return res.json(essInteractionDetail)
  if (startsWith(essDetails, 'dit:directoryFormsApi:Submission:2222'))
    return res.json(essInteractionsNoTitle)

  // Maxemail emails sent
  if (isEqual(maxemailEmailSentQuery, req.body)) {
    return res.json(maxemailEmailSentActivities)
  }

  return res.json(noActivity)
}
