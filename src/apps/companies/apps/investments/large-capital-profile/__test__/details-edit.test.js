const investorTypeTransformed = require('../../../../../../../test/unit/data/companies/investments/metadata/investor-type-transformed.json')
const requiredChecksConducted = require('../../../../../../../test/unit/data/companies/investments/metadata/required-checks-conducted.json')
const companyProfile = require('../../../../../../../test/unit/data/companies/investments/large-capital-profile-new.json')
const investorType = require('../../../../../../../test/unit/data/companies/investments/metadata/investor-type.json')
const company = require('../../../../../../../test/unit/data/companies/minimal-company.json')
const advisers = require('../../../../../../../test/unit/data/advisers/advisers.json')
const { cloneDeep } = require('lodash')
const config = require('../../../../../../config')

const buildMiddlewareParameters = require('../../../../../../../test/unit/helpers/middleware-parameters-builder')
const controller = require('../controllers')

describe('Company Investments - Large capital profile - Investor details', () => {
  describe('renderProfile', () => {
    context('when the user is editing the "Investor details" section', () => {
      beforeEach(async () => {
        const clonedCompanyProfile = cloneDeep(companyProfile)
        const profile = clonedCompanyProfile.results[0]

        // Preselect the 'Cleared' radio button
        profile.required_checks_conducted = {
          name: 'Cleared',
          id: '02d6fc9b-fbb9-4621-b247-d86f2487898e',
        }

        // Define a date the Adviser conducted the checks on.
        profile.required_checks_conducted_on = '2019-05-02'

        //  Define the adviser.
        profile.required_checks_conducted_by = {
          name: 'Holly Collins',
          id: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
        }

        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${company.id}`)
          .reply(200, clonedCompanyProfile)
          .get('/v4/metadata/capital-investment/investor-type')
          .reply(200, investorType)
          .get('/v4/metadata/capital-investment/required-checks-conducted')
          .reply(200, requiredChecksConducted)
          .get('/adviser/?limit=100000&offset=0')
          .reply(200, advisers)

        this.middlewareParameters = buildMiddlewareParameters({
          company,
          requestQuery: {
            editing: 'investor-details',
          },
        })

        await controller.renderProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      const profile = {
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
            cleared: {
              checked: true,
              text: 'Cleared',
              adviser: {
                name: 'Holly Collins',
                id: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
              },
              advisers: [
                {
                  label: 'Jeff Smith',
                  subLabel: 'Team A',
                  value: 'a0dae366-1134-e411-985c-e4115bead28a',
                },
                {
                  label: 'Aaron Mr',
                  subLabel: 'Team B',
                  value: 'e13209b8-8d61-e311-8255-e4115bead28a',
                },
                {
                  label: 'Mr Benjamin',
                  subLabel: 'Team C',
                  value: 'b9d6b3dc-7af4-e411-bcbe-e4115bead28a',
                },
                {
                  label: 'George Chan',
                  subLabel: 'Team D',
                  value: '0119a99e-9798-e211-a939-e4115bead28a',
                },
                {
                  label: 'Fred Rafters',
                  subLabel: 'Team E',
                  value: '0919a99e-9798-e211-a939-e4115bead28a',
                },
              ],
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
              advisers: [
                {
                  label: 'Jeff Smith',
                  subLabel: 'Team A',
                  value: 'a0dae366-1134-e411-985c-e4115bead28a',
                },
                {
                  label: 'Aaron Mr',
                  subLabel: 'Team B',
                  value: 'e13209b8-8d61-e311-8255-e4115bead28a',
                },
                {
                  label: 'Mr Benjamin',
                  subLabel: 'Team C',
                  value: 'b9d6b3dc-7af4-e411-bcbe-e4115bead28a',
                },
                {
                  label: 'George Chan',
                  subLabel: 'Team D',
                  value: '0119a99e-9798-e211-a939-e4115bead28a',
                },
                {
                  label: 'Fred Rafters',
                  subLabel: 'Team E',
                  value: '0919a99e-9798-e211-a939-e4115bead28a',
                },
              ],
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
        const view =
          'companies/apps/investments/large-capital-profile/views/profile'
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(
          view
        )
      })

      it('should call the render function and pass the profile', () => {
        expect(
          this.middlewareParameters.resMock.render.args[0][1].profile
        ).to.deep.equal(profile)
      })
    })
  })
})
