import {
  formFields,
  customerDetailsStep,
  creditForThisWinStep,
} from './constants'

import {
  assertUrl,
  assertFieldError,
  assertErrorSummary,
  assertFieldTypeahead,
  assertFieldRadiosStrict,
} from '../../support/assertions'

import { clickContinueButton } from '../../support/actions'

describe('Credit for this win', () => {
  const { creditForThisWin } = formFields

  beforeEach(() => cy.visit(creditForThisWinStep))

  it('should render a step heading', () => {
    cy.get(creditForThisWin.heading).should('have.text', 'Credit for this win')
  })

  it('should render a hint', () => {
    cy.get(creditForThisWin.hint).should(
      'have.text',
      'Other teams that helped with this win should be added so they can be credited, this will not reduce your credit for this win.'
    )
  })

  it('should render two unselected radio buttons', () => {
    assertFieldRadiosStrict({
      inputName: 'credit_for_win',
      legend: 'Did any other teams help with this win?',
      options: ['Yes', 'No'],
    })
    cy.get(creditForThisWin.radiosBtnYes).should('not.be.checked')
    cy.get(creditForThisWin.radiosBtnNo).should('not.be.checked')
  })

  it('should go to the next step when selecting "No" and then "Continue"', () => {
    cy.get(creditForThisWin.radiosBtnNo).check()
    clickContinueButton()
    assertUrl(customerDetailsStep)
  })

  it('should render a legend and hint text', () => {
    cy.get(creditForThisWin.radiosBtnYes).check()
    cy.get(creditForThisWin.fieldAddAnother)
      .find('legend')
      .eq(0)
      .should('have.text', 'Contributing advisers')
    cy.get(creditForThisWin.hintText).should(
      'have.text',
      'Up to 5 advisers can be added.'
    )
  })

  it('should render a Typeahead for the contributing officer', () => {
    cy.get(creditForThisWin.radiosBtnYes).check()
    cy.get(creditForThisWin.contributingOfficer).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Contributing officer',
      })
    })
  })

  it('should render a Typeahead for the team type', () => {
    cy.get(creditForThisWin.radiosBtnYes).check()
    cy.get(creditForThisWin.teamType).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Team type',
      })
    })
  })

  it('should render an "Add another" button', () => {
    cy.get(creditForThisWin.radiosBtnYes).check()
    cy.get(creditForThisWin.addAnother).should('exist')
  })

  it('should display validation error messages on mandatory fields', () => {
    clickContinueButton()
    // Assert Yes and No radio buttons
    assertErrorSummary(['Select Yes or No'])
    assertFieldError(
      cy.get(creditForThisWin.radiosBtns),
      'Select Yes or No',
      true
    )
    cy.get(creditForThisWin.radiosBtnYes).check()
    clickContinueButton()
    // Assert Contributing officer and Team type
    assertErrorSummary(['Enter a contributing officer', 'Enter a team type'])
    assertFieldError(
      cy.get(creditForThisWin.contributingOfficer),
      'Enter a contributing officer',
      false
    )
    assertFieldError(
      cy.get(creditForThisWin.teamType),
      'Enter a team type',
      false
    )
    // Select a team type to render the HQ team, region or post field
    cy.get(creditForThisWin.teamType).find('input').as('teamTypeInput')
    cy.get('@teamTypeInput').type('Inv')
    cy.get('@teamTypeInput').type('{downarrow}{enter}{esc}')
    clickContinueButton()
    // Assert HQ team, region or post
    assertErrorSummary([
      'Enter a contributing officer',
      'Enter a HQ team, region or post',
    ])
    assertFieldError(
      cy.get(creditForThisWin.hqTeam),
      'Enter a HQ team, region or post',
      false
    )
  })
})
