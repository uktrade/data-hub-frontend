const proxyquire = require('proxyquire')

var rpErrors = require('request-promise/errors')
// TODO: write a functional test for the dashboard
describe('dashboard controller', () => {
  beforeEach(() => {
    global.reqMock = Object.assign({}, globalReq, {
      session: {
        token: 'abcd',
      },
    })

    global.resMock = {
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

    global.controllers = proxyquire('../controllers', {
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

      await global.controllers.renderDashboard(
        global.reqMock,
        global.resMock,
        global.nextSpy
      )
    })

    it('should render the dashboard template', () => {
      expect(global.resMock.render).to.be.calledWith(
        'dashboard/views/dashboard'
      )
      expect(global.formatHelpCentreAnnouncementsStub).to.be.called
    })

    it('should not call next', () => {
      expect(global.nextSpy).to.not.have.been.called
    })

    it('should set a page title', () => {
      expect(global.resMock.title).to.be.calledWith('Dashboard')
    })
  })

  context('when the Help centre API fails to return data', () => {
    // TODO: Before each is useless here as we only have one test case.
    beforeEach(async () => {
      global.resMock = {
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      global.rpStub.rejects()

      await global.controllers.renderDashboard(
        global.reqMock,
        global.resMock,
        global.nextSpy
      )
    })

    it('should return an empty array', () => {
      const expected = {
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
        render: sinon.spy(),
        title: sinon.stub().returnsThis(),
      }
      global.rpStub.throws(rpErrors.StatusCodeError(500))

      await global.controllers.renderDashboard(
        global.reqMock,
        global.resMock,
        global.nextSpy
      )
    })

    it('should return an empty array', () => {
      const expected = {
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
})
