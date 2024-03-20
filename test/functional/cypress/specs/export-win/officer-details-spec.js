import { formFields, officerDetailsStep } from './constants'
import { clickContinueButton } from '../../support/actions'

import {
  assertFieldError,
  assertErrorSummary,
  assertFieldTypeahead,
} from '../../support/assertions'

describe('Officer details', () => {
  const { officerDetails } = formFields

  beforeEach(() => cy.visit(officerDetailsStep))

  it('should render an officer details heading', () => {
    cy.get(officerDetails.heading).should('have.text', 'Officer details')
  })

  it('should render Lead Officer name label and a Typeahead', () => {
    cy.get(officerDetails.leadOfficer).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Lead officer name',
      })
    })
  })

  it('should render both Team Type and HQ Team', () => {
    // The HQ Team field is not visible until a team has been selected
    cy.get(officerDetails.hqTeam).should('not.exist')
    cy.get(officerDetails.teamType).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Team type',
      })
    })
    cy.get(officerDetails.teamType).find('input').as('teamTypeInput')
    cy.get('@teamTypeInput').type('Inv')
    cy.get('@teamTypeInput').type('{downarrow}{enter}{esc}')
    // Now the user has selected a team the HQ Team field is visible
    cy.get(officerDetails.hqTeam).should('exist')
    cy.get(officerDetails.hqTeam).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'HQ team, region or post',
      })
    })
  })

  it('should render a Team Members Typeahead and hint text', () => {
    cy.get(officerDetails.teamMembers).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Team members (optional)',
      })
    })
    cy.get(officerDetails.teamMembersHintText).should(
      'have.text',
      'You can add up to 5 team members. They will not be credited for the win but will be notified when this win is updated.'
    )
  })

  it('should display validation error messages on mandatory fields', () => {
    clickContinueButton()
    assertErrorSummary(['Enter a lead officer', 'Select a team type'])
    assertFieldError(
      cy.get(officerDetails.leadOfficer),
      'Enter a lead officer',
      false
    )
    assertFieldError(
      cy.get(officerDetails.teamType),
      'Select a team type',
      false
    )
    // Select a team to reveal the HQ Team field
    cy.get(officerDetails.teamType).find('input').as('teamTypeInput')
    cy.get('@teamTypeInput').type('Inv')
    cy.get('@teamTypeInput').type('{downarrow}{enter}{esc}')
    clickContinueButton()
    assertErrorSummary([
      'Enter a lead officer',
      'Select HQ team, region or post',
    ])
    assertFieldError(
      cy.get(officerDetails.hqTeam),
      'Select HQ team, region or post',
      false
    )
  })
})
