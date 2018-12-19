const transformCompanyToRegionView = require('~/src/apps/companies/transformers/company-to-region-view')

describe('#transformCompanyToRegionView', () => {
  const commonTests = (expectedSectors) => {
    it('should set the region', () => {
      expect(this.actual).to.deep.equal(expectedSectors)
    })
  }

  context('when all information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToRegionView({
        uk_region: {
          name: 'North West',
        },
      })
    })

    commonTests('North West')
  })

  context('when no information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToRegionView({
      })
    })

    commonTests('Not set')
  })
})
