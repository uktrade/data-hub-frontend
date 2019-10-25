const transformCompanyToBusinessHierarchyView = require('~/src/apps/companies/transformers/company-to-business-hierarchy-view')

describe('#transformCompanyToBusinessHierarchyView', () => {
  context('when the company is populated from D&B data', () => {
    context('when the company is a global ultimate with subsidiaries', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: {
            name: 'ghq',
          },
          global_headquarters: null,
          duns_number: '123',
        }, 2)
      })

      it('should set the headquarter type', () => {
        expect(this.actual['Headquarter type']).to.deep.equal('Global HQ')
      })

      it('should set the subsidiaries link', () => {
        expect(this.actual.Subsidiaries).to.deep.equal({
          url: `/companies/1/subsidiaries`,
          name: '2 subsidiaries',
        })
      })

      it('should not set the Global HQ', () => {
        expect(this.actual['Global HQ']).to.not.exist
      })
    })

    context('when the company is a global ultimate without subsidiaries', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: {
            name: 'ghq',
          },
          global_headquarters: null,
          duns_number: '123',
        }, 0)
      })

      it('should set the headquarter type', () => {
        expect(this.actual['Headquarter type']).to.deep.equal('Global HQ')
      })

      it('should set the subsidiaries to "None", with a "Link a subsidiary action"', () => {
        expect(this.actual.Subsidiaries).to.deep.equal({
          actions: [
            {
              label: 'Link a subsidiary',
              url: '/companies/1/subsidiaries/link',
            },
          ],
          name: 'None',
        })
      })

      it('should not set the Global HQ', () => {
        expect(this.actual['Global HQ']).to.not.exist
      })
    })

    context('when the company is a subsidiary', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: null,
          global_headquarters: {
            id: '2',
            name: 'Parent Ltd',
          },
          duns_number: '123',
        }, 0)
      })

      it('should not set the headquarter type', () => {
        expect(this.actual['Headquarter type']).to.not.exist
      })

      it('should not set the subsidiaries link', () => {
        expect(this.actual.Subsidiaries).to.not.exist
      })

      it('should set the Global HQ with a "Remove link" action', () => {
        expect(this.actual['Global HQ']).to.deep.equal({
          actions: [
            {
              label: 'Remove link',
              url: '/companies/1/hierarchies/ghq/remove',
            },
          ],
          name: 'Parent Ltd',
          url: '/companies/2',
        })
      })
    })

    context('when the company is not a GHQ and not linked to a GHQ', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: null,
          global_headquarters: null,
          duns_number: '123',
        }, 0)
      })

      it('should not set the headquarter type', () => {
        expect(this.actual['Headquarter type']).to.not.exist
      })

      it('should not set the subsidiaries link', () => {
        expect(this.actual.Subsidiaries).to.not.exist
      })

      it('should set the Global HQ with a "Link to the Global HQ" action', () => {
        expect(this.actual['Global HQ']).to.deep.equal({
          actions: [
            {
              label: 'Link to the Global HQ',
              url: `/companies/1/hierarchies/ghq/search`,
            },
          ],
          name: 'None',
        })
      })
    })
  })

  context('when the company is populated from Data Hub data', () => {
    context('when the company is a GHQ with subsidiaries', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: {
            name: 'ghq',
          },
          global_headquarters: null,
        }, 2)
      })

      it('should set the headquarter type', () => {
        expect(this.actual['Headquarter type']).to.deep.equal('Global HQ')
      })

      it('should set the subsidiaries link', () => {
        expect(this.actual.Subsidiaries).to.deep.equal({
          url: `/companies/1/subsidiaries`,
          name: '2 subsidiaries',
        })
      })

      it('should not set the Global HQ', () => {
        expect(this.actual['Global HQ']).to.not.exist
      })
    })

    context('when the company is a GHQ without subsidiaries', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: {
            name: 'ghq',
          },
          global_headquarters: null,
        }, 0)
      })

      it('should set the headquarter type', () => {
        expect(this.actual['Headquarter type']).to.deep.equal('Global HQ')
      })

      it('should set the subsidiaries to "None", with a "Link a subsidiary action"', () => {
        expect(this.actual.Subsidiaries).to.deep.equal({
          actions: [
            {
              label: 'Link a subsidiary',
              url: '/companies/1/subsidiaries/link',
            },
          ],
          name: 'None',
        })
      })

      it('should not set the Global HQ', () => {
        expect(this.actual['Global HQ']).to.not.exist
      })
    })

    context('when the company is a subsidiary', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: null,
          global_headquarters: {
            id: '2',
            name: 'Parent Ltd',
          },
        }, 0)
      })

      it('should not set the headquarter type', () => {
        expect(this.actual['Headquarter type']).to.not.exist
      })

      it('should not set the subsidiaries link', () => {
        expect(this.actual.Subsidiaries).to.not.exist
      })

      it('should set the Global HQ with a "Remove link" action', () => {
        expect(this.actual['Global HQ']).to.deep.equal({
          actions: [
            {
              label: 'Remove link',
              url: '/companies/1/hierarchies/ghq/remove',
            },
          ],
          name: 'Parent Ltd',
          url: '/companies/2',
        })
      })
    })

    context('when the company is not a GHQ and not linked to a GHQ', () => {
      beforeEach(() => {
        this.actual = transformCompanyToBusinessHierarchyView({
          id: '1',
          headquarter_type: null,
          global_headquarters: null,
        }, 0)
      })

      it('should not set the headquarter type', () => {
        expect(this.actual['Headquarter type']).to.not.exist
      })

      it('should not set the subsidiaries link', () => {
        expect(this.actual.Subsidiaries).to.not.exist
      })

      it('should set the Global HQ with a "Link to the Global HQ" action', () => {
        expect(this.actual['Global HQ']).to.deep.equal({
          actions: [
            {
              label: 'Link to the Global HQ',
              url: `/companies/1/hierarchies/ghq/search`,
            },
          ],
          name: 'None',
        })
      })
    })
  })
})
