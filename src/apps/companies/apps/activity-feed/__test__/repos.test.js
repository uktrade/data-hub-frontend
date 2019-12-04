const config = require('~/src/config')
const activityFeedRawFixture = require('~/test/unit/data/activity-feed/activity-feed-from-es')
const { ES_KEYS_GROUPED } = require('../constants')

describe('Activity feed repos', () => {
  describe('#fetchActivityFeed', () => {
    const authorisedRequestStub = sinon.stub().resolves(activityFeedRawFixture)
    const repos = proxyquire('../../src/apps/companies/apps/activity-feed/repos', {
      '../../../../lib/authorised-request': { authorisedRequest: authorisedRequestStub },
    })

    context('when called with filters', () => {
      const { dataHubActivity } = ES_KEYS_GROUPED
      let body, results
      const token = 'abcd'

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

        results = await repos.fetchActivityFeed({
          token,
          body,
        })
      })

      it('should make a request including the filters', () => {
        expect(authorisedRequestStub).to.be.calledOnceWith(
          token,
          {
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
