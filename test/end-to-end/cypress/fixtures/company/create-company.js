const { v4: uuidv4 } = require('uuid')

function create() {
  return {
    pk: uuidv4(),
    model: 'company.company',
    fields: {
      name: 'audit testing',
      business_type: '98d14e94-5d95-e211-a939-e4115bead28a',
      employee_range: '41afd8d0-5d95-e211-a939-e4115bead28a',
      turnover_range: '7a4cd12a-6095-e211-a939-e4115bead28a',
      export_to_countries: [
        '82756b9a-5d95-e211-a939-e4115bead28a',
        '83756b9a-5d95-e211-a939-e4115bead28a',
      ],
      future_interest_countries: ['37afd8d0-5d95-e211-a939-e4115bead28a'],
      sector: '355f977b-8ac3-e211-a646-e4115bead28a',
      address_1: '100 Path',
      address_town: 'A town',
      address_postcode: '12345',
      address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
      registered_address_1: '100 Path',
      registered_address_town: 'A town',
      registered_address_postcode: '12345',
      registered_address_country: '81756b9a-5d95-e211-a939-e4115bead28a',
      description: 'This is a dummy company for testing',
      created_on: '2017-10-16T11:00:00Z',
      modified_on: '2017-11-16T11:00:00Z',
    },
  }
}

module.exports = {
  create,
}
