const dealTicketSize = require('~/test/unit/data/companies/investments/metadata/deal-ticket-size.json')
const investmentType = require('~/test/unit/data/companies/investments/metadata/investment-type.json')
const timeHorizons = require('~/test/unit/data/companies/investments/metadata/time-horizon.json')
const restrictions = require('~/test/unit/data/companies/investments/metadata/restrictions.json')
const constructionRisk = require('~/test/unit/data/companies/investments/metadata/construction-risk.json')
const desiredDealRole = require('~/test/unit/data/companies/investments/metadata/desired-deal-role.json')
const companyProfile = require('~/test/unit/data/companies/investments/large-capital-profile-new.json')
const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const { cloneDeep } = require('lodash')
const config = require('~/config')

const controller = require('~/src/apps/companies/apps/investments/large-capital-profile/controllers')
const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

describe('Company Investments - Large capital profile - Investor requirements', () => {
  describe('renderProfile', () => {
    context('when the user is editing the "Investor requirements" section', () => {
      beforeEach(async () => {
        const clonedCompanyProfile = cloneDeep(companyProfile)
        const profile = clonedCompanyProfile.results[0]

        profile.deal_ticket_sizes = [{
          name: 'Up to £49 million',
          id: '56492c50-aa12-404d-a14e-1eaae24ac6ee',
        }, {
          name: '£1 billion +',
          id: '5e7601b5-becd-42ea-b885-1bbd88b85e4b',
        }]

        profile.investment_types = [{
          id: '06834da2-c9ac-4faf-b555-39762ce373ae',
          name: 'Direct Investment in Project Debt',
        }]

        profile.time_horizons = [{
          id: 'd2d1bdbb-c42a-459c-adaa-fce45ce08cc9',
          name: 'Up to 5 years',
        }]

        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, clonedCompanyProfile)
          .get('/metadata/capital-investment/deal-ticket-size/')
          .reply(200, dealTicketSize)
          .get('/metadata/capital-investment/large-capital-investment-type/')
          .reply(200, investmentType)
          .get('/metadata/capital-investment/time-horizon/')
          .reply(200, timeHorizons)
          .get('/metadata/capital-investment/restriction/')
          .reply(200, restrictions)
          .get('/metadata/capital-investment/construction-risk/')
          .reply(200, constructionRisk)
          .get('/metadata/capital-investment/desired-deal-role/')
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
          this.middlewareParameters.nextSpy,
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
            value: [{
              name: 'Up to £49 million',
              id: '56492c50-aa12-404d-a14e-1eaae24ac6ee',
            }, {
              name: '£1 billion +',
              id: '5e7601b5-becd-42ea-b885-1bbd88b85e4b',
            }],
            items: [ {
              checked: true,
              text: 'Up to £49 million',
              value: '56492c50-aa12-404d-a14e-1eaae24ac6ee',
            }, {
              text: '£50-99 million',
              value: '54df4ffb-5787-49b8-a7d2-ba33040fa32f',
            }, {
              text: '£100-249 million',
              value: '359f4183-5617-47a9-a2ac-39e2c60d5088',
            }, {
              text: '£250-499 million',
              value: 'e5ae2715-aa2c-4aa2-b047-f247625322a3',
            }, {
              text: '£500-999 million',
              value: '01eb55d6-167f-4c2f-b482-b0356605d3e1',
            }, {
              checked: true,
              text: '£1 billion +',
              value: '5e7601b5-becd-42ea-b885-1bbd88b85e4b',
            }],
          },
          investmentTypes: {
            items: [ {
              text: 'Direct Investment in Corporate Debt',
              value: 'f972c0d9-f480-4727-af39-dff10cf935a9',
            }, {
              text: 'Direct Investment in Corporate Equity',
              value: '942726e3-1b3f-4218-b06e-7cf983754de0',
            }, {
              checked: true,
              text: 'Direct Investment in Project Debt',
              value: '06834da2-c9ac-4faf-b555-39762ce373ae',
            }, {
              text: 'Direct Investment in Project Equity',
              value: '4170d99a-02fc-46ee-8fd4-3fe786717708',
            }, {
              text: 'Energy / Infrastructure / Real Estate Funds (UKEIREFs)',
              value: '24826b7c-e3df-4a76-80d4-4fe2661b838e',
            }, {
              text: 'Mezzanine Debt (incl. preferred shares, convertibles)',
              value: '703140ec-6990-4f36-8b22-52ebde63932c',
            }, {
              text: 'Private Equity / Venture Capital',
              value: 'ef615dde-49d8-41dd-9ddd-a00c78004135',
            }, {
              text: 'Venture capital funds',
              value: '8feb6087-d61c-43bd-9bf1-3d9e1129432b',
            } ],
            value: [{
              id: '06834da2-c9ac-4faf-b555-39762ce373ae',
              name: 'Direct Investment in Project Debt',
            }],
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
            value: [{
              name: 'Up to 5 years',
              id: 'd2d1bdbb-c42a-459c-adaa-fce45ce08cc9',
            }],
          },
          restrictions: {
            items: [{
              text: 'Liquidity / exchange listing',
              value: '5b4f5dc5-c836-4572-afd2-013776ed00c5',
            }, {
              text: 'Inflation adjustment',
              value: 'daa293d4-e18e-44af-b139-bd1b4c4a9067',
            }, {
              text: 'Require FX hedge',
              value: '24d90807-91de-4814-92f6-0a5ee43406d1',
            }, {
              text: 'Require board seat',
              value: '7dad0891-9174-437d-bb30-b610ac1ecd0a',
            }, {
              text: 'Require linked technology / knowledge transfer',
              value: 'bfa167ab-f98a-4c73-b34d-c34ba7bdf93b',
            }, {
              text: 'Will participate in competitive bids / auctions',
              value: 'dbc0cdf0-5365-4cbf-8d55-7516b6ebc383',
            }],
            value: [],
          },
          constructionRisks: {
            items: [{
              text: 'Greenfield (construction risk)',
              value: '79cc3963-9376-4771-9cba-c1b3cc0ade33',
            }, {
              text: 'Brownfield (some construction risk)',
              value: '884deaf6-cb0c-4036-b78c-efd92cb10098',
            }, {
              text: 'Operational (no construction risk)',
              value: '9f554b26-70f2-4cac-89ae-758c2ef71c70',
            }],
            value: [],
          },
          desiredDealRoles: {
            items: [{
              text: 'Lead manager / deal structure',
              value: 'efadc6bb-2a73-4627-8ce3-9dc2c34c3f31',
            }, {
              text: 'Co-lead manager',
              value: '29d930e6-de2f-403d-87dc-764bc418d33a',
            }, {
              text: 'Co-investor / syndicate member',
              value: '48cace6e-ec14-467b-b1b5-19b318ab5c51',
            }],
            value: [],
          },
        },
        location: {
          incompleteFields: 3,
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
