var { isEqual, startsWith, get } = require('lodash')

// External activities
var externalActivities = require('../../../fixtures/v4/activity-feed/external/external-activities.json')
var maxemailCampaignQuery = require('../../../fixtures/v4/activity-feed/external/maxemail-campaign-query.json')
var maxemailCampaignActivities = require('../../../fixtures/v4/activity-feed/external/maxemail-campaign-activities.json')
var maxemailEmailSentQuery = require('../../../fixtures/v4/activity-feed/external/maxemail-email-sent-query.json')
var maxemailEmailSentActivities = require('../../../fixtures/v4/activity-feed/external/maxemail-email-sent-activities.json')

// Data Hub and external activities
var dataHubAndExternalActivities = require('../../../fixtures/v4/activity-feed/data-hub-and-external-activities.json')
var companyActivities = require('../../../fixtures/v4/activity-feed/company-activity-feed-activities.json')
var contactDataHubAndExternalActivities = require('../../../fixtures/v4/activity-feed/contact-data-hub-and-external-activities.json')

// My activities
var myActivities = require('../../../fixtures/v4/activity-feed/my-activities.json')

// Data Hub activities
var dataHubActivities = require('../../../fixtures/v4/activity-feed/data-hub-activities.json')
var noActivity = require('../../../fixtures/v4/activity-feed/no-activity.json')
var dataHubEvents = require('../../../fixtures/v4/activity-feed/data-hub-events.json')

//Aventri events
var aventriEvents = require('../../../fixtures/v4/activity-feed/aventri-events.json')
var aventriEventsNoDetails = require('../../../fixtures/v4/activity-feed/aventri-events-no-details.json')
var aventriAttendees = require('../../../fixtures/v4/activity-feed/aventri-attendees.json')
////This order is correct when sorted by: First Name A-Z, Last name A-Z and Company name A-Z
var aventriAttendeesAToZOrder = require('../../../fixtures/v4/activity-feed/aventri-attendees-sort-a-z.json')
var aventriAttendeeForCompany = require('../../../fixtures/v4/activity-feed/aventri-attendee-for-company.json')
var aventriRegistrationStatusWithAggregations = require('../../../fixtures/v4/activity-feed/aventri-registration-status-with-aggregation-counts.json')

////This order is correct when sorted by: First Name Z-A, Last name Z-A and Company name Z-A
var aventriAttendeesZToAOrder = require('../../../fixtures/v4/activity-feed/aventri-attendees-sort-z-a.json')
//All Activitiy feed events
var allActivityFeedEvents = require('../../../fixtures/v4/activity-feed/all-activity-feed-events.json')
const { faker } = require('@faker-js/faker')

const generateFakeAttendeeHitObject = (status) => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  return {
    _index:
      'activities__feed_id_dummy-data-feed__date_2022-06-28__timestamp_1656410763__batch_id_ltepro51__',
    _type: '_doc',
    _id: 'dit:aventri:Event:1111:Attendee:2222:Create',
    _score: 3.6005385,
    _source: {
      'dit:application': 'aventri',
      id: 'dit:aventri:Event:1111:Attendee:2222:Create',
      object: {
        attributedTo: {
          id: 'dit:aventri:Event:1111',
          type: 'dit:aventri:Event',
        },
        'dit:aventri:approvalstatus': '',
        'dit:aventri:category': null,
        'dit:aventri:companyname': faker.company.name(),
        'dit:aventri:createdby': 'attendee',
        'dit:aventri:email': '',
        'dit:aventri:firstname': firstName,
        'dit:aventri:language': 'eng',
        'dit:aventri:lastmodified': '2022-01-24T11:12:13',
        'dit:aventri:lastname': lastName,
        'dit:aventri:modifiedby': 'attendee',
        'dit:aventri:registrationstatus': status,
        'dit:aventri:virtual_event_attendance': 'Yes',
        'dit:emailAddress': '',
        'dit:firstName': firstName,
        'dit:lastName': lastName,
        'dit:registrationStatus': status,
        id: 'dit:aventri:Attendee:2222',
        published: '1970-01-01T00:00:00',
        type: ['dit:aventri:Attendee'],
      },
      published: '2022-02-24T11:28:57',
      type: 'dit:aventri:Attendee',
    },
  }
}

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
const BEST_EVER_COMPANY =
  'dit:DataHubCompany:c79ba298-106e-4629-aa12-61ec6e2e47ce'
const AVENTRI_ID_TO_FILTER_CONTACTS = 'dit:aventri:Event:2222'

exports.activityFeed = function (req, res) {
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
    if (req.body.sort[0].published.order === 'desc') {
      return res.json(contactDataHubAndExternalActivities)
    }
    //if the story by is oldest
    if (req.body.sort[0].published.order === 'asc') {
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

  if (isAventriEventQuery) {
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

    //no optional details
    if (aventriId === 'dit:aventri:Event:6666:Create') {
      return res.json(aventriEventsNoDetails)
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
      return res.json(aventriAttendeeForCompany)
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
    if (
      aventriId == AVENTRI_ID_TO_FILTER_CONTACTS &&
      Array.isArray(registrationStatus) &&
      registrationStatus.length > 0
    ) {
      const filteredHits = aventriAttendees.hits.hits.filter((h) =>
        registrationStatus.includes(h._source.object['dit:registrationStatus'])
      )

      registrationStatus.forEach((status) =>
        filteredHits.push(
          ...[...Array(15).keys()].map(() =>
            generateFakeAttendeeHitObject(status)
          )
        )
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
  var dataHubTypes = get(req.body, "query.bool.must[0].terms['object.type']")
  if (isEqual(dataHubTypes, DATA_HUB_ACTIVITY)) {
    var company = get(
      req.body,
      "query.bool.must[1].terms['object.attributedTo.id'][0]"
    )
    return res.json(company === VENUS_LTD ? noActivity : dataHubActivities)
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
    return res.json(
      company === BEST_EVER_COMPANY
        ? companyActivities
        : dataHubAndExternalActivities
    )
  }

  // Maxemail campaigns
  if (isEqual(maxemailCampaignQuery, req.body)) {
    return res.json(maxemailCampaignActivities)
  }

  // Maxemail emails sent
  if (isEqual(maxemailEmailSentQuery, req.body)) {
    return res.json(maxemailEmailSentActivities)
  }

  return res.json(noActivity)
}
