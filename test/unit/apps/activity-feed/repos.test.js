const config = require('../../../../config')
const activityFeedRawFixture = require('../../data/activity-feed/activity-feed-from-es')
const token = 'abcd'

describe('Activity feed repos', () => {
  beforeEach(() => {
    this.authorisedRequestStub = sinon.stub().resolves(activityFeedRawFixture)
    this.repos = proxyquire('../../src/apps/activity-feed/repos', {
      '../../lib/authorised-request': { authorisedRequest: this.authorisedRequestStub },
    })
  })

  describe('#fetchActivityFeed', () => {
    context('when called with companyId', () => {
      beforeEach(async () => {
        this.results = await this.repos.fetchActivityFeed({ token, from: 1, size: 21, companyId: '123' })
      })

      it('should make a request without company ID in the request body', () => {
        const expectedBody = {
          from: 1,
          query: {
            bool: { filter: { term: { 'object.attributedTo.id': 'dit:DataHubCompany:123' } } },
          },
          size: 21,
          sort: { published: 'desc' },
        }
        expect(this.authorisedRequestStub).to.be.calledOnceWith(token, {
          body: expectedBody,
          url: `${config.apiRoot}/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(this.results).to.be.equal(activityFeedRawFixture.hits)
      })
    })

    context('when called without companyId', () => {
      beforeEach(async () => {
        this.results = await this.repos.fetchActivityFeed({ token, from: 0, size: 20 })
      })

      it('should make a request without company ID in the request body', () => {
        const expectedBody = {
          from: 0,
          size: 20,
          sort: { published: 'desc' },
        }
        expect(this.authorisedRequestStub).to.be.calledOnceWith(token, {
          body: expectedBody,
          url: `${config.apiRoot}/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(this.results).to.be.equal(activityFeedRawFixture.hits)
      })
    })

    context('when called without any params', () => {
      beforeEach(async () => {
        this.results = await this.repos.fetchActivityFeed({})
      })

      it('should make a request with default params', async () => {
        const expectedBody = {
          from: 0,
          size: 20,
          sort: { published: 'desc' },
        }
        expect(this.authorisedRequestStub).to.be.calledOnceWith(undefined, {
          body: expectedBody,
          url: `${config.apiRoot}/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(this.results).to.be.equal(activityFeedRawFixture.hits)
      })
    })
  })
})
