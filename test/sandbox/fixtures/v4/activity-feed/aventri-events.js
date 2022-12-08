const { faker } = require('@faker-js/faker')

const generateFakerAventriEvent = () => ({
  id: faker.random.numeric(),
  name: faker.random.word(),
  startTime: faker.date.between(faker.date.past(), faker.date.future()),
  endTime: faker.date.between(faker.date.past(), faker.date.future()),
})

const generateAventriEvent = ({ id, name, startTime, endTime }) => {
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
        'dit:aventri:location_address1': faker.address.buildingNumber(),
        'dit:aventri:location_address2': 'Brockley',
        'dit:aventri:location_address3': 'Lewisham',
        'dit:aventri:location_city': faker.address.city(),
        'dit:aventri:location_country': faker.address.country(),
        'dit:aventri:location_name': '',
        'dit:aventri:location_postcode': faker.address.zipCode(),
        'dit:aventri:location_state': '',
        'dit:aventri:locationname': 'Name of Location',
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
        published: '2022-01-23T20:09:14',
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
        endTime: '2021-03-02T20:09:14',
      },
      {
        id: 1113,
        name: 'EITA Test Event 2 2022',
        startTime: '2021-03-02T20:09:14',
        endTime: '2021-03-02T20:09:14',
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
    ].map(generateAventriEvent),
    ...Array.from({ length: additionalEventCount }).map(
      generateFakerAventriEvent
    ),
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
