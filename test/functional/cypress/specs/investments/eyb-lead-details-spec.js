import {
  assertSummaryTable,
  assertLeadBreadcrumbs,
} from '../../support/assertions'
import { investments } from '../../../../../src/lib/urls'
import { convertEYBChoicesToLabels } from '../../../../../src/client/modules/Investments/utils'
import { eybLeadFaker } from '../../fakers/eyb-leads'
import { NOT_SET_TEXT } from '../../../../../src/apps/companies/constants'
import { VALUES_VALUE_TO_LABEL_MAP } from '../../../../../src/client/modules/Investments/EYBLeads/constants'

const selectors = require('../../../../selectors/index')
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
        'FIND_PEOPLE_WITH_SPECIALIST_SKILLS',
        'SET_UP_A_NEW_DISTRIBUTION_CENTRE',
        'OTHER',
        'ONWARD_SALES_AND_EXPORTS_FROM_THE_UK',
      ],
      hiring: '6 to 50',
      spend: '£500,000 to £1 million',
      is_high_value: true,
      full_name: 'Joe Bloggs',
      role: 'CEO',
      email: 'email@example.com',
      telephone_number: '01234567890',
      landing_timeframe: 'UNDER_SIX_MONTHS',
      company_website: 'fake.website.com',
      investment_projects: [],
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
          'When do you want to set up?': convertEYBChoicesToLabels(eybLeadWithValues.landing_timeframe),
          'Do you know where you want to set up in the UK?': 'Yes',
          'Where do you want to set up in the UK?': 'Cardiff',
          'How do you plan to expand your business in the UK?':
          convertEYBChoicesToLabels(eybLeadWithValues.intent).join(''),
          'How many people do you want to hire in the UK in the first 3 years?':
            eybLeadWithValues.hiring,
          'How much do you want to spend on setting up in the first 3 years?':
            eybLeadWithValues.spend,
          'Full name': eybLeadWithValues.full_name,
          'Job title': eybLeadWithValues.role,
          'Phone number': eybLeadWithValues.telephone_number,
          'Email': eybLeadWithValues.email,
        },
      })
    })

    it('should render the company overview link within the table', () => {
      cy.get('[data-test="company-link"]')
        .should('exist')
        .should('have.text', eybLeadWithValues.company.name)
        .should(
          'have.attr',
          'href',
          urls.companies.overview.index('fc752802-e454-4c7c-bbfd-4bdd84759b84')
        )
    })

    it('should render the company website link within the table', () => {
      cy.get('[data-test="website-link"]')
        .should('exist')
        .should(
          'have.text',
          eybLeadWithValues.company_website + ' (opens in new tab)'
        )
        .should('have.attr', 'href', '//' + eybLeadWithValues.company_website)
    })

    it('should render the superheading', () => {
      cy.get('[data-test="superheading"]')
        .should('exist')
        .should('have.text', 'EYB lead')
    })

    it('should render the heading', () => {
      cy.get('[data-test="heading"]')
        .should('exist')
        .should('have.text', eybLeadWithValues.company.name)
    })

    it('should render the breadcrumbs', () => {
      assertLeadBreadcrumbs({
        leadType: 'EYB leads',
        leadDetailsUrl: urls.investments.eybLeads.index(),
        leadName: eybLeadWithValues.company.name,
      })
    })

    it('should not render the header notification banner', () => {
      cy.get('[data-test="status-message-header"]').should('not.exist')
    })

    it('should render the `Add investment project` button', () => {
      cy.get('[data-test="button-add-investment-project"]')
        .should('exist')
        .should('have.text', 'Add investment project')
        .should(
          'have.attr',
          'href',
          `/investments/projects/create/${eybLeadWithValues.company.id}?eyb-lead-id=${eybLeadWithValues.id}`
        )
    })
  })

  context('When viewing an EYB lead without a company associated to it', () => {
    const eybLeadWithoutCompany = eybLeadFaker({
      company: null,
      value: true,
      sector: null,
      triage_created: '2023-06-07T10:00:00Z',
      intent: [
        'FIND_PEOPLE_WITH_SPECIALIST_SKILLS',
        'SET_UP_A_NEW_DISTRIBUTION_CENTRE',
        'OTHER',
        'ONWARD_SALES_AND_EXPORTS_FROM_THE_UK',
      ],
      hiring: '6 to 50',
      spend: '£500,000 to £1 million',
      is_high_value: true,
      full_name: 'Joe Bloggs',
      role: 'CEO',
      email: 'email@example.com',
      telephone_number: '01234567890',
      landing_timeframe: 'UNDER_SIX_MONTHS',
      company_website: null,
      company_name: 'Mars Temp',
      investment_projects: [],
    })
    beforeEach(() => {
      setup(eybLeadWithoutCompany)
      cy.visit(investments.eybLeads.details(eybLeadWithoutCompany.id))
      cy.wait('@getEYBLeadDetails')
    })

    it('should render all the fields of the details table', () => {
      assertSummaryTable({
        dataTest: 'eyb-lead-details-table',
        // prettier-ignore
        content: {
          'Company name': eybLeadWithoutCompany.company_name,
          'Value': 'High value',
          'Sector or industry': NOT_SET_TEXT,
          'Location of company headquarters': 'Canada',
          'Submitted to EYB': '07 Jun 2023',
          'Company website address': NOT_SET_TEXT,
          'When do you want to set up?': convertEYBChoicesToLabels(eybLeadWithoutCompany.landing_timeframe),
          'Do you know where you want to set up in the UK?': 'Yes',
          'Where do you want to set up in the UK?': 'Cardiff',
          'How do you plan to expand your business in the UK?':
          convertEYBChoicesToLabels(eybLeadWithoutCompany.intent).join(''),
          'How many people do you want to hire in the UK in the first 3 years?':
            eybLeadWithoutCompany.hiring,
          'How much do you want to spend on setting up in the first 3 years?':
            eybLeadWithoutCompany.spend,
          'Full name': eybLeadWithoutCompany.full_name,
          'Job title': eybLeadWithoutCompany.role,
          'Phone number': eybLeadWithoutCompany.telephone_number,
          'Email': eybLeadWithoutCompany.email,
        },
      })
    })

    it('should not show the company website link within the table', () => {
      cy.get('[data-test="website-link"]').should('not.exist')
    })

    it('should use backup name on the heading', () => {
      cy.get('[data-test="heading"]')
        .should('exist')
        .should('have.text', eybLeadWithoutCompany.company_name)
    })

    it('should render the breadcrumbs', () => {
      assertLeadBreadcrumbs({
        leadType: 'EYB leads',
        leadDetailsUrl: urls.investments.eybLeads.index(),
        leadName: eybLeadWithoutCompany.company_name,
      })
    })

    it('should not render the header notification banner', () => {
      cy.get('[data-test="status-message-header"]').should('not.exist')
    })

    it('should not render the `Add investment project` button', () => {
      cy.get('[data-test="button-add-investment-project"]').should('not.exist')
    })
  })

  context(
    'When viewing an EYB lead with company and investment projects associated',
    () => {
      const eybLeadWithCompanyAndInvestmentProjects = eybLeadFaker({
        company: {
          name: 'Mars',
          id: 'fc752802-e454-4c7c-bbfd-4bdd84759b84',
        },
        investment_projects: [
          {
            id: 'fc752802-e454-4c7c-bbfd-4bdd84759b84',
          },
        ],
      })
      beforeEach(() => {
        setup(eybLeadWithCompanyAndInvestmentProjects)
        cy.visit(
          investments.eybLeads.details(
            eybLeadWithCompanyAndInvestmentProjects.id
          )
        )
        cy.wait('@getEYBLeadDetails')
      })

      it('should render the header notification banner', () => {
        cy.get('[data-test="status-message-header"]')
          .should('exist')
          .should(
            'have.text',
            'This EYB lead has been added as an investment project. View the project'
          )

        cy.get('a:contains("View the project")').should(
          'have.attr',
          'href',
          `/investments/projects/fc752802-e454-4c7c-bbfd-4bdd84759b84/details`
        )
      })

      it('should not render the `Add investment project` button', () => {
        cy.get('[data-test="button-add-investment-project"]').should(
          'not.exist'
        )
      })
    }
  )

  context('When viewing an EYB lead with high, low, and unknown values', () => {
    const testCases = [true, false, null]
    testCases.forEach((value) => {
      const eybLead = eybLeadFaker({ is_high_value: value })
      it('should render the value field with the correct label', () => {
        setup(eybLead)
        cy.visit(investments.eybLeads.details(eybLead.id))
        cy.wait('@getEYBLeadDetails')
        cy.get(
          selectors.keyValueTable('eyb-lead-details-table').keyCell(2)
        ).should('have.text', 'Value')
        cy.get(
          selectors.keyValueTable('eyb-lead-details-table').valueCell(2)
        ).should('have.text', VALUES_VALUE_TO_LABEL_MAP[eybLead.is_high_value])
      })
    })
  })

  context('When viewing an EYB lead without an email', () => {
    const eybLeadWithNoEmail = eybLeadFaker({
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
        'FIND_PEOPLE_WITH_SPECIALIST_SKILLS',
        'SET_UP_A_NEW_DISTRIBUTION_CENTRE',
        'OTHER',
        'ONWARD_SALES_AND_EXPORTS_FROM_THE_UK',
      ],
      hiring: '6 to 50',
      spend: '£500,000 to £1 million',
      is_high_value: true,
      full_name: 'Joe Bloggs',
      role: 'CEO',
      email: null,
      telephone_number: '01234567890',
      landing_timeframe: 'UNDER_SIX_MONTHS',
      company_website: 'fake.website.com',
      investment_projects: [],
    })
    beforeEach(() => {
      setup(eybLeadWithNoEmail)
      cy.visit(investments.eybLeads.details(eybLeadWithNoEmail.id))
      cy.wait('@getEYBLeadDetails')
    })

    it('should render all the fields of the details table with email test displayed as "Not set"', () => {
      assertSummaryTable({
        dataTest: 'eyb-lead-details-table',
        // prettier-ignore
        content: {
          'Company name': eybLeadWithNoEmail.company.name,
          'Value': 'High value',
          'Sector or industry': eybLeadWithNoEmail.sector.name,
          'Location of company headquarters': 'Canada',
          'Submitted to EYB': '07 Jun 2023',
          'Company website address':
            eybLeadWithNoEmail.company_website + ' (opens in new tab)',
          'When do you want to set up?': convertEYBChoicesToLabels(eybLeadWithNoEmail.landing_timeframe),
          'Do you know where you want to set up in the UK?': 'Yes',
          'Where do you want to set up in the UK?': 'Cardiff',
          'How do you plan to expand your business in the UK?':
          convertEYBChoicesToLabels(eybLeadWithNoEmail.intent).join(''),
          'How many people do you want to hire in the UK in the first 3 years?':
            eybLeadWithNoEmail.hiring,
          'How much do you want to spend on setting up in the first 3 years?':
            eybLeadWithNoEmail.spend,
          'Full name': eybLeadWithNoEmail.full_name,
          'Job title': eybLeadWithNoEmail.role,
          'Phone number': eybLeadWithNoEmail.telephone_number,
          'Email': NOT_SET_TEXT,
        },
      })
    })
  })
})
