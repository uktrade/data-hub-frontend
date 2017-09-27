const companyMock = require('~/test/unit/data/companies/company.json')
const contactsMock = require('~/test/unit/data/contacts/contacts.json')

describe('Company contacts controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.nextSpy = this.sandbox.spy()
    this.breadcrumbStub = this.sandbox.stub().returnsThis()
    this.renderSpy = this.sandbox.spy()
    this.transformContactToListItemSpy = this.sandbox.spy()

    this.controller = require('~/src/apps/companies/controllers/contacts')

    this.companyMock = require('~/test/unit/data/companies/company.json')

    this.reqMock = {}
    this.resMock = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderSpy,
      locals: {
        company: this.companyMock,
      },
    }
  })

  afterEach(() => {
    this.sandbox.restore()
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

      it('should set the correct tab', () => {
        expect(this.renderSpy.args[0][1]).to.have.property('tab')
        expect(this.renderSpy.args[0][1].tab).to.equal('contacts')
      })

      it('should set the correct add url', () => {
        expect(this.renderSpy.args[0][1]).to.have.property('addContactUrl')
        expect(this.renderSpy.args[0][1].addContactUrl).to.equal(`/contacts/create?company=${companyMock.id}`)
      })
    })

    context('when a company has no contacts', () => {
      beforeEach(() => {
        this.controller.renderContacts(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should send empty contacts arrays to view', () => {
        expect(this.renderSpy.args[0][1]).to.have.property('activeContacts')
        expect(this.renderSpy.args[0][1]).to.have.property('archivedContacts')

        expect(this.renderSpy.args[0][1].activeContacts).to.be.an('array').to.have.length(0)
        expect(this.renderSpy.args[0][1].archivedContacts).to.be.an('array').to.have.length(0)
      })
    })

    context('when a company has active contacts', () => {
      beforeEach(() => {
        this.companyMock.contacts = contactsMock
        this.controller.renderContacts(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should send the correct active contacts to view', () => {
        expect(this.renderSpy.args[0][1]).to.have.property('activeContacts')
        expect(this.renderSpy.args[0][1].activeContacts).to.be.an('array').to.have.length(2)
      })
    })

    context('when a company has archived contacts', () => {
      beforeEach(() => {
        this.companyMock.contacts = contactsMock
        this.controller.renderContacts(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should send the correct archived contacts to view', () => {
        expect(this.renderSpy.args[0][1]).to.have.property('archivedContacts')
        expect(this.renderSpy.args[0][1].archivedContacts).to.be.an('array').to.have.length(1)
      })
    })
  })
})
