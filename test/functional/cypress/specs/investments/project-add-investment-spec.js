const { expect } = require('chai')

const urls = require('../../../../../src/lib/urls')
const { company } = require('../../fixtures')
const {
  assertSummaryTable,
  assertFieldTypeahead,
  assertFieldTextarea,
  assertFieldRadios,
  assertFieldRadiosWithLegend,
  assertFieldInput,
  assertFieldSelect,
  assertFieldDate,
  assertFieldDateShort,
} = require('../../support/assertions')
const { clearTypeahead } = require('../../support/form-fillers')

const { usCompany } = company

const investmentTypeTests = () => {
  it('should display a form"', () => {
    cy.get('form').should('be.visible')
  })

  it('should display the "Investment type"', () => {
    cy.get('form legend').should('contain', 'Investment type')
  })

  it('should display 3 radio buttons', () => {
    cy.get('input[type="radio"]').should('have.length', 3)
  })

  it('should display an "FDI" radio button label', () => {
    cy.get('form')
      .find('label')
      .eq(0)
      .should('contain', 'FDI')
      .should('not.be.checked')
  })

  it('should display the FDI info text', () => {
    cy.get('[data-test="fdi-info"]')
      .should('exist')
      .should(
        'have.text',
        'Is this a Foreign Direct Investment (FDI) project?Is there a foreign direct investor involved in the Project and is the global HQ of the company based outside the UK?Is there a new (additional) financial investment being made in the UK as a result of the Project?Is there a UK Foreign Direct Enterprise established in the UK with at least 10% foreign ownership?Will the UK foreign direct enterprise be involved in a business (commercial) activity in the UK which is expected to last at least 3 years?Is there at least 1 new job created as a result of the Project (or safeguarded jobs for Retentions or M&As)?If a Retention or M&A project is being claimed, is there evidence that the UK jobs were at risk?'
      )
  })

  it('should display a "Non-FDI" radio button label', () => {
    cy.get('form')
      .find('label')
      .eq(1)
      .should('contain', 'Non-FDI')
      .should('not.be.checked')
  })

  it('should display the Non-FDI info text', () => {
    cy.get('[data-test="non-fdi-info"]')
      .should('exist')
      .should(
        'have.text',
        'Is this an Non-FDI project?Is there a foreign investor/partner involved in the project?Is it clear who is the UK recipient organisation in the proposed collaboration and partnership project?Is the R&D Collaboration or partnership aimed at creating (or validating) new to the world technology, products or services that will lead to creation (or testing) new intellectual property (IP) in the UK?Will there be a new IP created (or validated) by the R&D collaboration or partnership be registered or used in the UK?Will the project create or maintain (directly or indirectly) at least 1 job in the UK partner organisation for a duration of at least 6 months?ORIs there additional financial support from the foreign partner which will ensure the continuation of the R&D Collaboration or partnership project in the UK site for a minimum of 6 months?'
      )
  })

  it('should display a "Commitment to invest" radio button label', () => {
    cy.get('form')
      .find('label')
      .eq(2)
      .should('contain', 'Commitment to invest')
      .should('not.be.checked')
  })

  it('should display the Commitment to invest info text', () => {
    cy.get('[data-test="cti-info"]')
      .should('exist')
      .should(
        'have.text',
        'Is this a Commitment to Invest project?Is this a Commitment to Invest – a project where a company is investing money into a large and multi-component investment project with a long period of preparation and implementation (e.g. infrastructure or regeneration)?'
      )
  })

  it('should display a list of "FDI types" when selecting "FDI"', () => {
    cy.get('[data-test="investment-type-fdi"]').click()
    cy.get('[data-test="field-fdi_type"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Type of Foreign Direct Investment (FDI)',
        placeholder: 'Select an FDI type',
      })
    })
  })

  it('should display a "Continue" button', () => {
    cy.get('form button').should('have.text', 'Continue')
  })
}

describe('Adding an investment via "Companies"', () => {
  beforeEach(() => {
    cy.visit(urls.companies.investments.companyInvestmentProjects(usCompany.id))
    cy.get('[data-test="add-collection-item-button"]').click()
  })
  it('should display the "Source of foreign equity investment" table', () => {
    assertSummaryTable({
      dataTest: 'clientCompanyTable',
      heading: 'Source of foreign equity investment',
      content: {
        Company: 'Texports Ltd',
        Country: 'United States',
        'Company investments': '12 investment projects in the UK',
        'One List tier': 'Tier A - Strategic Account',
        'Global Account Manager': 'Travis Greene',
      },
    })
  })
  investmentTypeTests()
})

