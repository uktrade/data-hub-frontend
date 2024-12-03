import React from 'react'

import { faker } from '../../../../../../sandbox/utils.js'

import { largeInvestorProfileFaker } from '../../../../../../functional/cypress/fakers/large-investor-profile'
import { ProfileDetailsForm } from '../../../../../../../src/client/modules/Companies/CompanyInvestments/LargeCapitalProfile/EditProfileDetailsForm'
import requiredChecksConductedListFaker from '../../../../../../functional/cypress/fakers/required-checks-conducted'
import {
  clearAndInputDateValueObject,
  clickButton,
  clickRadioGroupOption,
} from '../../../../../../functional/cypress/support/actions'
import { assertErrorSummary } from '../../../../../../functional/cypress/support/assertions'

describe('Profile details form', () => {
  context('Validation checks', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <ProfileDetailsForm
          profile={largeInvestorProfileFaker({
            requiredChecksConductedOn: null,
          })}
          requiredCheckOptions={requiredChecksConductedListFaker()}
          investorTypeOptions={[]}
        />
      )
    })

    it('should show an error message when cleared checks details are not entered', () => {
      clickRadioGroupOption({
        element: '[data-test="field-required_checks"]',
        label: 'Cleared',
      })

      clickButton('Save and return')

      assertErrorSummary([
        'Enter the date of the most recent checks',
        'Enter the person responsible for the most recent checks',
      ])
    })

    it('should show an error message when cleared checks future date is entered', () => {
      const futureDate = faker.date.future()

      clickRadioGroupOption({
        element: '[data-test="field-required_checks"]',
        label: 'Cleared',
      })
      cy.get('[data-test="field-required_checks"]').then((element) => {
        clearAndInputDateValueObject({
          element,
          value: {
            day: futureDate.getDate().toString(),
            month: (futureDate.getMonth() + 1).toString(),
            year: futureDate.getFullYear().toString(),
          },
        })
      })

      clickButton('Save and return')

      assertErrorSummary([
        'Date of most recent checks must be within the last 12 months.',
        'Enter the person responsible for the most recent checks',
      ])
    })

    it('should show an error message when issues identified details are not entered', () => {
      clickRadioGroupOption({
        element: '[data-test="field-required_checks"]',
        label: 'Issues identified',
      })

      clickButton('Save and return')

      assertErrorSummary([
        'Enter the date of the most recent checks',
        'Enter the person responsible for the most recent checks',
      ])
    })

    it('should show an error message when issues identified future date is entered', () => {
      const futureDate = faker.date.future()

      clickRadioGroupOption({
        element: '[data-test="field-required_checks"]',
        label: 'Issues identified',
      })
      cy.get('[data-test="field-required_checks"]').then((element) => {
        clearAndInputDateValueObject({
          element,
          value: {
            day: futureDate.getDate().toString(),
            month: (futureDate.getMonth() + 1).toString(),
            year: futureDate.getFullYear().toString(),
          },
        })
      })

      clickButton('Save and return')

      assertErrorSummary([
        'Date of most recent checks must be within the last 12 months.',
        'Enter the person responsible for the most recent checks',
      ])
    })
  })
})
