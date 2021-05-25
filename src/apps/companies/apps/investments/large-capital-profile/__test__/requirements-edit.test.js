const dealTicketSize = require('../../../../../../../test/unit/data/companies/investments/metadata/deal-ticket-size.json')
const assetClassInterest = require('../../../../../../../test/unit/data/companies/investments/metadata/asset-class-interest.json')
const investmentType = require('../../../../../../../test/unit/data/companies/investments/metadata/investment-type.json')
const minimumReturnRate = require('../../../../../../../test/unit/data/companies/investments/metadata/minimum-return-rate.json')
const timeHorizons = require('../../../../../../../test/unit/data/companies/investments/metadata/time-horizon.json')
const restrictions = require('../../../../../../../test/unit/data/companies/investments/metadata/restrictions.json')
const constructionRisk = require('../../../../../../../test/unit/data/companies/investments/metadata/construction-risk.json')
const minimumEquityPercentage = require('../../../../../../../test/unit/data/companies/investments/metadata/minimum-equity-percentage.json')
const desiredDealRole = require('../../../../../../../test/unit/data/companies/investments/metadata/desired-deal-role.json')
const companyProfile = require('../../../../../../../test/unit/data/companies/investments/large-capital-profile-new.json')
const companyMock = require('../../../../../../../test/unit/data/companies/minimal-company.json')
const { cloneDeep } = require('lodash')
const config = require('../../../../../../config')

const controller = require('../controllers')
const buildMiddlewareParameters = require('../../../../../../../test/unit/helpers/middleware-parameters-builder')

