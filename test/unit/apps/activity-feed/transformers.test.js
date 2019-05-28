const activityFeedRawFixture = require('../../data/activity-feed/activity-feed-from-es')
const activityFeedTransformedFixture = require('../../data/activity-feed/activity-feed-transformed')
const { transformActivityFeedSearchResults } = require('../../../../src/apps/activity-feed/transformers')

describe('transformActivityFeedSearchResults', () => {
  it('should transform ES results', () => {
    const transformed = transformActivityFeedSearchResults(activityFeedRawFixture.hits)
    expect(transformed).to.deep.equal(activityFeedTransformedFixture)
  })
})