describe('Adding an investment via "Investments"', () => {
  beforeEach(() => {
    cy.visit(urls.investments.projects.index())
    cy.get('[data-test="add-collection-item-button"]').click()
  })

  it('should take us to create investment page', () => {
    cy.location('pathname').should('eq', `/investments/projects/create`)
  })

  it('should display "Search for a company as the source of foreign equity"', () => {
    cy.get('label')
      .parent()
      .should(
        'have.text',
        'Search for a company as the source of foreign equity'
      )
  })

  it('should display a "Search" button', () => {
    cy.get('form button:contains("Search")').should('be.visible')
  })

  it('should display error messages when the "Company name" search field is not filled in', () => {
    cy.get('form button').click()
    cy.get('[data-test="summary-form-errors"] h2').should(
      'contain',
      'There is a problem'
    )
    cy.get('[data-test="summary-form-errors"] ul').should(
      'contain',
      'Enter company name'
    )
    cy.get('[data-test="field-companyName"]').should(
      'contain',
      'Enter company name'
    )
  })

  it('should display error messages when the search character count is below the threshold', () => {
    cy.get('input[data-test="company-name"]').type('a')
    cy.get('form button').click()
    cy.get('[data-test="summary-form-errors"] ul').should(
      'contain',
      'Enter at least 2 characters'
    )
  })

  it('should produce search results when searching for a company', () => {
    cy.get('input[data-test="company-name"]').clear()
    cy.get('input[data-test="company-name"]').type('alphabet')
    cy.get('form button').click()
    cy.get('form ol li:nth-child(1)').should('exist')
    cy.get('form ol li:nth-child(2)').should('exist')
    cy.get('form ol li:nth-child(3)').should('exist')
  })

  it('should take you to the next step when clicking a company from the search results', () => {
    cy.get('input[data-test="company-name"]').clear()
    cy.get('input[data-test="company-name"]').type('alphabet')
    cy.get('form button').click()
    cy.get('form ol li:nth-child(1)').click()
    assertSummaryTable({
      dataTest: 'clientCompanyTable',
      heading: 'Source of foreign equity investment',
      content: {
        Company: 'Lambda plc',
        Country: 'France',
        'Company investments': '12 investment projects in the UK',
      },
    })
  })
})

