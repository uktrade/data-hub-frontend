import { pick } from 'lodash'

import { formFields, company, successPageRegex } from './constants'
import { exportWinsFaker } from '../../fakers/export-wins'
import { contactFaker } from '../../fakers/contacts'
import { exportFaker } from '../../fakers/export'
import urls from '../../../../../src/lib/urls'

import {
  assertTypeaheadValues,
  assertSingleTypeaheadOptionSelected,
} from '../../support/assertions'

import {
  fillWinDetails,
  fillOfficerDetails,
  fillCustomerDetails,
  fillSupportProvided,
  fillCreditForThisWin,
  getDateNextMonth,
  getDateThirteenMonthsAgo,
  clickContinueAndAssertUrl,
  getDateWithinLastTwelveMonths,
} from './utils'

const { month, year } = getDateWithinLastTwelveMonths()

const exportWin = exportWinsFaker()

// These are the fields that will pre-populate the export win form
const exportProject = exportFaker({
  owner: {
    id: '1',
    name: 'Sally Truston', // lead officer
  },
  team_members: [
    {
      id: '2',
      name: 'Adrian Jewel',
    },
    {
      id: '3',
      name: 'Kelly Williams',
    },
  ],
  // To pre-populate the form with a customer contact
  // there can only be one of them otherwise we don't
  // know who to select from of a list of them.
  contacts: [
    {
      id: '4',
      name: 'Jessica Groom',
    },
  ],
  exporter_experience: {
    id: '5',
    name: 'Never exported',
  },
  destination_country: { id: '6', name: 'Dubai' },
  // To pre-populate the form the estimated win
  // date has to be within the last 12 months
  estimated_win_date: `${year}-${month}-01`,
  sector: {
    id: '7',
    name: 'Railways',
  },
})

const createFromExport = urls.companies.exportWins.createFromExport
const createFromExportUrl = createFromExport(company.id, exportProject.id)

// All form step URLs (creating a win from an export project)
const officerDetailsStep = `${createFromExportUrl}?step=officer_details`
const creditForThisWinStep = `${createFromExportUrl}?step=credit_for_this_win`
const customerDetailsStep = `${createFromExportUrl}?step=customer_details`
const winDetailsStep = `${createFromExportUrl}?step=win_details`
const supportProvidedStep = `${createFromExportUrl}?step=support_provided`
const checkBeforeSendingStep = `${createFromExportUrl}?step=check_before_sending`

