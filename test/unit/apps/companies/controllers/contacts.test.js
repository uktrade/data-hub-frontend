const companyMock = require('~/test/unit/data/companies/company.json')

describe('Company contacts controller', () => {
  beforeEach(() => {
    this.breadcrumbStub = sandbox.stub().returnsThis()
    this.renderSpy = sandbox.spy()
    this.transformContactToListItemSpy = sandbox.spy()

    this.controller = require('~/src/apps/companies/controllers/contacts')

    this.companyMock = require('~/test/unit/data/companies/company.json')

    this.reqMock = {
      query: {},
    }
    this.resMock = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderSpy,
      locals: {
        company: this.companyMock,
      },
    }
  })

  describe('renderContacts()', () => {
    describe('all scenarios', () => {
      beforeEach(() => {
        this.controller.renderContacts(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set the correct number of breadcrumbs', () => {
        expect(this.breadcrumbStub).to.have.been.calledTwice
      })

      it('should render the correct template', () => {
        expect(this.renderSpy.args[0][0]).to.equal('companies/views/contacts')
      })

      it('should set the correct add url', () => {
        expect(this.renderSpy.args[0][1]).to.have.property('addContactUrl')
        expect(this.renderSpy.args[0][1].addContactUrl).to.equal(`/contacts/create?company=${companyMock.id}`)
      })
    })
  })
})
