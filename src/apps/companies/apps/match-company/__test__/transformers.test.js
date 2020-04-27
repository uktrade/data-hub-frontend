const { transformToDnbInvestigation } = require('../transformers')

describe('#transformToDnbInvestigation', () => {
  it('should transform the request body', () => {
    expect(
      transformToDnbInvestigation(
        {
          id: 'id',
          name: 'name',
          address: {
            line_1: 'line_1',
            line_2: 'line_2',
            town: 'town',
            county: 'county',
            postcode: 'postcode',
            country: {
              name: 'United Kingdom',
              id: 'countryId',
            },
          },
        },
        'website',
        'telephone'
      )
    ).to.deep.equal({
      company: 'id',
      name: 'name',
      website: 'website',
      telephone_number: 'telephone',
      address: {
        line_1: 'line_1',
        line_2: 'line_2',
        town: 'town',
        county: 'county',
        postcode: 'postcode',
        country: 'countryId',
      },
    })
  })
})
