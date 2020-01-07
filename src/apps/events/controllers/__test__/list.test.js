const proxyquire = require('proxyquire')

const config = require('../../../../config')
const advisersData = require('../../../../../test/unit/data/advisers/advisers.json')

const standardMacros = [{ macroName: 'useful' }, { macroName: 'exciting' }]

describe('Event list controller', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.reqMock = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    this.resMock = {
      render: sinon.spy(),
      query: {},
      locals: {
        advisers: advisersData,
      },
    }
    this.eventFiltersFieldsStub = sinon.stub()
    this.controller = proxyquire('../list', {
      '../macros': {
        eventFiltersFields: this.eventFiltersFieldsStub,
      },
    })

    const advisers = [
      {
        id: '1',
        name: 'Fred Flintstone',
        disabled_on: '2017-01-01',
      },
      {
        id: '2',
        name: 'Wilma Flintstone',
        disabled_on: '2017-01-01',
      },
      {
        id: '3',
        name: 'Barney Rubble',
        disabled_on: null,
      },
    ]

    nock(config.apiRoot)
      .get(`/adviser/?limit=100000&offset=0`)
      .reply(200, { results: advisers })
  })

  describe('#renderEventList', () => {
    beforeEach(async () => {
      this.eventFiltersFieldsStub.returns(standardMacros)
      await this.controller.renderEventList(
        this.reqMock,
        this.resMock,
        this.nextSpy
      )
    })

    it('should render collection page as expected', () => {
      expect(this.resMock.render).to.have.been.calledWith(
        '_layouts/collection',
        sinon.match.hasOwn('title')
      )
      expect(this.resMock.render).to.have.been.calledWith(
        '_layouts/collection',
        sinon.match.hasOwn('sortForm')
      )
      expect(this.resMock.render).to.have.been.calledWith(
        '_layouts/collection',
        sinon.match.hasOwn('filtersFields')
      )
      expect(this.resMock.render).to.have.been.calledWith(
        '_layouts/collection',
        sinon.match.hasOwn('selectedFilters')
      )
      expect(this.resMock.render).to.have.been.calledWith(
        '_layouts/collection',
        sinon.match.hasOwn('actionButtons')
      )
    })
  })
})
