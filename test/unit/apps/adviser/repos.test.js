const nock = require('nock')
const adviserData = require('~/test/unit/data/advisers/advisers.json')
const badAdviserData = require('~/test/unit/data/advisers/advisers-with-bad-data.json')
const config = require('~/config')
const repos = require('~/src/apps/adviser/repos')

describe('Adviser repository', () => {
  describe('getAdvisers', () => {
    context('when an adviser without a name is encountered', () => {
      beforeEach(() => {
        nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, badAdviserData)
      })

      it('will be filtered out', async () => {
        const actual = await repos.getAdvisers(123)
        expect(actual.length).to.equal(4)
      })
    })

    context('when all advisers have names', () => {
      beforeEach(() => {
        nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, adviserData)
      })
      it('will not filter out any advisers', async () => {
        const actual = await repos.getAdvisers(123)
        expect(actual.length).to.equal(5)
      })
    })

    context('when advisers contains disabled advisers', () => {
      beforeEach(() => {
        this.advisers = [{
          id: '1',
          first_name: 'Fred',
          last_name: 'Flintstone',
          disabled_on: '2017-01-01',
        }, {
          id: '2',
          first_name: 'Wilma',
          last_name: 'Flintstone',
          disabled_on: '2017-01-01',
        }, {
          id: '3',
          first_name: 'Barney',
          last_name: 'Rubble',
          disabled_on: null,
        }]

        nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, { results: this.advisers })
      })

      context('and when the caller wishes to only see active users', () => {
        context('and when the caller does not specify an adviser that must be returned', () => {
          beforeEach(async () => {
            this.advisersResult = await repos.getAdvisers('1234', false)
          })

          it('should return just the active adviser', () => {
            expect(this.advisersResult).to.deep.equal([{
              id: '3',
              first_name: 'Barney',
              last_name: 'Rubble',
              disabled_on: null,
            }])
          })
        })

        context('and when the caller specified an adviser that must be returned', () => {
          beforeEach(async () => {
            this.advisersResult = await repos.getAdvisers('1234', false, '2')
          })

          it('should return just the active adviser', () => {
            expect(this.advisersResult).to.deep.equal([{
              id: '2',
              first_name: 'Wilma',
              last_name: 'Flintstone',
              disabled_on: '2017-01-01',
            }, {
              id: '3',
              first_name: 'Barney',
              last_name: 'Rubble',
              disabled_on: null,
            }])
          })
        })
      })

      context('and when the caller wishes to see all advisers', () => {
        beforeEach(async () => {
          this.advisersResult = await repos.getAdvisers('1234')
        })

        it('should return just the active adviser', () => {
          expect(this.advisersResult).to.deep.equal(this.advisers)
        })
      })
    })
  })
})
