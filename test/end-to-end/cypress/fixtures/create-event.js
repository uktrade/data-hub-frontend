const { v4: uuidv4 } = require('uuid')

function defaultEvent() {
  return {
    model: 'event.event',
    pk: uuidv4(),
    fields: {
      name: 'Grand exhibition',
      event_type: '2fade471-e868-4ea9-b125-945eb90ae5d4',
      start_date: '2020-01-01',
      end_date: '2020-01-02',
      location_type: 'b71fa81c-0c22-44c6-ab6f-13b9e045dc10',
      notes: 'This is a dummy event for testing.',
      address_1: 'Grand Court Exhibition Centre',
      address_2: 'Grand Court Lane',
      address_town: 'London',
      address_county: 'Londinium',
      address_postcode: 'SW9 9AA',
      address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
      organiser: 'e83a608e-84a4-11e6-ae22-56b6b6499611',
      lead_team: '18e84437-5a25-e511-b6bc-e4115bead28a',
      teams: [
        '18e84437-5a25-e511-b6bc-e4115bead28a',
        '8880da16-d80e-e611-9bdc-e4115bead28a',
      ],
      related_programmes: ['1abe5563-6482-41d8-b566-6a9ee9e37c5f'],
      uk_region: '864cd12a-6095-e211-a939-e4115bead28a',
      service: '9584b82b-3499-e211-a939-e4115bead28a',
      created_on: '2017-01-05T00:00:00Z',
      modified_on: '2017-01-05T00:00:00Z',
    },
  }
}

module.exports = {
  defaultEvent,
}
