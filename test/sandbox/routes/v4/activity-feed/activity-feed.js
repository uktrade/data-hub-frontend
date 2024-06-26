import get from 'lodash/get.js'
import isEqual from 'lodash/isEqual.js'
import startsWith from 'lodash/startsWith.js'

// External activities
import externalActivities from '../../../fixtures/v4/activity-feed/external/external-activities.json' assert { type: 'json' }

import maxemailCampaignActivities from '../../../fixtures/v4/activity-feed/external/maxemail-campaign-activities.json' assert { type: 'json' }

// Data Hub and external activities
import dataHubAndExternalActivities from '../../../fixtures/v4/activity-feed/data-hub-and-external-activities.json' assert { type: 'json' }

import companyActivities from '../../../fixtures/v4/activity-feed/company-activity-feed-activities.json' assert { type: 'json' }
import companyRecentActivities from '../../../fixtures/v4/activity-feed/company-recent-activity-feed-activities.json' assert { type: 'json' }
import companyUpcomingActivities from '../../../fixtures/v4/activity-feed/company-upcoming-activity-feed-activities.json' assert { type: 'json' }
import contactDataHubAndExternalActivities from '../../../fixtures/v4/activity-feed/contact-data-hub-and-external-activities.json' assert { type: 'json' }

// My activities
import myActivities from '../../../fixtures/v4/activity-feed/my-activities.json' assert { type: 'json' }

// Data Hub activities
import noActivity from '../../../fixtures/v4/activity-feed/no-activity.json' assert { type: 'json' }

import dataHubEvents from '../../../fixtures/v4/activity-feed/data-hub-events.json' assert { type: 'json' }

//Aventri events
////This order is correct when sorted by: First Name A-Z, Last name A-Z and Company name A-Z
import aventriAttendeesAToZOrder from '../../../fixtures/v4/activity-feed/aventri-attendees-sort-a-z.json' assert { type: 'json' }

import aventriRegistrationStatusWithAggregations from '../../../fixtures/v4/activity-feed/aventri-registration-status-with-aggregation-counts.json' assert { type: 'json' }

//ESS Interactions
import essInteractionsNoTitle from '../../../fixtures/v4/activity-feed/ess-interaction-no-title.json' assert { type: 'json' }

import essInteractionDetail from '../../../fixtures/v4/activity-feed/ess-interaction.json' assert { type: 'json' }

////This order is correct when sorted by: First Name Z-A, Last name Z-A and Company name Z-A
import aventriAttendeesZToAOrder from '../../../fixtures/v4/activity-feed/aventri-attendees-sort-z-a.json' assert { type: 'json' }

import { generateAventriEventESResponse } from '../../../fixtures/v4/activity-feed/aventri-events.js'
import { generateDataHubActivitiesESResponse } from '../../../fixtures/v4/activity-feed/data-hub-activities.js'
import { generateAventriAttendeeESResponse } from '../../../fixtures/v4/activity-feed/aventri-attendees.js'

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

export const activityFeed = function (req, res) {
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
    const { sort } = req.body

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

    if (company === BEST_EVER_COMPANY) {
      return res.json(companyActivities)
    }
    if (company === BEST_EVER_COMPANY_2) {
      return res.json(essInteractionsNoTitle)
    }
    return res.json(dataHubAndExternalActivities)
  }

  // ESS Interactions
  var essDetails = get(req.body, "query.bool.must[0].term['id']")
  if (startsWith(essDetails, 'dit:directoryFormsApi:Submission:1111'))
    return res.json(essInteractionDetail)
  if (startsWith(essDetails, 'dit:directoryFormsApi:Submission:2222'))
    return res.json(essInteractionsNoTitle)

  return res.json(noActivity)
}
