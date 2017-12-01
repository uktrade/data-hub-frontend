const nock = require('nock')
const adviserData = require('~/test/unit/data/advisers/advisers.json')
const badAdviserData = require('~/test/unit/data/advisers/advisers-with-bad-data.json')
const config = require('~/config')
const repos = require('~/src/apps/adviser/repos')

describe('Adviser repository', () => {
  describe('getAdvisers', () => {
    context('when an adviser without a name is encountered', () => {
      beforeEach(async () => {
        this.nockScope = nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, badAdviserData)
        this.advisers = await repos.getAdvisers(123)
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

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })

    context('when all advisers have names', () => {
      beforeEach(async () => {
        this.nockScope = nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, adviserData)
        this.advisers = await repos.getAdvisers(123)
      })

      it('will not filter out any advisers', () => {
        expect(this.advisers).to.deep.equal(adviserData)
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })
  })
})
