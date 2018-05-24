const setCompaniesLocalNav = require('~/src/apps/companies/middleware/local-navigation')

describe('Companies local navigation', () => {
  beforeEach(() => {
    this.req = {}

    this.res = {
      locals: {
        user: {
          permissions: ['company.read_company_timeline'],
        },
      },
    }

    this.next = sinon.stub()
  })

  context('when company is not a headquarters', () => {
    beforeEach(() => {
      this.res.locals.company = {
        id: '1234',
        headquarter_type: null,
        company_number: null,
      }

      setCompaniesLocalNav(this.req, this.res, this.next)
    })

    it('should not have a subsidiaries menu option', () => {
      const menuItem = this.res.locals.localNavItems.find(item => item.path === 'subsidiaries')
      expect(menuItem).to.be.undefined
    })
  })

  context('when company is a European headquarters', () => {
    beforeEach(() => {
      this.res.locals.company = {
        id: '1234',
        headquarter_type: {
          id: '2222',
          name: 'ehq',
        },
        company_number: null,
      }

      setCompaniesLocalNav(this.req, this.res, this.next)
    })

    it('should not have a subsidiaries menu option', () => {
      const menuItem = this.res.locals.localNavItems.find(item => item.path === 'subsidiaries')
      expect(menuItem).to.be.undefined
    })
  })

  context('when company is a global headquarters', () => {
    beforeEach(() => {
      this.res.locals.company = {
        id: '1234',
        headquarter_type: {
          id: '2222',
          name: 'ghq',
        },
        company_number: null,
      }

      setCompaniesLocalNav(this.req, this.res, this.next)
    })

    it('should have a subsidiaries menu option', () => {
      const menuItem = this.res.locals.localNavItems.find(item => item.path === 'subsidiaries')
      expect(menuItem).to.be.ok
    })
  })
})
