const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const { assertKeyValueTable } = require('../../support/assertions')
const {
  selectFirstTypeaheadOption,
} = require('../../../../functional/cypress/support/actions')

const { companies, investments } = require('../../../../../src/lib/urls')

const populateForm = (data) => {
  cy.get(selectors.investment.form.name).type(data.name)
  cy.get(selectors.investment.form.description).type(data.description)
  cy.get(selectors.investment.form.anonymousDescription).type(
    data.anonymousDescription
  )
  selectFirstTypeaheadOption({
    element: selectors.investment.form.primarySector,
    input: data.sector,
  })
  selectFirstTypeaheadOption({
    element: selectors.investment.form.businessActivities,
    input: data.businessActivities,
  })
  selectFirstTypeaheadOption({
    element: selectors.investment.form.clientContact,
    input: data.contact,
  })
  cy.get(selectors.investment.form.clientRelationshipManagerYes).click()
  cy.get(selectors.investment.form.referralSourceYes).click()
  cy.get(selectors.investment.form.referralSourceActivity).select(
    data.referralSource
  )
  cy.get(selectors.investment.form.estimatedLandDateMonth).type(
    data.estimateMonth
  )
  cy.get(selectors.investment.form.estimatedLandDateYear).type(
    data.estimateYear
  )
  cy.get(selectors.investment.form.actualLandDateYear).type(data.year)
  cy.get(selectors.investment.form.actualLandDateMonth).type(data.month)
  cy.get(selectors.investment.form.actualLandDateDay).type(data.day)
  selectFirstTypeaheadOption({
    element: selectors.investment.form.investorType,
    input: data.investor,
  })
  selectFirstTypeaheadOption({
    element: selectors.investment.form.levelOfInvolvement,
    input: data.investorLevel,
  })
  selectFirstTypeaheadOption({
    element: selectors.investment.form.specificInvestmentProgramme,
    input: data.specificInvestmentProgramme,
  })
  cy.get(selectors.investment.form.submitButton).click()
}

