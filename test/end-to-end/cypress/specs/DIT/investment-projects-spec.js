const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const {
  assertFieldRadiosWithoutLabel,
  assertSummaryTable,
} = require('../../../../functional/cypress/support/assertions')
const {
  selectFirstTypeaheadOption,
} = require('../../../../functional/cypress/support/actions')
const {
  EXPORT_REVENUE_FALSE,
  EXPORT_REVENUE_TRUE,
  NEW_TECH_TRUE,
  NEW_TECH_FALSE,
  R_AND_D_TRUE,
  R_AND_D_FALSE,
  NOT_LINKED_TO_R_AND_D,
  INVESTOR_TYPES,
  FDI_TYPES,
} = require('../../../../../src/client/modules/Investments/Projects/constants')

const { companies, investments } = require('../../../../../src/lib/urls')

const populateForm = (data, expansionProject = false) => {
  cy.get(selectors.investment.form.name).type(data.name)
  cy.get(selectors.investment.form.description).type(data.description)
  cy.get(selectors.investment.form.anonymousDescription).type(
    data.anonymousDescription
  )
  selectFirstTypeaheadOption({
    element: selectors.investment.form.primarySector,
    input: data.sector,
  })
  cy.get(selectors.investment.form.businessActivities).selectTypeaheadOption(
    data.businessActivities
  )
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
  if (!expansionProject) {
    cy.get(selectors.investment.form.investorTypeNew).click()
  }
  cy.get(selectors.investment.form.levelOfInvolvement).selectTypeaheadOption(
    data.investorLevel
  )
  cy.get(
    selectors.investment.form.specificInvestmentProgrammes
  ).selectTypeaheadOption(data.specificInvestmentProgrammes)
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
    investorLevel: 'HQ and Post Only',
    specificInvestmentProgrammes: 'Space',
  }

  describe('Creating an "FDI" project from Companies', () => {
    const company = fixtures.company.create.lambda()
    const contact = fixtures.contact.create(company.pk)

    beforeEach(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(companies.investments.companyInvestment(company.pk))
    })
    it('should create an FDI project and add value to an investment project', () => {
      cy.contains('Add investment project').click()
      cy.get(selectors.companyInvestmentProjects.fdiInvestmentType).click()
      cy.get(selectors.companyInvestmentProjects.fdiType).selectTypeaheadOption(
        'Merger'
      )
      cy.get(selectors.companyInvestmentProjects.continue).click()

      populateForm(data)
      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment project created'
      )

      assertSummaryTable({
        dataTest: 'project-details-table',
        content: {
          Client: 'Lambda plc',
          'Investment type': 'FDI, Merger',
          'Primary sector': data.sector,
          'Business activity': data.businessActivities,
          'Client contacts': data.contact,
          'Project description': data.description,
          'Anonymised description': data.anonymousDescription,
          'Estimated land date': 'October 2030',
          'Actual land date': '5 May 2031',
          'New or existing investor': 'New Investor',
          'Level of involvement': data.investorLevel,
          'Specific investment programme': data.specificInvestmentProgrammes,
        },
      })

      cy.contains('Add value').click()
      cy.get(selectors.investment.value.totalInvestmentRadioYes).click()
      cy.get(selectors.investment.value.totalInvestment).type('1000000')
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

      assertSummaryTable({
        dataTest: 'project-value-table',
        content: {
          'Total investment': '£1,000,000',
          'Capital expenditure value': '£500,000',
          'Gross Value Added (GVA)': '£104,825',
          'Government assistance': 'Has government assistance',
          'New jobs': '500 new jobs',
          'Safeguarded jobs': '600 safeguarded jobs',
          'R&D budget': R_AND_D_TRUE,
          'Non-FDI R&D project': 'Find project',
          'New-to-world tech': NEW_TECH_TRUE,
          'Export revenue': EXPORT_REVENUE_TRUE,
        },
      })
    })

    it('should create a capital only FDI project with job fields pre-populated', () => {
      cy.contains('Add investment project').click()
      cy.get(selectors.companyInvestmentProjects.fdiInvestmentType).click()
      cy.get(selectors.companyInvestmentProjects.fdiType).selectTypeaheadOption(
        FDI_TYPES.capitalOnly.label
      )
      cy.get(selectors.companyInvestmentProjects.continue).click()
      cy.intercept('POST', `/api-proxy/v3/investment`).as(
        'createProjectRequest'
      )
      populateForm(data)
      cy.wait('@createProjectRequest').its('request.body').should('include', {
        number_new_jobs: 0,
        number_safeguarded_jobs: 0,
      })
      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment project created'
      )
      assertSummaryTable({
        dataTest: 'project-value-table',
        content: {
          'New jobs': '0 new jobs',
          'Safeguarded jobs': '0 safeguarded jobs',
          'Non-FDI R&D project': 'Not linked to a non-FDI R&D project',
        },
      })
      cy.contains('Edit value')
    })

    it('should create an expansion FDI project with investor type field set to existing', () => {
      cy.contains('Add investment project').click()
      cy.get(selectors.companyInvestmentProjects.fdiInvestmentType).click()
      cy.get(selectors.companyInvestmentProjects.fdiType).selectTypeaheadOption(
        FDI_TYPES.expansionOfExistingSiteOrActivity.label
      )
      cy.get(selectors.companyInvestmentProjects.continue).click()
      cy.intercept('POST', `/api-proxy/v3/investment`).as(
        'createProjectRequest'
      )
      populateForm(data, (expansionProject = true))
      cy.wait('@createProjectRequest')
        .its('request.body')
        .should('deep.include', {
          investor_type: INVESTOR_TYPES.existing.value,
        })
      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment project created'
      )
      assertSummaryTable({
        dataTest: 'project-details-table',
        content: {
          Client: 'Lambda plc',
          'Investment type': 'FDI, Expansion of existing site or activity',
          'Primary sector': data.sector,
          'Business activity': data.businessActivities,
          'Client contacts': data.contact,
          'Project description': data.description,
          'Anonymised description': data.anonymousDescription,
          'Estimated land date': 'October 2030',
          'Actual land date': '5 May 2031',
          'New or existing investor': INVESTOR_TYPES.existing.label,
          'Level of involvement': data.investorLevel,
          'Specific investment programme': data.specificInvestmentProgrammes,
        },
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

    it('should create a Non-FDI project and add value to an investment project when user selects no value', () => {
      cy.contains('Add investment project').click()
      cy.get(selectors.companyInvestmentProjects.nonFdiInvestmentType).click()
      cy.get(selectors.companyInvestmentProjects.continue).click()

      populateForm(data)
      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment project created'
      )

      assertSummaryTable({
        dataTest: 'project-details-table',
        content: {
          Client: 'Lambda plc',
          'Investment type': 'Non-FDI',
          'Primary sector': data.sector,
          'Business activity': data.businessActivities,
          'Client contacts': data.contact,
          'Project description': data.description,
          'Anonymised description': data.anonymousDescription,
          'Estimated land date': 'October 2030',
          'Actual land date': '5 May 2031',
          'New or existing investor': 'New Investor',
          'Level of involvement': data.investorLevel,
          'Specific investment programme': data.specificInvestmentProgrammes,
        },
      })

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

      assertSummaryTable({
        dataTest: 'project-value-table',
        content: {
          'Total investment': 'Client cannot provide this information',
          'Capital expenditure value': 'Client cannot provide this information',
          'Government assistance': 'No government assistance',
          'New jobs': '500 new jobs',
          'Safeguarded jobs': '600 safeguarded jobs',
          'R&D budget': R_AND_D_FALSE,
          'Non-FDI R&D project': NOT_LINKED_TO_R_AND_D,
          'New-to-world tech': NEW_TECH_FALSE,
          'Export revenue': EXPORT_REVENUE_FALSE,
        },
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

    it('should create a commitment to investment project and change the project status', () => {
      cy.contains('Add investment project').click()
      cy.get(selectors.companyInvestmentProjects.ctiInvestmentType).click()
      cy.get(selectors.companyInvestmentProjects.continue).click()

      populateForm(data)

      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment project created'
      )

      assertSummaryTable({
        dataTest: 'project-details-table',
        content: {
          Client: 'Lambda plc',
          'Investment type': 'Commitment to invest',
          'Primary sector': data.sector,
          'Business activity': data.businessActivities,
          'Client contacts': data.contact,
          'Project description': data.description,
          'Anonymised description': data.anonymousDescription,
          'Estimated land date': 'October 2030',
          'Actual land date': '5 May 2031',
          'New or existing investor': 'New Investor',
          'Level of involvement': data.investorLevel,
          'Specific investment programme': data.specificInvestmentProgrammes,
        },
      })

      cy.contains('change').click()

      cy.get('[data-test="field-status"]').then((element) => {
        assertFieldRadiosWithoutLabel({
          element,
          optionsCount: 5,
          value: 'Ongoing',
        })
      })

      cy.get('[data-test="status-dormant"]').click()
      cy.get('[data-test="submit-button"]').click()

      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment status updated'
      )
      cy.contains('Dormant')
    })
  })

  describe('Creating an "FDI" project from Investments', () => {
    before(() => {
      cy.visit(investments.projects.index())
      cy.contains('Add investment project').click()
      cy.get('[data-test="field-companyName"]')
        .type('Mars Exports Ltd')
        .type('{enter}')
      cy.get('[data-test="entity-list-item"]')
        .first()
        .contains('Mars Exports Ltd')
        .click()
    })
    it('should create an FDI project', () => {
      cy.get(selectors.companyInvestmentProjects.fdiInvestmentType).click()
      cy.get(selectors.companyInvestmentProjects.fdiType).selectTypeaheadOption(
        'Merger'
      )
      cy.get(selectors.companyInvestmentProjects.continue).click()

      populateForm({
        ...data,
        contact: 'Fred Peterson',
      })

      cy.get('[data-test="status-message"]').should(
        'contain',
        'Investment project created'
      )

      assertSummaryTable({
        dataTest: 'project-details-table',
        content: {
          Client: 'Mars Exports Ltd',
          'Investment type': 'FDI, Merger',
          'Primary sector': data.sector,
          'Business activity': data.businessActivities,
          'Client contacts': 'Fred Peterson',
          'Project description': data.description,
          'Anonymised description': data.anonymousDescription,
          'Estimated land date': 'October 2030',
          'Actual land date': '5 May 2031',
          'New or existing investor': 'New Investor',
          'Level of involvement': data.investorLevel,
          'Specific investment programme': data.specificInvestmentProgrammes,
        },
      })
    })

    describe('Creating a "Non-FDI" project from Investments', () => {
      before(() => {
        cy.visit(investments.projects.index())
        cy.contains('Add investment project').click()
        cy.get('[data-test="field-companyName"]')
          .type('Mars Exports Ltd')
          .type('{enter}')
        cy.get('[data-test="entity-list-item"]')
          .first()
          .contains('Mars Exports Ltd')
          .click()
      })
      it('should create a Non-FDI project', () => {
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

        assertSummaryTable({
          dataTest: 'project-details-table',
          content: {
            Client: 'Mars Exports Ltd',
            'Investment type': 'Non-FDI',
            'Primary sector': data.sector,
            'Business activity': data.businessActivities,
            'Client contacts': 'Fred Peterson',
            'Project description': data.description,
            'Anonymised description': data.anonymousDescription,
            'Estimated land date': 'October 2030',
            'Actual land date': '5 May 2031',
            'New or existing investor': 'New Investor',
            'Level of involvement': data.investorLevel,
            'Specific investment programme': data.specificInvestmentProgrammes,
          },
        })
      })
    })

    describe('Creating a "Commitment to invest" project from Investments', () => {
      before(() => {
        cy.visit(investments.projects.index())
        cy.contains('Add investment project').click()
        cy.get('[data-test="field-companyName"]')
          .type('Mars Exports Ltd')
          .type('{enter}')
        cy.get('[data-test="entity-list-item"]')
          .first()
          .contains('Mars Exports Ltd')
          .click()
      })

      it('should create a commitment to investment project', () => {
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

        assertSummaryTable({
          dataTest: 'project-details-table',
          content: {
            Client: 'Mars Exports Ltd',
            'Investment type': 'Commitment to invest',
            'Primary sector': data.sector,
            'Business activity': data.businessActivities,
            'Client contacts': 'Fred Peterson',
            'Project description': data.description,
            'Anonymised description': data.anonymousDescription,
            'Estimated land date': 'October 2030',
            'Actual land date': '5 May 2031',
            'New or existing investor': 'New Investor',
            'Level of involvement': data.investorLevel,
            'Specific investment programme': data.specificInvestmentProgrammes,
          },
        })
      })
    })
  })
})
