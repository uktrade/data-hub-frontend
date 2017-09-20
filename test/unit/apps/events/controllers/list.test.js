describe('Event list controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.req = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    this.res = {
      render: this.sandbox.spy(),
      query: {},
    }

    this.buildSelectedFiltersSummaryStub = this.sandbox.spy()

    this.controller = proxyquire('~/src/apps/events/controllers/list', {
      '../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
      '../macros': {
        eventFiltersFields: [
          { macroName: 'useful' },
          { macroName: 'exciting' },
        ],
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderEventList', () => {
    it('should render collection page with expected locals', () => {
      this.controller.renderEventList(this.req, this.res, this.next)
      expect(this.res.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('title'))
      expect(this.res.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('sortForm'))
      expect(this.res.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('filtersFields'))
      expect(this.res.render).to.have.been.calledWith('events/views/list', sinon.match.hasOwn('selectedFilters'))
      expect(this.buildSelectedFiltersSummaryStub).to.have.been.calledWith([
        { macroName: 'useful' },
        { macroName: 'exciting' },
      ], this.req.query)
    })
  })

  describe('Conditional field', () => {
    beforeEach(() => {
      this.controller = proxyquire('~/src/apps/events/controllers/list', {
        '../macros': {
          eventFiltersFields: [
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
          ],
        },
      })
    })

    it('should render collection without region if non-UK country is selected', () => {
      this.req.query = { address_country: 'non-uk' }
      this.controller.renderEventList(this.req, this.res, this.next)

      expect(this.res.render).to.have.been.calledWith(
        'events/views/list',
        sinon.match.hasOwn(
          'filtersFields',
          sinon.match(fields => fields.length === 1 && fields[0].name === 'address_country' && fields[0].value === 'non-uk')
        )
      )
    })

    it('should render collection with region if UK is selected', () => {
      this.req.query = { address_country: 'uk' }
      this.controller.renderEventList(this.req, this.res, this.next)

      expect(this.res.render).to.have.been.calledOnce
      expect(this.res.render).to.have.been.calledWith(
        'events/views/list',
        sinon.match.hasOwn(
          'filtersFields',
          sinon.match(fields => fields.length === 2 && fields[1].name === 'uk_region')
        )
      )
    })
  })
})
