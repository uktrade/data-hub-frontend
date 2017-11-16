const companiesHouseCompany = require('~/test/unit/data/companies/companiesHouseCompany.json')
const minimalCompany = require('~/test/unit/data/companies/minimalCompany.json')
const { renderDetails } = require('~/src/apps/companies/controllers/details')

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

  describe('#renderDetails', () => {
    context('when the company contains companes house data', () => {
      beforeEach(() => {
        this.res.locals.company = companiesHouseCompany
        renderDetails(this.req, this.res, this.next)
      })

      it('should render the correct template', () => {
        const templateName = this.res.render.firstCall.args[0]
        expect(templateName).to.equal('companies/views/details')
      })

      it('should include company details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.companyDetails).to.not.be.null
      })

      it('should include companies house details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.chDetails).to.not.be.null
      })

      it('should include one list information', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.accountManagementDetails).to.not.be.null
      })
    })

    context('when the company has no companies house data', () => {
      beforeEach(() => {
        this.res.locals.company = minimalCompany
        renderDetails(this.req, this.res, this.next)
      })

      it('should render the correct template', () => {
        const templateName = this.res.render.firstCall.args[0]
        expect(templateName).to.equal('companies/views/details')
      })

      it('should include company details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.companyDetails).to.not.be.null
      })

      it('should include companies house details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.chDetails).to.be.null
      })

      it('should include one list information', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.accountManagementDetails).to.not.be.null
      })
    })
  })
})
