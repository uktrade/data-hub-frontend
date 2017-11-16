const { assign } = require('lodash')

const companyData = require('~/test/unit/data/companies/company.json')
const viewController = require('~/src/apps/companies/controllers/details')

describe('Companies details controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.req = {
      session: {
        token: '1234',
      },
      params: {
        companyId: '999',
      },
    }

    this.res = {
      locals: {},
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.stub(),
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('renderDetails', () => {
    context('when there is one list data associated with a company', () => {
      beforeEach(() => {
        const company = assign({}, companyData, {
          one_list_account_owner: {
            id: '888',
            name: 'Fred Bloggs',
          },
          classification: {
            id: '777',
            name: 'Top',
          },
        })

        this.res.locals = assign({}, this.res.locals, { company })
        viewController.renderDetails(this.req, this.res)
      })

      it('should pass account management display data to the view', () => {
        expect(this.res.locals).to.have.deep.property('accountManagementDisplay', {
          oneListAccountManager: 'Fred Bloggs',
          oneListTier: 'Top',
        })
      })

      it('should pass account management labels to the view', () => {
        expect(this.res.locals).to.have.property('accountManagementDisplayLabels')
      })
    })

    context('when there is no one list data associated with a company', () => {
      beforeEach(() => {
        const company = assign({}, companyData, {
          one_list_account_owner: null,
          classification: null,
        })

        this.res.locals = assign({}, this.res.locals, { company })
        viewController.renderDetails(this.req, this.res)
      })

      it('should indicate there is non one list account information', () => {
        expect(this.res.locals).to.have.deep.property('accountManagementDisplay', {
          oneListAccountManager: 'None',
          oneListTier: 'None',
        })
      })

      it('should pass account management labels to the view', () => {
        expect(this.res.locals).to.have.property('accountManagementDisplayLabels')
      })
    })
  })
})
