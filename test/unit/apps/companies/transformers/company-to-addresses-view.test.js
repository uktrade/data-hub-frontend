const transformCompanyToAddressesView = require('~/src/apps/companies/transformers/company-to-addresses-view')

describe('#transformCompanyToAddressesView', () => {
  context('when all information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToAddressesView({
        registered_address_1: 'registered address 1',
        registered_address_2: 'registered address 2',
        registered_address_town: 'registered address town',
        registered_address_county: 'registered address county',
        registered_address_postcode: 'registered address postcode',
        registered_address_country: {
          name: 'registered address country',
        },
        trading_address_1: 'trading address 1',
        trading_address_2: 'trading address 2',
        trading_address_town: 'trading address town',
        trading_address_county: 'trading address county',
        trading_address_postcode: 'trading address postcode',
        trading_address_country: {
          name: 'trading address country',
        },
      })
    })

    it('should set the registered address', () => {
      expect(this.actual.registered.address).to.deep.equal([
        'registered address 1',
        'registered address 2',
        'registered address town',
        'registered address county',
        'registered address postcode',
        'registered address country',
      ])
    })

    it('should set the registered address badges', () => {
      expect(this.actual.registered.meta).to.deep.equal([
        {
          value: 'Registered',
          label: 'Type',
          type: 'badge',
        },
      ])
    })

    it('should set the trading address', () => {
      expect(this.actual.trading.address).to.deep.equal([
        'trading address 1',
        'trading address 2',
        'trading address town',
        'trading address county',
        'trading address postcode',
        'trading address country',
      ])
    })

    it('should set the trading address badges', () => {
      expect(this.actual.trading.meta).to.deep.equal([
        {
          value: 'Trading',
          label: 'Type',
          type: 'badge',
        },
      ])
    })
  })

  context('when the company has the minimal address information', () => {
    beforeEach(() => {
      this.actual = transformCompanyToAddressesView({
        registered_address_country: {
          name: 'registered address country',
        },
      })
    })

    it('should set the registered address', () => {
      expect(this.actual.registered.address).to.deep.equal([
        'registered address country',
      ])
    })

    it('should set the registered address badges', () => {
      expect(this.actual.registered.meta).to.deep.equal([
        {
          value: 'Trading',
          label: 'Type',
          type: 'badge',
        },
        {
          value: 'Registered',
          label: 'Type',
          type: 'badge',
        },
      ])
    })

    it('should not set the trading address', () => {
      expect(this.actual.trading).to.be.undefined
    })
  })
})
