const companyProfile = require('~/test/unit/data/companies/investments/large-capital-profile-new.json')
const company = require('~/test/unit/data/companies/minimal-company.json')
const ukRegion = require('~/test/unit/data/companies/investments/metadata/uk-region.json')

const { cloneDeep } = require('lodash')
const config = require('~/config')

const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const controller = require('~/src/apps/companies/apps/investments/large-capital-profile/controllers')

describe('Company Investments - Large capital profile - Investor details', () => {
  describe('renderProfile', () => {
    context('when the user is editing the "Location" section', () => {
      beforeEach(async () => {
        const clonedCompanyProfile = cloneDeep(companyProfile)

        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${company.id}`)
          .reply(200, clonedCompanyProfile)
          .get('/metadata/uk-region/')
          .reply(200, ukRegion)

        this.middlewareParameters = buildMiddlewareParameters({
          company,
          requestQuery: {
            editing: 'location',
          },
        })

        await controller.renderProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      const profile = {
        editing: 'location',
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
            items: [
              {
                label: 'All',
                value: '1718e330-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'East Midlands',
                value: '844cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'East of England',
                value: '864cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'London',
                value: '874cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'North East',
                value: '814cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'North West',
                value: '824cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'Northern Ireland',
                value: '8e4cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'Scotland',
                value: '8c4cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'South East',
                value: '884cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'South West',
                value: '894cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'UKTI Dubai Hub',
                value: 'e1dd40e9-3dfd-e311-8a2b-e4115bead28a',
              },
              {
                label: 'Wales',
                value: '8d4cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'West Midlands',
                value: '854cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                label: 'Yorkshire and The Humber',
                value: '834cd12a-6095-e211-a939-e4115bead28a',
              },
            ],
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
        expect(this.middlewareParameters.resMock.render.args[0][1].profile).to.deep.equal(profile)
      })
    })
  })
})
