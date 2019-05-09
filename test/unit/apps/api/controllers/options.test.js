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
      json: sinon.spy(),
    }

    this.nextSpy = sinon.spy()

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
            autocomplete: 'isle',
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

  context('given the list of options depends on another selection', () => {
    beforeEach(async () => {
      const reqMock = {
        query: {
          chained_param: 'chainedParam',
          chained_value: 'chainedValue',
          api_version: 'v4',
          is_active: true,
          autocomplete: 'France',
        },
        session: {
          token: '1234',
        },
        params: {
          entity: 'company',
        },
      }

      this.getOptions = sinon.stub().resolves({})

      const controller = proxyquire('~/src/apps/api/controllers/options', {
        '../../../lib/options': {
          getOptions: this.getOptions,
        },
      })

      await controller.getOptionsHandler(reqMock, this.resMock, this.nextSpy)
    })

    it('should define and pass chained params to getOptions', () => {
      expect(this.getOptions).to.be.calledWith('1234', 'company', {
        apiVersion: 'v4',
        chainedUrlParam: 'chainedParam',
        chainedValue: 'chainedValue',
        includeDisabled: true,
        is_active: true,
        term: 'France',
      })
    })
  })
})
