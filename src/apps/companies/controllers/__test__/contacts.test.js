const proxyquire = require('proxyquire')

const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../test/unit/data/companies/company-v4.json')

describe('Company contact list controller', () => {
  beforeEach(() => {
    this.buildSelectedFiltersSummaryStub = sinon.spy()

    this.controller = proxyquire('../contacts', {
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
    const commonTests = (expectedCompanyId, expectedTemplate) => {
      it('should render the correct template', () => {
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(
          expectedTemplate
        )
      })
    }

    context('when the company does not have a DUNS number', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        this.controller.renderContacts(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock
        )
      })

      commonTests(companyMock.id, 'companies/views/contacts')
    })

    context('when the company is archived', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived: true,
          },
        })

        this.controller.renderContacts(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock
        )
      })

      commonTests(companyMock.id, 'companies/views/contacts')

      it('should not set actions buttons', () => {
        const props = this.middlewareParameters.resMock.render.args[0][1]

        expect(props.actionButtons).to.be.undefined
      })
    })
  })
})
