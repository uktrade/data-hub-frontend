const adviserData = require('~/test/unit/data/advisers/advisers.json')
const badAdviserData = require('~/test/unit/data/advisers/advisers-with-bad-data.json')
const config = require('~/config')
const repos = require('~/src/apps/adviser/repos')

describe('Adviser repository', () => {
  describe('getAdvisers', () => {
    context('when an adviser without a name is encountered', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
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
    })

    context('when all advisers have names', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/adviser/?limit=100000&offset=0`)
          .reply(200, adviserData)
        this.advisers = await repos.getAdvisers(123)
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
        is_active: false,
        last_login: null,
        first_name: 'Bert',
        last_name: 'Smith',
        email: 'bert.smith@mockexample.com',
        contact_email: '',
        telephone_number: '',
        dit_team: {
          id: 't1',
          name: 'Team E',
          role: 'r1',
          uk_region: null,
          country: 'c1',
        },
      }

      this.albertAsmee = {
        id: '2',
        name: 'Albert Asmee',
        is_active: false,
        last_login: null,
        first_name: 'Albert',
        last_name: 'Asmee',
        email: 'albert.asmee@mockexample.com',
        contact_email: '',
        telephone_number: '',
        dit_team: {
          id: 't1',
          name: 'Team E',
          role: 'r1',
          uk_region: null,
          country: 'c1',
        },
      }
    })

    context('when searching for a single name', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get('/adviser/?first_name__icontains=be')
          .reply(200, {
            results: [this.bertSmith, this.albertAsmee],
          })

        this.advisers = await repos.adviserSearch('1234', 'be')
      })

      it('should return the result that starts with be', () => {
        expect(this.advisers).to.deep.equal([this.bertSmith])
      })
    })

    context('when searching for a full name', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get('/adviser/?first_name__icontains=be&last_name__icontains=sm')
          .reply(200, {
            results: [this.bertSmith, this.albertAsmee],
          })

        this.advisers = await repos.adviserSearch('1234', 'be sm')
      })

      it('should return the result that starts with be and sm', () => {
        expect(this.advisers).to.deep.equal([this.bertSmith])
      })
    })
  })
})
