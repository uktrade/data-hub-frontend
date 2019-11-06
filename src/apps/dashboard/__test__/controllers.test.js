const nock = require('nock')
const config = require('../../../config')

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
      permissions: ['company_list.view_companylist'],
    },
  },
}

const cannotSeeCompanyListsRequest = {
  locals: {
    user: {
      permissions: [],
    },
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

    global.formatHelpCentreAnnouncementsStub = sinon.stub()
    global.rpStub = sinon.stub()
    global.helpCentre = {
      url: 'www',
      announcementsURL: 'www',
      token: '1',
    }

    global.controllers = proxyquire('~/src/apps/dashboard/controllers', {
      '../../config': {
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

  context('when there is a problem fetching company lists from the API', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/v4/company-list')
        .reply(500)

      await global.controllers.renderDashboard(
        global.reqMock,
        global.resMock,
        global.nextSpy
      )
    })

    it('should show an error', () => {
      expect(global.nextSpy).to.have.been.called
      expect(global.nextSpy.firstCall.args[0]).to.be.instanceof(rpErrors.StatusCodeError)
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
