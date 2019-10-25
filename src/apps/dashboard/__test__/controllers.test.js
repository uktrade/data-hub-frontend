var rpErrors = require('request-promise/errors')
const { mockCompanyListsServer } = require('./utils')

const withPopulatedCompanyLists = () =>
  mockCompanyListsServer({
    companyIdString: 'abcdef',
    listIds: {
      x: 'abc',
      y: 'def',
    },
  })

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

const cannotSeeCompanyListsRequest = {
  locals: {
    user: {
      permissions: [],
    },
    features: {
      companies_add_remove_from_lists: true,
    },
  },
}

const companyListsFeatureOffRequest = {
  locals: {
    user: {
      permissions: ['company_list.view_companylistitem'],
    },
    features: {},
  },
}

describe('dashboard controller', () => {
  beforeEach(() => {
    global.reqMock = Object.assign({}, globalReq, {
      session: {
        token: 'abcd',
      },
    })

    global.resMock = {
      ...canSeeCompanyListsRequest,
      render: sinon.spy(),
      title: sinon.stub().returnsThis(),
    }

    global.nextSpy = sinon.spy()

    global.fetchHomepageDataStub = sinon.stub()
    global.formatHelpCentreAnnouncementsStub = sinon.stub()
    global.rpStub = sinon.stub()
    global.helpCentre = {
      url: 'www',
      announcementsURL: 'www',
      token: '1',
    }

    global.dashData = {
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

    global.controllers = proxyquire('~/src/apps/dashboard/controllers', {
      './repos': {
        fetchHomepageData: global.fetchHomepageDataStub,
      },
      '../../../config': {
        helpCentre: global.helpCentre,
      },
      './transformers': {
        formatHelpCentreAnnouncements: global.formatHelpCentreAnnouncementsStub,
      },
      'request-promise': global.rpStub,
    })
  })
  context('when there are no errors calling the API', () => {
    beforeEach(async () => {
      global.fetchHomepageDataStub.resolves(global.dashData)
      global.rpStub.resolves([])

      withPopulatedCompanyLists()
      await global.controllers.renderDashboard(
        global.reqMock,
        global.resMock,
        global.nextSpy
      )
    })

    it('should render the dashboard template', () => {
      expect(global.resMock.render).to.be.calledWith('dashboard/views/dashboard')
      expect(global.formatHelpCentreAnnouncementsStub).to.be.called
    })

    it('should render the page with contacts', () => {
      const renderOptions = global.resMock.render.firstCall.args[1]
      expect(renderOptions.contacts).to.deep.equal(global.dashData.contacts)
    })

    it('should render the page with interactions', () => {
      const renderOptions = global.resMock.render.firstCall.args[1]
      expect(renderOptions.interactions).to.deep.equal(
        global.dashData.interactions
      )
    })

    it('should not call next', () => {
      expect(global.nextSpy).to.not.have.been.called
    })

    it('should set a page title', () => {
      expect(global.resMock.title).to.be.calledWith('Dashboard')
    })

    it('should render the company lists', () => {
      expect(global.resMock.render.firstCall.args[1].companyLists)
        .to.deep.equal(expectedCompanyLists)
    })
  })

  context('when there is a problem calling the API', () => {
    beforeEach(async () => {
      global.error = { status: 500 }
      global.fetchHomepageDataStub.rejects(global.error)

      withPopulatedCompanyLists()
      await global.controllers.renderDashboard(
        global.reqMock,
        global.resMock,
        global.nextSpy
      )
    })

    it('should show an error', () => {
      expect(global.nextSpy).to.have.been.calledWith(global.error)
    })

    it('should not render the page', () => {
      expect(global.resMock.render).to.not.have.been.called
    })
  })

  context('when the Help centre API fails to return data', () => {
    // TODO: Before each is useless here as we only have one test case.
    beforeEach(async () => {
      global.resMock = {
        ...canSeeCompanyListsRequest,
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      global.fetchHomepageDataStub.resolves(global.dashData)
      global.rpStub.rejects()

      withPopulatedCompanyLists()
      await global.controllers.renderDashboard(
        global.reqMock,
        global.resMock,
        global.nextSpy
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
      expect(global.resMock.render.firstCall.args[1]).to.deep.equal(expected)
    })
  })

  context('when the Help centre API request throws an error', () => {
    // TODO: Before each is useless here as we only have one test case.
    beforeEach(async () => {
      global.resMock = {
        ...canSeeCompanyListsRequest,
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      global.fetchHomepageDataStub.resolves(global.dashData)
      global.rpStub.throws(rpErrors.StatusCodeError(500))

      withPopulatedCompanyLists()
      await global.controllers.renderDashboard(
        global.reqMock,
        global.resMock,
        global.nextSpy
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
      expect(global.resMock.render.firstCall.args[1]).to.deep.equal(expected)
    })
  })

  context('when the company list feature is off', () => {
    beforeEach(async () => {
      global.resMock = {
        ...companyListsFeatureOffRequest,
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      global.fetchHomepageDataStub.resolves(global.dashData)

      withPopulatedCompanyLists()
      await global.controllers.renderDashboard(
        global.reqMock,
        global.resMock,
        global.nextSpy
      )
    })

    it('it should not be rendered', () => {
      expect(global.resMock.render.firstCall.args[1].companyLists)
        .to.not.be.ok
    })
  })

  context("when the user doesn't have the right permission", () => {
    beforeEach(async () => {
      global.resMock = {
        ...cannotSeeCompanyListsRequest,
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      global.fetchHomepageDataStub.resolves(global.dashData)

      withPopulatedCompanyLists()
      await global.controllers.renderDashboard(
        global.reqMock,
        global.resMock,
        global.nextSpy
      )
    })

    it('company lists should not be rendered', () => {
      expect(global.resMock.render.firstCall.args[1].companyLists)
        .to.not.be.ok
    })
  })
})
