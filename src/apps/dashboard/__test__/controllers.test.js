var rpErrors = require('request-promise/errors')
const { mockCompanyListsServer } = require('./repos.test')

const withPopulatedCompanyLists = () =>
  mockCompanyListsServer({
    companyIdString: 'abcdef',
    listIds: {
      x: 'abc',
      y: 'def',
    },
  })

const canSeeCompanyListsRequest = {
  locals: {
    user: {
      permissions: ['company_list.view_companylistitem'],
    },
    features: {
      companies_add_remove_from_lists: true,
    },
  },
}

const expectedCompanyLists = [
  {
    id: 'x',
    name: 'Company List X',
    companies: [
      {
        company: {
          id: 'a',
          name: 'Company A',
        },
        latestInteraction: {},
      },
      {
        company: {
          id: 'b',
          name: 'Company B',
        },
        latestInteraction: {},
      },
      {
        company: {
          id: 'c',
          name: 'Company C',
        },
        latestInteraction: {},
      },
    ],
  },
  {
    id: 'y',
    name: 'Company List Y',
    companies: [
      {
        company: {
          id: 'd',
          name: 'Company D',
        },
        latestInteraction: {},
      },
      {
        company: {
          id: 'e',
          name: 'Company E',
        },
        latestInteraction: {},
      },
      {
        company: {
          id: 'f',
          name: 'Company F',
        },
        latestInteraction: {},
      },
    ],
  },
]

describe('dashboard controller', () => {
  beforeEach(() => {
    this.reqMock = Object.assign({}, globalReq, {
      session: {
        token: 'abcd',
      },
    })

    this.resMock = {
      ...canSeeCompanyListsRequest,
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

      withPopulatedCompanyLists()
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

    it('should render the company lists', () => {
      expect(this.resMock.render.firstCall.args[1].companyLists)
        .to.deep.equal(expectedCompanyLists)
    })
  })

  context('when there is a problem calling the API', () => {
    beforeEach(async () => {
      this.error = { status: 500 }
      this.fetchHomepageDataStub.rejects(this.error)

      withPopulatedCompanyLists()
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
        ...canSeeCompanyListsRequest,
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      this.fetchHomepageDataStub.resolves(this.dashData)
      this.rpStub.rejects()

      withPopulatedCompanyLists()
      await this.controllers.renderDashboard(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
    })

    it('should return an empty array', () => {
      const expected = {
        companyLists: expectedCompanyLists,
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
        ...canSeeCompanyListsRequest,
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      this.fetchHomepageDataStub.resolves(this.dashData)
      this.rpStub.throws(rpErrors.StatusCodeError(500))

      withPopulatedCompanyLists()
      await this.controllers.renderDashboard(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
    })

    it('should return an empty array', () => {
      const expected = {
        companyLists: expectedCompanyLists,
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
