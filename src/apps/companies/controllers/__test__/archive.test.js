const proxyquire = require('proxyquire')

const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../test/unit/data/companies/minimal-company.json')

describe('Company controller, archive', () => {
  beforeEach(() => {
    this.stub = {
      archiveCompany: sinon.stub(),
      unarchiveCompany: sinon.stub(),
    }

    this.errorLoggerSpy = sinon.spy()

    this.controller = proxyquire('../archive', {
      '../repos': {
        archiveCompany: this.stub.archiveCompany,
        unarchiveCompany: this.stub.unarchiveCompany,
      },
      '../../../config/logger': {
        error: this.errorLoggerSpy,
      },
    })
  })

  const commonTests = ({ stubName, expectedReason, expectedFlash }) => {
    if (stubName) {
      it('should call archive company with correct args', () => {
        if (expectedReason) {
          expect(this.stub[stubName]).to.have.been.calledWith(
            this.middlewareParameters.reqMock,
            companyMock.id,
            expectedReason
          )
        } else {
          expect(this.stub[stubName]).to.have.been.calledWith(
            this.middlewareParameters.reqMock,
            companyMock.id
          )
        }

        expect(this.stub[stubName]).to.have.been.calledOnce
      })
    }

    it('should set a success on flash', () => {
      expect(this.middlewareParameters.reqMock.flash.args[0][0]).to.equal(
        expectedFlash
      )
      expect(this.middlewareParameters.reqMock.flash).to.have.been.calledOnce
    })

    it('should redirect back to company', () => {
      expect(
        this.middlewareParameters.resMock.redirect
      ).to.have.been.calledWith(`/companies/${companyMock.id}/business-details`)
      expect(this.middlewareParameters.resMock.redirect).to.have.been.calledOnce
    })
  }

  describe('#archiveCompany', () => {
    context('when no reason is supplied', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {},
          company: companyMock,
        })

        this.controller.archiveCompany(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock
        )
      })

      commonTests({
        expectedFlash: 'error',
      })

      it('should not attempt to archive company', () => {
        expect(this.stub.archiveCompany).not.to.have.been.called
      })
    })

    context('when a reason is supplied', () => {
      context('when save returns successfully', () => {
        context('with a default reason', () => {
          beforeEach(async () => {
            this.middlewareParameters = buildMiddlewareParameters({
              requestBody: {
                archived_reason: 'Archived reason',
              },
              company: companyMock,
            })

            this.stub.archiveCompany.resolves(companyMock)

            await this.controller.archiveCompany(
              this.middlewareParameters.reqMock,
              this.middlewareParameters.resMock
            )
          })

          commonTests({
            stubName: 'archiveCompany',
            expectedReason: 'Archived reason',
            expectedFlash: 'success',
          })
        })

        context('with a custom reason', () => {
          beforeEach(async () => {
            this.middlewareParameters = buildMiddlewareParameters({
              requestBody: {
                archived_reason: 'Other',
                archived_reason_other: 'My custom reason',
              },
              company: companyMock,
            })

            this.stub.archiveCompany.resolves(companyMock)

            await this.controller.archiveCompany(
              this.middlewareParameters.reqMock,
              this.middlewareParameters.resMock
            )
          })

          commonTests({
            stubName: 'archiveCompany',
            expectedReason: 'My custom reason',
            expectedFlash: 'success',
            expectedPath: `/companies/${companyMock.id}`,
          })
        })
      })

      context('when save rejects with an error', () => {
        beforeEach(async () => {
          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              archived_reason: 'Other',
              archived_reason_other: 'My custom reason',
            },
            company: companyMock,
          })

          this.stub.archiveCompany.rejects({ errorCode: 500 })

          await this.controller.archiveCompany(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock
          )
        })

        commonTests({
          stubName: 'archiveCompany',
          expectedReason: 'My custom reason',
          expectedFlash: 'error',
          expectedPath: `/companies/${companyMock.id}`,
        })

        it('should send error to logger', () => {
          expect(this.errorLoggerSpy).to.have.been.calledWith({
            errorCode: 500,
          })
          expect(this.errorLoggerSpy).to.have.been.calledOnce
        })
      })
    })
  })

  describe('#unarchiveCompany', () => {
    context('when save returns successfully', () => {
      context('when there is not a redirect', () => {
        beforeEach(async () => {
          this.middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
          })

          this.stub.unarchiveCompany.resolves(companyMock)

          await this.controller.unarchiveCompany(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock
          )
        })

        commonTests({
          stubName: 'unarchiveCompany',
          expectedFlash: 'success',
        })
      })
    })

    context('when save rejects with an error', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        this.stub.unarchiveCompany.rejects({ errorCode: 500 })

        await this.controller.unarchiveCompany(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock
        )
      })

      commonTests({
        stubName: 'unarchiveCompany',
        expectedFlash: 'error',
      })

      it('should send error to logger', () => {
        expect(this.errorLoggerSpy).to.have.been.calledWith({ errorCode: 500 })
        expect(this.errorLoggerSpy).to.have.been.calledOnce
      })
    })
  })
})
