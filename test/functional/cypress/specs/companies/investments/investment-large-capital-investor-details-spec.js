const {
  assertBreadcrumbs,
  assertFieldInput,
  assertFieldTextarea,
  assertFieldRadiosWithLegend,
  assertFieldDate,
  assertSingleTypeaheadOptionSelected,
  assertUrl,
  assertRequestBody,
  assertFlashMessage,
  assertAPIRequest,
  assertLink,
} = require('../../../support/assertions')
const urls = require('../../../../../../src/lib/urls')
const fixtures = require('../../../fixtures')
const {
  clearAndInputDateValueObject,
  clickButton,
} = require('../../../support/actions')
const { decimal } = require('../../../../../../src/client/utils/number-utils')

const { oneListCorp: existingCompany, lambdaPlc: newCompany } = fixtures.company

const EDIT_INVESTOR_INTERCEPT = 'editInvestorHttpRequest'

describe('View large capital investor details page', () => {
  beforeEach(() => {
    cy.intercept('PATCH', '/api-proxy/v4/large-investor-profile/*').as(
      EDIT_INVESTOR_INTERCEPT
    )
  })

  context('when the company already exists', () => {
    beforeEach(() => {
      gotoEditInvestorDetails(existingCompany.id)
    })

    it('should have the correct url or breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        [existingCompany.name]: urls.companies.detail(existingCompany.id),
        Investment: null,
      })
    })

    it('should render the cancel link', () => {
      assertLink(
        'cancel-button',
        urls.companies.investments.largeCapitalProfile(existingCompany.id)
      )
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
          value: decimal('1000000'),
        })
      })
    })

    it('should have investable with capital value', () => {
      assertCapitalValue().then((element) => {
        assertFieldInput({
          element,
          label: 'Investable capital',
          hint: 'Enter value in US dollars',
          value: decimal('30000'),
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
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        [newCompany.name]: urls.companies.detail(newCompany.id),
        Investment: null,
      })
    })
  })

  context('when successfully saved', () => {
    beforeEach(() => {
      gotoEditInvestorDetails(existingCompany.id)
    })

    it('should save and redirect when valid data assigned', () => {
      const lastMonth = getDateFromNow({ day: 3, monthAddition: -1 })
      const expectedBody = {
        id: '63010090-ba38-4894-84a7-dc039c84edb3',
        investor_company_id: existingCompany.id,
        investor_type: '80168d31-fa91-494e-9ad5-b9255e01b5da',
        global_assets_under_management: 1000000,
        investable_capital: 30000,
        investor_description: '',
        required_checks_conducted: '02d6fc9b-fbb9-4621-b247-d86f2487898e',
        required_checks_conducted_on: `${lastMonth.getFullYear()}-${(
          lastMonth.getMonth() + 1
        ).toString()}-${lastMonth.getDate().toString()}`,
        required_checks_conducted_by: null,
      }
      assertRequiredCheckDate().then((element) => {
        clearAndInputDateValueObject({
          element,
          value: {
            day: lastMonth.getDate().toString(),
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

function gotoEditInvestorDetails(companyId) {
  cy.visit(urls.companies.investments.largeCapitalProfile(companyId))
  cy.get('#investor_details_toggle-toggle-button-open').click()
  cy.get('[data-test=investor_details_button]').click()
}
