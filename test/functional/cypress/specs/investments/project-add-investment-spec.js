const urls = require('../../../../../src/lib/urls')
const { company } = require('../../fixtures')
const { expect } = require('chai')

const {
  assertSelectOptions,
  assertSummaryTable,
  assertFieldTypeahead,
  assertFieldTextarea,
  assertFieldRadiosWithLegend,
  assertFieldInput,
  assertFieldSelect,
  assertFieldDate,
  assertFieldDateShort,
} = require('../../support/assertions')

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

  it('should display a "Non-FDI" radio button label', () => {
    cy.get('form')
      .find('label')
      .eq(1)
      .should('contain', 'Non-FDI')
      .should('not.be.checked')
  })

  it('should display a "Commitment to invest" radio button label', () => {
    cy.get('form')
      .find('label')
      .eq(2)
      .should('contain', 'Commitment to invest')
      .should('not.be.checked')
  })

  it('should display a list of "FDI types" when selecting "FDI"', () => {
    cy.checkRadioGroup('Investment type', 'FDI')
    assertSelectOptions('select option', [
      {
        label: 'Select an FDI type',
        value: '',
      },
      {
        label: 'Acquisition',
        value: 'ac035522-ad0b-4eeb-87f4-0ce964e4b104',
      },
      {
        label: 'Capital only',
        value: '840f62c1-bbcb-44e4-b6d4-a258d2ffa07d',
      },
      {
        label: 'Creation of new site or activity',
        value: 'f8447013-cfdc-4f35-a146-6619665388b3',
      },
      {
        label: 'Expansion of existing site or activity',
        value: 'd08a2f07-c366-4133-9a7e-35b6c88a3270',
      },
      {
        label: 'Joint venture',
        value: 'a7dbf6b3-9c04-43a7-9be9-d3072f138fab',
      },
      {
        label: 'Merger',
        value: '32018db0-fd2d-4b8c-aee4-a931bde3abe8',
      },
      {
        label: 'Retention',
        value: '0657168e-8a58-4f37-914f-ec541556fc28',
      },
    ])
  })

  it('should display a "Continue" button', () => {
    cy.get('form button').should('have.text', 'Continue')
  })
}

describe('Adding an investment via "Companies"', () => {
  before(() => {
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
  before(() => {
    cy.visit(urls.investments.projects.index())
    cy.get('[data-test="add-collection-item-button"]').click()
  })

  it('should display "Search for a company as the source of foreign equity"', () => {
    cy.get('label').should(
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
  before(() => {
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
    cy.get('[data-test="name"]').should('be.visible')
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
        placeholder: 'Search',
        hint: 'You can select more than one activity',
      })
    })
  })

  it('should display the add another activitiy field', () => {
    cy.get('[data-test="field-otherBusinessActivity"]').then((element) => {
      assertFieldRadiosWithLegend({
        element,
        legend:
          'Do you want to add another activity that is not available above?',
        optionsCount: 2,
      })
    })
  })

  it('should display the other business activitiy field', () => {
    cy.get('[data-test="other-business-activity-yes"]').check()
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
        placeholder: 'Search',
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
      "Information you'll need to add a contact"
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
    cy.get('[data-test="field-referralSourceAdviser"]').then((element) => {
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
        value: 'Choose a referral source activity',
        optionsCount: 46,
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
      assertFieldTypeahead({
        element,
        label: 'Is the investor new or existing? (optional)',
        placeholder: 'Choose an investor type',
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
    'Enter anonymous project details',
    'Choose a sector',
    'Choose a business activity',
    "Select yes if you're the client relationship manager for this project",
    "Select yes if you're the referral source for this project",
    'Choose a referral source activity',
    'Enter an estimated land date',
    'Choose a client contact',
  ]

  before(() => {
    cy.visit(urls.investments.projects.index())
    cy.get('[data-test="add-collection-item-button"]').click()
  })

  it('should display all validation error messages', () => {
    cy.get('input[data-test="company-name"]').clear()
    cy.get('input[data-test="company-name"]').type('alphabet')
    cy.get('form button').click()
    cy.get('form ol li:nth-child(1)').click()
    cy.get('[data-test="investment-type-non-fdi"]').click()
    cy.get('[data-test="continue"]').click()
    cy.get('[data-test="submit"]').click()
    cy.get('[data-test="summary-form-errors"] ul > li').each(($li, i) => {
      expect($li.text()).to.equal(validationErrorMessages[i])
    })
  })
})
