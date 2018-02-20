const { assign } = require('lodash')

const config = require('~/config')
const { getOptionsHandler } = require('~/src/apps/api/controllers/options')

describe('options API controller', () => {
  beforeEach(() => {
    this.reqMock = {
      query: {},
      session: {
        token: '1234',
      },
      params: {
        entity: 'uk-region',
      },
    }

    this.resMock = {
      json: sandbox.spy(),
    }

    this.nextSpy = sandbox.spy()

    const regions = [{
      id: '1',
      name: 'Alderney',
      disabled_on: '2013-03-25T14:25:00Z',
    }, {
      id: '2',
      name: 'East Midlands',
      disabled_on: null,
    }, {
      id: '3',
      name: 'Isle of Man',
      disabled_on: null,
    }]

    nock(config.apiRoot)
      .get('/metadata/uk-region/')
      .reply(200, regions)
  })

  context('given the user asks for a list of options', () => {
    context('and given the user does not send a term', () => {
      beforeEach(async () => {
        const reqMock = assign({}, this.reqMock, {
          params: {
            entity: 'uk-region',
          },
        })

        await getOptionsHandler(reqMock, this.resMock, this.nextSpy)
      })

      it('should return all the options', () => {
        expect(this.resMock.json).to.be.calledWith([{
          value: '1',
          label: 'Alderney',
        }, {
          value: '2',
          label: 'East Midlands',
        }, {
          value: '3',
          label: 'Isle of Man',
        }])
      })
    })

    context('and given the user asks for a term', () => {
      beforeEach(async () => {
        const reqMock = assign({}, this.reqMock, {
          params: {
            entity: 'uk-region',
          },
          query: {
            term: 'isle',
          },
        })

        await getOptionsHandler(reqMock, this.resMock, this.nextSpy)
      })

      it('should return filtered options', () => {
        expect(this.resMock.json).to.be.calledWith([{
          value: '3',
          label: 'Isle of Man',
        }])
      })
    })
  })
})