describe('Company Investments - Large capital profile - Investor requirements', () => {
  describe('renderProfile', () => {
    context(
      'when the user is editing the "Investor requirements" section',
      () => {
        beforeEach(async () => {
          const clonedCompanyProfile = cloneDeep(companyProfile)
          const profile = clonedCompanyProfile.results[0]

          profile.deal_ticket_sizes = [
            {
              name: 'Up to £49 million',
              id: '56492c50-aa12-404d-a14e-1eaae24ac6ee',
            },
            {
              name: '£1 billion +',
              id: '5e7601b5-becd-42ea-b885-1bbd88b85e4b',
            },
          ]

          profile.investment_types = [
            {
              id: '06834da2-c9ac-4faf-b555-39762ce373ae',
              name: 'Direct Investment in Project Debt',
            },
          ]

          profile.time_horizons = [
            {
              id: 'd2d1bdbb-c42a-459c-adaa-fce45ce08cc9',
              name: 'Up to 5 years',
            },
          ]

          profile.minimum_equity_percentage = {
            id: 'f7b72f8b-399e-43b2-b7ef-f42a154ef916',
            name: '1-19%',
          }

          nock(config.apiRoot)
            .get(
              `/v4/large-investor-profile?investor_company_id=${companyMock.id}`
            )
            .reply(200, clonedCompanyProfile)
            .get('/v4/metadata/capital-investment/deal-ticket-size')
            .reply(200, dealTicketSize)
            .get('/v4/metadata/capital-investment/asset-class-interest')
            .reply(200, assetClassInterest)
            .get(
              '/v4/metadata/capital-investment/large-capital-investment-type'
            )
            .reply(200, investmentType)
            .get('/v4/metadata/capital-investment/return-rate')
            .reply(200, minimumReturnRate)
            .get('/v4/metadata/capital-investment/time-horizon')
            .reply(200, timeHorizons)
            .get('/v4/metadata/capital-investment/restriction')
            .reply(200, restrictions)
            .get('/v4/metadata/capital-investment/construction-risk')
            .reply(200, constructionRisk)
            .get('/v4/metadata/capital-investment/equity-percentage')
            .reply(200, minimumEquityPercentage)
            .get('/v4/metadata/capital-investment/desired-deal-role')
            .reply(200, desiredDealRole)

          this.middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            requestQuery: {
              editing: 'investor-requirements',
            },
          })

          await controller.renderProfile(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        const profile = {
          editing: 'investor-requirements',
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
              value: [
                {
                  name: 'Up to £49 million',
                  id: '56492c50-aa12-404d-a14e-1eaae24ac6ee',
                },
                {
                  name: '£1 billion +',
                  id: '5e7601b5-becd-42ea-b885-1bbd88b85e4b',
                },
              ],
              items: [
                {
                  checked: true,
                  text: 'Up to £49 million',
                  value: '56492c50-aa12-404d-a14e-1eaae24ac6ee',
                },
                {
                  text: '£50-99 million',
                  value: '54df4ffb-5787-49b8-a7d2-ba33040fa32f',
                },
                {
                  text: '£100-249 million',
                  value: '359f4183-5617-47a9-a2ac-39e2c60d5088',
                },
                {
                  text: '£250-499 million',
                  value: 'e5ae2715-aa2c-4aa2-b047-f247625322a3',
                },
                {
                  text: '£500-999 million',
                  value: '01eb55d6-167f-4c2f-b482-b0356605d3e1',
                },
                {
                  checked: true,
                  text: '£1 billion +',
                  value: '5e7601b5-becd-42ea-b885-1bbd88b85e4b',
                },
              ],
            },
            assetClasses: {
              energyAndInfrastructure: {
                items: [
                  {
                    text: 'Biofuel',
                    value: '66507830-595d-432e-8521-9daf11785265',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Biomass',
                    value: 'f2b6c1a7-4d4f-4fd9-884b-5e1f5b3525be',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Direct heating',
                    value: 'bfab8ff2-e9bb-4fc8-b36c-5adddf8286b0',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Energy from waste',
                    value: '7fe8bde8-72ef-45ac-8c2d-4627023514b4',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Energy storage',
                    value: 'f5a134fa-968f-4723-9255-9450d8f98869',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Gas fired power',
                    value: '0ec0c3b8-6b79-40ae-945a-1a0e1b9a9c46',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Nuclear',
                    value: '9e619e8d-af51-4abf-a83a-5c139851de82',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Regulated assets',
                    value: 'c50686e4-9700-4a9b-8ea9-3dac53c934ac',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Smart energy',
                    value: '51d4f291-15ab-441f-b9e5-82b46a1ba145',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Solar power',
                    value: '87d5c012-9f06-49ce-b2a7-a15d4943a976',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Transport',
                    value: '096772cb-bd14-4bdf-bd5a-5b430e651048',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Wave and tidal',
                    value: 'ea41c626-5464-484e-81a3-05906917aad6',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Windpower (offshore)',
                    value: '07046d37-60bc-4db4-942c-56c5cd31c3e1',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Windpower (onshore)',
                    value: 'f081c413-0c01-4fc2-9061-3203041c71e2',
                    sector: 'Energy and infrastructure',
                  },
                  {
                    text: 'Upstream oil and gas',
                    value: 'ce528446-a24d-4f05-b3b8-a033cf5d4720',
                    sector: 'Energy and infrastructure',
                  },
                ],
                value: [],
              },
              realEstate: {
                items: [
                  {
                    sector: 'Real estate',
                    text: 'Advanced manufacturing',
                    value: '0fbceb4c-860a-4d1c-9c51-1da6997ba5fd',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Commerical led',
                    value: 'a8818051-1618-466d-b2b8-7a4992dcd923',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Data centre',
                    value: 'f84e9340-d975-453e-895b-c63d388b1bf5',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Garden cities',
                    value: '7df7000e-afd1-4301-8d65-7ab7d8d64fea',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Hotel',
                    value: 'b4516edf-c151-47d6-9c12-1c2185cacff0',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Lesuire',
                    value: '1536f225-f755-44d1-8bdd-e89a1964966b',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Life sciences',
                    value: '38c8d05c-2899-4433-a15c-6598d76dd69b',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Logistics',
                    value: '55bec24e-e107-4bae-9869-9a470dbe1cd7',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Mixed use',
                    value: '2fcf4687-724b-44af-b6df-65a9cc6e037c',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Private rented sector',
                    value: '814f4c5b-854b-48f8-80f3-5bd070f9f97e',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Regeneration',
                    value: '2c2c0d6d-6a10-44fc-bdab-e6a0484394a5',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Research and development',
                    value: 'a865f307-2f73-43a2-8039-2b906237406c',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Residential led',
                    value: '1eae0983-7c94-4d3a-8888-40c84a9ae092',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Retail',
                    value: '17755b4f-0aee-4675-baf5-5e592bd89c7d',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Smart cities',
                    value: 'e0d2d653-dba4-4be9-9fb8-b91a8fcdbe9e',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Student housing',
                    value: '3b95756d-a905-4abc-81f6-398fe6dc029d',
                  },
                  {
                    sector: 'Real estate',
                    text: 'Transport hub / rail',
                    value: 'f86ca55d-4512-4b71-a6fd-60ddc6c3bafe',
                  },
                ],
                value: [],
              },
            },
            investmentTypes: {
              items: [
                {
                  text: 'Direct Investment in Corporate Debt',
                  value: 'f972c0d9-f480-4727-af39-dff10cf935a9',
                },
                {
                  text: 'Direct Investment in Corporate Equity',
                  value: '942726e3-1b3f-4218-b06e-7cf983754de0',
                },
                {
                  checked: true,
                  text: 'Direct Investment in Project Debt',
                  value: '06834da2-c9ac-4faf-b555-39762ce373ae',
                },
                {
                  text: 'Direct Investment in Project Equity',
                  value: '4170d99a-02fc-46ee-8fd4-3fe786717708',
                },
                {
                  text: 'Energy / Infrastructure / Real Estate Funds (UKEIREFs)',
                  value: '24826b7c-e3df-4a76-80d4-4fe2661b838e',
                },
                {
                  text: 'Mezzanine Debt (incl. preferred shares, convertibles)',
                  value: '703140ec-6990-4f36-8b22-52ebde63932c',
                },
                {
                  text: 'Private Equity / Venture Capital',
                  value: 'ef615dde-49d8-41dd-9ddd-a00c78004135',
                },
                {
                  text: 'Venture capital funds',
                  value: '8feb6087-d61c-43bd-9bf1-3d9e1129432b',
                },
              ],
              value: [
                {
                  id: '06834da2-c9ac-4faf-b555-39762ce373ae',
                  name: 'Direct Investment in Project Debt',
                },
              ],
            },
            minimumReturnRate: {
              items: [
                {
                  text: 'Up to 5% IRR',
                  value: '6fec56ba-0be9-4931-bd76-16e11924ec55',
                },
                {
                  text: '5-10%',
                  value: '65c9bc7a-af68-4549-a9c9-70cd73109617',
                },
                {
                  text: '10-15%',
                  value: '6ecbd7d2-e16a-4bfd-a4b9-8c9bca947302',
                },
                {
                  text: '15%',
                  value: '0c55bd5c-82ea-4400-b7fc-7344958ee3a5',
                },
              ],
              text: null,
              value: null,
            },
            timeHorizons: {
              items: [
                {
                  checked: true,
                  text: 'Up to 5 years',
                  value: 'd2d1bdbb-c42a-459c-adaa-fce45ce08cc9',
                },
                {
                  text: '5-9 years',
                  value: 'd186343f-ed66-47e4-9ab0-258f583ff3cb',
                },
                {
                  text: '10-14 years',
                  value: '29a0a8e9-1c21-432a-bb4f-b9363b46a6aa',
                },
                {
                  text: '15 years +',
                  value: 'c4579a5e-4588-4952-a974-e03475a3f559',
                },
              ],
              value: [
                {
                  name: 'Up to 5 years',
                  id: 'd2d1bdbb-c42a-459c-adaa-fce45ce08cc9',
                },
              ],
            },
            restrictions: {
              items: [
                {
                  text: 'Liquidity / exchange listing',
                  value: '5b4f5dc5-c836-4572-afd2-013776ed00c5',
                },
                {
                  text: 'Inflation adjustment',
                  value: 'daa293d4-e18e-44af-b139-bd1b4c4a9067',
                },
                {
                  text: 'Require FX hedge',
                  value: '24d90807-91de-4814-92f6-0a5ee43406d1',
                },
                {
                  text: 'Require board seat',
                  value: '7dad0891-9174-437d-bb30-b610ac1ecd0a',
                },
                {
                  text: 'Require linked technology / knowledge transfer',
                  value: 'bfa167ab-f98a-4c73-b34d-c34ba7bdf93b',
                },
                {
                  text: 'Will participate in competitive bids / auctions',
                  value: 'dbc0cdf0-5365-4cbf-8d55-7516b6ebc383',
                },
              ],
              value: [],
            },
            constructionRisks: {
              items: [
                {
                  text: 'Greenfield (construction risk)',
                  value: '79cc3963-9376-4771-9cba-c1b3cc0ade33',
                },
                {
                  text: 'Brownfield (some construction risk)',
                  value: '884deaf6-cb0c-4036-b78c-efd92cb10098',
                },
                {
                  text: 'Operational (no construction risk)',
                  value: '9f554b26-70f2-4cac-89ae-758c2ef71c70',
                },
              ],
              value: [],
            },
            minimumEquityPercentage: {
              items: [
                {
                  text: '0% - Not required',
                  value: '414a13f7-1b6f-4071-a6d3-d22ed64f4612',
                },
                {
                  checked: true,
                  text: '1-19%',
                  value: 'f7b72f8b-399e-43b2-b7ef-f42a154ef916',
                },
                {
                  text: '20-49%',
                  value: 'ec061f70-b287-41cf-aaf4-620aec79616b',
                },
                {
                  text: '50% +',
                  value: '488bf5ad-4c8e-4e6b-b339-182f291dcd76',
                },
              ],
              text: '1-19%',
              value: 'f7b72f8b-399e-43b2-b7ef-f42a154ef916',
            },
            desiredDealRoles: {
              items: [
                {
                  text: 'Lead manager / deal structure',
                  value: 'efadc6bb-2a73-4627-8ce3-9dc2c34c3f31',
                },
                {
                  text: 'Co-lead manager',
                  value: '29d930e6-de2f-403d-87dc-764bc418d33a',
                },
                {
                  text: 'Co-investor / syndicate member',
                  value: '48cace6e-ec14-467b-b1b5-19b318ab5c51',
                },
              ],
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
          expect(this.middlewareParameters.resMock.render).to.have.been
            .calledOnce
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
      }
    )
  })
})
