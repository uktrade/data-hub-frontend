const setCompaniesLocalNav = require('~/src/apps/companies/middleware/local-navigation')

describe('Companies local navigation', () => {
  beforeEach(() => {
    this.req = {}

    this.res = {
      locals: {
        user: {
          permissions: ['company.view_company_timeline'],
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
      this.res.locals.features = {}

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
      this.res.locals.features = {}

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
      this.res.locals.features = {}

      setCompaniesLocalNav(this.req, this.res, this.next)
    })

    it('should have a subsidiaries menu option', () => {
      const menuItem = this.res.locals.localNavItems.find(item => item.path === 'subsidiaries')
      expect(menuItem).to.be.ok
    })
  })

  context('when company has a company number', () => {
    beforeEach(() => {
      this.res.locals.company = {
        id: '1234',
        headquarter_type: {
          id: '2222',
          name: 'Global HQ',
        },
        company_number: '1234',
      }
      this.res.locals.features = {}

      setCompaniesLocalNav(this.req, this.res, this.next)
    })

    it('should have a timeline option', () => {
      const menuItem = this.res.locals.localNavItems.find(item => item.path === 'timeline')
      expect(menuItem).to.be.ok
    })
  })

  context('when company does not have a company number', () => {
    beforeEach(() => {
      this.res.locals.company = {
        id: '1234',
        headquarter_type: {
          id: '2222',
          name: 'Global HQ',
        },
        company_number: null,
      }
      this.res.locals.features = {}

      setCompaniesLocalNav(this.req, this.res, this.next)
    })

    it('should not have a timeline option', () => {
      const menuItem = this.res.locals.localNavItems.find(item => item.path === 'timeline')
      expect(menuItem).to.be.undefined
    })
  })

  context('when the company advisers feature is not enabled', () => {
    beforeEach(() => {
      this.res.locals.company = {}
      this.res.locals.features = {}

      setCompaniesLocalNav(this.req, this.res, this.next)
    })

    it('should not have an advisers option', () => {
      const menuItem = this.res.locals.localNavItems.find(item => item.path === 'advisers')
      expect(menuItem).to.be.undefined
    })
  })

  context('when the company advisers feature is enabled', () => {
    beforeEach(() => {
      this.res.locals.company = {}
      this.res.locals.features = { 'companies-advisers': true }

      setCompaniesLocalNav(this.req, this.res, this.next)
    })

    it('should have an advisers option', () => {
      const menuItem = this.res.locals.localNavItems.find(item => item.path === 'advisers')
      expect(menuItem).to.be.ok
    })
  })
})
