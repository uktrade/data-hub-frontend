import { assertSummaryTable } from '../../support/assertions'
import { investments } from '../../../../../src/lib/urls'
import { eybLeadFaker } from '../../fakers/eyb-leads'

const urls = require('../../../../../src/lib/urls')

const setup = (eybLead) => {
  cy.intercept('GET', `/api-proxy/v4/investment-lead/eyb/${eybLead.id}`, {
    statusCode: 200,
    body: eybLead,
  }).as('getEYBLeadDetails')
}

describe('EYB lead details', () => {
  context('When viewing an EYB lead with all the details fields', () => {
    const eybLeadWithValues = eybLeadFaker({
      company: {
        name: 'Mars',
        id: 'fc752802-e454-4c7c-bbfd-4bdd84759b84',
      },
      value: true,
      sector: {
        name: 'Mining',
        id: 'a622c9d2-5f95-e211-a939-e4115bead28a',
      },
      triage_created: '2023-06-07T10:00:00Z',
      intent: [
        'Find people with specialist skills',
        'Set up a new distribution centre',
        'Other',
        'Onward sales and exports from the UK',
      ],
      hiring: '6-50',
      spend: '500000-1000000',
      is_high_value: true,
      full_name: 'Joe Bloggs',
      role: 'CEO',
      email: 'email@example.com',
      telephone_number: '01234567890',
      landing_timeframe: 'In the next 6 months',
      company_website: 'fake.website.com',
    })
    beforeEach(() => {
      setup(eybLeadWithValues)
      cy.visit(investments.eybLeads.details(eybLeadWithValues.id))
      cy.wait('@getEYBLeadDetails')
    })

    it('should render all the fields of the details table', () => {
      assertSummaryTable({
        dataTest: 'eyb-lead-details-table',
        // prettier-ignore
        content: {
          'Company name': eybLeadWithValues.company.name,
          'Value': 'High value',
          'Sector or industry': eybLeadWithValues.sector.name,
          'Location of company headquarters': 'Canada',
          'Submitted to EYB': '07 Jun 2023',
          'Company website address':
            eybLeadWithValues.company_website + ' (opens in new tab)',
          'When do you want to set up?': eybLeadWithValues.landing_timeframe,
          'Do you know where you want to set up in the UK?': 'Yes',
          'Where do you want to set up in the UK?': 'Cardiff',
          'How do you plan to expand your business in the UK?':
            eybLeadWithValues.intent.join(''),
          'How many people do you want to hire in the UK in the first 3 years?':
            eybLeadWithValues.hiring,
          'How much do you want to spend on setting up in the first 3 years?':
            eybLeadWithValues.spend,
          'Full name': eybLeadWithValues.full_name,
          'Job title': eybLeadWithValues.role,
          'Phone number': eybLeadWithValues.telephone_number,
        },
      })
    })

    it('should render the company link within the table', () => {
      cy.get('[data-test="company-link"]')
        .should('exist')
        .should('have.text', eybLeadWithValues.company.name)
        .should(
          'have.attr',
          'href',
          urls.companies.overview.index('fc752802-e454-4c7c-bbfd-4bdd84759b84')
        )
    })
  })
})
