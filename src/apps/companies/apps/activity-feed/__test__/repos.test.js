const activityFeedRawFixture = require('../../../../../../test/unit/data/activity-feed/activity-feed-from-es.json')
const { DATA_HUB_ACTIVITY } = require('../constants')

describe('Activity feed repos', () => {
  const BASE_URL = 'https://example.com'
  const stubRequest = {
    session: { token: 'abcd' },
    res: { locals: { BASE_URL } },
  }

  describe('#fetchActivityFeed', () => {
    const authorisedRequestStub = sinon.stub().resolves(activityFeedRawFixture)
    const repos = proxyquire(
      '../../src/apps/companies/apps/activity-feed/repos',
      {
        '../../../../lib/authorised-request': {
          authorisedRequest: authorisedRequestStub,
        },
      }
    )

    context('when called with filters', () => {
      let body, results

      before(async () => {
        body = {
          from: 0,
          size: 20,
          sort: [
            {
              'object.startTime': {
                order: 'desc',
              },
            },
          ],
          query: {
            bool: {
              must: [
                {
                  terms: {
                    'object.type': DATA_HUB_ACTIVITY,
                  },
                },
                {
                  term: {
                    'object.attributedTo.id': 'dit:DataHubCompany:123',
                  },
                },
              ],
            },
          },
        }

        results = await repos.fetchActivityFeed(stubRequest, body)
      })

      it('should make a request including the filters', () => {
        expect(authorisedRequestStub).to.be.calledOnceWith(stubRequest, {
          body,
          url: `${BASE_URL}/api-proxy/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(results).to.be.equal(activityFeedRawFixture)
      })
    })
  })
})
