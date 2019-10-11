const transformCompanyToRegionView = require('~/src/apps/companies/transformers/company-to-region-view')

const unitedKingdomId = '80756b9a-5d95-e211-a939-e4115bead28a'
const franceId = '82756b9a-5d95-e211-a939-e4115bead28a'

describe('#transformCompanyToRegionView', () => {
  const commonTests = (expectedRegion) => {
    it('should set the region', () => {
      expect(this.actual).to.deep.equal(expectedRegion)
    })
  }

  context('when a UK business', () => {
    context('when all information is populated with a D&B dunns number', () => {
      beforeEach(() => {
        this.actual = transformCompanyToRegionView({
          address: {
            country: {
              id: unitedKingdomId,
            },
          },
          uk_region: {
            name: 'North West',
          },
          archived: false,
          duns_number: 888,
          id: 123,
        })
      })

      commonTests({
        name: 'North West',
        url: '/companies/123/business-details/region',
      })
    })

    context('when all information is populated without a D&B dunns number', () => {
      beforeEach(() => {
        this.actual = transformCompanyToRegionView({
          address: {
            country: {
              id: unitedKingdomId,
            },
          },
          uk_region: {
            name: 'North West',
          },
          archived: false,
          id: 123,
        })
      })

      commonTests({
        name: 'North West',
        url: '/companies/123/edit',
      })
    })

    context('when no information is populated', () => {
      beforeEach(() => {
        this.actual = transformCompanyToRegionView({
          address: {
            country: {
              id: unitedKingdomId,
            },
          },
        })
      })

      commonTests({
        name: 'Not set',
        url: null,
      })
    })
  })

  context('when a business outside the UK', () => {
    beforeEach(() => {
      this.actual = transformCompanyToRegionView({
        address: {
          country: {
            id: franceId,
          },
        },
      })
    })

    it('should not set the region', () => {
      expect(this.actual).to.not.exist
    })
  })
})
