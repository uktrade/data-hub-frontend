const transformCompanyToBusinessHierarchyView = require('~/src/apps/companies/transformers/company-to-business-hierarchy-view')

describe('#transformCompanyToBusinessHierarchyView', () => {
  const commonTests = (expectedHeadquarterType, expectedSubsidiaries) => {
    it('should set the headquarter type', () => {
      expect(this.actual['Headquarter type']).to.deep.equal(expectedHeadquarterType)
    })

    it('should set the subsidiaries link', () => {
      expect(this.actual.Subsidiaries).to.deep.equal(expectedSubsidiaries)
    })
  }

  context('when the company is a global ultimate', () => {
    context('when there is 1 subsidiary', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: {
            name: 'ghq',
          },
          global_headquarters: null,
        }, 1)
      })

      commonTests('Global HQ', {
        url: `/companies/1/subsidiaries`,
        name: '1 subsidiary',
      })
    })

    context('when there is multiple subsidiaries', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: {
            name: 'ghq',
          },
          global_headquarters: null,
        }, 2)
      })

      commonTests('Global HQ', {
        url: `/companies/1/subsidiaries`,
        name: '2 subsidiaries',
      })
    })

    context('when there is no subsidiaries', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: {
            name: 'ghq',
          },
          global_headquarters: null,
        }, 0)
      })

      commonTests('Global HQ', 'None')
    })
  })

  context('when the company is a subsidiary', () => {
    beforeEach(() => {
      this.actual = transformCompanyToBusinessHierarchyView({
        id: '2',
        headquarter_type: null,
        global_headquarters: {
          id: '1',
          name: 'parent',
        },
      }, 0)
    })

    commonTests({
      url: `/companies/1`,
      name: 'Global HQ - parent',
    }, 'None')
  })
})
