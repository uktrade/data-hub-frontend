const adviserData = require('../../../../test/unit/data/advisers/advisers.json')
const badAdviserData = require('../../../../test/unit/data/advisers/advisers-with-bad-data.json')
const config = require('../../../config')
const repos = require('../repos')

describe('Adviser repository', () => {
  describe('getAdvisers', () => {
    context('when an adviser without a name is encountered', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, badAdviserData)
        this.advisers = await repos.getAdvisers({ session: { token: 123 } })
      })

      it('will be filtered out', async () => {
        const expected = {
          count: 4,
          results: [
            badAdviserData.results[1],
            badAdviserData.results[2],
            badAdviserData.results[3],
            badAdviserData.results[4],
          ],
        }

        expect(this.advisers).to.deep.equal(expected)
      })
    })

    context('when all advisers have names', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, adviserData)
        this.advisers = await repos.getAdvisers({ session: { token: 123 } })
      })

      it('will not filter out any advisers', () => {
        expect(this.advisers).to.deep.equal(adviserData)
      })
    })
  })

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
