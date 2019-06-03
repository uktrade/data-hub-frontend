const activityFeedRawFixture = require('../../data/activity-feed/activity-feed-from-es')
const token = 'abcd'

describe('Activity feed controllers', () => {
  beforeEach(() => {
    this.fetchActivityFeedStub = sinon.stub().resolves(activityFeedRawFixture.hits)
    this.transformActivityFeedSearchResultsStub = sinon.stub().resolves()

    this.controllers = proxyquire('../../src/apps/activity-feed/controllers', {
      './repos': { fetchActivityFeed: this.fetchActivityFeedStub },
      './transformers': { transformActivityFeedSearchResults: this.transformActivityFeedSearchResultsStub },
    })

    this.resMock = {
      json: sinon.spy(),
    }

    this.nextSpy = sinon.spy()
  })

  describe('#getActivityFeedHandler', () => {
    context('when called without query params', () => {
      beforeEach(async () => {
        const reqMock = {
          query: {},
          session: {
            token: token,
          },
        }
        await this.controllers.getActivityFeedHandler(reqMock, this.resMock, this.nextSpy)
      })

      it('should call fetchActivityFeed with default params', async () => {
        const expectedParams = { companyId: undefined, from: 0, token: token }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.transformActivityFeedSearchResultsStub).to.be.calledOnce
        expect(this.resMock.json).to.be.calledOnce
      })
    })

    context('when called with company_id in the query', () => {
      beforeEach(async () => {
        const reqMock = {
          query: {
            company_id: 'com-123',
          },
          session: {
            token: token,
          },
        }
        await this.controllers.getActivityFeedHandler(reqMock, this.resMock, this.nextSpy)
      })

      it('should call fetchActivityFeed with companyId', async () => {
        const expectedParams = { companyId: 'com-123', from: 0, token: token }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.transformActivityFeedSearchResultsStub).to.be.calledOnce
        expect(this.resMock.json).to.be.calledOnce
      })
    })

    context('when the endpoint returns error', () => {
      beforeEach(async () => {
        this.error = {
          statusCode: 404,
        }
        this.fetchActivityFeedStub.rejects(this.error)

        const reqMock = {
          query: {},
          session: {
            token: token,
          },
        }
        await this.controllers.getActivityFeedHandler(reqMock, this.resMock, this.nextSpy)
      })

      it('should call next with an error', async () => {
        const expectedParams = { companyId: undefined, from: 0, token: token }

        expect(this.fetchActivityFeedStub).to.be.calledWith(expectedParams)
        expect(this.transformActivityFeedSearchResultsStub).to.not.have.been.called
        expect(this.resMock.json).to.not.have.been.called
        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })
})
