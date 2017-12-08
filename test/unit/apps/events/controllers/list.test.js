const config = require('~/config')
const advisersData = require('../../../data/advisers/advisers')

const standardMacros = [
  { macroName: 'useful' },
  { macroName: 'exciting' },
]
const countryAndUkRegionMacros = [
  {
    macroName: 'MultipleChoiceField',
    name: 'address_country',
    options: [
      { value: 'non-uk', label: 'Albania' },
      { value: 'uk', label: 'United Kingdom' },
    ],
  },
  {
    macroName: 'MultipleChoiceField',
    name: 'uk_region',
    options: [
      { value: '1', label: 'England' },
      { value: '2', label: 'Scotland' },
    ],
  },
]

describe('Event list controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextSpy = this.sandbox.spy()
    this.reqMock = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    this.resMock = {
      render: this.sandbox.spy(),
      query: {},
      locals: {
        advisers: advisersData,
      },
    }
    this.eventFiltersFieldsStub = this.sandbox.stub()
    this.controller = proxyquire('~/src/apps/events/controllers/list', {
      '../macros': {
        eventFiltersFields: this.eventFiltersFieldsStub,
      },
    })

    const advisers = [{
      id: '1',
      name: 'Fred Flintstone',
      disabled_on: '2017-01-01',
    }, {
      id: '2',
      name: 'Wilma Flintstone',
      disabled_on: '2017-01-01',
    }, {
      id: '3',
      name: 'Barney Rubble',
      disabled_on: null,
    }]

    this.nockScope = nock(config.apiRoot)
      .get(`/adviser/?limit=100000&offset=0`)
      .reply(200, { results: advisers })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderEventList', () => {
    beforeEach(async () => {
      this.eventFiltersFieldsStub.returns(standardMacros)
      await this.controller.renderEventList(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should render collection page as expected', () => {
      expect(this.resMock.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('title'))
      expect(this.resMock.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('sortForm'))
      expect(this.resMock.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('filtersFields'))
      expect(this.resMock.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('selectedFilters'))
    })

    it('nock mocked scope has been called', () => {
      expect(this.nockScope.isDone()).to.be.true
    })
  })

  describe('Uk region conditional field', () => {
    beforeEach(() => {
      this.eventFiltersFieldsStub.returns(countryAndUkRegionMacros)
    })

    it('should render collection without region if non-UK country is selected', async () => {
      this.reqMock.query = { address_country: 'non-uk' }
      await this.controller.renderEventList(this.reqMock, this.resMock, this.nextSpy)

      expect(this.resMock.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('title'))
      expect(this.resMock.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('sortForm'))
      expect(this.resMock.render).to.have.been.calledWith(
        'events/views/list',
        sinon.match.hasOwn(
          'filtersFields',
          sinon.match(fields => fields.length === 1 && fields[0].name === 'address_country')
        )
      )
      expect(this.resMock.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('selectedFilters'))
    })

    it('should render collection with region if UK is selected', async () => {
      this.reqMock.query = { address_country: 'uk' }
      await this.controller.renderEventList(this.reqMock, this.resMock, this.nextSpy)

      expect(this.resMock.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('title'))
      expect(this.resMock.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('sortForm'))
      expect(this.resMock.render).to.have.been.calledWith(
        'events/views/list',
        sinon.match.hasOwn(
          'filtersFields',
          sinon.match(fields => fields.length === 2 && fields[1].name === 'uk_region')
        )
      )
      expect(this.resMock.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('selectedFilters'))
    })

    it('nock mocked scope has been called', async () => {
      await this.controller.renderEventList(this.reqMock, this.resMock, this.nextSpy)
      expect(this.nockScope.isDone()).to.be.true
    })
  })
})
