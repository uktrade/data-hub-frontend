const setLocalNavigation = require('../local-navigation')

describe('Investment projects local navigation', () => {
  beforeEach(() => {
    this.req = {}

    this.res = {
      locals: {
        CURRENT_PATH: '',
        investment: {},
        user: {
          permissions: ['investment.view_investmentproject_document'],
        },
      },
    }

    this.next = sinon.stub()
  })

  context("when a project code starts with 'DHP' it is a new project", () => {
    beforeEach(() => {
      this.res.locals.investment.project_code = 'DHP-00000001'
      setLocalNavigation(this.req, this.res, this.next)
    })

    it('should filter out the documents nav item', () => {
      const documentsNavItem = this.res.locals.localNavItems.find(
        (item) => item.path === 'documents'
      )
      expect(documentsNavItem).to.be.undefined
    })
  })

  context(
    "when a project code starts with 'P' it is an old project (CDMS)",
    () => {
      beforeEach(() => {
        this.res.locals.investment.project_code = 'P-30016857'
        setLocalNavigation(this.req, this.res, this.next)
      })

      it('should keep the documents nav item', () => {
        const documentsNavItem = this.res.locals.localNavItems.find(
          (item) => item.path === 'documents'
        )
        expect(documentsNavItem).to.be.ok
      })
    }
  )

  context(
    'when a project code starts with a number it is a very old project (pre-dates CDMS)',
    () => {
      beforeEach(() => {
        this.res.locals.investment.project_code = '016020'
        setLocalNavigation(this.req, this.res, this.next)
      })

      it('should keep the documents nav item', () => {
        const documentsNavItem = this.res.locals.localNavItems.find(
          (item) => item.path === 'documents'
        )
        expect(documentsNavItem).to.be.ok
      })
    }
  )
})
