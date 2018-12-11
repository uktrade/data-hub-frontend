const { renderDetails } = require('~/src/apps/companies/controllers/details')

const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company.json')
const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const dunAndBradstreetCompany = require('~/test/unit/data/companies/dnb-company.json')
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
      .reply(200, [])

    nock(config.apiRoot)
      .get(`/v3/company/${dunAndBradstreetCompany.id}/one-list-group-core-team`)
      .reply(200, oneListGroupCoreTeam)
  })

  describe('#renderDetails', () => {
    const commonTests = (template) => {
      it('should render the correct template', () => {
        const templateName = this.res.render.firstCall.args[0]
        expect(templateName).to.equal(template)
      })

      it('should include company details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.companyDetails).to.not.be.null
      })

      it('should include account management details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.accountManagementDetails).to.not.be.null
      })

      it('should include one list information', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.accountManagementDetails).to.not.be.null
      })

      it('should include a link to the One List support email', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.oneListEmail).to.equal(config.oneList.email)
      })
    }

    context('when the company contains Companies House data', () => {
      beforeEach(async () => {
        this.res.locals.company = companiesHouseCompany

        await renderDetails(this.req, this.res, this.next)
      })

      commonTests('companies/views/_deprecated/details')

      it('should include companies house details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.chDetails).to.not.be.null
      })
    })

    context('when the company has no companies house data', () => {
      beforeEach(async () => {
        this.res.locals.company = minimalCompany

        await renderDetails(this.req, this.res, this.next)
      })

      commonTests('companies/views/_deprecated/details')

      it('should not include Companies House details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.chDetails).to.be.null
      })
    })

    context('when the company is populated by data from Dun & Bradstreet', () => {
      beforeEach(async () => {
        this.res.locals.company = dunAndBradstreetCompany

        await renderDetails(this.req, this.res, this.next)
      })

      commonTests('companies/views/details')

      it('should not include Companies House details', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.chDetails).to.be.null
      })
    })
  })
})
