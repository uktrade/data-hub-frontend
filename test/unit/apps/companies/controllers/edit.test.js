const { assign } = require('lodash')

const companyMock = require('test/unit/data/companies/company-v4.json')
const config = require('config')

const metaDataMock = {
  businessTypeOptions: [
    {
      id: '9dd14e94-5d95-e211-a939-e4115bead28a',
      name: 'Charity',
    },
    {
      id: '9cd14e94-5d95-e211-a939-e4115bead28a',
      name: 'Government department',
    },
    {
      id: '9bd14e94-5d95-e211-a939-e4115bead28a',
      name: 'Intermediary',
    },
    {
      id: '8b6eaf7e-03e7-e611-bca1-e4115bead28a',
      name: 'Limited partnership',
    },
    {
      id: '9ad14e94-5d95-e211-a939-e4115bead28a',
      name: 'Partnership',
    },
    {
      id: '6f75408b-03e7-e611-bca1-e4115bead28a',
      name: 'Private limited company',
    },
    {
      id: 'dac8c591-03e7-e611-bca1-e4115bead28a',
      name: 'Public limited company',
    },
    {
      id: '99d14e94-5d95-e211-a939-e4115bead28a',
      name: 'Sole Trader',
    },
    {
      id: 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98',
      name: 'UK branch of foreign company (BR)',
    },
    {
      id: '98d14e94-5d95-e211-a939-e4115bead28a',
      name: 'Company',
    },
  ],
}