describe('Creating an investment project', () => {
  const data = {
    name: 'FDI Auto Project',
    description: 'FDI Auto Description',
    anonymousDescription: 'Anonymous description',
    sector: 'Aerospace',
    businessActivities: 'Assembly',
    contact: 'Johnny Cakeman',
    referralSource: 'Bank',
    estimateMonth: '10',
    estimateYear: '2030',
    day: '5',
    month: '5',
    year: '2031',
    investor: 'New Investor',
    investorLevel: 'HQ and Post Only',
    specificInvestmentProgramme: 'Space',
  }

  describe('Creating an "FDI" project from Companies', () => {
    const company = fixtures.company.create.lambda()
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(companies.investments.companyInvestment(company.pk))
    })

    it('should create an FDI project', () => {
      cy.contains('Add investment project').click()
      cy.get(selectors.companyInvestmentProjects.fdiInvestmentType).click()
      cy.get(selectors.companyInvestmentProjects.fdiType).select('Merger')
      cy.get(selectors.companyInvestmentProjects.continue).click()

      populateForm(data)
      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment project created'
      )

      assertKeyValueTable('summaryContainer', {
        Client: 'Lambda plc',
        'Investment type': 'FDI, Merger',
        'Primary sector': data.sector,
        'Business activity': data.businessActivities,
        'Client contacts': data.contact,
        'Project description': data.description,
        'Anonymised description': data.anonymousDescription,
        'Estimated land date': 'October 2030',
        'Actual land date': '5 May 2031',
        'New or existing investor': data.investor,
        'Level of involvement': data.investorLevel,
        'Specific investment programme': data.specificInvestmentProgramme,
      })
    })

    it('should add value to an investment project', () => {
      cy.contains('Add value').click()
      cy.get(selectors.investment.value.totalInvestmentRadioYes).click()
      cy.get(selectors.investment.value.totalInvestment).type('100000')
      cy.get(selectors.investment.value.foreignEquityInvestmentRadioYes).click()
      cy.get(selectors.investment.value.foreignEquityInvestment).type('500000')
      cy.get(selectors.investment.value.newJobs).type('500')
      cy.get(selectors.investment.value.safeguardedJobs).type('600')
      cy.get(selectors.investment.value.governmentAssistanceRadioYes).click()
      cy.get(selectors.investment.value.rDBudgetRadioYes).click()
      cy.get(selectors.investment.value.nonFdiRDProjectRadioYes).click()
      cy.get(selectors.investment.value.newToWorldTechRadioYes).click()
      cy.get(selectors.investment.value.exportRevenueRadioYes).click()
      cy.get(selectors.investment.value.save).click()

      assertKeyValueTable('valueContainer', {
        'Total investment': '£100,000.00',
        'Capital expenditure value': '£500,000.00',
        'Gross Value Added (GVA)': '£31,050.00',
        'Government assistance': 'Has government assistance',
        'New jobs': '500 new jobs',
        'Safeguarded jobs': '600 safeguarded jobs',
        'R&D budget': 'Has R&D budget',
        'Non-FDI R&D project': 'Find project',
        'New-to-world tech': 'Has new-to-world tech, business model or IP',
        'Export revenue': 'Yes, will create significant export revenue',
      })
    })
  })

  describe('Creating a "Non-FDI" project from Companies', () => {
    const company = fixtures.company.create.lambda()
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(companies.investments.companyInvestment(company.pk))
    })

    it('should create a Non-FDI project', () => {
      cy.contains('Add investment project').click()
      cy.get(selectors.companyInvestmentProjects.nonFdiInvestmentType).click()
      cy.get(selectors.companyInvestmentProjects.continue).click()

      populateForm(data)
      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment project created'
      )

      assertKeyValueTable('summaryContainer', {
        Client: 'Lambda plc',
        'Investment type': 'Non-FDI',
        'Primary sector': data.sector,
        'Business activity': data.businessActivities,
        'Client contacts': data.contact,
        'Project description': data.description,
        'Anonymised description': data.anonymousDescription,
        'Estimated land date': 'October 2030',
        'Actual land date': '5 May 2031',
        'New or existing investor': data.investor,
        'Level of involvement': data.investorLevel,
        'Specific investment programme': data.specificInvestmentProgramme,
      })
    })

    it('should add value to an investment project when user selects no value', () => {
      cy.contains('Add value').click()
      cy.get(selectors.investment.value.totalInvestmentRadioNo).click()
      cy.get(selectors.investment.value.foreignEquityInvestmentRadioNo).click()
      cy.get(selectors.investment.value.newJobs).type('500')
      cy.get(selectors.investment.value.safeguardedJobs).type('600')
      cy.get(selectors.investment.value.governmentAssistanceRadioNo).click()
      cy.get(selectors.investment.value.rDBudgetRadioNo).click()
      cy.get(selectors.investment.value.nonFdiRDProjectRadioNo).click()
      cy.get(selectors.investment.value.newToWorldTechRadioNo).click()
      cy.get(selectors.investment.value.exportRevenueRadioNo).click()
      cy.get(selectors.investment.value.save).click()

      assertKeyValueTable('valueContainer', {
        'Total investment': 'Client cannot provide this information',
        'Capital expenditure value': 'Client cannot provide this information',
        'Government assistance': 'No government assistance',
        'New jobs': '500 new jobs',
        'Safeguarded jobs': '600 safeguarded jobs',
        'R&D budget': 'No R&D budget',
        'Non-FDI R&D project': 'Not linked to a non-FDI R&D project',
        'New-to-world tech': 'No new-to-world tech, business model or IP',
        'Export revenue': 'No, will not create significant export revenue',
      })
    })
  })

  describe('Creating a "Commitment to invest" project from Companies', () => {
    const company = fixtures.company.create.lambda()
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(companies.investments.companyInvestment(company.pk))
    })

    it('should create a commitment to investment project', () => {
      cy.contains('Add investment project').click()
      cy.get(selectors.companyInvestmentProjects.ctiInvestmentType).click()
      cy.get(selectors.companyInvestmentProjects.continue).click()

      populateForm(data)

      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment project created'
      )

      assertKeyValueTable('summaryContainer', {
        Client: 'Lambda plc',
        'Investment type': 'Commitment to invest',
        'Primary sector': data.sector,
        'Business activity': data.businessActivities,
        'Client contacts': data.contact,
        'Project description': data.description,
        'Anonymised description': data.anonymousDescription,
        'Estimated land date': 'October 2030',
        'Actual land date': '5 May 2031',
        'New or existing investor': data.investor,
        'Level of involvement': data.investorLevel,
        'Specific investment programme': data.specificInvestmentProgramme,
      })
    })
  })

  describe('Creating an "FDI" project from Investments', () => {
    before(() => {
      cy.visit(investments.projects.index())
      cy.contains('Add investment project').click()
    })
    it('should create an FDI project', () => {
      cy.get('input[data-test="company-name"]')
        .type('Mars Exports Ltd')
        .type('{enter}')
      cy.get('[data-test="entity-list-item"]')
        .first()
        .contains('Mars Exports Ltd')
        .click()
      cy.get(selectors.companyInvestmentProjects.fdiInvestmentType).click()
      cy.get(selectors.companyInvestmentProjects.fdiType).select('Merger')
      cy.get(selectors.companyInvestmentProjects.continue).click()

      populateForm({
        ...data,
        contact: 'Fred Peterson',
      })

      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment project created'
      )

      assertKeyValueTable('summaryContainer', {
        Client: 'Mars Exports Ltd',
        'Investment type': 'FDI, Merger',
        'Primary sector': data.sector,
        'Business activity': data.businessActivities,
        'Client contacts': 'Fred Peterson',
        'Project description': data.description,
        'Anonymised description': data.anonymousDescription,
        'Estimated land date': 'October 2030',
        'Actual land date': '5 May 2031',
        'New or existing investor': data.investor,
        'Level of involvement': data.investorLevel,
        'Specific investment programme': data.specificInvestmentProgramme,
      })
    })

    describe('Creating a "Non-FDI" project from Investments', () => {
      before(() => {
        cy.visit(investments.projects.index())
        cy.contains('Add investment project').click()
      })
      it('should create a Non-FDI project', () => {
        cy.get('input[data-test="company-name"]')
          .type('Mars Exports Ltd')
          .type('{enter}')
        cy.get('[data-test="entity-list-item"]')
          .first()
          .contains('Mars Exports Ltd')
          .click()
        cy.get(selectors.companyInvestmentProjects.nonFdiInvestmentType).click()
        cy.get(selectors.companyInvestmentProjects.continue).click()

        populateForm({
          ...data,
          contact: 'Fred Peterson',
        })

        cy.get('[data-test="status-message"]').should(
          'contain',
          'Investment project created'
        )

        assertKeyValueTable('summaryContainer', {
          Client: 'Mars Exports Ltd',
          'Investment type': 'Non-FDI',
          'Primary sector': data.sector,
          'Business activity': data.businessActivities,
          'Client contacts': 'Fred Peterson',
          'Project description': data.description,
          'Anonymised description': data.anonymousDescription,
          'Estimated land date': 'October 2030',
          'Actual land date': '5 May 2031',
          'New or existing investor': data.investor,
          'Level of involvement': data.investorLevel,
          'Specific investment programme': data.specificInvestmentProgramme,
        })
      })
    })

    describe('Creating a "Commitment to invest" project from Investments', () => {
      before(() => {
        cy.visit(investments.projects.index())
        cy.contains('Add investment project').click()
      })

      it('should create a commitment to investment project', () => {
        cy.get('input[data-test="company-name"]')
          .type('Mars Exports Ltd')
          .type('{enter}')
        cy.get('[data-test="entity-list-item"]')
          .first()
          .contains('Mars Exports Ltd')
          .click()
        cy.get(selectors.companyInvestmentProjects.ctiInvestmentType).click()
        cy.get(selectors.companyInvestmentProjects.continue).click()

        populateForm({
          ...data,
          contact: 'Fred Peterson',
        })

        cy.get('[data-test="status-message"]').should(
          'contain',
          'Investment project created'
        )

        assertKeyValueTable('summaryContainer', {
          Client: 'Mars Exports Ltd',
          'Investment type': 'Commitment to invest',
          'Primary sector': data.sector,
          'Business activity': data.businessActivities,
          'Client contacts': 'Fred Peterson',
          'Project description': data.description,
          'Anonymised description': data.anonymousDescription,
          'Estimated land date': 'October 2030',
          'Actual land date': '5 May 2031',
          'New or existing investor': data.investor,
          'Level of involvement': data.investorLevel,
          'Specific investment programme': data.specificInvestmentProgramme,
        })
      })
    })
  })
})
