const { faker } = require('@faker-js/faker')

const generateAventriEvent = (
  {
    id,
    name,
    startTime,
    endTime,
    address1,
    address2,
    address3,
    city,
    country,
    postcode,
    nameOfLocation,
  } = {
    id: faker.string.numeric(),
    name: faker.word.sample(),
    startTime: faker.date.between({
      from: faker.date.past(),
      to: faker.date.future(),
    }),
    endTime: faker.date.between({
      from: faker.date.past(),
      to: faker.date.future(),
    }),
    address1: faker.location.buildingNumber(),
    address2: faker.location.buildingNumber(),
    address3: faker.location.buildingNumber(),
    city: faker.location.buildingNumber(),
    country: faker.location.buildingNumber(),
    postcode: faker.location.buildingNumber(),
    nameOfLocation: faker.location.streetAddress(),
  }
) => {
  return {
    _index:
      'activities__feed_id_dummy-data-feed__date_2022-05-03__timestamp_1651585823__batch_id_jaedyooq__',
    _type: '_doc',
    _id: `dit:aventri:Event:${id}:Create`,
    _score: 1.3122244,
    _source: {
      'dit:application': 'aventri',
      id: `dit:aventri:Event:${id}:Create`,
      object: {
        attributedTo: {
          id: 'dit:aventri:Folder:EITA Event 2022',
          type: 'dit:aventri:Folder',
        },
        content: '<p>This is some content about event</p>',
        'dit:aventri:approval_required': '0',
        'dit:aventri:approval_status': '0',
        'dit:aventri:city': 'Online',
        'dit:aventri:clientcontact': '',
        'dit:aventri:closedate': '2022-01-23T23:45:00',
        'dit:aventri:code': 'EITA Code',
        'dit:aventri:contactinfo': 'contact2@example.host',
        'dit:aventri:country': '',
        'dit:aventri:createdby': '1234',
        'dit:aventri:defaultlanguage': 'eng',
        'dit:aventri:folderid': id,
        'dit:aventri:live_date': null,
        'dit:aventri:location_address1': address1,
        'dit:aventri:location_address2': address2,
        'dit:aventri:location_address3': address3,
        'dit:aventri:location_city': city,
        'dit:aventri:location_country': country,
        'dit:aventri:location_name': '',
        'dit:aventri:location_postcode': postcode,
        'dit:aventri:location_state': '',
        'dit:aventri:locationname': nameOfLocation,
        'dit:aventri:max_reg': '0',
        'dit:aventri:modifiedby': 'firstname1.lastname1@example.host',
        'dit:aventri:modifieddatetime': '2022-01-23T20:53:38',
        'dit:aventri:price_type': 'net',
        'dit:aventri:standardcurrency': 'Sterling',
        'dit:aventri:state': '',
        'dit:aventri:timezone': 'Europe/London',
        'dit:public': true,
        'dit:status': 'Pre-Event',
        endTime,
        id: `dit:aventri:Event:${id}`,
        name,
        published: new Date().toISOString(),
        startTime,
        type: ['dit:aventri:Event'],
        url: '',
      },
      published: '2022-01-23T20:09:14',
      type: 'dit:aventri:Event',
    },
  }
}

/**
 * Generate an array of aventri event hits
 */
const generateAventriEventHits = (additionalEventCount = 0) => {
  return [
    ...[
      {
        id: 1111,
        name: 'EITA Test Event 2022',
        startTime: '2021-03-02T20:09:14',
        endTime: '2022-05-04T20:09:14',
        address1: '1 street avenue',
        address2: 'Brockley',
        address3: 'Lewisham',
        city: 'London',
        country: 'England',
        postcode: 'ABC 123',
        nameOfLocation: 'Name of Location',
      },
      {
        id: 1113,
        name: 'EITA Test Event 2 2022',
        startTime: '2021-03-02T20:09:14',
        endTime: '2022-05-04T20:09:14',
      },
      {
        id: 1112,
        name: 'EITA Test Event2 with unknown date',
        startTime: null,
        endTime: null,
      },
      {
        id: 1114,
        name: 'EITA Test Event in Future',
        startTime: '2030-03-02T20:09:14',
        endTime: '2030-05-04T20:09:14',
      },
      {
        id: 2222,
        name: 'EITA Test Filtering Event 2022',
        startTime: '2021-03-02T20:09:14',
        endTime: '2021-03-02T20:09:14',
      },
      {
        id: 6666,
        name: 'Aventri event no details',
        startTime: '2021-03-02T20:09:14',
        endTime: null,
        address1: null,
        address2: null,
        address3: null,
        city: null,
        country: null,
        postcode: null,
        nameOfLocation: null,
      },
    ].map(generateAventriEvent),
    ...Array.from({ length: additionalEventCount }).map(generateAventriEvent),
  ]
}

/**
 * Generates a full ES response for aventri events
 */
const generateAventriEventESResponse = (additionalEventCount = 0) => {
  const events = generateAventriEventHits(additionalEventCount)
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
        value: events.length,
        relation: 'eq',
      },
      max_score: 1.3122244,
      hits: events,
    },
  }
}

module.exports = {
  generateAventriEvent,
  generateAventriEventESResponse,
  generateAventriEventHits,
}
