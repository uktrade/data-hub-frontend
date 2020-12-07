const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')

const config = require('../../../../config')
const { setGlobalHQ, removeGlobalHQ, addSubsidiary } = require('../hierarchies')

const globalHeadquartersId = '1'
const subsidiaryCompanyId = '2'
// TODO: add new functional/e2e test to companies updating the Global HQ of  companies and subsidiaries (using the contexts outlined below). This could be in addition to: test/functional/cypress/specs/companies/dnb-hierarchy-spec.js (ensuring non D&B companies are covered if there is a business need)
describe('Company hierarchies middleware', () => {
  describe('#setGlobalHQ', () => {
    context('when company update is successful', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestParams: {
            companyId: subsidiaryCompanyId,
            globalHqId: globalHeadquartersId,
          },
        })

        nock(config.apiRoot)
          .patch(`/v4/company/${subsidiaryCompanyId}`, {
            global_headquarters: globalHeadquartersId,
          })
          .reply(200, { id: subsidiaryCompanyId })

        await setGlobalHQ(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should redirect', () => {
        expect(this.middlewareParameters.resMock.redirect).to.have.been
          .calledOnce
        expect(this.middlewareParameters.resMock.redirect).to.be.calledWith(
          `/companies/${subsidiaryCompanyId}/business-details`
        )
      })

      it('should call flash', () => {
        expect(this.middlewareParameters.reqMock.flash).to.have.been.calledOnce
        expect(this.middlewareParameters.reqMock.flash).to.be.calledWith(
          'success',
          'You’ve linked the Global Headquarters'
        )
      })
    })

    context('when company update fails with a server error', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestParams: {
            companyId: subsidiaryCompanyId,
            globalHqId: globalHeadquartersId,
          },
        })

        nock(config.apiRoot)
          .patch(`/v4/company/${subsidiaryCompanyId}`, {
            global_headquarters: globalHeadquartersId,
          })
          .reply(500, 'Error message')

        await setGlobalHQ(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should call next with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
        expect(this.middlewareParameters.nextSpy).to.be.calledWith(
          sinon.match({
            message: '500 - "Error message"',
          })
        )
      })

      it('should not set a flash message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.not.be.called
      })
    })

    context('when company update fails with a validation error', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestParams: {
            companyId: subsidiaryCompanyId,
            globalHqId: globalHeadquartersId,
          },
        })

        nock(config.apiRoot)
          .patch(`/v4/company/${subsidiaryCompanyId}`, {
            global_headquarters: globalHeadquartersId,
          })
          .reply(400, { error: 'Error message' })

        await setGlobalHQ(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should redirect', () => {
        expect(this.middlewareParameters.resMock.redirect).to.have.been
          .calledOnce
        expect(this.middlewareParameters.resMock.redirect).to.be.calledWith(
          `/companies/${subsidiaryCompanyId}/business-details`
        )
      })

      it('should call flash', () => {
        expect(this.middlewareParameters.reqMock.flash).to.have.been.calledOnce
        expect(this.middlewareParameters.reqMock.flash).to.be.calledWith(
          'error',
          'There has been an error'
        )
      })
    })
  })

  describe('#removeGlobalHQ', () => {
    context('when company update is successful', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestParams: {
            companyId: subsidiaryCompanyId,
          },
        })

        nock(config.apiRoot)
          .patch(`/v4/company/${subsidiaryCompanyId}`, {
            global_headquarters: null,
          })
          .reply(200, { id: subsidiaryCompanyId })

        await removeGlobalHQ(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should redirect', () => {
        expect(this.middlewareParameters.resMock.redirect).to.have.been
          .calledOnce
        expect(this.middlewareParameters.resMock.redirect).to.be.calledWith(
          `/companies/${subsidiaryCompanyId}/business-details`
        )
      })

      it('should call flash', () => {
        expect(this.middlewareParameters.reqMock.flash).to.have.been.calledOnce
        expect(this.middlewareParameters.reqMock.flash).to.be.calledWith(
          'success',
          'You’ve removed the link to Global Headquarters'
        )
      })
    })

    context('when company update fails with a server error', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestParams: {
            companyId: subsidiaryCompanyId,
          },
        })

        nock(config.apiRoot)
          .patch(`/v4/company/${subsidiaryCompanyId}`, {
            global_headquarters: null,
          })
          .reply(500, 'Error message')

        await removeGlobalHQ(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should call next with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
        expect(this.middlewareParameters.nextSpy).to.be.calledWith(
          sinon.match({
            message: '500 - "Error message"',
          })
        )
      })

      it('should not set a flash message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.not.be.called
      })
    })

    context('when company update fails with a validation error', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestParams: {
            companyId: subsidiaryCompanyId,
          },
        })

        nock(config.apiRoot)
          .patch(`/v4/company/${subsidiaryCompanyId}`, {
            global_headquarters: null,
          })
          .reply(400, { error: 'Error message' })

        await removeGlobalHQ(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should redirect', () => {
        expect(this.middlewareParameters.resMock.redirect).to.have.been
          .calledOnce
        expect(this.middlewareParameters.resMock.redirect).to.be.calledWith(
          `/companies/${subsidiaryCompanyId}/business-details`
        )
      })

      it('should call flash', () => {
        expect(this.middlewareParameters.reqMock.flash).to.have.been.calledOnce
        expect(this.middlewareParameters.reqMock.flash).to.be.calledWith(
          'error',
          'There has been an error'
        )
      })
    })
  })

  describe('#addSubsidiary', () => {
    context('when company update is successful', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestParams: {
            subsidiaryCompanyId,
            companyId: globalHeadquartersId,
          },
        })

        nock(config.apiRoot)
          .patch(`/v4/company/${subsidiaryCompanyId}`, {
            global_headquarters: globalHeadquartersId,
          })
          .reply(200, { id: subsidiaryCompanyId })

        await addSubsidiary(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should redirect', () => {
        expect(this.middlewareParameters.resMock.redirect).to.have.been
          .calledOnce
        expect(this.middlewareParameters.resMock.redirect).to.be.calledWith(
          `/companies/${globalHeadquartersId}/subsidiaries`
        )
      })

      it('should call flash', () => {
        expect(this.middlewareParameters.reqMock.flash).to.have.been.calledOnce
        expect(this.middlewareParameters.reqMock.flash).to.be.calledWith(
          'success',
          'You’ve linked the subsidiary'
        )
      })
    })

    context('when company update fails with a server error', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestParams: {
            subsidiaryCompanyId,
            companyId: globalHeadquartersId,
          },
        })

        nock(config.apiRoot)
          .patch(`/v4/company/${subsidiaryCompanyId}`, {
            global_headquarters: globalHeadquartersId,
          })
          .reply(500, 'Error message')

        await addSubsidiary(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should call next with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
        expect(this.middlewareParameters.nextSpy).to.be.calledWith(
          sinon.match({
            message: '500 - "Error message"',
          })
        )
      })

      it('should not set a flash message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.not.be.called
      })
    })

    context('when company update fails with a validation error', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestParams: {
            subsidiaryCompanyId,
            companyId: globalHeadquartersId,
          },
        })

        nock(config.apiRoot)
          .patch(`/v4/company/${subsidiaryCompanyId}`, {
            global_headquarters: globalHeadquartersId,
          })
          .reply(400, { error: 'Error message' })

        await addSubsidiary(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should redirect', () => {
        expect(this.middlewareParameters.resMock.redirect).to.have.been
          .calledOnce
        expect(this.middlewareParameters.resMock.redirect).to.be.calledWith(
          `/companies/${globalHeadquartersId}/subsidiaries`
        )
      })

      it('should call flash', () => {
        expect(this.middlewareParameters.reqMock.flash).to.have.been.calledOnce
        expect(this.middlewareParameters.reqMock.flash).to.be.calledWith(
          'error',
          'There has been an error'
        )
      })
    })
  })
})
