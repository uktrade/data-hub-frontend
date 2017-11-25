const { assign } = require('lodash')

const { getCompanyAddress } = require('~/src/apps/companies/transformers/shared')
const companyData = require('~/test/unit/data/company')

describe('Companies shared transformers', () => {
  describe('#getCompanyAddress', () => {
    context('when the company has a trading address', () => {
      beforeEach(() => {
        this.address = getCompanyAddress(assign({}, companyData, {
          trading_address_1: '100 Bolton Road',
          trading_address_2: null,
          trading_address_town: 'London',
          trading_address_county: null,
          trading_address_postcode: 'W1C 2BA',
          trading_address_country: null,
        }))
      })

      it('should return a formatted trading address', () => {
        expect(this.address).to.deep.equal({
          label: 'Trading address',
          value: '100 Bolton Road, London, W1C 2BA',
        })
      })
    })

    context('when the company does not have a trading address', () => {
      beforeEach(() => {
        this.address = getCompanyAddress(assign({}, companyData, {
          registered_address_1: 'Leeds City Centre',
          registered_address_2: null,
          registered_address_town: 'Leeds',
          registered_address_county: null,
          registered_address_postcode: 'EX1 2PL',
          registered_address_country: {
            id: '4231',
            name: 'United Kingdom',
          },
          trading_address_1: null,
          trading_address_2: null,
          trading_address_town: null,
          trading_address_county: null,
          trading_address_postcode: null,
          trading_address_country: null,
        }))
      })

      it('should return a formatted registered address', () => {
        expect(this.address).to.deep.equal({
          label: 'Primary address',
          value: 'Leeds City Centre, Leeds, EX1 2PL, United Kingdom',
        })
      })
    })
  })
})
