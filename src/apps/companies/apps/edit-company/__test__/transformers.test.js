const {
  transformFormToDnbChangeRequest,
  transformCompanyToForm,
} = require('../transformers')

describe('#transformFormToDnbChangeRequest', () => {
  context('when all fields are populated', () => {
    let actual = transformFormToDnbChangeRequest(
      'company123',
      {
        address1: 'line 1',
        address2: 'line 2',
        city: 'town',
        county: 'county',
        postcode: 'postcode',
        area: 'area',
      },
      { locals: { features: { 'address-area-company-search': true } } }
    )

    it('should transform the request body', () => {
      expect(actual).to.deep.equal({
        address: {
          line_1: 'line 1',
          line_2: 'line 2',
          town: 'town',
          county: 'county',
          postcode: 'postcode',
          area: {
            id: 'area',
          },
        },
      })
    })
  })

  context('when address-area-company-search feature flag is false', () => {
    let actual = transformFormToDnbChangeRequest(
      'company123',
      {
        address1: 'line 1',
        address2: 'line 2',
        city: 'town',
        county: 'county',
        postcode: 'postcode',
        country: 'country',
        area: 'area',
      },
      { locals: { features: { 'address-area-company-search': false } } }
    )

    it('should omit the area field', () => {
      expect(actual).to.deep.equal({
        address: {
          line_1: 'line 1',
          line_2: 'line 2',
          town: 'town',
          county: 'county',
          postcode: 'postcode',
        },
      })
    })
  })
})

describe('#transformCompanyToForm', () => {
  context(
    'when all fields except whitelisted fields populated with duns_number is null',
    () => {
      const company = {
        trading_names: [''],
        duns_number: null,
        employee_range: {
          name: '500+',
          id: '41afd8d0-5d95-e211-a939-e4115bead28a',
        },
        sector: {
          name: 'Retail',
          id: '355f977b-8ac3-e211-a646-e4115bead28a',
        },
        turnover_range: {
          name: '£33.5M+',
          id: '7a4cd12a-6095-e211-a939-e4115bead28a',
        },
        turnover: 123,
        turnover_gbp: 987,
        uk_region: {
          name: 'North West',
          id: '824cd12a-6095-e211-a939-e4115bead28a',
        },
        address: {
          line_1: '82 Ramsgate Rd',
          line_2: '',
          town: 'Willington',
          county: '',
          postcode: 'NE28 5JB',
          country: {
            name: 'United Kingdom',
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
          },
        },
      }

      const actual = transformCompanyToForm(company)

      const expected = {
        address: {
          line_1: '82 Ramsgate Rd',
          line_2: '',
          town: 'Willington',
          county: '',
          postcode: 'NE28 5JB',
          country: {
            name: 'United Kingdom',
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
          },
        },
        address1: '82 Ramsgate Rd',
        address2: '',
        city: 'Willington',
        county: '',
        postcode: 'NE28 5JB',
        headquarter_type: '',
        uk_region: '824cd12a-6095-e211-a939-e4115bead28a',
        sector: '355f977b-8ac3-e211-a646-e4115bead28a',
        employee_range: '41afd8d0-5d95-e211-a939-e4115bead28a',
        turnover_range: '7a4cd12a-6095-e211-a939-e4115bead28a',
        trading_names: '',
        turnover: 990,
      }

      it('should transform the request body', () => {
        expect(actual).to.deep.equal(expected)
      })
    }
  )
})
