const { renderDetails } = require('~/src/apps/companies/controllers/details')

const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company.json')
const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const oneListGroupCoreTeam = require('~/test/unit/data/companies/one-list-group-core-team.json')
const config = require('~/config')

describe('Companies details controller', () => {
  beforeEach(() => {
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
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.stub(),
    }

    nock(config.apiRoot)
      .get(`/v3/company/${minimalCompany.id}/one-list-group-core-team`)
      .reply(200, oneListGroupCoreTeam)
  })

  describe('#renderDetails', () => {
    context('when the company contains companes house data', () => {
      beforeEach(async () => {
        this.res.locals.company = companiesHouseCompany

        await renderDetails(this.req, this.res, this.next)
      })

      it('should render the correct template', () => {
        const templateName = this.res.render.firstCall.args[0]
        expect(templateName).to.equal('companies/views/details')
      })

      it('should include company details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.companyDetails).to.not.be.null
      })

      it('should include account management details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.accountManagementDetails).to.not.be.null
      })

      it('should include companies house details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.chDetails).to.not.be.null
      })

      it('should include one list information', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.accountManagementDetails).to.not.be.null
      })

      it('should include a link to the One List support email', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.oneListEmail).to.equal(config.oneList.email)
      })
    })

    context('when the company has no companies house data', () => {
      beforeEach(async () => {
        this.res.locals.company = minimalCompany

        await renderDetails(this.req, this.res, this.next)
      })

      it('should render the correct template', () => {
        const templateName = this.res.render.firstCall.args[0]
        expect(templateName).to.equal('companies/views/details')
      })

      it('should include company details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.companyDetails).to.not.be.null
      })

      it('should include account management details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.accountManagementDetails).to.not.be.null
      })

      it('should not include companies house details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.chDetails).to.be.null
      })

      it('should include one list information', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.accountManagementDetails).to.not.be.null
      })

      it('should include a link to the One List support email', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.oneListEmail).to.equal(config.oneList.email)
      })
    })
  })
})
