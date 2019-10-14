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
        user: {},
        features: {},
      },
      render: sinon.spy(),
      title: sinon.stub().returnsThis(),
    }

    this.nextSpy = sinon.spy()

    this.fetchHomepageDataStub = sinon.stub()
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

    this.controllers = proxyquire('~/src/apps/dashboard/controllers', {
      './repos': {
        fetchHomepageData: this.fetchHomepageDataStub,
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
      this.rpStub.resolves()
      await this.controllers.renderDashboard(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
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
    // TODO: Before each is useless here as we only have one test case.
    beforeEach(async () => {
      this.resMock = {
        locals: {
          user: {
            permissions: [],
          },
          features: {},
        },
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      this.fetchHomepageDataStub.resolves(this.dashData)
      this.rpStub.rejects()
      await this.controllers.renderDashboard(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
    })

    it('should return an empty array', () => {
      const expected = {
        companyLists: undefined,
        contacts: [{ id: '1234' }],
        interactions: [{ id: '4321' }],
        articleFeed: [],
        interactionsPermitted: false,
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
    // TODO: Before each is useless here as we only have one test case.
    beforeEach(async () => {
      this.resMock = {
        locals: {
          user: {
            permissions: [],
          },
          features: {},
        },
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      this.fetchHomepageDataStub.resolves(this.dashData)
      this.rpStub.throws(rpErrors.StatusCodeError(500))
      await this.controllers.renderDashboard(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
    })

    it('should return an empty array', () => {
      const expected = {
        companyLists: undefined,
        contacts: [{ id: '1234' }],
        interactions: [{ id: '4321' }],
        articleFeed: [],
        interactionsPermitted: false,
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
