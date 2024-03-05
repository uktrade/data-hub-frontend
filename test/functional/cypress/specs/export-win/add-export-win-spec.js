import { omit } from 'lodash'

import { getTwelveMonthsAgo } from '../../../../../src/client/modules/ExportWins/Form/utils'
import { winTypeId } from '../../../../../src/client/modules/ExportWins/Form/constants'
import { clickContinueButton } from '../../support/actions'
import { companyFaker } from '../../fakers/companies'
import { contactFaker } from '../../fakers/contacts'
import urls from '../../../../../src/lib/urls'
import {
  assertUrl,
  assertFieldInput,
  assertFieldError,
  assertBreadcrumbs,
  assertLocalHeader,
  assertErrorSummary,
  assertSummaryTable,
  assertFieldTextarea,
  assertFieldTypeahead,
  assertFieldDateShort,
  assertFieldCheckboxes,
  assertFieldRadiosWithLegend,
} from '../../support/assertions'

const company = companyFaker({
  name: 'Advanced Mini Devices',
})

const twelveMonthsAgo = getTwelveMonthsAgo()
const month = twelveMonthsAgo.getMonth() + 1
const year = twelveMonthsAgo.getFullYear()

const create = urls.companies.exportWins.create(company.id)

const officerDetailsStep = create + '&step=officer_details'
const creditForThisWinStep = create + '&step=credit_for_this_win'
const customerDetailsStep = create + '&step=customer_details'
const winDetailsStep = create + '&step=win_details'
const supportProvidedStep = create + '&step=support_provided'
const checkBeforeSendingStep = create + '&step=check_before_sending'

const formFields = {
  officerDetails: {
    heading: '[data-test="step-heading"]',
    leadOfficer: '[data-test="field-lead_officer"]',
    teamType: '[data-test="field-team_type"]',
    hqTeam: '[data-test="field-hq_team"]',
    teamMembers: '[data-test="field-team_members"]',
    teamMembersHintText: '[data-test="hint-text"]',
  },
  creditForThisWin: {
    heading: '[data-test="step-heading"]',
    hint: '[data-test="hint"]',
    hintText: '[data-test="hint-text"]',
    radiosBtns: '[data-test="field-credit_for_win"]',
    radiosBtnYes: '[data-test="credit-for-win-yes"]',
    radiosBtnNo: '[data-test="credit-for-win-no"]',
    addAnother: '[data-test="field-addAnother"]',
    contributingOfficer: '[data-test="field-contributing_officer_0"]',
    teamType: '[data-test="field-team_type_0"]',
    hqTeam: '[data-test="field-hq_team_0"]',
  },
  customerDetails: {
    heading: '[data-test="step-heading"]',
    contacts: '[data-test="field-company_contacts"]',
    contactHint: '[data-test="contact-hint"]',
    location: '[data-test="field-customer_location"]',
    potential: '[data-test="field-business_potential"]',
    experience: '[data-test="field-export_experience"]',
  },
  winDetails: {
    heading: '[data-test="step-heading"]',
    hint: '[data-test="hint"]',
    country: '[data-test="field-country"]',
    date: '[data-test="field-date"]',
    dateMonth: '[data-test="date-month"]',
    dateYear: '[data-test="date-year"]',
    description: '[data-test="field-description"]',
    nameOfCustomer: '[data-test="field-name_of_customer"]',
    confidential: '[data-test="field-name_of_customer_confidential"]',
    businessType: '[data-test="field-business_type"]',
    winType: '[data-test="field-win_type"]',
    goodsVsServices: '[data-test="field-goods_vs_services"]',
    nameOfExport: '[data-test="field-name_of_export"]',
    sector: '[data-test="field-sector"]',
    exportWinCheckbox: '[data-test="checkbox-export_win"]',
    businessSuccessCheckbox: '[data-test="checkbox-business_success_win"]',
    odiCheckbox: '[data-test="checkbox-odi_win"]',
    winTypeValuesExport: '[data-test="win-type-values-export_win"]',
    winTypeValuesBusSupp: '[data-test="win-type-values-business_success_win"]',
    winTypeValuesODI: '[data-test="win-type-values-odi_win"]',
    totalExportValue: '[data-test="total-export-value"]',
  },
  supportProvided: {
    heading: '[data-test="step-heading"]',
    hint: '[data-test="hint"]',
    hvc: '[data-test="field-hvc"]',
    typeOfSupport: '[data-test="field-type_of_support"]',
    associatedProgramme: '[data-test="field-associated_programme"]',
    personallyConfirmed: '[data-test="field-is_personally_confirmed"]',
    lineManagerConfirmed: '[data-test="field-is_line_manager_confirmed"]',
  },
}

const clickContinueAndAssertUrl = (url) => {
  clickContinueButton()
  assertUrl(url)
}

