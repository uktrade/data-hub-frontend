const completedProfile = require('../../../../../../../../test/unit/data/companies/investments/large-capital-profile-completed.json')
const companyMock = require('../../../../../../../../test/unit/data/companies/minimal-company.json')
const config = require('../../../../../../../config')

const buildMiddlewareParameters = require('../../../../../../../../test/unit/helpers/middleware-parameters-builder')
const controller = require('../../controllers')

describe('Company Investments - Large capital profile', () => {
  describe('renderProfile', () => {
    context('when the company has a complete profile', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(
            `/v4/large-investor-profile?investor_company_id=${companyMock.id}`
          )
          .reply(200, completedProfile)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await controller.renderProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      const profile = {
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
          incompleteFields: 4,
          dealTicketSizes: {
            value: [
              {
                name: '£1 billion +',
                id: '5e7601b5-becd-42ea-b885-1bbd88b85e4b',
              },
            ],
          },
          assetClasses: {
            energyAndInfrastructure: {
              value: [
                {
                  name: 'Biomass',
                  id: 'f2b6c1a7-4d4f-4fd9-884b-5e1f5b3525be',
                },
                {
                  name: 'Direct heating',
                  id: 'bfab8ff2-e9bb-4fc8-b36c-5adddf8286b0',
                },
                {
                  id: '0fbceb4c-860a-4d1c-9c51-1da6997ba5fd',
                  name: 'Advanced manufacturing',
                },
                {
                  id: 'a8818051-1618-466d-b2b8-7a4992dcd923',
                  name: 'Commerical led',
                },
              ],
            },
            realEstate: {
              value: [
                {
                  id: 'f2b6c1a7-4d4f-4fd9-884b-5e1f5b3525be',
                  name: 'Biomass',
                },
                {
                  id: 'bfab8ff2-e9bb-4fc8-b36c-5adddf8286b0',
                  name: 'Direct heating',
                },
                {
                  id: '0fbceb4c-860a-4d1c-9c51-1da6997ba5fd',
                  name: 'Advanced manufacturing',
                },
                {
                  id: 'a8818051-1618-466d-b2b8-7a4992dcd923',
                  name: 'Commerical led',
                },
              ],
            },
          },
          investmentTypes: {
            value: [
              {
                name: 'Direct Investment in Project Equity',
                id: '4170d99a-02fc-46ee-8fd4-3fe786717708',
              },
            ],
          },
          minimumReturnRate: {
            text: '5-10%',
            value: '65c9bc7a-af68-4549-a9c9-70cd73109617',
          },
          timeHorizons: {
            value: [
              {
                id: '29a0a8e9-1c21-432a-bb4f-b9363b46a6aa',
                name: '10-14 years',
              },
            ],
          },
          restrictions: {
            value: [
              {
                id: '24d90807-91de-4814-92f6-0a5ee43406d1',
                name: 'Require FX hedge',
              },
            ],
          },
          constructionRisks: {
            value: [
              {
                id: '884deaf6-cb0c-4036-b78c-efd92cb10098',
                name: 'Brownfield (some construction risk)',
              },
            ],
          },
          minimumEquityPercentage: {
            text: '20-49%',
            value: 'ec061f70-b287-41cf-aaf4-620aec79616b',
          },
          desiredDealRoles: {
            value: [
              {
                id: '48cace6e-ec14-467b-b1b5-19b318ab5c51',
                name: 'Co-investor / syndicate member',
              },
            ],
          },
        },
        location: {
          incompleteFields: 0,
          notes_on_locations: 'They are super keen on the Midlands Engine',
          uk_region_locations: {
            value: [
              {
                name: 'East of England',
                id: '864cd12a-6095-e211-a939-e4115bead28a',
              },
              {
                name: 'London',
                id: '874cd12a-6095-e211-a939-e4115bead28a',
              },
            ],
          },
          other_countries_being_considered: {
            value: [
              {
                name: 'Japan',
                id: '85756b9a-5d95-e211-a939-e4115bead28a',
              },
            ],
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
