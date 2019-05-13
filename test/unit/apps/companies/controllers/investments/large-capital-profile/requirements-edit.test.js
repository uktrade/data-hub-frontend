const dealTicketSize = require('~/test/unit/data/companies/investments/metadata/deal-ticket-size.json')
const companyProfile = require('~/test/unit/data/companies/investments/large-capital-profile.json')
const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const { cloneDeep } = require('lodash')
const config = require('~/config')

const controller = require('~/src/apps/companies/apps/investments/large-capital-profile/controllers')

describe('Company Investments - Large capital profile - Investor requirements', () => {
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

        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, clonedCompanyProfile)
          .get('/metadata/capital-investment/deal-ticket-size/')
          .reply(200, dealTicketSize)

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

      commonTests({
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
        },
        location: {
          incompleteFields: 3,
        },
      })
    })
  })
})