const populateWinWithValues = ({ alias, winType, values }) =>
  values.forEach((value, index) =>
    cy.get(alias).find(`[data-test="${winType}-${index}-input"]`).type(value)
  )

const createBreakdown = ({ type, values }) =>
  values.map((value, index) => ({
    type,
    year: index + 1,
    value,
  }))

describe('Adding an export win', () => {
  beforeEach(() => {
    cy.intercept('GET', `/api-proxy/v4/company/${company.id}`, company)
    cy.intercept('GET', `/api-proxy/v4/contact?company_id=${company.id}`, {
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
    cy.intercept('GET', '/api-proxy/v4/metadata/team-type', [
      { id: '200', name: 'Investment (ITFG or IG)' },
      { id: '201', name: 'Trade (TD or ST)' },
    ])
    cy.intercept('GET', '/api-proxy/v4/metadata/hq-team-region-or-post?*', [
      { id: '300', name: 'DIT Education' },
      { id: '301', name: 'Healthcare UK' },
    ])
    cy.intercept('GET', '/api-proxy/v4/metadata/hvc', [
      { id: '400', name: 'Australia Consumer Goods & Retail: E004' },
    ])
    cy.intercept('GET', '/api-proxy/v4/metadata/support-type', [
      {
        id: '500',
        name: 'Market entry advice and support – DIT/FCO in UK',
      },
    ])
    cy.intercept('GET', '/api-proxy/v4/metadata/associated-programme', [
      { id: '600', name: 'Afterburner' },
    ])
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

  context('Officer details', () => {
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

  context('Credit for this win', () => {
    const { creditForThisWin } = formFields

    beforeEach(() => cy.visit(creditForThisWinStep))

    it('should render a step heading', () => {
      cy.get(creditForThisWin.heading).should(
        'have.text',
        'Credit for this win'
      )
    })

    it('should render a hint', () => {
      cy.get(creditForThisWin.hint).should(
        'have.text',
        'Other teams that helped with this win should be added so they can be credited, this will not reduce your credit for this win.'
      )
    })

    it('should render two unselected radio buttons', () => {
      cy.get(creditForThisWin.radiosBtns).then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Did any other teams help with this win?',
          optionsCount: 2,
        })
      })
      cy.get(creditForThisWin.radiosBtnYes)
        .should('not.be.checked')
        .parent()
        .should('have.text', 'Yes')
      cy.get(creditForThisWin.radiosBtnNo)
        .should('not.be.checked')
        .parent()
        .should('have.text', 'No')
    })

    it('should go to the next step when selecting "No" and then "Continue"', () => {
      cy.get(creditForThisWin.radiosBtnNo).check()
      clickContinueAndAssertUrl(customerDetailsStep)
    })

    it('should render a legend and hint text', () => {
      cy.get(creditForThisWin.radiosBtnYes).check()
      cy.get(creditForThisWin.addAnother)
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

  context('Customer details', () => {
    const { customerDetails } = formFields

    beforeEach(() => cy.visit(customerDetailsStep))

    it('should render a step heading', () => {
      cy.get(customerDetails.heading).should('have.text', 'Customer details')
    })

    it('should render a contact hint', () => {
      cy.get(customerDetails.contactHint).should(
        'have.text',
        'To select a customer contact name, it must have already been added to Data Hub. If not listed, go to the company page to add them.'
      )
    })

    it('should render Company contacts label and a Typeahead', () => {
      cy.get(customerDetails.contacts).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Company contacts',
          hint: 'This contact will be emailed to approve the win.',
        })
      })
    })

    it('should render HQ location label and a Typeahead', () => {
      cy.get(customerDetails.location).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'HQ location',
        })
      })
    })

    it('should render Export potential label and a Typeahead', () => {
      cy.get(customerDetails.potential).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Export potential',
        })
      })
    })

    it('should render Export potential label and a Typeahead', () => {
      cy.get(customerDetails.experience).then((element) => {
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
      assertFieldError(
        cy.get(customerDetails.contacts),
        'Select a contact',
        true
      )
      assertFieldError(
        cy.get(customerDetails.location),
        'Select HQ location',
        false
      )
      assertFieldError(
        cy.get(customerDetails.potential),
        'Select export potential',
        false
      )
      assertFieldError(
        cy.get(customerDetails.experience),
        'Select export experience',
        true
      )
    })
  })

  context('Win details', () => {
    const { winDetails } = formFields

    beforeEach(() => cy.visit(winDetailsStep))

    it('should render a step heading', () => {
      cy.get(winDetails.heading).should('have.text', 'Win details')
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

    it('should renderer Overseas customer', () => {
      cy.get(winDetails.nameOfCustomer).then((element) => {
        assertFieldInput({
          element,
          label: 'Overseas customer',
          placeholder: 'Add name',
        })
      })
    })

    it('should render a Confidential checkbox', () => {
      assertFieldCheckboxes({
        element: winDetails.confidential,
        hint: 'Check this box if your customer has asked for this not to be public (optional).',
        options: [
          {
            label: 'Confidential',
            checked: false,
          },
        ],
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
        hint: 'Select goods or services',
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
        'Enter the name of the overseas customer',
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
      assertFieldError(
        cy.get(winDetails.nameOfCustomer),
        'Enter the name of the overseas customer',
        false
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
  })

  context('Support provided', () => {
    const { supportProvided } = formFields

    beforeEach(() => cy.visit(supportProvidedStep))

    it('should render a step heading', () => {
      cy.get(supportProvided.heading).should('have.text', 'Support given')
    })

    it('should render a hint', () => {
      cy.get(supportProvided.hint).should(
        'have.text',
        'Did any of these help the customer achieve this win?'
      )
    })

    it('should render a typeahead for high value campaign', () => {
      cy.get(supportProvided.hvc).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'High Value Campaign (HVC) code (optional)',
          hint: 'If the win was linked to a HVC, select the appropriate campaign.',
        })
      })
    })

    it('should render a support given typeahead', () => {
      cy.get(supportProvided.typeOfSupport).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'What type of support was given?',
          hint: 'You can add up to 5 types of support.',
        })
      })
    })

    it('should render an associated programme typeahead', () => {
      cy.get(supportProvided.associatedProgramme).then((element) => {
        assertFieldTypeahead({
          element,
          label:
            'Was there a DBT campaign or event that contributed to this win?',
          hint: 'You can add up to 5 campaigns or events.',
        })
      })
    })

    it('should render personally confirmed checkbox', () => {
      assertFieldCheckboxes({
        element: supportProvided.personallyConfirmed,
        options: [
          {
            label: 'I confirm that this information is complete and accurate.',
            checked: false,
          },
        ],
      })
    })

    it('should render a manager confirmed checkbox', () => {
      assertFieldCheckboxes({
        element: supportProvided.lineManagerConfirmed,
        options: [
          {
            label:
              'My line manager has agreed that this win should be recorded.',
            checked: false,
          },
        ],
      })
    })

    it('should display validation error messages on mandatory fields', () => {
      clickContinueButton()
      assertErrorSummary([
        'Select at least one type of support',
        'Select at least one type of DBT campaign or event',
        'Confirm that this information is complete and accurate',
        'Confirm your line manager has agreed that this win should be recorded',
      ])
      assertFieldError(
        cy.get(supportProvided.typeOfSupport),
        'Select at least one type of support',
        true
      )
      assertFieldError(
        cy.get(supportProvided.associatedProgramme),
        'Select at least one type of DBT campaign or event',
        true
      )
      cy.get(supportProvided.personallyConfirmed).should(
        'contain',
        'Confirm that this information is complete and accurate'
      )
      cy.get(supportProvided.lineManagerConfirmed).should(
        'contain',
        'Confirm your line manager has agreed that this win should be recorded'
      )
    })
  })

  // Disable testIsolation due to multi step form with lots of data.
  context('Check before sending', { testIsolation: false }, () => {
    const {
      officerDetails,
      creditForThisWin,
      customerDetails,
      winDetails,
      supportProvided,
    } = formFields

    before(() => cy.visit(officerDetailsStep))

    it('should complete the entire export win user journey', () => {
      // Officer details
      cy.get(officerDetails.leadOfficer).selectTypeaheadOption('David')
      cy.get(officerDetails.teamType).selectTypeaheadOption(
        'Investment (ITFG or IG)'
      )
      cy.get(officerDetails.hqTeam).selectTypeaheadOption('DIT Education')

      clickContinueAndAssertUrl(creditForThisWinStep)

      // Credit for this win
      cy.get(creditForThisWin.radiosBtnYes).check()
      cy.get(creditForThisWin.contributingOfficer).selectTypeaheadOption('John')
      cy.get(creditForThisWin.teamType).selectTypeaheadOption(
        'Trade (TD or ST)'
      )
      cy.get(creditForThisWin.hqTeam).selectTypeaheadOption('Healthcare UK')

      clickContinueAndAssertUrl(customerDetailsStep)

      // Customer details
      cy.get(customerDetails.contacts).selectTypeaheadOption('Joseph Barker')
      cy.get(customerDetails.location).selectTypeaheadOption('Scotland')
      cy.get(customerDetails.potential).selectTypeaheadOption(
        'The company is a Medium Sized Business'
      )
      cy.get(customerDetails.experience).selectTypeaheadOption('Never exported')

      clickContinueAndAssertUrl(winDetailsStep)

      // Win details
      cy.get(winDetails.country).selectTypeaheadOption('United states')
      cy.get(winDetails.dateMonth).type(month)
      cy.get(winDetails.dateYear).type(year)
      cy.get(winDetails.description).find('textarea').type('Foo bar baz')
      cy.get(winDetails.nameOfCustomer).find('input').type('David French')
      cy.get(winDetails.confidential).find('input').check()
      cy.get(winDetails.businessType).find('input').type('Contract')

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

      cy.get(winDetails.goodsVsServices).find('input').eq(0).check() // Goods
      cy.get(winDetails.nameOfExport).find('input').type('Biscuits')
      cy.get(winDetails.sector).selectTypeaheadOption('Advanced Engineering')

      clickContinueAndAssertUrl(supportProvidedStep)

      // Suppport Provided
      cy.get(supportProvided.hvc).selectTypeaheadOption('Aus')
      cy.get(supportProvided.typeOfSupport).selectTypeaheadOption('Mar')
      cy.get(supportProvided.associatedProgramme).selectTypeaheadOption('Aft')
      cy.get(supportProvided.personallyConfirmed)
        .find('[data-test="checkbox-yes"]')
        .check()
      cy.get(supportProvided.lineManagerConfirmed)
        .find('[data-test="checkbox-yes"]')
        .check()

      clickContinueAndAssertUrl(checkBeforeSendingStep)
    })

    it('should render a step heading', () => {
      cy.get('[data-test="step-heading"]').should(
        'have.text',
        'Check before sending'
      )
    })

    it('should render an officer details table', () => {
      assertSummaryTable({
        dataTest: 'officer-details',
        heading: 'Officer details',
        showEditLink: false,
        content: {
          'Lead officer name': 'David Meyer',
          'Team type': 'Investment (ITFG or IG)',
          'HQ Team, region or post': 'DIT Education',
          'Team members (optional)': 'Not set',
        },
      })
    })

    it('should render a credit for this win table', () => {
      assertSummaryTable({
        dataTest: 'credit-for-this-win',
        heading: 'Credit for this win',
        showEditLink: false,
        content: {
          'Did any other teams help with this win?':
            'YesContributing teams and advisersContributing officer: John SmithTeam ' +
            'type: Trade (TD or ST)HQ team, region or post: Healthcare UK',
        },
      })
    })

    it('should render a customer details table', () => {
      assertSummaryTable({
        dataTest: 'customer-details',
        heading: 'Customer details',
        showEditLink: false,
        content: {
          'Contact name': 'Joseph Barker',
          'HQ location': 'Scotland',
          'Export potential': 'The company is a Medium Sized Business',
          'Export experience': 'Never exported',
        },
      })
    })

    it('should render a win details table', () => {
      assertSummaryTable({
        dataTest: 'win-details',
        heading: 'Win details',
        showEditLink: false,
        content: {
          Destination: 'United States',
          'Date won': `${month}/${year}`,
          'Summary of support given': 'Foo bar baz',
          'Overseas customer': 'David French',
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
        showEditLink: false,
        content: {
          'HVC code': 'Australia Consumer Goods & Retail: E004',
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

    it('should POST to the API and have the correct payload', () => {
      cy.get('[data-test="confirm-and-send-to-customer"]').should(
        'have.text',
        'Confirm and send to customer'
      )
      cy.intercept('POST', '/api-proxy/v4/export-win', {
        statusCode: 201,
      }).as('apiRequest')
      cy.get('[data-test="confirm-and-send-to-customer"]').click()
      cy.wait('@apiRequest').then(({ request }) => {
        expect(omit(request.body, '_csrf')).to.deep.equal({
          lead_officer: '100',
          team_type: '42bdaf2e-ae19-4589-9840-5dbb67b50add',
          hq_team: '300',
          team_members: [],
          advisers: [
            {
              adviser: '101',
              hq_team: '301',
              team_type: '201',
            },
          ],
          company_contacts: ['000'],
          customer_location: '8c4cd12a-6095-e211-a939-e4115bead28a',
          business_potential: 'e4d74957-60a4-4eab-a17b-d4c7b792ad25',
          export_experience: '051a0362-d1a9-41c0-8a58-3171e5f59a8e',
          country: '81756b9a-5d95-e211-a939-e4115bead28a',
          date: `${year}-${month}-01`,
          description: 'Foo bar baz',
          name_of_customer: 'David French',
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
          hvc: '400',
          type_of_support: ['500'],
          associated_programme: ['600'],
          is_personally_confirmed: true,
          is_line_manager_confirmed: true,
          total_expected_export_value: 5000000,
          total_expected_non_export_value: 10000000,
          total_expected_odi_value: 15000000,
          company: company.id,
          adviser: '7d19d407-9aec-4d06-b190-d3f404627f21',
        })
      })
    })
  })
})