describe('Company edit controller', () => {
  beforeEach(() => {
    this.breadcrumbStub = sinon.stub().returnsThis()
    this.renderSpy = sinon.spy()
    this.nextSpy = sinon.spy()
    this.redirectSpy = sinon.spy()

    this.controller = require('src/apps/companies/controllers/edit')

    this.reqMock = {
      session: {
        token: 'abcd',
      },
    }
    this.resMock = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderSpy,
      redirect: this.redirectSpy,
      locals: {
        company: companyMock,
      },
    }
    this.getCalledRenderLocals = () => {
      return this.resMock.render.firstCall.args[1]
    }
    this.getCalledRenderView = () => {
      return this.resMock.render.firstCall.args[0]
    }
    this.getCalledBreadcrumb = (call = 0) => {
      return this.resMock.breadcrumb.getCall(call)
    }
  })

  describe('renderForm', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get('/metadata/business-type/')
        .twice().reply(200, metaDataMock.businessTypeOptions)
    })

    context('when adding a UK branch of a foreign company', () => {
      beforeEach(async () => {
        const reqMock = assign(this.reqMock, {
          query: {
            country: 'uk',
          },
        })
        const resMock = assign(this.resMock, {
          locals: {
            formData: {
              business_type: 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98',
            },
          },
        })

        await this.controller.renderForm(reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.getCalledRenderView()).to.equal('companies/views/edit')
      })

      it('should set the add breadcrumb', () => {
        expect(this.getCalledBreadcrumb().args[0]).to.equal('Add business details')
      })

      it('should set heading', () => {
        expect(this.getCalledRenderLocals().heading).to.equal('Add business details')
      })

      it('should set isForeign', () => {
        expect(this.getCalledRenderLocals().isForeign).to.be.false
      })

      it('should set isOnOneList', () => {
        expect(this.getCalledRenderLocals().isOnOneList).to.be.false
      })

      it('should not include company details', () => {
        expect(this.getCalledRenderLocals().companyDetails).to.deep.equal({})
      })

      it('should include a link to the One List support email', () => {
        expect(this.getCalledRenderLocals().oneListEmail).to.equal(config.oneList.email)
      })

      it('should set businessTypeLabel', () => {
        expect(this.getCalledRenderLocals().businessTypeLabel).to.equal('UK branch of foreign company (BR)')
      })

      it('should show the company number field', () => {
        expect(this.getCalledRenderLocals().showCompanyNumberForUkBranch).to.be.true
      })
    })

    context('when editing a UK branch of a foreign company', () => {
      beforeEach(async () => {
        const reqMock = assign(this.reqMock, {
          query: {
            country: 'uk',
          },
        })
        const resMock = assign(this.resMock, {
          locals: {
            formData: {
              business_type: 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98',
            },
            company: {
              id: 1,
              name: 'Existing UK branch of foreign company',
              uk_based: true,
            },
          },
        })

        await this.controller.renderForm(reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.getCalledRenderView()).to.equal('companies/views/edit')
      })

      it('should set the company breadcrumb text', () => {
        expect(this.getCalledBreadcrumb().args[0]).to.equal('Existing UK branch of foreign company')
      })

      it('should set the company breadcrumb link', () => {
        expect(this.getCalledBreadcrumb().args[1]).to.equal('/companies/1')
      })

      it('should set the business details breadcrumb', () => {
        expect(this.getCalledBreadcrumb(1).args[0]).to.equal('Business details')
      })

      it('should set the edit breadcrumb', () => {
        expect(this.getCalledBreadcrumb(2).args[0]).to.equal('Edit business details')
      })

      it('should set heading', () => {
        expect(this.getCalledRenderLocals().heading).to.equal('Edit business details')
      })

      it('should set isForeign', () => {
        expect(this.getCalledRenderLocals().isForeign).to.be.false
      })

      it('should set isOnOneList', () => {
        expect(this.getCalledRenderLocals().isOnOneList).to.be.false
      })

      it('should include company details', () => {
        expect(this.getCalledRenderLocals().companyDetails).to.not.be.null
      })

      it('should include a link to the One List support email', () => {
        expect(this.getCalledRenderLocals().oneListEmail).to.equal(config.oneList.email)
      })

      it('should set businessTypeLabel', () => {
        expect(this.getCalledRenderLocals().businessTypeLabel).to.equal('UK branch of foreign company (BR)')
      })

      it('should show the company number field', () => {
        expect(this.getCalledRenderLocals().showCompanyNumberForUkBranch).to.be.true
      })
    })

    context('when adding a UK sole trader', () => {
      beforeEach(async () => {
        const reqMock = assign(this.reqMock, {
          query: {
            country: 'uk',
          },
        })
        const resMock = assign(this.resMock, {
          locals: {
            formData: {
              business_type: '99d14e94-5d95-e211-a939-e4115bead28a',
            },
          },
        })

        await this.controller.renderForm(reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.getCalledRenderView()).to.equal('companies/views/edit')
      })

      it('should set the add breadcrumb', () => {
        expect(this.getCalledBreadcrumb().args[0]).to.equal('Add business details')
      })

      it('should set heading', () => {
        expect(this.getCalledRenderLocals().heading).to.equal('Add business details')
      })

      it('should set isForeign', () => {
        expect(this.getCalledRenderLocals().isForeign).to.be.false
      })

      it('should set isOnOneList', () => {
        expect(this.getCalledRenderLocals().isOnOneList).to.be.false
      })

      it('should not include company details', () => {
        expect(this.getCalledRenderLocals().companyDetails).to.deep.equal({})
      })

      it('should include a link to the One List support email', () => {
        expect(this.getCalledRenderLocals().oneListEmail).to.equal(config.oneList.email)
      })

      it('should set businessTypeLabel', () => {
        expect(this.getCalledRenderLocals().businessTypeLabel).to.equal('Sole Trader')
      })

      it('should not show the company number field', () => {
        expect(this.getCalledRenderLocals().showCompanyNumberForUkBranch).to.be.false
      })
    })

    context('when adding a foreign sole trader', () => {
      beforeEach(async () => {
        const reqMock = assign(this.reqMock, {
          query: {
            country: 'non-uk',
          },
        })
        const resMock = assign(this.resMock, {
          locals: {
            formData: {
              business_type: '99d14e94-5d95-e211-a939-e4115bead28a',
            },
          },
        })

        await this.controller.renderForm(reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.getCalledRenderView()).to.equal('companies/views/edit')
      })

      it('should set the add breadcrumb', () => {
        expect(this.getCalledBreadcrumb().args[0]).to.equal('Add business details')
      })

      it('should set heading', () => {
        expect(this.getCalledRenderLocals().heading).to.equal('Add business details')
      })

      it('should set isForeign', () => {
        expect(this.getCalledRenderLocals().isForeign).to.be.true
      })

      it('should set isOnOneList', () => {
        expect(this.getCalledRenderLocals().isOnOneList).to.be.false
      })

      it('should not include company details', () => {
        expect(this.getCalledRenderLocals().companyDetails).to.deep.equal({})
      })

      it('should include a link to the One List support email', () => {
        expect(this.getCalledRenderLocals().oneListEmail).to.equal(config.oneList.email)
      })

      it('should set businessTypeLabel', () => {
        expect(this.getCalledRenderLocals().businessTypeLabel).to.equal('Sole Trader')
      })

      it('should not show the company number field', () => {
        expect(this.getCalledRenderLocals().showCompanyNumberForUkBranch).to.be.false
      })
    })

    context('when editing a government department', () => {
      beforeEach(async () => {
        const reqMock = assign(this.reqMock, {
          query: {
            country: 'uk',
          },
        })
        const resMock = assign(this.resMock, {
          locals: {
            formData: {
              business_type: '9cd14e94-5d95-e211-a939-e4115bead28a',
            },
            company: {
              id: 1,
              name: 'Existing government department',
              uk_based: true,
            },
          },
        })

        await this.controller.renderForm(reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.getCalledRenderView()).to.equal('companies/views/edit')
      })

      it('should set the add breadcrumb', () => {
        expect(this.getCalledBreadcrumb().args[0]).to.equal('Existing government department')
      })

      it('should set the business details breadcrumb', () => {
        expect(this.getCalledBreadcrumb(1).args[0]).to.equal('Business details')
      })

      it('should set the edit breadcrumb', () => {
        expect(this.getCalledBreadcrumb(2).args[0]).to.equal('Edit business details')
      })

      it('should set heading', () => {
        expect(this.getCalledRenderLocals().heading).to.equal('Edit business details')
      })

      it('should set isForeign', () => {
        expect(this.getCalledRenderLocals().isForeign).to.be.false
      })

      it('should set isOnOneList', () => {
        expect(this.getCalledRenderLocals().isOnOneList).to.be.false
      })

      it('should include company details', () => {
        expect(this.getCalledRenderLocals().companyDetails).to.not.be.null
      })

      it('should set businessTypeLabel', () => {
        expect(this.getCalledRenderLocals().businessTypeLabel).to.equal('Government department')
      })

      it('should include a link to the One List support email', () => {
        expect(this.getCalledRenderLocals().oneListEmail).to.equal(config.oneList.email)
      })

      it('should not show the company number field', () => {
        expect(this.getCalledRenderLocals().showCompanyNumberForUkBranch).to.be.false
      })
    })

    context('when editing a company on the One List', () => {
      beforeEach(async () => {
        const resMock = assign(this.resMock, {
          locals: {
            company: {
              id: 1,
              name: 'One List Company',
              one_list_group_tier: {
                id: '4321',
                name: 'Tier A - Strategic Account',
              },
            },
          },
        })

        await this.controller.renderForm(this.reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.getCalledRenderView()).to.equal('companies/views/edit')
      })

      it('should set the add breadcrumb', () => {
        expect(this.getCalledBreadcrumb().args[0]).to.equal('One List Company')
      })

      it('should set heading', () => {
        expect(this.getCalledRenderLocals().heading).to.equal('Edit business details')
      })

      it('should set isOnOneList', () => {
        expect(this.getCalledRenderLocals().isOnOneList).to.be.true
      })

      it('should include company details', () => {
        expect(this.getCalledRenderLocals().companyDetails).to.not.be.null
      })

      it('should include a link to the One List support email', () => {
        expect(this.getCalledRenderLocals().oneListEmail).to.equal(config.oneList.email)
      })
    })
  })
})