describe('Investment Detail Step Form Content', () => {
  beforeEach(() => {
    cy.visit(urls.investments.projects.index())
    cy.get('[data-test="add-collection-item-button"]').click()
    cy.get('input[data-test="company-name"]').clear()
    cy.get('input[data-test="company-name"]').type('alphabet')
    cy.get('form button').click()
    cy.get('form ol li:nth-child(1)').click()
    cy.get('[data-test="investment-type-non-fdi"]').click()
    cy.get('[data-test="continue"]').click()
  })

  it('should display a form"', () => {
    cy.get('form').should('be.visible')
  })

  it('should display the Project name field', () => {
    cy.get('form label').should('contain', 'Project name')
    cy.get('[data-test="field-name"]').should('be.visible')
  })

  it('should display the Project description field', () => {
    cy.get('[data-test="field-description"]').then((element) => {
      assertFieldTextarea({
        element,
        label: 'Project description',
        hint: 'Provide a short description of the project',
      })
    })
  })

  it('should display the Anonymous project details field', () => {
    cy.get('[data-test="field-anonymous_description"]').then((element) => {
      assertFieldTextarea({
        element,
        label: 'Anonymous project details',
        hint: 'Do not include company names, financial details or addresses',
      })
    })
  })

  it('should display the Primary sector field', () => {
    cy.get('[data-test="field-sector"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Primary sector',
        placeholder: 'Choose a sector',
      })
    })
  })

  it('should display the Business activities field', () => {
    cy.get('[data-test="field-business_activities"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Business activities',
        placeholder: 'Choose a business activity',
        hint: 'You can select more than one activity',
      })
    })
  })

  it('should not display the other business activitiy field', () => {
    clearTypeahead('[data-test=field-business_activities]')

    cy.get('[data-test="field-other_business_activity"]').should('not.exist')
  })

  it('should display the other business activitiy field if Other listed in Business activities field', () => {
    clearTypeahead('[data-test=field-business_activities]')
    cy.get('[data-test="field-business_activities"]').selectTypeaheadOption(
      'Other'
    )

    cy.get('[data-test="field-other_business_activity"]').then((element) => {
      assertFieldInput({
        element,
        label: 'Other business activity',
        hint: 'Tell us more about the other business activity here',
      })
    })
  })

  it('should display the Client contact details field', () => {
    cy.get('[data-test="field-client_contacts"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Client contact details',
        placeholder: 'Choose a client contact',
      })
    })
  })

  it('should display the add a new contact link', () => {
    cy.get('[data-test="add-a-new-contact-link"]').should(
      'contain',
      'add a new contact'
    )
  })

  it('should display the add a new contact details', () => {
    cy.get('[data-test="contact-information-details"]').should(
      'contain',
      'Information needed to add a new contact'
    )
  })

  it('should display the Client relationship manager field', () => {
    cy.get('[data-test="field-clientRelationshipManager"]').then((element) => {
      assertFieldRadiosWithLegend({
        element,
        legend: 'Are you the client relationship manager for this project?',
        optionsCount: 2,
      })
    })
  })

  it('should display the Referral source field', () => {
    cy.get('[data-test="field-is_referral_source"]').then((element) => {
      assertFieldRadiosWithLegend({
        element,
        legend: 'Are you the referral source for this project?',
        optionsCount: 2,
      })
    })
  })

  it('should display the Referral source activity field', () => {
    cy.get('[data-test="field-referral_source_activity"]').then((element) => {
      assertFieldSelect({
        element,
        label: 'Referral source activity',
        placeholder: 'Choose a referral source activity',
        optionsCount: 53,
      })
    })
  })

  it('should display the Estimated land date field', () => {
    cy.get('[data-test="field-estimated_land_date"]').then((element) => {
      assertFieldDateShort({
        element,
        label: 'Estimated land date',
      })
    })
  })

  it('should display the Actual land date field', () => {
    cy.get('[data-test="field-actual_land_date"]').then((element) => {
      assertFieldDate({
        element,
        label: 'Actual land date',
        value: { day: '', month: '', year: '' },
      })
    })
  })

  it('should display the new or existing investor field', () => {
    cy.get('[data-test="field-investor_type"]').then((element) => {
      assertFieldRadios({
        element,
        label: 'Is the investor new or existing? (optional)',
        optionsCount: 2,
      })
    })
  })

  it('should display the level of investor involvement field', () => {
    cy.get('[data-test="field-level_of_involvement"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Level of investor involvement (optional)',
        placeholder: 'Choose a level of involvement',
      })
    })
  })

  it('should display the specific investment programme field', () => {
    cy.get('[data-test="field-specific_programme"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Specific investment programme (optional)',
        placeholder: 'Choose a specific programme',
      })
    })
  })

  it('should display the form submit and back buttons', () => {
    cy.get('[data-test="submit"]').should('be.visible')
    cy.get('form button:contains("Back")').should('be.visible')
  })
})

describe('Validation error messages', () => {
  const validationErrorMessages = [
    'Enter a project name',
    'Enter a project description',
    'Choose a primary sector',
    'Choose a business activity',
    'Choose a client contact',
    "Select yes if you're the client relationship manager for this project",
    "Select yes if you're the referral source for this project",
    'Enter an estimated land date',
    'Choose a referral source activity',
  ]

  const validationErrorMessageOtherBusinessActivities =
    "Enter an 'Other' business activity"

  beforeEach(() => {
    cy.visit(urls.investments.projects.index())
    cy.get('[data-test="add-collection-item-button"]').click()
    cy.get('input[data-test="company-name"]').clear()
    cy.get('input[data-test="company-name"]').type('alphabet')
    cy.get('form button').click()
    cy.get('form ol li:nth-child(1)').click()
    cy.get('[data-test="investment-type-non-fdi"]').click()
    cy.get('[data-test="continue"]').click()
  })

  it('should display validation error messages', () => {
    cy.get('[data-test="submit"]').click()
    cy.get('[data-test="summary-form-errors"] ul > li').each(($li, i) => {
      expect($li.text()).to.equal(validationErrorMessages[i])
      assert.notEqual($li.text(), validationErrorMessageOtherBusinessActivities)
    })
  })

  it('should display Other Business Activities validation error messages', () => {
    cy.get('[data-test="field-business_activities"]').selectTypeaheadOption(
      'Other'
    )
    cy.get('[data-test="submit"]').click()
    cy.get('a[href="#field-other_business_activity"]').contains(
      validationErrorMessageOtherBusinessActivities
    )
  })

  it('should display a validation error message if a future date is entered as the actual land date', () => {
    cy.get('[data-test="actual_land_date-day"]').type('04')
    cy.get('[data-test="actual_land_date-month"]').type('02')
    cy.get('[data-test="actual_land_date-year"]').type('2350')
    cy.get('[data-test="submit"]').click()
    cy.contains('Actual land date cannot be in the future')
  })
})
