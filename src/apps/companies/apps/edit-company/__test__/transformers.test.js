const { UK_REGIONS } = require('../../../../../common/constants')
const {
  transformFormToDnbChangeRequest,
  transformCompanyToForm,
} = require('../transformers')

describe('#transformFormToDnbChangeRequest', () => {
  context('when all fields are populated', () => {
    let actual = transformFormToDnbChangeRequest('company123', {
      address1: 'line 1',
      address2: 'line 2',
      city: 'town',
      county: 'county',
      postcode: 'postcode',
      area: 'area',
    })

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
})

describe('#transformCompanyToForm', () => {
  context(
    'when all fields except allowed fields populated with duns_number is null',
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
          id: UK_REGIONS.NORTH_WEST,
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
        uk_region: UK_REGIONS.NORTH_WEST,
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

  context('when all fields populated with duns_number is null', () => {
    const company = {
      business_type: {
        name: 'Private limited company',
        id: '6f75408b-03e7-e611-bca1-e4115bead28a',
      },
      vat_number: '',
      website: null,
      description: 'This is a dummy company for testing',
      headquarter_type: null,
      export_segment: 'hep',
      export_sub_segment: 'sustain_nurture_and_grow',
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
        id: UK_REGIONS.NORTH_WEST,
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
      vat_number: '',
      export_segment: 'hep',
      export_sub_segment: 'sustain_nurture_and_grow',
      description: 'This is a dummy company for testing',
      website: null,
      business_type: {
        name: 'Private limited company',
        id: '6f75408b-03e7-e611-bca1-e4115bead28a',
      },
      address1: '82 Ramsgate Rd',
      address2: '',
      city: 'Willington',
      county: '',
      postcode: 'NE28 5JB',
      headquarter_type: '',
      uk_region: UK_REGIONS.NORTH_WEST,
      sector: '355f977b-8ac3-e211-a646-e4115bead28a',
      employee_range: '41afd8d0-5d95-e211-a939-e4115bead28a',
      turnover_range: '7a4cd12a-6095-e211-a939-e4115bead28a',
      trading_names: '',
      turnover: 990,
    }

    it('should transform the request body', () => {
      expect(actual).to.deep.equal(expected)
    })
  })

  context('when all fields populated with duns_number has a value', () => {
    const company = {
      name: 'sample-company',
      number_of_employees: 321,
      vat_number: 54321,
      website: null,
      description: 'This is a dummy company for testing',
      headquarter_type: null,
      export_segment: 'hep',
      export_sub_segment: 'sustain_nurture_and_grow',
      trading_names: [''],
      duns_number: 123,
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
        id: UK_REGIONS.NORTH_WEST,
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
        area: {
          id: '80756b9a-5d95-e211-a939-e4115bead28a',
          name: 'California',
        },
      },
    }

    const actual = transformCompanyToForm(company)

    const expected = {
      vat_number: 54321,
      export_segment: 'hep',
      export_sub_segment: 'sustain_nurture_and_grow',
      description: 'This is a dummy company for testing',
      website: null,
      address1: '82 Ramsgate Rd',
      address2: '',
      area: '80756b9a-5d95-e211-a939-e4115bead28a',
      city: 'Willington',
      county: '',
      postcode: 'NE28 5JB',
      headquarter_type: '',
      name: 'sample-company',
      number_of_employees: 321,
      uk_region: UK_REGIONS.NORTH_WEST,
      sector: '355f977b-8ac3-e211-a646-e4115bead28a',
      employee_range: '41afd8d0-5d95-e211-a939-e4115bead28a',
      turnover_range: '7a4cd12a-6095-e211-a939-e4115bead28a',
      trading_names: '',
      turnover: 990,
    }

    it('should transform the request body', () => {
      expect(actual).to.deep.equal(expected)
    })
  })
})
