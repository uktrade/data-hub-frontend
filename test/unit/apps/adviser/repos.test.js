const nock = require('nock')
const config = require('~/config')
const repos = require('~/src/apps/adviser/repos')

describe('Adviser repository', () => {
  describe('getAdvisers', () => {
    context('when an adviser without a name is encountered', () => {
      beforeEach(() => {
        this.advisers = [{
          id: '1',
          first_name: 'Fred',
          last_name: null,
          disabled_on: null,
        }, {
          id: '2',
          first_name: null,
          last_name: 'Flintstone',
          disabled_on: null,
        }, {
          id: '3',
          first_name: null,
          last_name: null,
          disabled_on: null,
        }]

        nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, { results: this.advisers })
      })

      it('will be filtered out', async () => {
        const actualAdvisers = await repos.getAdvisers({ token: '1234' })
        const expectedAdvisers = [this.advisers[0], this.advisers[1]]
        expect(actualAdvisers).to.deep.equal(expectedAdvisers)
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
            this.advisersResult = await repos.getAdvisers({ token: '1234', includeDisabled: false })
          })

          it('should return just the active adviser', () => {
            const expectedActiveAdvisers = [this.advisers[2]]
            expect(this.advisersResult).to.deep.equal(expectedActiveAdvisers)
          })
        })

        context('and when the caller specified an adviser that must be returned', () => {
          beforeEach(async () => {
            this.advisersResult = await repos.getAdvisers({ token: '1234', includeDisabled: false, currentAdviser: '2' })
          })

          it('should return just the active adviser', () => {
            const expectedActiveAdvisers = [this.advisers[1], this.advisers[2]]
            expect(this.advisersResult).to.deep.equal(expectedActiveAdvisers)
          })
        })
      })

      context('and when the caller wishes to see all advisers', () => {
        beforeEach(async () => {
          this.advisersResult = await repos.getAdvisers({ token: '1234' })
        })

        it('should return just the active adviser', () => {
          expect(this.advisersResult).to.deep.equal(this.advisers)
        })
      })
    })
  })
})
