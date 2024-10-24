import { omit } from 'lodash'

import { winTypeId } from '../../../../../src/client/modules/ExportWins/Form/constants'
import { exportWinsFaker } from '../../fakers/export-wins'
import { contactFaker } from '../../fakers/contacts'
import urls from '../../../../../src/lib/urls'

import {
  assertBreadcrumbs,
  assertLocalHeader,
  assertSummaryTable,
} from '../../support/assertions'

import {
  fillWinDetails,
  fillOfficerDetails,
  fillCustomerDetails,
  fillSupportProvided,
  fillCreditForThisWin,
  clickContinueAndAssertUrl,
  getDateWithinLastTwelveMonths,
} from './utils'

const { month, year } = getDateWithinLastTwelveMonths()

import {
  company,
  formFields,
  winDetailsStep,
  successPageRegex,
  officerDetailsStep,
  customerDetailsStep,
  supportProvidedStep,
  creditForThisWinStep,
  summaryStep,
} from './constants'
import { UK_REGIONS } from '../../../../../src/common/constants'

const exportWin = {
  ...exportWinsFaker(),
  country: { name: 'Dubai' },
  name_of_export: 'Rolls Reece Cars',
  company_contacts: [{ email: 'jeff.marks@test.com' }],
}

const createBreakdown = ({ type, values }) =>
  values.map((value, index) => ({
    type,
    year: index + 1,
    value,
  }))

