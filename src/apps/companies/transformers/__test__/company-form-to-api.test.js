const transformCompanyFormToApi = require('~/src/apps/companies/transformers/company-form-to-api')

describe('Company form to API transformer', () => {
  context('when all fields are populated', () => {
    beforeEach(() => {
      this.transformed = transformCompanyFormToApi({
        contacts: [],
        interactions: [],
        address_1: 'line 1',
        address_2: 'line 2',
        address_town: 'town',
        address_county: 'county',
        address_postcode: 'postcode',
        address_country: 'country',
        registered_address_1: 'registered line 1',
        registered_address_2: 'registered line 2',
        registered_address_town: 'registered town',
        registered_address_county: 'registered county',
        registered_address_postcode: 'registered postcode',
        registered_address_country: 'registered country',
        trading_names: 'trading',
        headquarter_type: 'ghq',
        another_field: 'another',
      })
    })

    it('should transform', () => {
      expect(this.transformed).to.deep.equal({
        address: {
          country: 'country',
          county: 'county',
          line_1: 'line 1',
          line_2: 'line 2',
          postcode: 'postcode',
          town: 'town',
        },
        another_field: 'another',
        headquarter_type: 'ghq',
        registered_address: {
          country: 'registered country',
          county: 'registered county',
          line_1: 'registered line 1',
          line_2: 'registered line 2',
          postcode: 'registered postcode',
          town: 'registered town',
        },
        trading_names: [
          'trading',
        ],
      })
    })
  })

  context('when "trading_names" is not set', () => {
    beforeEach(() => {
      this.transformed = transformCompanyFormToApi({
        contacts: [],
        interactions: [],
        address_1: 'line 1',
        address_2: 'line 2',
        address_town: 'town',
        address_county: 'county',
        address_postcode: 'postcode',
        address_country: 'country',
        registered_address_1: 'registered line 1',
        registered_address_2: 'registered line 2',
        registered_address_town: 'registered town',
        registered_address_county: 'registered county',
        registered_address_postcode: 'registered postcode',
        registered_address_country: 'registered country',
        headquarter_type: 'ghq',
        another_field: 'another',
      })
    })

    it('should transform', () => {
      expect(this.transformed).to.deep.equal({
        address: {
          country: 'country',
          county: 'county',
          line_1: 'line 1',
          line_2: 'line 2',
          postcode: 'postcode',
          town: 'town',
        },
        another_field: 'another',
        headquarter_type: 'ghq',
        registered_address: {
          country: 'registered country',
          county: 'registered county',
          line_1: 'registered line 1',
          line_2: 'registered line 2',
          postcode: 'registered postcode',
          town: 'registered town',
        },
        trading_names: [],
      })
    })
  })

  context('when unsetting optional address fields', () => {
    beforeEach(() => {
      this.transformed = transformCompanyFormToApi({
        contacts: [],
        interactions: [],
        address_1: 'line 1',
        address_town: 'town',
        address_country: 'country',
        registered_address_1: 'registered line 1',
        registered_address_2: 'registered line 2',
        registered_address_town: 'registered town',
        registered_address_county: 'registered county',
        registered_address_postcode: 'registered postcode',
        registered_address_country: 'registered country',
        trading_names: 'trading',
        headquarter_type: 'ghq',
        another_field: 'another',
      })
    })

    it('should transform', () => {
      expect(this.transformed).to.deep.equal({
        address: {
          country: 'country',
          county: '',
          line_1: 'line 1',
          line_2: '',
          postcode: '',
          town: 'town',
        },
        another_field: 'another',
        headquarter_type: 'ghq',
        registered_address: {
          country: 'registered country',
          county: 'registered county',
          line_1: 'registered line 1',
          line_2: 'registered line 2',
          postcode: 'registered postcode',
          town: 'registered town',
        },
        trading_names: [
          'trading',
        ],
      })
    })
  })

  context('when registered address fields are not specified', () => {
    beforeEach(() => {
      this.transformed = transformCompanyFormToApi({
        contacts: [],
        interactions: [],
        address_1: 'line 1',
        address_2: 'line 2',
        address_town: 'town',
        address_county: 'county',
        address_postcode: 'postcode',
        address_country: 'country',
        trading_names: 'trading',
        headquarter_type: 'ghq',
        another_field: 'another',
      })
    })

    it('should transform', () => {
      expect(this.transformed).to.deep.equal({
        address: {
          country: 'country',
          county: 'county',
          line_1: 'line 1',
          line_2: 'line 2',
          postcode: 'postcode',
          town: 'town',
        },
        another_field: 'another',
        headquarter_type: 'ghq',
        registered_address: undefined,
        trading_names: [
          'trading',
        ],
      })
    })
  })

  context('when "headquarter_type" is set as "not_headquarters', () => {
    beforeEach(() => {
      this.transformed = transformCompanyFormToApi({
        contacts: [],
        interactions: [],
        address_1: 'line 1',
        address_2: 'line 2',
        address_town: 'town',
        address_county: 'county',
        address_postcode: 'postcode',
        address_country: 'country',
        registered_address_1: 'registered line 1',
        registered_address_2: 'registered line 2',
        registered_address_town: 'registered town',
        registered_address_county: 'registered county',
        registered_address_postcode: 'registered postcode',
        registered_address_country: 'registered country',
        trading_names: 'trading',
        headquarter_type: 'not_headquarters',
        another_field: 'another',
      })
    })

    it('should transform', () => {
      expect(this.transformed).to.deep.equal({
        address: {
          country: 'country',
          county: 'county',
          line_1: 'line 1',
          line_2: 'line 2',
          postcode: 'postcode',
          town: 'town',
        },
        another_field: 'another',
        headquarter_type: '',
        registered_address: {
          country: 'registered country',
          county: 'registered county',
          line_1: 'registered line 1',
          line_2: 'registered line 2',
          postcode: 'registered postcode',
          town: 'registered town',
        },
        trading_names: [
          'trading',
        ],
      })
    })
  })
})
