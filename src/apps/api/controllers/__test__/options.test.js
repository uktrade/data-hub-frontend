const { assign } = require('lodash')
const proxyquire = require('proxyquire')

const config = require('../../../../config')
const { getOptionsHandler } = require('../options')

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

    const regions = [
      {
        id: '1',
        name: 'Alderney',
        disabled_on: '2013-03-25T14:25:00Z',
      },
      {
        id: '2',
        name: 'East Midlands',
        disabled_on: null,
      },
      {
        id: '3',
        name: 'Isle of Man',
        disabled_on: null,
      },
    ]

    nock(config.apiRoot).get('/v4/metadata/uk-region').reply(200, regions)
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
        expect(this.resMock.json).to.be.calledWith([
          {
            value: '1',
            label: 'Alderney',
          },
          {
            value: '2',
            label: 'East Midlands',
          },
          {
            value: '3',
            label: 'Isle of Man',
          },
        ])
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
        expect(this.resMock.json).to.be.calledWith([
          {
            value: '3',
            label: 'Isle of Man',
          },
        ])
      })
    })
  })

  context('given that defined target is search_autocomplete', () => {
    const reqMock = {
      query: {
        target: 'search_autocomplete',
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

    beforeEach(async () => {
      this.searchAutocomplete = sinon.stub().resolves({})

      const controller = proxyquire('../options', {
        '../../../modules/search/services': {
          searchAutocomplete: this.searchAutocomplete,
        },
      })

      await controller.getOptionsHandler(reqMock, this.resMock, this.nextSpy)
    })

    it('should define and pass chained params to getOptions', () => {
      expect(this.searchAutocomplete).to.be.calledWith({
        searchEntity: 'company',
        searchTerm: 'France',
        req: reqMock,
      })
    })
  })

  context(
    'given target is search_autocomplete and list of options depends on another selection',
    () => {
      const reqMock = {
        query: {
          chained_param: 'chainedParam',
          chained_value: 'chainedValue',
          target: 'search_autocomplete',
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

      beforeEach(async () => {
        this.searchAutocomplete = sinon.stub().resolves({})

        const controller = proxyquire('../options', {
          '../../../modules/search/services': {
            searchAutocomplete: this.searchAutocomplete,
          },
        })

        await controller.getOptionsHandler(reqMock, this.resMock, this.nextSpy)
      })

      it('should define and pass chained params to getOptions', () => {
        expect(this.searchAutocomplete).to.be.calledWith({
          searchEntity: 'company',
          searchTerm: 'France&chainedParam=chainedValue',
          req: reqMock,
        })
      })
    }
  )
})