describe('Adding an export win', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api-proxy/v4/company/${company.id}`, company)
    cy.intercept('GET', `/api-proxy/v4/contact?company_id=${company.id}*`, {
      results: [
        contactFaker({
          name: 'Joseph Barker',
          email: 'joseph.barker@test.com',
          id: '000',
        }),
      ],
    })
    cy.intercept('/api-proxy/adviser/?*', {
      results: [
        { id: '100', name: 'David Meyer' },
        { id: '101', name: 'John Smith' },
      ],
    })
    cy.intercept('POST', '/api-proxy/v4/export-win', {
      statusCode: 201,
    }).as('apiPostExportWin')
    cy.intercept('GET', '/api-proxy/v4/export-win/*', exportWin).as(
      'apiGetExportWin'
    )
  })

  context('Breadcrumbs', () => {
    it('should render the breadcrumbs', () => {
      cy.visit(officerDetailsStep)
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        [company.name.toUpperCase()]: urls.companies.detail(company.id),
        'Add export win': null,
      })
    })
  })

  context('Page headers', () => {
    it('should render both the header and subheader', () => {
      cy.visit(officerDetailsStep)
      assertLocalHeader('Add export win')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        company.name.toUpperCase()
      )
    })
  })

  context(
    'When the export win is created from scratch',
    { testIsolation: false },
    () => {
      before(() => cy.visit(officerDetailsStep))

      it('should complete the entire export win user journey', () => {
        fillOfficerDetails({
          leadOfficer: 'David',
          teamType: 'Investment (ITFG or IG)',
          hqTeam: 'ITFG - E-Business Projects Team',
        })

        clickContinueAndAssertUrl(creditForThisWinStep)

        fillCreditForThisWin({
          contributingOfficer: 'John',
          teamType: 'Trade (TD or ST)',
          hqTeam: 'TD - Events - Education',
        })

        clickContinueAndAssertUrl(customerDetailsStep)

        fillCustomerDetails({
          contact: 'Joseph Barker',
          location: 'Scotland',
          potential: 'The company is a Medium Sized Business',
          experience: 'Never exported',
        })

        clickContinueAndAssertUrl(winDetailsStep)

        fillWinDetails({
          country: 'United states',
          dateMonth: month,
          dateYear: year,
          description: 'Foo bar baz',
          nameOfCustomerConfidential: true,
          businessType: 'Contract',
          exportValues: ['1000000', '1000000', '1000000', '1000000', '1000000'],
          businessSuccessValues: [
            '2000000',
            '2000000',
            '2000000',
            '2000000',
            '2000000',
          ],
          odiValues: ['3000000', '3000000', '3000000', '3000000', '3000000'],
          goodsVsServices: 'goods',
          nameOfExport: 'Biscuits',
          sector: 'Advanced Engineering',
        })

        clickContinueAndAssertUrl(supportProvidedStep)

        fillSupportProvided({
          hvc: 'Aus',
          typeOfSupport: 'Mar',
          associatedProgramme: 'Aft',
          personallyConfirmed: true,
          lineManagerConfirmed: true,
        })

        clickContinueAndAssertUrl(summaryStep)
      })

      it('should not render an edit status message', () => {
        cy.get('[data-test="localHeader"]').should(
          'not.contain',
          'To edit an export win' +
            'Edit each section that needs changing then return to the summary page. ' +
            'When you are happy with all the changes save the page.'
        )
      })

      it('should render an officer details table', () => {
        assertSummaryTable({
          dataTest: 'officer-details',
          heading: 'Officer details',
          showEditLink: true,
          content: {
            'Lead officer name': 'David Meyer',
            'Team type': 'Investment (ITFG or IG)',
            'HQ team, region or post': 'ITFG - E-Business Projects Team',
            'Team members (optional)': 'Not set',
          },
        })
      })

      it('should render a credit for this win table', () => {
        assertSummaryTable({
          dataTest: 'credit-for-this-win',
          heading: 'Credit for this win',
          showEditLink: true,
          content: {
            'Did any other teams help with this win?':
              'YesContributing teams and advisersContributing officer: John SmithTeam ' +
              'type: Trade (TD or ST)HQ team, region or post: TD - Events - Education',
          },
        })
      })

      it('should render a customer details table', () => {
        assertSummaryTable({
          dataTest: 'customer-details',
          heading: 'Customer details',
          showEditLink: true,
          content: {
            'Company name': company.name.toUpperCase(),
            'Contact name': 'Joseph Barker',
            'HQ location': 'Scotland',
            'Medium-sized and high potential companies':
              'The company is a Medium Sized Business',
            'Export experience': 'Never exported',
          },
        })
      })

      it('should render a win details table', () => {
        assertSummaryTable({
          dataTest: 'win-details',
          heading: 'Win details',
          showEditLink: true,
          content: {
            Destination: 'United States',
            'Date won': `${month}/${year}`,
            'Summary of support given': 'Foo bar baz',
            Confidential: 'Yes',
            'Type of win': 'Contract',
            'Export value': '£5,000,000 over 5 years',
            'Business success value': '£10,000,000 over 5 years',
            'Outward Direct Investment (ODI) value': '£15,000,000 over 5 years',
            'Total value': '£30,000,000 over 5 years',
            'What does the value relate to?': 'Goods',
            'Type of goods or services': 'Biscuits',
            Sector: 'Advanced Engineering',
          },
        })
      })

      it('should render a support given table', () => {
        assertSummaryTable({
          dataTest: 'support-given',
          heading: 'Support given',
          showEditLink: true,
          content: {
            'High Value Campaign (HVC) code':
              'Australia Consumer Goods & Retail: E004',
            'What type of support was given?':
              'Market entry advice and support – DIT/FCO in UK',
            'Was there a DBT campaign or event that contributed to this win?':
              'Afterburner',
          },
        })
      })

      it('should render warning text', () => {
        cy.get('[data-test="warning-text"]').should(
          'contain',
          'This information will be sent to joseph.barker@test.com so they can confirm the export win.'
        )
      })

      it('should POST to the API and redirect to the success page', () => {
        cy.get('[data-test="confirm-and-send-to-customer"]').should(
          'have.text',
          'Confirm and send to customer'
        )
        cy.get('[data-test="confirm-and-send-to-customer"]').click()
        cy.wait('@apiPostExportWin').then(({ request }) => {
          expect(omit(request.body, '_csrf')).to.deep.equal({
            lead_officer: '100',
            team_type: '42bdaf2e-ae19-4589-9840-5dbb67b50add', // Investment (ITFG or IG)
            hq_team: '1e5aec69-c581-4356-b0ca-1f710d3d077d', // ITFG - E-Business Projects Team
            team_members: [],
            contributing_advisers: [
              {
                adviser: '101',
                team_type: 'a4839e09-e30e-492c-93b5-8ab2ef90b891', // Trade (TD or ST)
                hq_team: '2f883a06-5811-4668-878f-92a1e3de548d', // TD - Events - Education
              },
            ],
            company_contacts: ['000'],
            customer_location: UK_REGIONS.SCOTLAND,
            business_potential: 'e4d74957-60a4-4eab-a17b-d4c7b792ad25',
            export_experience: '051a0362-d1a9-41c0-8a58-3171e5f59a8e',
            country: '81756b9a-5d95-e211-a939-e4115bead28a',
            date: `${year}-${month}-01`,
            description: 'Foo bar baz',
            name_of_customer: 'confidential',
            name_of_customer_confidential: true,
            business_type: 'Contract',
            breakdowns: [
              ...createBreakdown({
                type: winTypeId.EXPORT,
                values: ['1000000', '1000000', '1000000', '1000000', '1000000'],
              }),
              ...createBreakdown({
                type: winTypeId.BUSINESS_SUCCESS,
                values: ['2000000', '2000000', '2000000', '2000000', '2000000'],
              }),
              ...createBreakdown({
                type: winTypeId.ODI,
                values: ['3000000', '3000000', '3000000', '3000000', '3000000'],
              }),
            ],
            goods_vs_services: '456e951d-a633-4f21-afde-d41381407efe',
            name_of_export: 'Biscuits',
            sector: 'af959812-6095-e211-a939-e4115bead28a',
            hvc: '0240d283-ec44-4f33-b501-e2bf14e337b5', // Australia Consumer Goods & Retail: E004
            type_of_support: ['5560d2ee-b75b-48b0-b6ca-36d43653be61'], // Market entry advice and support – DIT/FCO in UK
            associated_programme: ['b6f5c31a-aa45-4ae0-89bd-2eb3ab943f76'], // Afterburner
            is_personally_confirmed: true,
            is_line_manager_confirmed: true,
            total_expected_export_value: 5000000,
            total_expected_non_export_value: 10000000,
            total_expected_odi_value: 15000000,
            company: company.id,
            adviser: '7d19d407-9aec-4d06-b190-d3f404627f21',
          })
        })
        cy.location().should(({ pathname }) => {
          expect(pathname).to.match(successPageRegex)
        })
      })

      it('should render a success page', () => {
        const { successPage } = formFields

        cy.get(successPage.flash).should(
          'have.text',
          'The export win Rolls Reece Cars to Dubai has been sent to jeff.marks@test.com for review and confirmation.'
        )

        cy.get(successPage.heading).should('have.text', 'What happens next?')

        cy.get(successPage.review).should(
          'have.text',
          'The customer will review the export win and have the option to provide feedback.'
        )

        cy.get(successPage.email).should(
          'have.text',
          'You will be sent an email once the customer has responded.'
        )

        cy.get(successPage.exportWinsLink)
          .should('have.text', 'Export wins')
          .should('have.attr', 'href', '/exportwins')
      })
    }
  )
})
