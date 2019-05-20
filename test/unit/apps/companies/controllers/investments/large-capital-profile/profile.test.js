const noCompanyProfile = require('~/test/unit/data/companies/investments/large-capital-profile-empty.json')
const companyProfile = require('~/test/unit/data/companies/investments/large-capital-profile.json')
const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const { cloneDeep, pullAll } = require('lodash')
const config = require('~/config')

const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const controller = require('~/src/apps/companies/apps/investments/large-capital-profile/controllers')

describe('Company Investments - Large capital profile', () => {
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

    context('when the company does not have a profile', () => {
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
            adviser: null,
            date: null,
            type: null,
            value: null,
          },
        },
        investorRequirements: {
          incompleteFields: 9,
          dealTicketSizes: {
            value: [],
          },
          investmentTypes: {
            value: [],
          },
          timeHorizons: {
            value: [],
          },
          restrictions: {
            value: [],
          },
        },
        location: {
          incompleteFields: 3,
        },
      })
    })

    context('when the company has a complete profile', () => {
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
        profile.required_checks_conducted = {
          name: 'Cleared',
          id: '02d6fc9b-fbb9-4621-b247-d86f2487898e',
        }
        profile.required_checks_conducted_by = {
          name: 'Holly Collins',
          id: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
        }
        profile.required_checks_conducted_on = '2019-04-29'

        profile.deal_ticket_sizes = [ {
          name: '£1 billion +',
          id: '5e7601b5-becd-42ea-b885-1bbd88b85e4b',
        }]

        profile.investment_types = [{
          name: 'Direct Investment in Project Equity',
          id: '4170d99a-02fc-46ee-8fd4-3fe786717708',
        }]

        profile.time_horizons = [{
          id: '29a0a8e9-1c21-432a-bb4f-b9363b46a6aa',
          name: '10-14 years',
        }]

        profile.restrictions = [{
          id: '24d90807-91de-4814-92f6-0a5ee43406d1',
          name: 'Require FX hedge',
        }]

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
            type: {
              id: '02d6fc9b-fbb9-4621-b247-d86f2487898e',
              name: 'Cleared',
            },
            date: '2019-04-29',
            adviser: {
              id: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
              name: 'Holly Collins',
            },
            value: [
              'Cleared',
              'Date of most recent background checks: 29 04 2019',
              'Person responsible for most recent background checks: Holly Collins',
            ],
          },
        },
        investorRequirements: {
          incompleteFields: 9,
          dealTicketSizes: {
            value: [ {
              name: '£1 billion +',
              id: '5e7601b5-becd-42ea-b885-1bbd88b85e4b',
            }],
          },
          investmentTypes: {
            value: [ {
              name: 'Direct Investment in Project Equity',
              id: '4170d99a-02fc-46ee-8fd4-3fe786717708',
            }],
          },
          timeHorizons: {
            value: [ {
              id: '29a0a8e9-1c21-432a-bb4f-b9363b46a6aa',
              name: '10-14 years',
            }],
          },
          restrictions: {
            value: [ {
              id: '24d90807-91de-4814-92f6-0a5ee43406d1',
              name: 'Require FX hedge',
            }],
          },
        },
        location: {
          incompleteFields: 3,
        },
      })
    })
  })
})
