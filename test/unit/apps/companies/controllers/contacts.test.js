const { assign } = require('lodash')

const companyMock = require('~/test/unit/data/companies/company.json')

describe('Company contact list controller', () => {
  beforeEach(() => {
    this.resMock = assign({}, globalRes, {
      locals: {
        company: companyMock,
      },
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      query: {},
    })
    this.reqMock = assign({}, globalReq, {
      session: {
        token: 'abcd',
      },
    })
    this.buildSelectedFiltersSummaryStub = sinon.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/contacts', {
      '../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
      '../../contacts/macros': {
        contactFiltersFields: [
          { macroName: 'foo', name: 'name' },
          { macroName: 'bar', name: 'archived' },
          { macroName: 'fizz', name: 'buzz' },
        ],
      },
    })
  })

  describe('#renderContacts', () => {
    beforeEach(() => {
      this.controller.renderContacts(this.reqMock, this.resMock)
    })

    it('should render collection page with locals', () => {
      expect(this.resMock.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('sortForm'))
      expect(this.resMock.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('filtersFields'))
      expect(this.resMock.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('selectedFilters'))
      expect(this.resMock.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('actionButtons'))
      expect(this.buildSelectedFiltersSummaryStub).to.have.been.calledWith([
        { macroName: 'foo', name: 'name' },
        { macroName: 'bar', name: 'archived' },
      ], this.reqMock.query)
    })

    it('should set the correct number of breadcrumbs', () => {
      expect(this.resMock.breadcrumb).to.have.been.calledTwice
    })

    it('should render the correct template', () => {
      expect(this.resMock.render.args[0][0]).to.equal('companies/views/contacts')
    })

    it('should set the correct add button', () => {
      const props = this.resMock.render.args[0][1]

      expect(props.actionButtons).to.deep.equal([{
        label: 'Add contact',
        url: `/contacts/create?company=${companyMock.id}`,
      }])
    })
  })
})
