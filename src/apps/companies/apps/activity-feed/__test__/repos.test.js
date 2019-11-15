const proxyquire = require('proxyquire')

const { ACTIVITY_TYPE_FILTER_KEYS, ACTIVITY_TYPE_FILTER_OBJECT } = require('../../../constants')

const { config, getMockData } = helpers

const activityFeedRawFixture = getMockData('/activity-feed/activity-feed-from-es')

const token = 'abcd'

describe('Activity feed repos', () => {
  beforeEach(() => {
    this.authorisedRequestStub = sinon.stub().resolves(activityFeedRawFixture)
    this.repos = proxyquire('../repos', {
      '../../../../lib/authorised-request': { authorisedRequest: this.authorisedRequestStub },
    })
  })

  describe('#fetchActivityFeed', () => {
    context('when called with companyId', () => {
      beforeEach(async () => {
        this.results = await this.repos.fetchActivityFeed(
          { token,
            from: 1,
            size: 21,
            filter: {
              terms: {
                [ACTIVITY_TYPE_FILTER_OBJECT.TYPE]: ACTIVITY_TYPE_FILTER_KEYS.dataHubActivity.value,
              },
            },
            companyId: '123',
          })
      })

      it('should make a request with company ID in the request body', () => {
        const expectedBody = {
          from: 1,
          query: {
            bool: {
              filter: [
                { term: { [ACTIVITY_TYPE_FILTER_OBJECT.ATTRIBUTED_TO_ID]: 'dit:DataHubCompany:123' } },
                { terms: { [ACTIVITY_TYPE_FILTER_OBJECT.TYPE]: ACTIVITY_TYPE_FILTER_KEYS.dataHubActivity.value } },
              ],
            },
          },
          size: 21,
          sort: { 'object.startTime': 'desc' },
        }
        expect(this.authorisedRequestStub).to.be.calledOnceWith(token, {
          body: expectedBody,
          url: `${config.apiRoot}/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(this.results).to.be.equal(activityFeedRawFixture)
      })
    })

    context('when called without companyId', () => {
      beforeEach(async () => {
        this.results = await this.repos.fetchActivityFeed(
          { token,
            from: 0,
            size: 20,
            filter: {
              terms: {
                [ACTIVITY_TYPE_FILTER_OBJECT.TYPE]: ACTIVITY_TYPE_FILTER_KEYS.dataHubActivity.value,
              },
            },
          })
      })

      it('should make a request without company ID in the request body', () => {
        const expectedBody = {
          from: 0,
          size: 20,
          sort: { 'object.startTime': 'desc' },
          query: {
            bool: {
              filter: [
                { term: { [ACTIVITY_TYPE_FILTER_OBJECT.ATTRIBUTED_TO_ID]: 'dit:DataHubCompany:undefined' } },
                { terms: { [ACTIVITY_TYPE_FILTER_OBJECT.TYPE]: ACTIVITY_TYPE_FILTER_KEYS.dataHubActivity.value } },
              ],
            },
          },
        }
        expect(this.authorisedRequestStub).to.be.calledOnceWith(token, {
          body: expectedBody,
          url: `${config.apiRoot}/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(this.results).to.be.equal(activityFeedRawFixture)
      })
    })

    context('when multiple filter items are applied', () => {
      beforeEach(async () => {
        this.results = await this.repos.fetchActivityFeed(
          { token,
            from: 0,
            size: 20,
            filter: [
              { terms: {
                [ACTIVITY_TYPE_FILTER_OBJECT.TYPE]: ACTIVITY_TYPE_FILTER_KEYS.dataHubActivity.value,
              } },
              { term: { [ACTIVITY_TYPE_FILTER_OBJECT.ATTRIBUTED_TO_ID]: 'dit:randomPrefix:stuff' } },
            ],
          })
      })

      it('should make a request with multiple filters in the request body', () => {
        const expectedBody = {
          from: 0,
          size: 20,
          sort: { 'object.startTime': 'desc' },
          query: {
            bool: {
              filter: [
                { term: { [ACTIVITY_TYPE_FILTER_OBJECT.ATTRIBUTED_TO_ID]: 'dit:DataHubCompany:undefined' } },
                { terms: { [ACTIVITY_TYPE_FILTER_OBJECT.TYPE]: ACTIVITY_TYPE_FILTER_KEYS.dataHubActivity.value } },
                { term: { 'object.attributedTo.id': 'dit:randomPrefix:stuff' } },
              ],
            },
          },
        }
        expect(this.authorisedRequestStub).to.be.calledOnceWith(token, {
          body: expectedBody,
          url: `${config.apiRoot}/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(this.results).to.be.equal(activityFeedRawFixture)
      })
    })
  })
})
