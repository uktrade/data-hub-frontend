const investorTypeTransformed = require('~/test/unit/data/companies/investments/metadata/investor-type-transformed.json')
const noCompanyProfile = require('~/test/unit/data/companies/investments/large-capital-profile-empty.json')
const investorType = require('~/test/unit/data/companies/investments/metadata/investor-type.json')
const requiredChecksConducted = require('~/test/unit/data/companies/investments/metadata/required-checks-conducted.json')
const companyProfile = require('~/test/unit/data/companies/investments/large-capital-profile.json')
const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const { cloneDeep, pullAll } = require('lodash')
const config = require('~/config')

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
            text: null,
            value: null,
          },
          globalAssetsUnderManagement: {
            value: null,
          },
          investableCapital: {
            value: null,
          },
          investorDescription: {
            value: '',
          },
          requiredChecks: {
            conducted: null,
            conductedOn: null,
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
        const clonedCompanyProfile = cloneDeep(companyProfile)
        const profile = clonedCompanyProfile.results[0]

        // Preselect the 'Cleared' radio button
        profile.required_checks_conducted = {
          name: 'Cleared',
          id: '02d6fc9b-fbb9-4621-b247-d86f2487898e',
        }

        // Define a date the advisor conducted the checks on.
        profile.required_checks_conducted_on = '2019-05-02'

        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, clonedCompanyProfile)
          .get('/metadata/capital-investment/investor-type/')
          .reply(200, investorType)
          .get('/metadata/capital-investment/required-checks-conducted/')
          .reply(200, requiredChecksConducted)

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
            text: null,
            value: null,
            items: investorTypeTransformed,
          },
          globalAssetsUnderManagement: {
            value: null,
          },
          investableCapital: {
            value: null,
          },
          investorDescription: {
            value: '',
          },
          requiredChecks: {
            conducted: {
              id: '02d6fc9b-fbb9-4621-b247-d86f2487898e',
              name: 'Cleared',
            },
            conductedOn: '2019-05-02',
            cleared: {
              checked: true,
              text: 'Cleared',
              date: {
                day: 2,
                month: 5,
                year: 2019,
              },
              value: '02d6fc9b-fbb9-4621-b247-d86f2487898e',
            },
            issuesIdentified: {
              text: 'Issues identified',
              value: '9beab8fc-1094-49b4-97d0-37bc7a9de631',
            },
            notYetChecked: {
              text: 'Not yet checked',
              value: '81fafe5a-ed32-4f46-bdc5-2cafedf828e8',
            },
            notRequired: {
              text: 'Checks not required - See Investor Screening Report (ISR) guidance',
              value: 'e6f66f9d-ed12-4bfd-9dd0-ac7e44f35034',
            },
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

    context('when the user has previously saved all fields within "Investor details"', () => {
      beforeEach(async () => {
        const clonedCompanyProfile = cloneDeep(companyProfile)
        const profile = clonedCompanyProfile.results[0]

        pullAll(profile.incomplete_details_fields, [
          'investor_type',
          'global_assets_under_management',
          'investable_capital',
          'investor_description',
          'required_checks_conducted',
        ])

        profile.investor_type = {
          id: '80168d31-fa91-494e-9ad5-b9255e01b5da',
          name: 'Asset manager',
        }
        profile.global_assets_under_management = 1000
        profile.investable_capital = 2000
        profile.investor_description = 'Lorem ipsum dolor sit amet.'
        profile.required_checks_conducted = '02d6fc9b-fbb9-4621-b247-d86f2487898e'
        profile.required_checks_conducted_on = '2019-04-29'

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
          incompleteFields: 0,
          investorType: {
            text: 'Asset manager',
            value: '80168d31-fa91-494e-9ad5-b9255e01b5da',
          },
          globalAssetsUnderManagement: {
            value: 1000,
          },
          investableCapital: {
            value: 2000,
          },
          investorDescription: {
            value: 'Lorem ipsum dolor sit amet.',
          },
          requiredChecks: {
            conducted: '02d6fc9b-fbb9-4621-b247-d86f2487898e',
            conductedOn: '2019-04-29',
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
