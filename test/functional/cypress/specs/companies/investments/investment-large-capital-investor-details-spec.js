const {
  assertBreadcrumbs,
  assertTypeaheadHints,
  assertFieldInput,
  assertFieldTextarea,
  assertFieldRadiosWithLegend,
  assertFieldDate,
  assertSingleTypeaheadOptionSelected,
  assertUrl,
  assertRequestBody,
  assertFlashMessage,
  assertErrorSummary,
  assertAPIRequest,
} = require('../../../support/assertions')
const urls = require('../../../../../../src/lib/urls')
const fixtures = require('../../../fixtures')
const {
  clearAndInputDateValueObject,
  clickButton,
  clickRadioGroupOption,
  clickCancelLink,
  selectFirstAdvisersTypeaheadOption,
  selectFirstTypeaheadOption,
  clearAndTypeInput,
  clearAndTypeTextArea,
} = require('../../../support/actions')

const { oneListCorp: existingCompany, lambdaPlc: newCompany } = fixtures.company

const EDIT_INVESTOR_INTERCEPT = 'editInvestorHttpRequest'

describe('View large capital investor details page', () => {
  beforeEach(() => {
    cy.intercept('PATCH', '/v4/large-investor-profile/*').as(
      EDIT_INVESTOR_INTERCEPT
    )
  })

  context('when the company already exists', () => {
    before(() => {
      gotoEditInvestorDetails(existingCompany.id)
    })

    it('should have the correct url or breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [existingCompany.name]: urls.companies.detail(existingCompany.id),
        Investment: null,
      })
    })

    it('should make sure we are on the investment details', () => {
      assertAndGetInvestorDetails().find('summary').contains('Investor details')
    })

    it('should have investor details expanded ready to view data', () => {
      assertAndGetInvestorDetails()
        .find('summary')
        .should('have.attr', 'aria-expanded', 'true')
    })

    it('should have investor type with asset manager value', () => {
      assertInvestorType().then((element) => {
        assertFieldInput({
          element,
          label: 'Investor type',
          value: 'Asset manager',
        })
      })
    })

    it('should have global assets under management', () => {
      assertGlobalAssetsAmount().then((element) => {
        assertFieldInput({
          element,
          label: 'Global assets under management',
          hint: 'Enter value in US dollars',
          value: '1000000',
        })
      })
    })

    it('should have investable with capital value', () => {
      assertCapitalValue().then((element) => {
        assertFieldInput({
          element,
          label: 'Investable capital',
          hint: 'Enter value in US dollars',
          value: '30000',
        })
      })
    })

    it('should have investor description with empty value', () => {
      assertInvestorDescription().then((element) => {
        assertFieldTextarea({
          element,
          label: 'Investor description',
          hint: 'Enter any additional relevant information.For instance when founded, ownership, purpose and strategy.',
          value: undefined,
        })
      })
    })

    it('should have required checks with cleared value and option details', () => {
      assertRequiredChecks().then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend:
            'Has this investor cleared the required checks within the last 12 months?',
          optionsCount: 8,
          value: 'Cleared',
        })
      })
    })

    it('should have required checks with a cleared date', () => {
      assertRequiredCheckDate().then((element) => {
        assertFieldDate({
          element,
          label: 'Date of most recent checks',
          value: { day: '29', month: '4', year: '2019' },
        })
      })
    })

    it('should have required checks with an adviser', () => {
      assertRequiredCheckAdviser().then((element) => {
        assertSingleTypeaheadOptionSelected({
          element,
          expectedOption: 'Aaron Chan',
        })
      })
    })
  })

  context('when the company is new ', () => {
    beforeEach(() => {
      gotoEditInvestorDetails(newCompany.id)
    })

    it('should have the correct url or breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [newCompany.name]: urls.companies.detail(newCompany.id),
        Investment: null,
      })
    })

    it('should load investor type with hints', () => {
      assertTypeaheadHints({
        element: '[data-test="field-investor_type"',
        label: 'Investor type',
        placeholder: 'Please select an investor type',
      })
    })

    it('should save new investment with issues identified', () => {
      const lastMonth = getDateFromNow({ monthAddition: -1 })
      const expectedBody = {
        id: 'a84f8405-c419-40a6-84c8-642b7c3209b2',
        investor_company_id: '0fb3379c-341c-4da4-b825-bf8d47b26baa',
        investor_type: '80168d31-fa91-494e-9ad5-b9255e01b5da',
        global_assets_under_management: '500',
        investable_capital: '700',
        notes_on_locations: 'Notes about investment',
        required_checks_conducted: '9beab8fc-1094-49b4-97d0-37bc7a9de631',
        required_checks_conducted_on: `${lastMonth.getFullYear()}-${(
          lastMonth.getMonth() + 1
        ).toString()}-${lastMonth.getDay().toString()}`,
        required_checks_conducted_by: '2c42c516-9898-e211-a939-e4115bead28a',
      }
      assertInvestorType().then((element) => {
        selectFirstTypeaheadOption({ element, input: 'Asset manager' })
      })
      assertGlobalAssetsAmount().then((element) => {
        clearAndTypeInput({ element, value: '500' })
      })
      assertCapitalValue().then((element) => {
        clearAndTypeInput({ element, value: '700' })
      })
      assertInvestorDescription().then((element) => {
        clearAndTypeTextArea({ element, value: 'Notes about investment' })
      })
      assertRequiredChecks().then((element) => {
        clickRadioGroupOption({
          element,
          label: 'Issues identified',
        })
        clearAndInputDateValueObject({
          element,
          value: {
            day: lastMonth.getDay().toString(),
            month: (lastMonth.getMonth() + 1).toString(),
            year: lastMonth.getFullYear().toString(),
          },
        })
        assertRequiredCheckAdviser().then((adviserElement) =>
          selectFirstAdvisersTypeaheadOption({
            element: adviserElement,
            input: 'shawn',
          })
        )
      })

      clickButton('Save and return')

      assertAPIRequest(EDIT_INVESTOR_INTERCEPT, (xhr) => {
        assertRequestBody(xhr, expectedBody)
        assertUrl(urls.companies.investments.largeCapitalProfile(newCompany.id))
        assertFlashMessage('Investor details changes saved')
      })
    })

    it('should save new investment with not yet checked', () => {
      const expectedBody = {
        id: 'a84f8405-c419-40a6-84c8-642b7c3209b2',
        investor_company_id: '0fb3379c-341c-4da4-b825-bf8d47b26baa',
        investor_type: '80168d31-fa91-494e-9ad5-b9255e01b5da',
        global_assets_under_management: '500',
        investable_capital: '700',
        notes_on_locations: 'Notes about investment',
        required_checks_conducted: '81fafe5a-ed32-4f46-bdc5-2cafedf828e8',
        required_checks_conducted_on: null,
      }

      assertInvestorType().then((element) => {
        selectFirstTypeaheadOption({ element, input: 'Asset manager' })
      })
      assertGlobalAssetsAmount().then((element) => {
        clearAndTypeInput({ element, value: '500' })
      })
      assertCapitalValue().then((element) => {
        clearAndTypeInput({ element, value: '700' })
      })
      assertInvestorDescription().then((element) => {
        clearAndTypeTextArea({ element, value: 'Notes about investment' })
      })
      assertRequiredChecks().then((element) => {
        clickRadioGroupOption({
          element,
          label: 'Not yet checked',
        })
      })

      clickButton('Save and return')

      assertAPIRequest(EDIT_INVESTOR_INTERCEPT, (xhr) => {
        assertRequestBody(xhr, expectedBody)
        assertUrl(urls.companies.investments.largeCapitalProfile(newCompany.id))
        assertFlashMessage('Investor details changes saved')
      })
    })
  })

  context('when successfully saved', () => {
    before(() => {
      gotoEditInvestorDetails(existingCompany.id)
    })

    it('should save and redirect when valid data assigned', () => {
      const lastMonth = getDateFromNow({ day: 3, monthAddition: -1 })
      const expectedBody = {
        id: '63010090-ba38-4894-84a7-dc039c84edb3',
        investor_company_id: existingCompany.id,
        investor_type: '80168d31-fa91-494e-9ad5-b9255e01b5da',
        global_assets_under_management: '1000000',
        investable_capital: '30000',
        notes_on_locations: '',
        required_checks_conducted: '02d6fc9b-fbb9-4621-b247-d86f2487898e',
        required_checks_conducted_on: `${lastMonth.getFullYear()}-${(
          lastMonth.getMonth() + 1
        ).toString()}-${lastMonth.getDay().toString()}`,
        required_checks_conducted_by: null,
      }
      assertRequiredCheckDate().then((element) => {
        clearAndInputDateValueObject({
          element,
          value: {
            day: lastMonth.getDay().toString(),
            month: (lastMonth.getMonth() + 1).toString(),
            year: lastMonth.getFullYear().toString(),
          },
        })
      })

      clickButton('Save and return')

      assertAPIRequest(EDIT_INVESTOR_INTERCEPT, (xhr) => {
        assertRequestBody(xhr, expectedBody)
        assertUrl(
          urls.companies.investments.largeCapitalProfile(existingCompany.id)
        )
        assertFlashMessage('Investor details changes saved')
      })
    })
  })

  context('when validation fails', () => {
    before(() => {
      gotoEditInvestorDetails(newCompany.id)
    })

    it('should show an error message when cleared checks details are not entered', () => {
      assertRequiredChecks().then((element) => {
        clickRadioGroupOption({
          element,
          label: 'Cleared',
        })
      })

      clickButton('Save and return')

      assertErrorSummary([
        'Enter the date of the most recent checks',
        'Enter the person responsible for the most recent checks',
      ])
    })

    it('should show an error message when issues identified details are not entered', () => {
      assertRequiredChecks().then((element) => {
        clickRadioGroupOption({
          element,
          label: 'Issues identified',
        })
      })

      clickButton('Save and return')

      assertErrorSummary([
        'Enter the date of the most recent checks',
        'Enter the person responsible for the most recent checks',
      ])
    })

    it('should show an error message when cleared checks future date is entered', () => {
      const futureDate = getDateFromNow({
        monthAddition: 1,
        yearAddition: 1,
      })
      assertRequiredChecks().then((element) => {
        clickRadioGroupOption({
          element,
          label: 'Cleared',
        })
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

    it('should not show an error message when a valid date is set', () => {
      const validPastDate = getDateFromNow({ day: 1, monthAddition: -1 })
      assertRequiredChecks().then((element) => {
        clickRadioGroupOption({
          element,
          label: 'Cleared',
        })
        clearAndInputDateValueObject({
          element,
          value: {
            day: validPastDate.getDate().toString(),
            month: (validPastDate.getMonth() + 1).toString(),
            year: validPastDate.getFullYear().toString(),
          },
        })
      })

      assertRequiredCheckAdviser().then((element) => {
        selectFirstAdvisersTypeaheadOption({
          element,
          input: 'shawn',
        })
      })

      clickButton('Save and return')

      cy.contains('h2', 'There is a problem').should('not.exist')
    })
  })

  context('when cancelling without saving', () => {
    before(() => {
      gotoEditInvestorDetails(newCompany.id)
    })

    it('should redirect back to large capital profile', () => {
      clickCancelLink()

      assertUrl(urls.companies.investments.largeCapitalProfile(newCompany.id))
    })
  })
})

function getDateFromNow({ day = 1, monthAddition = 0, yearAddition = 0 }) {
  const now = new Date()
  now.setDate(day)
  now.setMonth(now.getMonth() + monthAddition)
  now.setYear(now.getFullYear() + yearAddition)
  return now
}

function assertRequiredCheckAdviser() {
  return cy.get('[data-test="field-adviser"]')
}

function assertRequiredCheckDate() {
  return cy.get('[data-test="field-date"]')
}

function assertRequiredChecks() {
  return cy.get('[data-test="field-required_checks"]')
}

function assertInvestorDescription() {
  return cy.get('[data-test="field-investor_notes"]')
}

function assertCapitalValue() {
  return cy.get('[data-test="field-investable_capital"]')
}

function assertGlobalAssetsAmount() {
  return cy.get('[data-test="field-global_assets_under_management"]')
}

function assertInvestorType() {
  return cy.get('[data-test="field-investor_type"]')
}

function assertAndGetInvestorDetails() {
  return cy.get('.large-capital-profile')
}

function gotoEditInvestorDetails(companyId) {
  cy.visit(
    `${urls.companies.investments.largeCapitalProfile(
      companyId
    )}?editing=investor-details`
  )
}
