const config = require('../../../config')
const draftPastMeeting = require('../../../../test/unit/data/interactions/draft-past-meeting.json')

const {
  archiveInteraction,
} = require('../repos')

describe('Interaction repository', () => {
  describe('#archiveInteraction', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/interaction/${draftPastMeeting.id}/archive`, { reason: 'reason' })
        .reply(200, { id: draftPastMeeting.id })

      this.interaction = await archiveInteraction('token', draftPastMeeting.id, 'reason')
    })

    it('should return an investment requirements object', () => {
      expect(this.interaction).to.deep.equal({ id: draftPastMeeting.id })
    })
  })
})
