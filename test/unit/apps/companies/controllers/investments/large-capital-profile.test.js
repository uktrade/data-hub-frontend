const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const noCompanyProfile = require('~/test/unit/data/companies/investments/large-capital-profile-empty.json')
const investorType = require('~/test/unit/data/companies/investments/metadata/investor-type.json')
const investorTypeTransformed = require('~/test/unit/data/companies/investments/metadata/investor-type-transformed.json')
const companyProfile = require('~/test/unit/data/companies/investments/large-capital-profile.json')
const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const config = require('~/config')
const { cloneDeep } = require('lodash')

const controller = require('~/src/apps/companies/apps/investments/large-capital-profile/controllers')

describe('Company Investments - large capital profile', () => {
  describe('renderProfile', () => {
    const commonTests = (profile) => {
      it('should call the render function once', () => {
        expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('should call the render function and pass the view', () => {
        const view = 'companies/apps/investments/large-capital-profile/views/profile'
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(view)
      })

      it('should call the render function and pass the profile', () => {
        expect(this.middlewareParameters.resMock.render.args[0][1].profile).to.deep.equal(profile)
      })
    }

    context('when the company does not have a company profile', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, noCompanyProfile)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await controller.renderProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests(undefined)
    })

    context('when the company has a new unedited profile', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, companyProfile)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await controller.renderProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests({
        editing: undefined,
        id: companyProfile.results[0].id,
        investorDetails: {
          incompleteFields: 5,
          investorType: {
            text: undefined,
            value: undefined,
          },
        },
        investorRequirements: {
          incompleteFields: 9,
        },
        location: {
          incompleteFields: 3,
        },
      })
    })

    context('when the company has a profile and the user is editing the "Investor details" section', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, companyProfile)
          .get('/metadata/capital-investment/investor-type/')
          .reply(200, investorType)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            editing: 'investor-details',
          },
        })

        await controller.renderProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests({
        editing: 'investor-details',
        id: companyProfile.results[0].id,
        investorDetails: {
          incompleteFields: 5,
          investorType: {
            text: undefined,
            value: undefined,
            items: investorTypeTransformed,
          },
        },
        investorRequirements: {
          incompleteFields: 9,
        },
        location: {
          incompleteFields: 3,
        },
      })
    })

    context('when the user has previously saved the "Investor type" within "Investor details"', () => {
      beforeEach(async () => {
        const clonedCompanyProfile = cloneDeep(companyProfile)
        const profile = clonedCompanyProfile.results[0]

        // Remove investor-type from the incomplete details fields array.
        profile.incomplete_details_fields.shift()

        // User has previously saved 'Asset manager'.
        profile.investor_type = {
          id: '80168d31-fa91-494e-9ad5-b9255e01b5da',
          name: 'Asset manager',
        }

        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, clonedCompanyProfile)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await controller.renderProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests({
        editing: undefined,
        id: 'a9e7afa4-1079-422a-b24e-a77f3ba80375',
        investorDetails: {
          incompleteFields: 4,
          investorType: {
            text: 'Asset manager',
            value: '80168d31-fa91-494e-9ad5-b9255e01b5da',
          },
        },
        investorRequirements: {
          incompleteFields: 9,
        },
        location: {
          incompleteFields: 3,
        },
      })
    })
  })
})
