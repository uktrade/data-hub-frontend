const proxyquire = require('proxyquire')

const buildMiddlewareParameters = require('../../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyProfile = require('../../../../../../../test/unit/data/companies/investments/large-capital-profile-new.json')
const companyMock = require('../../../../../../../test/unit/data/companies/minimal-company.json')

const route = `/companies/${companyMock.id}/investments/large-capital-profile`
const config = require('../../../../../../config')

describe('HTTP PATCH - Large capital profile', () => {
  describe('#updateCompanyProfile', () => {
    const commonTests = () => {
      it('should call updateCompanyProfile with the correct arguments', () => {
        expect(this.updateCompanyProfileStub).to.have.been.calledWith(
          this.middlewareParameters.reqMock,
          {},
          '123'
        )
      })

      it('should call redirect once', () => {
        expect(this.middlewareParameters.resMock.redirect).to.have.been
          .calledOnce
      })

      it('should call redirect with the correct route', () => {
        expect(this.middlewareParameters.resMock.redirect).to.be.calledWith(
          route
        )
      })

      it('should not call next', () => {
        expect(this.middlewareParameters.nextSpy).to.not.be.called
      })
    }

    beforeEach(() => {
      this.transformInvestorDetailsStub = sinon.stub()
      this.transformInvestorRequirementsStub = sinon.stub()
      this.updateCompanyProfileStub = sinon.stub()

      this.controller = proxyquire('../controllers/update', {
        '../transformers': {
          transformInvestorDetails: this.transformInvestorDetailsStub,
          transformInvestorRequirements: this.transformInvestorRequirementsStub,
        },
        '../repos': {
          updateCompanyProfile: this.updateCompanyProfileStub,
        },
      })
    })

    context(
      'when updateCompanyProfile for Investor details returns successfully',
      () => {
        beforeEach(async () => {
          this.requestBody = {
            profileId: '123',
            editing: 'investor-details',
          }

          this.middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            requestBody: this.requestBody,
          })

          this.transformInvestorDetailsStub.returns({})

          nock(config.apiRoot)
            .patch(`/v4/large-investor-profile/123`)
            .reply(200, companyProfile)

          await this.controller.updateProfile(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should call transformInvestorDetails with the request body', () => {
          expect(this.transformInvestorDetailsStub).to.have.been.calledWith(
            this.requestBody
          )
        })

        commonTests()
      }
    )

    context(
      'when updateCompanyProfile for Investor requirements returns successfully',
      () => {
        beforeEach(async () => {
          this.requestBody = {
            profileId: '123',
            editing: 'investor-requirements',
          }

          this.middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            requestBody: this.requestBody,
          })

          this.transformInvestorRequirementsStub.returns({})

          nock(config.apiRoot)
            .patch(`/v4/large-investor-profile/123`)
            .reply(200, companyProfile)

          await this.controller.updateProfile(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should call transformInvestorRequirements with the request body', () => {
          expect(
            this.transformInvestorRequirementsStub
          ).to.have.been.calledWith(this.requestBody)
        })

        commonTests()
      }
    )

    context('when updateCompanyProfile rejects', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestBody: {
            profileId: '123',
            editing: 'investor-requirements',
          },
        })

        this.errorMock = {
          errorCode: 500,
        }

        this.updateCompanyProfileStub.rejects(this.errorMock)

        await this.controller.updateProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should call next with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(
          this.errorMock
        )
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
      })
    })
  })
})
