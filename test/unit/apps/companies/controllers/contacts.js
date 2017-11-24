const { assign } = require('lodash')

describe('Company contact list controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.resMock = assign({}, globalRes, {
      locals: {
        company: {
          id: '1234334',
          name: 'mock company',
        },
      },
      breadcrumb: function () { return this },
      render: this.sandbox.spy(),
      query: {},
    })
    this.reqMock = assign({}, globalReq, {
      session: {
        token: 'abcd',
      },
    })
    this.buildSelectedFiltersSummaryStub = this.sandbox.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/contacts', {
      '../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
      '../../contacts/macros': {
        contactFiltersFields: [
          { macroName: 'useful' },
          { macroName: 'exciting' },
        ],
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderContacts', () => {
    it('should render collection page with locals', () => {
      this.controller.renderContacts(this.reqMock, this.resMock, this.next)
      expect(this.resMock.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('sortForm'))
      expect(this.resMock.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('filtersFields'))
      expect(this.resMock.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('selectedFilters'))
      expect(this.resMock.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('addContactUrl'))
      expect(this.buildSelectedFiltersSummaryStub).to.have.been.calledWith([
        { macroName: 'useful' },
        { macroName: 'exciting' },
      ], this.reqMock.query)
    })
  })

  describe('Conditional field', () => {
    beforeEach(() => {
      this.controller = proxyquire('~/src/apps/companies/controllers/contacts', {
        '../../contacts/macros': {
          contactFiltersFields: [
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
              name: 'company_uk_region',
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
      this.reqMock.query = { address_country: 'non-uk' }
      this.controller.renderContacts(this.reqMock, this.resMock, this.next)

      expect(this.resMock.render).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.hasOwn(
          'filtersFields',
          sinon.match(fields => fields.length === 1 && fields[0].name === 'address_country' && fields[0].value === 'non-uk')
        )
      )
    })

    it('should render collection with region if UK is selected', () => {
      this.reqMock.query = { address_country: 'uk' }
      this.controller.renderContacts(this.reqMock, this.resMock, this.next)

      expect(this.resMock.render).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.hasOwn(
          'filtersFields',
          sinon.match(fields => fields.length === 2 && fields[1].name === 'company_uk_region')
        )
      )
    })
  })
})
