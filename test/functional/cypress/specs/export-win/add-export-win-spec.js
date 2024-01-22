import {
  assertUrl,
  assertFieldError,
  assertLocalHeader,
  assertErrorSummary,
  assertFieldTypeahead,
  assertFieldRadiosWithLegend,
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
    beforeEach(() =>
      cy.visit(`${urls.companies.exportWins.create()}${creditForThisWin}`)
    )

    it('should render a step heading', () => {
      cy.get('[data-test="step-heading"]').should(
        'have.text',
        'Credit for this win'
      )
    })

    it('should render a hint', () => {
      cy.get('[data-test="hint"]').should(
        'have.text',
        'Other teams that helped with this win should be added so they can be credited, this will not reduce your credit for this win.'
      )
    })

    it('should render two unselected radio buttons', () => {
      cy.get('[data-test="field-credit_for_win"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Did any other teams help with this win?',
          optionsCount: 2,
        })
      })
      cy.get('[data-test="credit-for-win-yes"]')
        .should('not.be.checked')
        .parent()
        .should('have.text', 'Yes')
      cy.get('[data-test="credit-for-win-no"]')
        .should('not.be.checked')
        .parent()
        .should('have.text', 'No')
    })

    it('should go to the next step when selecting "No" and then "Continue"', () => {
      cy.get('[data-test="credit-for-win-no"]').check()
      clickContinueAndAssertUrl(customerDetails)
    })

    it('should render a legend and hint text', () => {
      cy.get('[data-test="credit-for-win-yes"]').check()
      cy.get('[data-test="field-addAnother"]')
        .find('legend')
        .eq(0)
        .should('have.text', 'Contributing advisers')
      cy.get('[data-test="hint-text"]').should(
        'have.text',
        'Up to 5 advisers can be added.'
      )
    })

    it('should render a Typeahead for the contributing officer', () => {
      cy.get('[data-test="credit-for-win-yes"]').check()
      cy.get('[data-test="field-contributing_officer_0"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Contributing officer',
        })
      })
    })

    it('should render a Typeahead for the team type', () => {
      cy.get('[data-test="credit-for-win-yes"]').check()
      cy.get('[data-test="field-team_type_0"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Team type',
        })
      })
    })

    it('should render an "Add another" button', () => {
      cy.get('[data-test="credit-for-win-yes"]').check()
      cy.get('[data-test="add-another"]').should('exist')
    })

    it('should display validation error messages on mandatory fields', () => {
      clickContinueButton()
      // Assert Yes and No radio buttons
      assertErrorSummary(['Select Yes or No'])
      assertFieldError(
        cy.get('[data-test="field-credit_for_win"]'),
        'Select Yes or No',
        true
      )
      cy.get('[data-test="credit-for-win-yes"]').check()
      clickContinueButton()
      // Assert Contributing officer and Team type
      assertErrorSummary(['Enter a contributing officer', 'Enter a team type'])
      assertFieldError(
        cy.get('[data-test="field-contributing_officer_0"]'),
        'Enter a contributing officer',
        false
      )
      assertFieldError(
        cy.get('[data-test="field-team_type_0"]'),
        'Enter a team type',
        false
      )
      // Select a team type to render the HQ team, region or post field
      cy.get('[data-test="field-team_type_0"]')
        .find('input')
        .as('teamTypeInput')
      cy.get('@teamTypeInput').type('Inv')
      cy.get('@teamTypeInput').type('{downarrow}{enter}{esc}')
      clickContinueButton()
      // Assert HQ team, region or post
      assertErrorSummary([
        'Enter a contributing officer',
        'Enter a HQ team, region or post',
      ])
      assertFieldError(
        cy.get('[data-test="field-hq_team_0"]'),
        'Enter a HQ team, region or post',
        false
      )
    })

    it('should complete this step and continue to "Customer details"', () => {
      const contributingOfficer = '[data-test="field-contributing_officer_0"]'
      const teamType = '[data-test="field-team_type_0"]'
      const hqTeam = '[data-test="field-hq_team_0"]'
      cy.get('[data-test="credit-for-win-yes"]').check()
      cy.get(contributingOfficer).selectTypeaheadOption('David')
      cy.get(teamType).selectTypeaheadOption('Investment (ITFG or IG)')
      cy.get(hqTeam).selectTypeaheadOption('DIT Education')
      clickContinueAndAssertUrl(customerDetails)
    })
  })

  context('Customer details', () => {
    // The 4 typeaheads on the form step
    const contacts = '[data-test="field-company_contacts"]'
    const location = '[data-test="field-customer_location"]'
    const potential = '[data-test="field-business_potential"]'
    const experience = '[data-test="field-export_experience"]'

    beforeEach(() =>
      cy.visit(`${urls.companies.exportWins.create()}${customerDetails}`)
    )

    it('should render a step heading', () => {
      cy.get('[data-test="step-heading"]').should(
        'have.text',
        'Customer details'
      )
    })

    it('should show a contact link and details', () => {
      cy.get('[data-test="add-a-new-contact-link"]').should('be.visible')
      cy.get('[data-test="contact-information-details"]').should('be.visible')
    })

    it('should render Company contacts label and a Typeahead', () => {
      cy.get(contacts).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Company contacts',
          hint: 'This contact will be emailed to approve the win.',
        })
      })
    })

    it('should render HQ location label and a Typeahead', () => {
      cy.get(location).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'HQ location',
        })
      })
    })

    it('should render Export potential label and a Typeahead', () => {
      cy.get(potential).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Export potential',
        })
      })
    })

    it('should render Export potential label and a Typeahead', () => {
      cy.get(experience).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Export experience',
          hint: 'Your customer will be asked to confirm this information.',
        })
      })
    })

    it('should display validation error messages on mandatory fields', () => {
      clickContinueButton()
      assertErrorSummary([
        'Select a contact',
        'Select HQ location',
        'Select export potential',
        'Select export experience',
      ])
      assertFieldError(cy.get(contacts), 'Select a contact', true)
      assertFieldError(cy.get(location), 'Select HQ location', false)
      assertFieldError(cy.get(potential), 'Select export potential', false)
      assertFieldError(cy.get(experience), 'Select export experience', true)
    })

    it('should complete this step and continue to "Win details"', () => {
      cy.get(contacts).selectTypeaheadOption('Joseph Woof')
      cy.get(location).selectTypeaheadOption('Scotland')
      cy.get(potential).selectTypeaheadOption(
        'The company is a Medium Sized Business'
      )
      cy.get(experience).selectTypeaheadOption('Never exported')
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
