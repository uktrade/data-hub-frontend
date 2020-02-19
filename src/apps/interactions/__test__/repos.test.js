const config = require('../../../config')
const draftPastMeeting = require('../../../../test/unit/data/interactions/draft-past-meeting.json')

const { archiveInteraction } = require('../repos')

describe('Interaction repository', () => {
  describe('#archiveInteraction', () => {
    it('should return an investment requirements object', async () => {
      nock(config.apiRoot)
        .post(`/v3/interaction/${draftPastMeeting.id}/archive`, {
          reason: 'reason',
        })
        .reply(200, { id: draftPastMeeting.id })

      const interaction = await archiveInteraction(
        'token',
        draftPastMeeting.id,
        'reason'
      )

      expect(interaction).to.deep.equal({ id: draftPastMeeting.id })
    })
  })
})
