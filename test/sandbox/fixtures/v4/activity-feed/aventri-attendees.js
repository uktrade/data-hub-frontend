const { faker } = require('@faker-js/faker')
const {
  EVENT_AVENTRI_ATTENDEES_STATUSES,
} = require('../../../../../src/apps/companies/apps/activity-feed/constants')

const generateAttendee = (
  {
    id,
    eventId,
    firstName,
    lastName,
    email,
    companyName,
    registrationStatus,
    datahubContactUrl,
  } = {
    id: faker.random.numeric(),
    eventId: faker.random.numeric(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    companyName: faker.company.name(),
    registrationStatus: faker.helpers.arrayElement(
      EVENT_AVENTRI_ATTENDEES_STATUSES
    ),
    datahubContactUrl: faker.internet.domainName(),
  }
) => ({
  _index:
    'activities__feed_id_dummy-data-feed__date_2022-06-28__timestamp_1656410763__batch_id_ltepro51__',
  _type: '_doc',
  _id: `dit:aventri:Event:${eventId}:Attendee:${id}:Create`,
  _score: 3.6005385,
  _source: {
    'dit:application': 'aventri',
    id: `dit:aventri:Event:${eventId}:Attendee:${id}:Create`,
    object: {
      attributedTo: {
        id: `dit:aventri:Event:${eventId}`,
        type: 'dit:aventri:Event',
      },
      'dit:aventri:approvalstatus': '',
      'dit:aventri:category': null,
      'dit:aventri:companyname': companyName,
      'dit:aventri:createdby': 'attendee',
      'dit:aventri:email': email,
      'dit:aventri:firstname': firstName,
      'dit:aventri:language': 'eng',
      'dit:aventri:lastmodified': '2022-01-24T11:12:13',
      'dit:aventri:lastname': lastName,
      'dit:aventri:modifiedby': 'attendee',
      'dit:aventri:registrationstatus': registrationStatus,
      'dit:aventri:virtual_event_attendance': 'Yes',
      'dit:emailAddress': email,
      'dit:firstName': firstName,
      'dit:lastName': lastName,
      'dit:registrationStatus': registrationStatus,
      id: `dit:aventri:Attendee:${id}`,
      published: '1970-01-01T00:00:00',
      type: ['dit:aventri:Attendee'],
    },
    published: '2022-02-24T11:28:57',
    type: 'dit:aventri:Attendee',
    datahubContactUrl,
  },
})

/**
 * Generate an array of aventri attendee hits
 */
const generateAventriAttendeeHits = (additionalAttendeeCount = 0) => {
  return [
    ...[
      {
        id: 1111,
        eventId: 1111,
        firstName: 'Elle',
        lastName: 'Woods',
        email: 'elle.woods@example.com',
        companyName: 'West End Corp',
        registrationStatus: 'Activated',
        datahubContactUrl:
          '/contacts/26f61090-df61-446c-b846-60c8bbca522f/details',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Cindy',
        lastName: 'Ella',
        email: 'cinders@gmail.com',
        companyName: 'Royal Palace',
        registrationStatus: 'Confirmed',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Fiona',
        lastName: 'Shrek',
        email: 'fiona.shrek@gmail.com',
        companyName: 'Ever Far Away',
        registrationStatus: 'Waitlist',
        datahubContactUrl:
          '/contacts/26f61090-df61-446c-b846-60c8bbca522f/details',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Ariel',
        lastName: 'Ocean',
        email: 'ariel.ocean@gmail.com',
        companyName: 'Ever Far Away',
        registrationStatus: 'No Show',
        datahubContactUrl:
          '/contacts/26f61090-df61-446c-b846-60c8bbca522f/details',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Tiana',
        lastName: 'Green',
        email: 'tiana.green@gmail.com',
        companyName: 'Ever Far Away',
        registrationStatus: 'Attended',
        datahubContactUrl:
          '/contacts/26f61090-df61-446c-b846-60c8bbca522f/details',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Belle',
        lastName: 'Beastly',
        email: '',
        companyName: 'Ever Far Away',
        registrationStatus: 'Attended',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Snow',
        lastName: 'White',
        email: '',
        companyName: 'Ever Far Away',
        registrationStatus: 'Confirmed',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Rapunzel',
        lastName: 'Hair',
        email: '',
        companyName: 'Ever Far Away',
        registrationStatus: 'No Show',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Elsa',
        lastName: 'Ice',
        email: '',
        companyName: 'Ever Far Away',
        registrationStatus: 'Waitlist',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Jasmine',
        lastName: 'Tiger',
        email: '',
        companyName: 'Ever Far Away',
        registrationStatus: 'Attended',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Fiona',
        lastName: 'Shrek',
        email: '',
        companyName: 'Ever Far Away',
        registrationStatus: 'Confirmed',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        registrationStatus: '',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'John',
        lastName: 'Mcclain',
        email: 'john.mcclain@gmail.com',
        companyName: 'Nakatomi',
        registrationStatus: 'Cancelled',
        datahubContactUrl:
          '/contacts/26f61090-df61-446c-b846-60c8bbca522f/details',
      },
    ].map(generateAttendee),
    ...Array.from({ length: additionalAttendeeCount }).map(generateAttendee),
  ]
}

/**
 * Generates a full ES response for aventri attendees
 */
const generateAventriAttendeeESResponse = (additionalAttendeeCount = 0) => {
  const attendees = generateAventriAttendeeHits(additionalAttendeeCount)
  return {
    took: 1930,
    timed_out: false,
    _shards: {
      total: 271,
      successful: 271,
      skipped: 135,
      failed: 0,
    },
    hits: {
      total: {
        value: attendees.length,
        relation: 'eq',
      },
      max_score: 1.3122244,
      hits: attendees,
    },
  }
}

module.exports = { generateAventriAttendeeESResponse }
