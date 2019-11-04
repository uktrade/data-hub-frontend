const companyProfile = require('~/test/unit/data/companies/investments/large-capital-profile-new.json')
const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const config = require('~/src/config')

const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const controller = require('~/src/apps/companies/apps/investments/large-capital-profile/controllers')

describe('Company Investments - Large capital profile', () => {
  describe('renderProfile', () => {
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

      const newUneditedProfile = {
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
          assetClasses: {
            energyAndInfrastructure: {
              value: [],
            },
            realEstate: {
              value: [],
            },
          },
          investmentTypes: {
            value: [],
          },
          minimumReturnRate: {
            text: null,
            value: null,
          },
          timeHorizons: {
            value: [],
          },
          restrictions: {
            value: [],
          },
          constructionRisks: {
            value: [],
          },
          minimumEquityPercentage: {
            text: null,
            value: null,
          },
          desiredDealRoles: {
            value: [],
          },
        },
        location: {
          incompleteFields: 3,
          notes_on_locations: '',
          uk_region_locations: {
            value: [],
          },
          other_countries_being_considered: {
            value: [],
          },
        },
      }

      it('should call the render function once', () => {
        expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('should call the render function and pass the view', () => {
        const view = 'companies/apps/investments/large-capital-profile/views/profile'
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(view)
      })

      it('should call the render function and pass the profile', () => {
        expect(this.middlewareParameters.resMock.render.args[0][1].profile).to.deep.equal(newUneditedProfile)
      })
    })
  })
})
