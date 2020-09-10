const config = require('../../../../../config')
const activityFeedRawFixture = require('../../../../../../test/unit/data/activity-feed/activity-feed-from-es.json')
const { ES_KEYS_GROUPED } = require('../constants')

describe('Activity feed repos', () => {
  const stubRequest = { session: { token: 'abcd' } }

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
      const { dataHubActivity } = ES_KEYS_GROUPED
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
              filter: {
                bool: {
                  must: [
                    {
                      terms: {
                        'object.type': dataHubActivity,
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
            },
          },
        }

        results = await repos.fetchActivityFeed(stubRequest, body)
      })

      it('should make a request including the filters', () => {
        expect(authorisedRequestStub).to.be.calledOnceWith(stubRequest, {
          body,
          url: `${config.apiRoot}/v4/activity-feed`,
        })
      })

      it('should return results', async () => {
        expect(results).to.be.equal(activityFeedRawFixture)
      })
    })
  })
})
