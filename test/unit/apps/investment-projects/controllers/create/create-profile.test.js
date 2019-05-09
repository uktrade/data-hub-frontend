const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

describe('Investment create invenstor profile post call controller', () => {
  describe('#createInvestorProfile', () => {
    context('when company is defined', () => {
      context('when profile does not exist', () => {
        beforeEach(async () => {
          this.createCompanyProfileSpy = sinon.stub().resolves({ 'investor_company': 'test' })

          const controller = proxyquire('~/src/apps/investments/controllers/create/create-profile', {
            './../../../companies/apps/investments/large-capital-profile/repos.js': {
              createCompanyProfile: this.createCompanyProfileSpy,
            },
          })

          this.middlewareParameters = await buildMiddlewareParameters({
            requestBody: {
              'investor_company': 'test',
            },
          })

          await controller.createProfile(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy)
        })

        it('should create company profile', () => {
          expect(this.createCompanyProfileSpy).to.be.calledOnce
        })

        it('should redirect', () => {
          expect(this.middlewareParameters.resMock.redirect).to.be.calledOnce
        })
      })

      context('when profile exists', () => {
        beforeEach(async () => {
          this.createCompanyProfileSpy = sinon.stub().rejects({ 'error': { 'investor_company': 'company exist' } })

          const controller = proxyquire('~/src/apps/investments/controllers/create/create-profile', {
            './../../../companies/apps/investments/large-capital-profile/repos.js': {
              createCompanyProfile: this.createCompanyProfileSpy,
            },
          })

          this.middlewareParameters = await buildMiddlewareParameters({
            requestBody: {
              'investor_company': 'test',
            },
          })

          await controller.createProfile(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy)
        })

        it('should return error message', () => {
          expect(this.middlewareParameters.resMock.redirect).not.to.be.called
          expect(this.middlewareParameters.resMock.locals.form.errors.summary).to.equal('company exist')
        })
      })
    })

    context('when company id is not defined', () => {
      beforeEach(async () => {
        this.createCompanyProfileSpy = sinon.stub().resolves({})

        const controller = proxyquire('~/src/apps/investments/controllers/create/create-profile', {
          './../../../companies/apps/investments/large-capital-profile/repos.js': {
            createCompanyProfile: this.createCompanyProfileSpy,
          },
        })

        this.middlewareParameters = await buildMiddlewareParameters({
          requestBody: { },
        })

        await controller.createProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy)
      })

      it('should return validation error message', () => {
        expect(this.createCompanyProfileSpy).not.to.be.called
        expect(this.middlewareParameters.resMock.redirect).not.to.be.called
        expect(this.middlewareParameters.resMock.locals.form.errors.messages.investor_company)
          .an('array').that.includes('Enter a company name')
      })
    })
  })
})
