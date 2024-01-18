import {
  assertUrl,
  assertFieldError,
  assertLocalHeader,
  assertErrorSummary,
  assertFieldTypeahead,
} from '../../support/assertions'
import { clickContinueButton } from '../../support/actions'
import { companyFaker } from '../../fakers/companies'
import { advisersListFaker } from '../../fakers/advisers'
import { teamTypeListFaker } from '../../fakers/team-type'
import { hqTeamListFaker } from '../../fakers/hq-team'
import urls from '../../../../../src/lib/urls'

const clickContinueAndAssertUrl = (url) => {
  clickContinueButton()
  assertUrl(url)
}

describe('Adding an export win', () => {
  const company = companyFaker()

  // Form steps and query params
  const officerDetails = `?step=officer_details&company=${company.id}`
  const creditForThisWin = `?step=credit_for_this_win&company=${company.id}`
  const customerDetails = `?step=customer_details&company=${company.id}`
  const winDetails = `?step=win_details&company=${company.id}`
  const supportProvided = `?step=support_provided&company=${company.id}`
  const checkBeforeSending = `?step=check_before_sending&company=${company.id}`

  beforeEach(() => {
    cy.intercept('GET', `/api-proxy/v4/company/${company.id}`, company)
    cy.intercept('/api-proxy/adviser/?*', {
      results: [...advisersListFaker(2), { id: '1', name: 'David Meyer' }],
    })
    cy.intercept('GET', `/api-proxy/v4/metadata/team-type`, [
      ...teamTypeListFaker(2),
      { id: '1', name: 'Investment (ITFG or IG)' },
    ])
    cy.intercept('GET', '/api-proxy/v4/metadata/hq-team-region-or-post?*', [
      ...hqTeamListFaker(2),
      { id: '1', name: 'DIT Education' },
    ])
  })

  context('Page headers', () => {
    it('should render both the header and subheader', () => {
      cy.visit(`${urls.companies.exportWins.create()}${officerDetails}`)
      assertLocalHeader('Add export win')
      cy.get('[data-test="subheading"]').should(
        'have.text',
        company.name.toUpperCase()
      )
    })
  })

  context('Officer details', () => {
    beforeEach(() =>
      cy.visit(`${urls.companies.exportWins.create()}${officerDetails}`)
    )

    it('should render an officer details heading', () => {
      cy.get('[data-test="step-heading"]').should(
        'have.text',
        'Officer details'
      )
    })

    it('should render Lead Officer name label and a Typeahead', () => {
      const leadOfficer = '[data-test="field-lead_officer"]'
      cy.get(leadOfficer).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Lead officer name',
        })
      })
    })

    it('should render both Team Type and HQ Team', () => {
      const teamType = '[data-test="field-team_type"]'
      const hqTeam = '[data-test="field-hq_team"]'
      // The HQ Team field is not visible until a team has been selected
      cy.get(hqTeam).should('not.exist')
      cy.get(teamType).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Team type',
        })
      })
      cy.get(teamType).find('input').as('teamTypeInput')
      cy.get('@teamTypeInput').type('Inv')
      cy.get('@teamTypeInput').type('{downarrow}{enter}{esc}')
      // Now the user has selected a team the HQ Team field is visible
      cy.get(hqTeam).should('exist')
      cy.get(hqTeam).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'HQ team, region or post',
        })
      })
    })

    it('should render a Team Members Typeahead and hint text', () => {
      cy.get('[data-test="field-team_members"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Team members (optional)',
        })
      })
      cy.get('[data-test="hint-text"]').should(
        'have.text',
        'You can add up to 5 team members. They will be notified when this win is updated.'
      )
    })

    it('should display validation error messages on mandatory fields', () => {
      const teamType = '[data-test="field-team_type"]'
      const leadOfficer = '[data-test="field-lead_officer"]'
      const hqTeam = '[data-test="field-hq_team"]'
      clickContinueButton()
      assertErrorSummary(['Enter a lead officer', 'Select a team type'])
      assertFieldError(cy.get(leadOfficer), 'Enter a lead officer', false)
      assertFieldError(cy.get(teamType), 'Select a team type', false)
      // Select a team to reveal the HQ Team field
      cy.get(teamType).find('input').as('teamTypeInput')
      cy.get('@teamTypeInput').type('Inv')
      cy.get('@teamTypeInput').type('{downarrow}{enter}{esc}')
      clickContinueButton()
      assertErrorSummary([
        'Enter a lead officer',
        'Select HQ team, region or post',
      ])
      assertFieldError(cy.get(hqTeam), 'Select HQ team, region or post', false)
    })

    it('should complete this step and continue to "Credit for this win"', () => {
      const leadOfficer = '[data-test="field-lead_officer"]'
      const teamType = '[data-test="field-team_type"]'
      const hqTeam = '[data-test="field-hq_team"]'
      cy.get(leadOfficer).selectTypeaheadOption('David')
      cy.get(teamType).selectTypeaheadOption('Investment (ITFG or IG)')
      cy.get(hqTeam).selectTypeaheadOption('DIT Education')
      clickContinueAndAssertUrl(creditForThisWin)
    })
  })

  context('Credit for this win', () => {
    it('should complete this step and continue to "Customer details"', () => {
      cy.visit(`${urls.companies.exportWins.create()}${creditForThisWin}`)
      clickContinueAndAssertUrl(customerDetails)
    })
  })

  context('Customer details', () => {
    it('should complete this step and continue to "Win details"', () => {
      cy.visit(`${urls.companies.exportWins.create()}${customerDetails}`)
      clickContinueAndAssertUrl(winDetails)
    })
  })

  context('Win details', () => {
    it('should complete this step and continue to "Support provided"', () => {
      cy.visit(`${urls.companies.exportWins.create()}${winDetails}`)
      clickContinueAndAssertUrl(supportProvided)
    })
  })

  context('Support provided', () => {
    it('should complete this step and continue to "Check before sending"', () => {
      cy.visit(`${urls.companies.exportWins.create()}${supportProvided}`)
      clickContinueAndAssertUrl(checkBeforeSending)
    })
  })
})
