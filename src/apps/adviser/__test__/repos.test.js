const config = require('../../../config')
const repos = require('../repos')

describe('Adviser repository', () => {
  describe('adviserSearch', () => {
    beforeEach(() => {
      this.bertSmith = {
        id: '1',
        name: 'Bert Smith',
      }
    })

    context('when searching for a term', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get('/adviser/?autocomplete=be&is_active=true')
          .reply(200, {
            results: [this.bertSmith],
          })

        this.advisers = await repos.fetchAdviserSearchResults(
          { session: { token: '1234' } },
          {
            term: 'be',
            is_active: true,
          }
        )
      })

      it('should return the results', () => {
        expect(this.advisers).to.deep.equal([this.bertSmith])
      })
    })
  })
})