describe('Adding an export win from an export project', () => {
  const { officerDetails, customerDetails, winDetails } = formFields

  context(
    'When the export win form fields are pre-populated from the export project',
    () => {
      const interceptExportApiCall = (overrides = {}) => {
        cy.intercept('GET', `/api-proxy/v4/export/${exportProject.id}`, {
          ...exportProject,
          ...overrides,
        })
      }

      beforeEach(() => {
        cy.setUserFeatureGroups(['export-wins'])
        interceptExportApiCall()
      })

      it('should pre-populate the lead officer field', () => {
        cy.visit(officerDetailsStep)
        cy.get(officerDetails.leadOfficer)
          .find('input')
          .should('have.value', exportProject.owner.name)
      })

      it('should pre-populate the team members field', () => {
        cy.visit(officerDetailsStep)
        assertTypeaheadValues(
          '[data-test="field-team_members"]',
          exportProject.team_members.map(({ name }) => name)
        )
      })

      it('should pre-populate the customer contact field', () => {
        cy.visit(customerDetailsStep)
        assertSingleTypeaheadOptionSelected({
          element: customerDetails.contacts,
          expectedOption: exportProject.contacts[0].name,
        })
      })

      it('should pre-populate the exporter experience field', () => {
        cy.visit(customerDetailsStep)
        assertSingleTypeaheadOptionSelected({
          element: customerDetails.experience,
          expectedOption: exportProject.exporter_experience.name,
        })
      })

      it('should pre-populate the export destination country', () => {
        cy.visit(winDetailsStep)
        assertSingleTypeaheadOptionSelected({
          element: winDetails.country,
          expectedOption: exportProject.destination_country.name,
        })
      })

      it(
        'should not pre-populate the win date when the estimated ' +
          'win date is greater than twelve months ago',
        () => {
          const { year, month } = getDateThirteenMonthsAgo()

          interceptExportApiCall({
            estimated_win_date: `${year}-${month}-01`,
          })

          cy.visit(winDetailsStep)
          cy.get(winDetails.dateMonth).should('have.value', '')
          cy.get(winDetails.dateYear).should('have.value', '')
        }
      )

      it(
        'should pre-populate the win date when the estimated win ' +
          'date is less than or equal to 12 months ago',
        () => {
          interceptExportApiCall({
            estimated_win_date: `${year}-${month}-01`,
          })

          cy.visit(winDetailsStep)
          cy.get(winDetails.dateYear).should('have.value', year)
          cy.get(winDetails.dateMonth).should('have.value', month)
        }
      )

      it(
        'should not pre-populate the win date when the ' +
          'estimated date is in the future',
        () => {
          const { year, month } = getDateNextMonth()

          interceptExportApiCall({
            estimated_win_date: `${year}-${month}-01`,
          })

          cy.visit(winDetailsStep)
          cy.get(winDetails.dateYear).should('have.value', '')
          cy.get(winDetails.dateMonth).should('have.value', '')
        }
      )

      it('should pre-populate the sector', () => {
        cy.visit(winDetailsStep)
        assertSingleTypeaheadOptionSelected({
          element: winDetails.sector,
          expectedOption: exportProject.sector.name,
        })
      })
    }
  )

  context(
    'When the export win is created from an export project',
    { testIsolation: false },
    () => {
      beforeEach(() => {
        cy.setUserFeatureGroups(['export-wins'])
        cy.intercept(
          'GET',
          `/api-proxy/v4/export/${exportProject.id}`,
          exportProject
        )
        cy.intercept('POST', '/api-proxy/v4/export-win', {
          statusCode: 201,
        }).as('apiPostExportWin')
        cy.intercept('GET', '/api-proxy/v4/export-win/*', exportWin).as(
          'apiGetExportWin'
        )
        cy.intercept('GET', '/api-proxy/v4/metadata/hq-team-region-or-post?*', [
          { name: 'DIT Education' },
          { name: 'Healthcare UK' },
        ])
        cy.intercept('GET', `/api-proxy/v4/contact?company_id=${company.id}`, {
          results: [
            contactFaker({
              name: 'Joseph Barker',
              email: 'joseph.barker@test.com',
            }),
          ],
        })
        cy.intercept('GET', '/api-proxy/v4/metadata/hvc', [
          { name: 'Australia Consumer Goods & Retail: E004' },
        ])
        cy.intercept('GET', '/api-proxy/v4/metadata/support-type', [
          {
            name: 'Market entry advice and support – DIT/FCO in UK',
          },
        ])
        cy.intercept('GET', '/api-proxy/v4/metadata/associated-programme', [
          { name: 'Afterburner' },
        ])
      })

      it(
        'should fill out the entire export win user journey ommiting ' +
          'the pre-populated fields from the export project',
        () => {
          cy.visit(officerDetailsStep)

          fillOfficerDetails({
            leadOfficer: null, // pre-populated from the export project
            teamType: 'Investment (ITFG or IG)',
            hqTeam: 'DIT Education',
            teamMembers: null, // pre-populated from the export project
          })

          clickContinueAndAssertUrl(creditForThisWinStep)

          fillCreditForThisWin({
            contributingOfficer: 'John',
            teamType: 'Trade (TD or ST)',
            hqTeam: 'Healthcare UK',
          })

          clickContinueAndAssertUrl(customerDetailsStep)

          fillCustomerDetails({
            contact: null, // pre-populated providing there's a single customer contact
            location: 'Scotland',
            potential: 'The company is a Medium Sized Business',
            experience: null, // pre-populated from the export project
          })

          clickContinueAndAssertUrl(winDetailsStep)

          fillWinDetails({
            country: null, // pre-populated from the export project
            dateMonth: null, // pre-populated but must be within the last 12 months
            dateYear: null, // pre-populated but must be within the last 12 months
            description: 'Foo bar baz',
            nameOfCustomer: 'David French',
            isConfidential: true,
            businessType: 'Contract',
            exportValues: ['1000000'],
            goodsVsServices: 'goods',
            nameOfExport: 'Biscuits',
            sector: null, // pre-populated from the export project
          })

          clickContinueAndAssertUrl(supportProvidedStep)

          fillSupportProvided({
            hvc: 'Aus',
            typeOfSupport: 'Mar',
            associatedProgramme: 'Aft',
            personallyConfirmed: true,
            lineManagerConfirmed: true,
          })

          clickContinueAndAssertUrl(checkBeforeSendingStep)
        }
      )
      it('should have the pre-populated values on the "Check before sending" step', () => {
        cy.get('[data-test="officer-details"]').should(
          'contain',
          exportProject.owner.name // lead officer
        )
        cy.get('[data-test="officer-details"]').should(
          'contain',
          exportProject.team_members.map(({ name }) => name).join('')
        )
        cy.get('[data-test="customer-details"]').should(
          'contain',
          exportProject.exporter_experience.name
        )
        cy.get('[data-test="win-details"]').should(
          'contain',
          exportProject.destination_country.name
        )
        cy.get('[data-test="win-details"]').should(
          'contain',
          `${month}/${year}` // win date
        )
        cy.get('[data-test="win-details"]').should(
          'contain',
          exportProject.sector.name
        )
      })

      it('should POST to the API and redirect to the success page', () => {
        cy.get('[data-test="confirm-and-send-to-customer"]').click()
        cy.wait('@apiPostExportWin').then(({ request }) => {
          expect(
            pick(request.body, [
              'lead_officer',
              'team_members',
              'company_contacts',
              'export_experience',
              'country',
              'date',
              'sector',
            ])
          ).to.deep.equal({
            // We only need to assert the fields that have
            // been pre-populated from an export project
            lead_officer: exportProject.owner.id,
            team_members: exportProject.team_members.map(({ id }) => id),
            company_contacts: exportProject.contacts.map(({ id }) => id),
            export_experience: exportProject.exporter_experience.id,
            country: exportProject.destination_country.id,
            date: `${year}-${month}-01`,
            sector: exportProject.sector.id,
          })
        })

        // Ensure we end up on the success page
        cy.location().should(({ pathname }) => {
          expect(pathname).to.match(successPageRegex)
        })
      })
    }
  )
})
