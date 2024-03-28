import { clickContinueButton } from '../../support/actions'
import { formFields, winDetailsStep, company } from './constants'

import {
  populateWinWithValues,
  getDateNextMonth,
  getDateThirteenMonthsAgo,
  getDateWithinLastTwelveMonths,
} from './utils'

import {
  assertFieldInput,
  assertFieldError,
  assertErrorSummary,
  assertFieldTextarea,
  assertFieldTypeahead,
  assertFieldDateShort,
  assertFieldCheckboxes,
  assertFieldRadiosStrict,
} from '../../support/assertions'

const { month, year } = getDateWithinLastTwelveMonths()

describe('Win details', () => {
  const { winDetails } = formFields

  beforeEach(() => {
    cy.intercept('GET', `/api-proxy/v4/company/${company.id}`, company)
    cy.visit(winDetailsStep)
  })

  it('should render a step heading', () => {
    cy.get(winDetails.heading).should('have.text', 'Win details')
  })

  it('should not render an edit status message', () => {
    cy.get('[data-test="status-message"]').should('not.exist')
  })

  it('should render a hint', () => {
    cy.get(winDetails.hint).should(
      'have.text',
      'The customer will be asked to confirm this information.'
    )
  })

  it('should render Destination country label and a Typeahead', () => {
    cy.get(winDetails.country).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Destination country',
      })
    })
  })

  it('should render the Win date', () => {
    cy.get(winDetails.date).then((element) => {
      // Both Month and Year labels are tested within the assertion
      assertFieldDateShort({
        element,
        label: 'Date won',
        hint: `For example ${month} ${year}, date of win must be in the last 12 months.`,
      })
    })
  })

  it('should render Summary of the support given', () => {
    cy.get(winDetails.description).then((element) => {
      assertFieldTextarea({
        element,
        label: 'Summary of the support given',
        hint: 'Outline what had the most impact or would be memorable to the customer in less than 100 words.',
        wordCount: 'You have 100 words remaining.',
      })
    })
  })

  it('should render two confidential unselected radio buttons', () => {
    assertFieldRadiosStrict({
      inputName: 'name_of_customer_confidential',
      legend: 'Overseas customer',
      hint: "Is the customer's name confidential?",
      options: ['Yes', 'No'],
    })
    cy.get(winDetails.nameOfCustomerConfidentialYes).should('not.be.checked')
    cy.get(winDetails.nameOfCustomerConfidentialNo).should('not.be.checked')
  })

  it('should renderer Overseas customer', () => {
    cy.get(winDetails.nameOfCustomerConfidentialNo).click()
    cy.get(winDetails.nameOfCustomer).then((element) => {
      assertFieldInput({
        element,
        label: "Customer's name",
        hint: 'Enter the customer’s name, this will be displayed on Data Hub.',
        placeholder: 'Add name',
      })
    })
  })

  it('should renderer a type of business deal', () => {
    cy.get(winDetails.businessType).then((element) => {
      assertFieldInput({
        element,
        label: 'Type of business deal',
        hint: 'For example: export sales, contract, order, distributor, tender / competition win, joint venture, outward investment.',
        placeholder: 'Enter a type of business deal',
      })
    })
  })

  it('should render Type of win ', () => {
    assertFieldCheckboxes({
      element: winDetails.winType,
      legend: 'Type of win',
      options: [
        {
          label: 'Export',
          checked: false,
        },
        {
          label: 'Business success',
          checked: false,
        },
        {
          label: 'Outward Direct Investment (ODI)',
          checked: false,
        },
      ],
    })
  })

  it('should render the WinTypeValues component for each win type', () => {
    cy.get(winDetails.winType).as('winType')

    // Export win
    cy.get('@winType')
      .find(winDetails.winTypeValuesExport)
      .should('not.exist')
      .get('@winType')
      .find(winDetails.exportWinCheckbox)
      .check()
      .next()
      .get(winDetails.winTypeValuesExport)
      .should('exist')

    // Business type
    cy.get('@winType')
      .find(winDetails.winTypeValuesBusSupp)
      .should('not.exist')
      .get('@winType')
      .find(winDetails.businessSuccessCheckbox)
      .check()
      .next()
      .get(winDetails.winTypeValuesBusSupp)
      .should('exist')

    // ODI
    cy.get('@winType')
      .find(winDetails.winTypeValuesODI)
      .should('not.exist')
      .get('@winType')
      .find(winDetails.odiCheckbox)
      .check()
      .next()
      .get(winDetails.winTypeValuesODI)
      .should('exist')
  })

  it('should render the total export value across all 3 win types', () => {
    cy.get(winDetails.winType).as('winType')

    // Check all 3 win types to render 15 (3 x 5) inputs
    cy.get('@winType').find(winDetails.exportWinCheckbox).check()
    cy.get('@winType').find(winDetails.businessSuccessCheckbox).check()
    cy.get('@winType').find(winDetails.odiCheckbox).check()

    populateWinWithValues({
      alias: '@winType',
      winType: 'export-win',
      values: ['1000000', '1000000', '1000000', '1000000', '1000000'], // 5M
    })

    populateWinWithValues({
      alias: '@winType',
      winType: 'business-success-win',
      values: ['2000000', '2000000', '2000000', '2000000', '2000000'], // 10M
    })

    populateWinWithValues({
      alias: '@winType',
      winType: 'odi-win',
      values: ['3000000', '3000000', '3000000', '3000000', '3000000'], // 15M
    })

    // Assert the total export value
    cy.get(winDetails.totalExportValue).should(
      'have.text',
      'Total export value: £30,000,000' // 5M + 10M + 15M
    )
  })

  it('should render Goods and Services', () => {
    assertFieldCheckboxes({
      element: winDetails.goodsVsServices,
      legend: 'What does the value relate to?',
      hint: 'Select all that apply.',
      options: [
        {
          label: 'Goods',
          checked: false,
        },
        {
          label: 'Services',
          checked: false,
        },
      ],
    })
  })

  it('should renderer name of goods or services', () => {
    cy.get(winDetails.nameOfExport).then((element) => {
      assertFieldInput({
        element,
        label: 'Name of goods or services',
        hint: "For instance 'shortbread biscuits'.",
        placeholder: 'Enter a name for goods or services',
      })
    })
  })

  it('should render a sector label and typeahead', () => {
    cy.get(winDetails.sector).then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Sector',
      })
    })
  })

  it('should display validation error messages on mandatory fields', () => {
    clickContinueButton()
    assertErrorSummary([
      'Choose a destination country',
      'Enter the win date',
      'Enter a summary',
      'Select Yes or No',
      'Enter the type of business deal',
      'Choose at least one type of win',
      'Select at least one option',
      'Enter the name of goods or services',
      'Enter a sector',
    ])
    assertFieldError(
      cy.get(winDetails.country),
      'Choose a destination country',
      false
    )
    assertFieldError(cy.get(winDetails.date), 'Enter the win date', true)
    assertFieldError(cy.get(winDetails.description), 'Enter a summary', true)

    cy.get(winDetails.nameOfCustomerConfidential).should(
      'contain',
      'Select Yes or No'
    )

    assertFieldError(
      cy.get(winDetails.businessType),
      'Enter the type of business deal',
      true
    )
    assertFieldError(
      cy.get(winDetails.winType),
      'Choose at least one type of win',
      true
    )
    // We can't use assertFieldError here as it picks up the wrong span
    cy.get(winDetails.goodsVsServices).should(
      'contain',
      'Select at least one option'
    )
    assertFieldError(
      cy.get(winDetails.nameOfExport),
      'Enter the name of goods or services',
      true
    )
    assertFieldError(cy.get(winDetails.sector), 'Enter a sector', false)
  })

  it('should display validation error messages on mandatory fields that are revealed', () => {
    // Reveal the overseas customer field by clicking no
    cy.get(winDetails.nameOfCustomerConfidentialNo).click()
    clickContinueButton()
    assertErrorSummary([
      'Choose a destination country',
      'Enter the win date',
      'Enter a summary',
      'Enter the type of business deal',
      'Choose at least one type of win',
      'Select at least one option',
      'Enter the name of goods or services',
      'Enter a sector',
      'Enter the name of the overseas customer',
    ])
    cy.get(winDetails.nameOfCustomerConfidential).should(
      'contain',
      'Enter the name of the overseas customer'
    )
  })

  it('should display a validation error message when the win date is in the future', () => {
    const { month, year } = getDateNextMonth()
    cy.get(winDetails.dateMonth).type(month)
    cy.get(winDetails.dateYear).type(year)
    clickContinueButton()
    assertFieldError(
      cy.get(winDetails.date),
      'Date must be in the last 12 months',
      true
    )
  })

  it('should display a validation error message when the win date is greater than twelve months ago', () => {
    const { month, year } = getDateThirteenMonthsAgo()
    cy.get(winDetails.dateMonth).type(month)
    cy.get(winDetails.dateYear).type(year)
    clickContinueButton()
    assertFieldError(
      cy.get(winDetails.date),
      'Date must be in the last 12 months',
      true
    )
  })
})
