const transformCompanyToSectorView = require('src/apps/companies/transformers/company-to-sector-view')

describe('#transformCompanyToSectorView', () => {
  const commonTests = (expectedSectors) => {
    it('should set the sectors', () => {
      expect(this.actual).to.deep.equal(expectedSectors)
    })
  }

  context('when all information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToSectorView({
        sector: {
          name: 'Renewable Energy',
        },
      })
    })

    commonTests([ 'Renewable Energy' ])
  })

  context('when no information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToSectorView({
      })
    })

    commonTests([ 'Not set' ])
  })
})
