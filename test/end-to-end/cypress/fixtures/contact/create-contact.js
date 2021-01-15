const { v4: uuidv4 } = require('uuid')

function create(companyId) {
  return {
    model: 'company.contact',
    pk: uuidv4(),
    fields: {
      first_name: 'Johnny',
      last_name: 'Cakeman',
      company: companyId,
      primary: 'False',
      telephone_countrycode: '+44',
      telephone_number: '67890123432',
      email: 'johnny@cakeman.com',
      address_1: '82 Ramsgate Rd',
      address_town: 'Willington',
      address_postcode: 'NE28 5JB',
      address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
      notes: 'This is a dummy contact for testing',
      created_on: '2017-02-28T15:00:00Z',
      modified_on: '2017-06-05T00:00:00Z',
      archived_documents_url_path: '/documents/123',
    },
  }
}

module.exports = {
  create,
}
