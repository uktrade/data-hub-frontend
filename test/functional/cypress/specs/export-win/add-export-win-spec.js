import { getTwelveMonthsAgo } from '../../../../../src/client/modules/ExportWins/Form/utils'
import { clickContinueButton } from '../../support/actions'
import { companyFaker } from '../../fakers/companies'
import { advisersListFaker } from '../../fakers/advisers'
import { teamTypeListFaker } from '../../fakers/team-type'
import { hqTeamListFaker } from '../../fakers/hq-team'
import urls from '../../../../../src/lib/urls'
import {
  assertUrl,
  assertFieldInput,
  assertFieldError,
  assertLocalHeader,
  assertErrorSummary,
  assertFieldTextarea,
  assertFieldTypeahead,
  assertFieldDateShort,
  assertFieldCheckboxes,
  assertFieldRadiosWithLegend,
} from '../../support/assertions'

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
    // Helpers
    const twelveMonthsAgo = getTwelveMonthsAgo()
    const month = twelveMonthsAgo.getMonth() + 1
    const year = twelveMonthsAgo.getFullYear()

    // Fields
    const country = '[data-test="field-country"]'
    const date = '[data-test="field-date"]'
    const description = '[data-test="field-description"]'
    const nameOfCustomer = '[data-test="field-name_of_customer"]'
    const confidential = '[data-test="field-name_of_customer_confidential"]'
    const businessType = '[data-test="field-business_type"]'
    const winType = '[data-test="field-win_type"]'
    const goodsVsServices = '[data-test="field-goods_vs_services"]'
    const nameOfExport = '[data-test="field-name_of_export"]'
    const sector = '[data-test="field-sector"]'

    beforeEach(() =>
      cy.visit(`${urls.companies.exportWins.create()}${winDetails}`)
    )

    it('should render a step heading', () => {
      cy.get('[data-test="step-heading"]').should('have.text', 'Win details')
    })

    it('should render a hint', () => {
      cy.get('[data-test="hint"]').should(
        'have.text',
        'The customer will be asked to confirm this information.'
      )
    })

    it('should render Destination country label and a Typeahead', () => {
      cy.get(country).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Destination country',
        })
      })
    })

    it('should render the Win date', () => {
      cy.get(date).then((element) => {
        // Both Month and Year labels are tested within the assertion
        assertFieldDateShort({
          element,
          label: 'Date won',
          hint: `For example ${month} ${year}, date of win must be in the last 12 months.`,
        })
      })
    })

    it('should render Summary of the support given', () => {
      cy.get(description).then((element) => {
        assertFieldTextarea({
          element,
          label: 'Summary of the support given',
          hint: 'Outline what had the most impact or would be memorable to the customer in less than 100 words.',
          wordCount: 'You have 100 words remaining.',
        })
      })
    })

    it('should renderer Overseas customer', () => {
      cy.get(nameOfCustomer).then((element) => {
        assertFieldInput({
          element,
          label: 'Overseas customer',
          placeholder: 'Add name',
        })
      })
    })

    it('should render a Confidential checkbox', () => {
      assertFieldCheckboxes({
        element: confidential,
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
      cy.get(businessType).then((element) => {
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
        element: winType,
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
      const exportWinCheckbox = '[data-test="checkbox-export_win"]'
      const exportWinTypeValues = '[data-test="win-type-values-export_win"]'
      const businessSuccessCheckbox =
        '[data-test="checkbox-business_success_win"]'
      const businessSuccessTypeValues =
        '[data-test="win-type-values-business_success_win"]'
      const odiCheckbox = '[data-test="checkbox-odi_win"]'
      const odiWinTypeValues = '[data-test="win-type-values-odi_win"]'

      cy.get(winType).as('winType')

      // Export win
      cy.get('@winType')
        .find(exportWinTypeValues)
        .should('not.exist')
        .get('@winType')
        .find(exportWinCheckbox)
        .check()
        .next()
        .get(exportWinTypeValues)
        .should('exist')

      // Business type
      cy.get('@winType')
        .find(businessSuccessTypeValues)
        .should('not.exist')
        .get('@winType')
        .find(businessSuccessCheckbox)
        .check()
        .next()
        .get(businessSuccessTypeValues)
        .should('exist')

      // ODI
      cy.get('@winType')
        .find(odiWinTypeValues)
        .should('not.exist')
        .get('@winType')
        .find(odiCheckbox)
        .check()
        .next()
        .get(odiWinTypeValues)
        .should('exist')
    })

    it('should render the total export value across all 3 win types', () => {
      cy.get(winType).as('winType')

      // Check the Export checkbox to render the input fields
      cy.get('@winType').find('[data-test="checkbox-export_win"]').check()

      const exportWinFields = [
        '[data-test="export-win-0-input"]',
        '[data-test="export-win-1-input"]',
        '[data-test="export-win-2-input"]',
        '[data-test="export-win-3-input"]',
        '[data-test="export-win-4-input"]',
      ]
      exportWinFields.forEach((dataTest) =>
        cy.get('@winType').find(dataTest).type('1000000')
      )

      // Check the Business success checkbox to render the input fields
      cy.get('@winType')
        .find('[data-test="checkbox-business_success_win"]')
        .check()

      const businessSuccessFields = [
        '[data-test="business-success-win-0-input"]',
        '[data-test="business-success-win-1-input"]',
        '[data-test="business-success-win-2-input"]',
        '[data-test="business-success-win-3-input"]',
        '[data-test="business-success-win-4-input"]',
      ]
      businessSuccessFields.forEach((dataTest) =>
        cy.get('@winType').find(dataTest).type('1000000')
      )

      // Check the ODI checkbox to render the input fields
      cy.get('@winType').find('[data-test="checkbox-odi_win"]').check()

      const odiFields = [
        '[data-test="odi-win-0-input"]',
        '[data-test="odi-win-1-input"]',
        '[data-test="odi-win-2-input"]',
        '[data-test="odi-win-3-input"]',
        '[data-test="odi-win-4-input"]',
      ]
      odiFields.forEach((dataTest) =>
        cy.get('@winType').find(dataTest).type('1000000')
      )

      // Assert the total export value
      cy.get('[data-test="total-export-value"]').should(
        'have.text',
        'Total export value: £15,000,000'
      )
    })

    it('should render Goods and Services', () => {
      assertFieldCheckboxes({
        element: goodsVsServices,
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
      cy.get(nameOfExport).then((element) => {
        assertFieldInput({
          element,
          label: 'Name of goods or services',
          hint: "For instance 'shortbread biscuits'.",
          placeholder: 'Enter a name for goods or services',
        })
      })
    })

    it('should render a sector label and typeahead', () => {
      cy.get(sector).then((element) => {
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
      assertFieldError(cy.get(country), 'Choose a destination country', false)
      assertFieldError(cy.get(date), 'Enter the win date', true)
      assertFieldError(cy.get(description), 'Enter a summary', true)
      assertFieldError(
        cy.get(nameOfCustomer),
        'Enter the name of the overseas customer',
        false
      )
      assertFieldError(
        cy.get(businessType),
        'Enter the type of business deal',
        true
      )
      assertFieldError(cy.get(winType), 'Choose at least one type of win', true)
      // We can't use assertFieldError here as it picks up the wrong span
      cy.get(goodsVsServices).should('contain', 'Select at least one option')
      assertFieldError(
        cy.get(nameOfExport),
        'Enter the name of goods or services',
        true
      )
      assertFieldError(cy.get(sector), 'Enter a sector', false)
    })

    it('should complete this step and continue to "Support provided"', () => {
      cy.get(country).selectTypeaheadOption('United states')
      cy.get(date).as('winDate')
      cy.get('@winDate').find('[data-test="date-month"]').type('03')
      cy.get('@winDate').find('[data-test="date-year"]').type('2023')
      cy.get(description).find('textarea').type('Foo bar baz')
      cy.get(nameOfCustomer).find('input').type('David French')
      cy.get(confidential).find('input[type="checkbox"]').check()
      cy.get(businessType).find('input').type('Contract')
      cy.get(winType).find('[data-test="checkbox-export_win"]').check()
      cy.get(goodsVsServices).find('input[type="checkbox"]').eq(0).check()
      cy.get(nameOfExport).find('input').type('Biscuits')
      cy.get(sector).selectTypeaheadOption('Advanced Engineering')
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
