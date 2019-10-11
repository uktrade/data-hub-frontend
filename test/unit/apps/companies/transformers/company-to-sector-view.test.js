const transformCompanyToSectorView = require('~/src/apps/companies/transformers/company-to-sector-view')

describe('#transformCompanyToSectorView', () => {
  const commonTests = (expectedSectors) => {
    it('should set the sectors', () => {
      expect(this.actual).to.deep.equal(expectedSectors)
    })
  }

  context('when all information is populated with a D&B dunns number', () => {
    beforeEach(() => {
      this.actual = transformCompanyToSectorView({
        sector: {
          name: 'Renewable Energy',
        },
        archived: false,
        duns_number: 888,
        id: 123,
      })
    })

    commonTests({
      name: [ 'Renewable Energy' ],
      url: '/companies/123/business-details/sector',
    })
  })

  context('when all information is populated without a D&B dunns number', () => {
    beforeEach(() => {
      this.actual = transformCompanyToSectorView({
        sector: {
          name: 'Renewable Energy',
        },
        archived: false,
        id: 123,
      })
    })

    commonTests({
      name: [ 'Renewable Energy' ],
      url: '/companies/123/edit',
    })
  })

  context('when no information is populated', () => {
    beforeEach(() => {
      this.actual = transformCompanyToSectorView({
      })
    })

    commonTests({
      name: [ 'Not set' ],
      url: null,
    })
  })
})
