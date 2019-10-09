var rpErrors = require('request-promise/errors')

describe('dashboard controller', () => {
  beforeEach(() => {
    this.reqMock = Object.assign({}, globalReq, {
      session: {
        token: 'abcd',
      },
    })

    this.resMock = {
      locals: {
        user: {
          permissions: ['company_list.view_companylistitem'],
        },
      },
      render: sinon.spy(),
      title: sinon.stub().returnsThis(),
    }

    this.nextSpy = sinon.spy()

    this.fetchHomepageDataStub = sinon.stub()
    this.fetchCompanyListStub = sinon.stub()
    this.formatHelpCentreAnnouncementsStub = sinon.stub()
    this.rpStub = sinon.stub()
    this.helpCentre = {
      url: 'www',
      announcementsURL: 'www',
      token: '1',
    }

    this.dashData = {
      contacts: [
        {
          id: '1234',
        },
      ],
      interactions: [
        {
          id: '4321',
        },
      ],
    }

    this.companyData = {
      results: [
        {
          company: {
            name: 'Company name',
            id: '39cad2d5-0fd2-427d-860a-47b120b0109e',
            isArchived: false,
          },
          latestInteraction: {
            id: '4db036cd-7444-46bb-9b51-67425e8ec189',
            date: '2019-08-06',
            displayDate: '06 Aug 19',
            subject: 'a subject',
          },
        },
      ],
    }

    this.controllers = proxyquire('~/src/apps/dashboard/controllers', {
      './repos': {
        fetchHomepageData: this.fetchHomepageDataStub,
        fetchCompanyList: this.fetchCompanyListStub,
      },
      '../../../config': {
        helpCentre: this.helpCentre,
      },
      './transformers': {
        formatHelpCentreAnnouncements: this.formatHelpCentreAnnouncementsStub,
      },
      'request-promise': this.rpStub,
    })
  })
  context('when there are no errors calling the API', () => {
    beforeEach(async () => {
      this.fetchHomepageDataStub.resolves(this.dashData)
      this.fetchCompanyListStub.resolves(this.companyData)
      this.rpStub.resolves([])
      await this.controllers.renderDashboard(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
    })

    it('should render the dashboard template', () => {
      expect(this.resMock.render).to.be.calledWith('dashboard/views/dashboard')
      expect(this.formatHelpCentreAnnouncementsStub).to.be.called
    })

    it('should render the page with contacts', () => {
      const renderOptions = this.resMock.render.firstCall.args[1]
      expect(renderOptions.contacts).to.deep.equal(this.dashData.contacts)
    })

    it('should render the page with interactions', () => {
      const renderOptions = this.resMock.render.firstCall.args[1]
      expect(renderOptions.interactions).to.deep.equal(
        this.dashData.interactions
      )
    })

    it('should not call next', () => {
      expect(this.nextSpy).to.not.have.been.called
    })

    it('should set a page title', () => {
      expect(this.resMock.title).to.be.calledWith('Dashboard')
    })
  })

  context('when the user has no permissions to view my-companies', () => {
    beforeEach(async () => {
      this.resMock = {
        locals: {
          user: {
            permissions: [],
          },
        },
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }

      this.fetchHomepageDataStub.resolves(this.dashData)
      this.fetchCompanyListStub.resolves(this.companyData)
      this.rpStub.resolves()
      await this.controllers.renderDashboard(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
    })
    it('canViewCompanyList should be false', () => {
      const expected = {
        companyList: null,
        contacts: [{ id: '1234' }],
        interactions: [{ id: '4321' }],
        articleFeed: [],
        interactionsPermitted: false,
        canViewCompanyList: false,
        helpCentre: {
          announcementsURL: 'www',
          token: '1',
          url: 'www',
        },
      }
      expect(this.resMock.render.firstCall.args[1]).to.deep.equal(expected)
    })
  })

  context('when there is a problem calling the API', () => {
    beforeEach(async () => {
      this.error = { status: 500 }
      this.fetchHomepageDataStub.rejects(this.error)
      await this.controllers.renderDashboard(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
    })

    it('should show an error', () => {
      expect(this.nextSpy).to.have.been.calledWith(this.error)
    })

    it('should not render the page', () => {
      expect(this.resMock.render).to.not.have.been.called
    })
  })

  context('when the Help centre API fails to return data', () => {
    beforeEach(async () => {
      this.resMock = {
        locals: {
          user: {
            permissions: [],
          },
        },
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      this.fetchHomepageDataStub.resolves(this.dashData)
      this.fetchCompanyListStub.resolves(this.companyData)
      this.rpStub.rejects()
      await this.controllers.renderDashboard(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
    })

    it('should return an empty array', () => {
      const expected = {
        companyList: null,
        contacts: [{ id: '1234' }],
        interactions: [{ id: '4321' }],
        articleFeed: [],
        interactionsPermitted: false,
        canViewCompanyList: false,
        helpCentre: {
          announcementsURL: 'www',
          token: '1',
          url: 'www',
        },
      }
      expect(this.resMock.render.firstCall.args[1]).to.deep.equal(expected)
    })
  })

  context('when the Help centre API request throws an error', () => {
    beforeEach(async () => {
      this.resMock = {
        locals: {
          user: {
            permissions: [],
          },
        },
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      this.fetchHomepageDataStub.resolves(this.dashData)
      this.fetchCompanyListStub.resolves(this.companyData)
      this.rpStub.throws(rpErrors.StatusCodeError(500))
      await this.controllers.renderDashboard(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
    })

    it('should return an empty array', () => {
      const expected = {
        companyList: null,
        contacts: [{ id: '1234' }],
        interactions: [{ id: '4321' }],
        articleFeed: [],
        interactionsPermitted: false,
        canViewCompanyList: false,
        helpCentre: {
          announcementsURL: 'www',
          token: '1',
          url: 'www',
        },
      }
      expect(this.resMock.render.firstCall.args[1]).to.deep.equal(expected)
    })
  })
})
