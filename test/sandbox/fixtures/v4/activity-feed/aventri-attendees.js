import { faker } from '@faker-js/faker'

const futureEventIdWithLargeAttendeeList = 1114
const pastEventIdWithLargeAttendeeList = 1111

function generateAttendee({
  id = faker.string.numeric(),
  eventId = faker.string.numeric(),
  firstName = faker.person.firstName(),
  lastName = faker.person.lastName(),
  email = faker.internet.email(),
  companyName = faker.company.name(),
  registrationStatus = faker.helpers.arrayElement([
    'Activated',
    'Attended',
    'Confirmed',
    'Cancelled',
    'No Show',
    'Waitlist',
  ]),
  datahubContactUrl = faker.internet.domainName(),
} = {}) {
  return {
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
  }
}

const generateListOfAttendeesForEvent = (eventId) =>
  ['Activated', 'Confirmed', 'Attended', 'Cancelled', 'No Show', 'Waitlist']
    .map((status) =>
      Array.from({ length: 10 }).map((_, index) =>
        generateAttendee({
          eventId: eventId,
          email: `contact${index}@bob.com`,
          registrationStatus: status,
        })
      )
    )
    .flat()

/**
 * Generate an array of aventri attendee hits
 */
export const generateAventriAttendeeHits = () => {
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
        eventId: 1114,
        firstName: 'Snow',
        lastName: 'White',
        email: 'contact1@bob.com',
        companyName: 'Ever Far Away',
        registrationStatus: 'Confirmed',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Rapunzel',
        lastName: 'Hair',
        email: 'contact4@bob.com',
        companyName: 'Ever Far Away',
        registrationStatus: 'No Show',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Elsa',
        lastName: 'Ice',
        email: 'contact3@bob.com',
        companyName: 'Ever Far Away',
        registrationStatus: 'Waitlist',
      },
      {
        id: 2222,
        eventId: 1111,
        firstName: 'Jasmine',
        lastName: 'Tiger',
        email: 'contact2@bob.com',
        companyName: 'Ever Far Away',
        registrationStatus: 'Attended',
      },
      {
        id: 2222,
        eventId: 1114,
        firstName: 'Fiona',
        lastName: 'Shrek',
        email: 'contact1@bob.com',
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
    ...generateListOfAttendeesForEvent(futureEventIdWithLargeAttendeeList),
    ...generateListOfAttendeesForEvent(pastEventIdWithLargeAttendeeList),
  ]
}

/**
 * Generates a full ES response for aventri attendees
 */
export const generateAventriAttendeeESResponse = () => {
  const attendees = generateAventriAttendeeHits()
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
