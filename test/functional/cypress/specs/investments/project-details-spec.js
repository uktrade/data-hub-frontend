import { investmentProjectFaker } from '../../fakers/investment-projects'
import { INVESTMENT_PROJECT_STAGES } from '../../fakers/constants'

const urls = require('../../../../../src/lib/urls')
const {
  assertBreadcrumbs,
  assertSummaryTable,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const {
  EXPORT_REVENUE_FALSE,
  EXPORT_REVENUE_TRUE,
  NEW_TECH_TRUE,
  NEW_TECH_FALSE,
  R_AND_D_TRUE,
  R_AND_D_FALSE,
} = require('../../../../../src/client/modules/Investments/Projects/constants')

const projectWithRequirements = investmentProjectFaker({
  stage: INVESTMENT_PROJECT_STAGES.prospect,
  uk_company: {
    name: 'Mars Components Ltd',
    address_1: '12 Alpha Street',
    address_2: '',
    address_town: 'Volcanus',
    address_postcode: 'NE28 5AQ',
    id: '731bdcc1-f685-4c8e-bd66-b356b2c16995',
  },
  strategic_drivers: [
    {
      name: 'Access to market',
      id: '382aa6d1-a362-4166-a09d-f579d9f3be75',
    },
  ],
  client_requirements: 'Anywhere',
  competitor_countries: [
    {
      name: 'Netherlands',
      id: '1950bdb8-5d95-e211-a939-e4115bead28a',
    },
  ],
  uk_region_locations: [
    {
      name: 'North East',
      id: '814cd12a-6095-e211-a939-e4115bead28a',
    },
  ],
  site_address_is_company_address: false,
  address_1: '10 Eastings Road',
  address_2: null,
  address_town: 'London',
  address_postcode: 'W1 2AA',
  actual_uk_regions: [],
  delivery_partners: [
    {
      name: 'New Anglia LEP',
      id: 'cdcc392e-0bf1-e511-8ffa-e4115bead28a',
    },
    {
      name: 'North Eastern LEP',
      id: '6e85b4e3-0df1-e511-8ffa-e4115bead28a',
    },
  ],
})
const projectWithNoRequirementsOrValue = investmentProjectFaker({
  stage: INVESTMENT_PROJECT_STAGES.prospect,
  uk_company: null,
  strategic_drivers: [],
  client_requirements: null,
  competitor_countries: [],
  uk_region_locations: [],
  site_address_is_company_address: null,
  address_1: null,
  address_2: null,
  address_town: null,
  address_postcode: null,
  actual_uk_regions: [],
  delivery_partners: [],
  client_cannot_provide_total_investment: null,
  total_investment: null,
  client_cannot_provide_foreign_investment: null,
  foreign_equity_investment: null,
  gross_value_added_capital: null,
  number_new_jobs: null,
  gross_value_added_labour: null,
  gross_value_added: null,
  average_salary: null,
  number_safeguarded_jobs: null,
  fdi_value: null,
  government_assistance: null,
  r_and_d_budget: null,
  non_fdi_r_and_d_budget: null,
  new_tech_to_uk: null,
  export_revenue: null,
  associated_non_fdi_r_and_d_project: null,
})

describe('Investment project details', () => {
  context('When viewing a project with all the details fields', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.details(
          fixtures.investment.investmentWithDetails.id
        )
      )
    })

    it('should render all the fields of the details table', () => {
      assertSummaryTable({
        dataTest: 'project-details-table',
        content: {
          Client: 'Venus Ltd',
          'Investment type': 'Commitment to invest',
          'Primary sector': 'Renewable Energy : Wind : Onshore',
          'Business activity':
            'Retail, Clean growth, E-commerce, Other, Another business activity',
          'Client contacts': 'Dean CoxJohnny Cakeman',
          'Project description':
            'This is a dummy investment project for testing',
          'Anonymised description':
            'This is an anonymised description of the project',
          'Estimated land date': 'January 2020',
          'Likelihood of landing': 'Medium',
          'Actual land date': '15 August 2023',
          'New or existing investor': 'Existing Investor',
          'Level of involvement': 'FDI Hub + HQ + LEP',
          'Specific investment programme': 'Advanced Engineering Supply Chain',
        },
      })
    })

    it('should render the company and contact links within the table', () => {
      cy.get('[data-test="company-link"]')
        .should('exist')
        .should('have.text', 'Venus Ltd')
        .should(
          'have.attr',
          'href',
          urls.companies.overview.index('0f5216e0-849f-11e6-ae22-56b6b6499611')
        )
      cy.get('[data-test="contact-0"]')
        .should('exist')
        .should('have.text', fixtures.contact.deanCox.name)
        .should(
          'have.attr',
          'href',
          urls.contacts.contact(fixtures.contact.deanCox.id)
        )
      cy.get('[data-test="contact-1"]')
        .should('exist')
        .should('have.text', fixtures.contact.johnnyCakeman.name)
        .should(
          'have.attr',
          'href',
          urls.contacts.contact(fixtures.contact.johnnyCakeman.id)
        )
    })

    it('should render the edit button', () => {
      cy.get('[data-test="edit-details-button"]')
        .should('exist')
        .should('have.text', 'Edit summary')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.editDetails(
            fixtures.investment.investmentWithDetails.id
          )
        )
    })
  })
  context('When viewing a project with all the requirements fields', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v3/investment/${projectWithRequirements.id}`,
        {
          statusCode: 200,
          body: projectWithRequirements,
        }
      ).as('getProjectDetails')
      cy.visit(urls.investments.projects.details(projectWithRequirements.id))
      cy.wait('@getProjectDetails')
    })

    it('should render all the fields of the requirements table', () => {
      assertSummaryTable({
        dataTest: 'project-requirements-table',
        showEditLink: true,
        content: {
          'Strategic drivers': 'Access to market',
          'Client requirements': 'Anywhere',
          'Competitor countries': 'Netherlands',
          'Possible UK locations': 'North East',
          'UK recipient company':
            'Mars Components LtdEdit companyRemove company',
          'Delivery partners': 'New Anglia LEP, North Eastern LEP',
        },
      })
    })

    it('should render the correct links in the UK company field', () => {
      cy.get('[data-test="edit-company-link"]')
        .should('exist')
        .should('have.text', 'Edit company')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.recipientCompany(
            projectWithRequirements.id
          ) + '?name=Mars Components Ltd'
        )

      cy.get('[data-test="remove-company-link"]')
        .should('exist')
        .should('have.text', 'Remove company')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.removeRecipientCompany(
            projectWithRequirements.id
          )
        )

      cy.get('[data-test=find-company-link]').should('not.exist')
    })

    it('should render the edit button', () => {
      cy.get('[data-test="edit-requirements-button"]')
        .should('exist')
        .should('have.text', 'Edit requirements')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.editRequirements(projectWithRequirements.id)
        )
      cy.get('[data-test="requirements-inset"]').should('not.exist')
      cy.get('[data-test="add-requirements-button"]').should('not.exist')
    })
  })
  context('When viewing a project with all the value fields', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.details(
          fixtures.investment.investmentWithValue.id
        )
      )
    })

    it('should render all the fields of the value table', () => {
      assertSummaryTable({
        dataTest: 'project-value-table',
        showEditLink: false,
        content: {
          'Total investment': '£1,000,000',
          'Capital expenditure value': '£200,000',
          'Gross Value Added (GVA)': '£34,568',
          'Government assistance': 'Has government assistance',
          'New jobs': '0 new jobs',
          'Average salary of new jobs': 'Below £25,000',
          'Safeguarded jobs': '11234 safeguarded jobs',
          'R&D budget': R_AND_D_FALSE,
          'Non-FDI R&D project': 'Find project',
          'New-to-world tech': NEW_TECH_FALSE,
          'Export revenue': EXPORT_REVENUE_TRUE,
        },
      })
    })

    it('should render the find project link', () => {
      cy.get('[data-test="find-project-link"]')
        .should('exist')
        .should('have.text', 'Find project')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.findAssociatedProject(
            fixtures.investment.investmentWithValue.id
          )
        )
      cy.get('[data-test="edit-project-link"]').should('not.exist')
      cy.get('[data-test="remove-project-link"]').should('not.exist')
    })

    it('should render the edit button', () => {
      cy.get('[data-test="edit-value-button"]')
        .should('exist')
        .should('have.text', 'Edit value')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.editValue(
            fixtures.investment.investmentWithValue.id
          )
        )
      cy.get('[data-test="value-inset"]').should('not.exist')
      cy.get('[data-test="add-value-button"]').should('not.exist')
    })
  })

  context(
    'When viewing a Verify Win project with all the alternate value fields',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.investments.projects.details(
            fixtures.investment.investmentWithAlternateValue.id
          )
        )
      })

      it('should render all the fields of the value table', () => {
        assertSummaryTable({
          dataTest: 'project-value-table',
          showEditLink: true,
          content: {
            'Total investment': 'Client cannot provide this information',
            'Capital expenditure value':
              'Client cannot provide this information',
            'Government assistance': 'No government assistance',
            'R&D budget': R_AND_D_TRUE,
            'Non-FDI R&D project':
              'New fruit machine research projectEdit project',
            'New-to-world tech': NEW_TECH_TRUE,
            'Export revenue': EXPORT_REVENUE_FALSE,
          },
        })
      })

      it('should only render the edit project links', () => {
        cy.get('[data-test="edit-project-link"]')
          .should('exist')
          .should('have.text', 'Edit project')
          .should(
            'have.attr',
            'href',
            urls.investments.projects.findAssociatedProject(
              fixtures.investment.investmentWithAlternateValue.id
            ) + '?project_code=DHP-00000204'
          )

        cy.get('[data-test="remove-project-link"]').should('not.exist')
        cy.get('[data-test="add-project-link"]').should('not.exist')
      })

      it('should render the edit button', () => {
        cy.get('[data-test="edit-value-button"]')
          .should('exist')
          .should('have.text', 'Edit value')
          .should(
            'have.attr',
            'href',
            urls.investments.projects.editValue(
              fixtures.investment.investmentWithAlternateValue.id
            )
          )
        cy.get('[data-test="value-inset"]').should('not.exist')
        cy.get('[data-test="add-value-button"]').should('not.exist')
      })
    }
  )
  context('When viewing a project with no requirements or value', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v3/investment/${projectWithNoRequirementsOrValue.id}`,
        {
          statusCode: 200,
          body: projectWithNoRequirementsOrValue,
        }
      ).as('getProjectDetails')
      cy.visit(
        urls.investments.projects.details(projectWithNoRequirementsOrValue.id)
      )
      cy.wait('@getProjectDetails')
    })

    it('should only render the UK company field in the requirements table', () => {
      assertSummaryTable({
        dataTest: 'project-requirements-table',
        content: {
          'UK recipient company': 'Find company',
        },
      })
      cy.get('[data-test="find-company-link"]')
        .should('exist')
        .should('have.text', 'Find company')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.recipientCompany(
            projectWithNoRequirementsOrValue.id
          )
        )
      cy.get('[data-test="edit-company-link"]').should('not.exist')
      cy.get('[data-test="remove-company-link"]').should('not.exist')
    })

    it('should render the requirements inset text', () => {
      cy.get('[data-test="requirements-inset"]')
        .should('exist')
        .should(
          'have.text',
          'Please complete this section to move to Assign PM stage'
        )
    })

    it('should render the add requirements button', () => {
      cy.get('[data-test="add-requirements-button"]')
        .should('exist')
        .should('have.text', 'Add requirements')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.editRequirements(
            projectWithNoRequirementsOrValue.id
          )
        )
      cy.get('[data-test="edit-requirements-button"]').should('not.exist')
    })

    it('should not render any rows in the value table', () => {
      assertSummaryTable({
        dataTest: 'project-value-table',
        content: '',
      })
    })

    it('should render the value inset text', () => {
      cy.get('[data-test="value-inset"]')
        .should('exist')
        .should(
          'have.text',
          'Please complete ‘Total investment’ and ‘Number of new jobs’ to move to Assign PM stage'
        )
    })

    it('should render the add value button', () => {
      cy.get('[data-test="add-value-button"]')
        .should('exist')
        .should('have.text', 'Add value')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.editValue(
            projectWithNoRequirementsOrValue.id
          )
        )
      cy.get('[data-test="edit-value-button"]').should('not.exist')
    })
  })
  context('When the current stage is at Won', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.details(fixtures.investment.stageWon.id)
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        [fixtures.investment.stageWon.name]: null,
      })
    })

    it('should render a blue info banner', () => {
      cy.get(selectors.message.info).should(
        'have.text',
        'This project has been verified as won. You should not make any changes to this project.' +
          'If you would like to make changes, please contact the Investment Promotion Performance team.'
      )
    })

    it('should not render the incomplete fields box', () => {
      cy.get('[data-test="project-incomplete-fields"]').should('not.exist')
    })
  })
  context('When and FDI investment type is missing an FDI Type', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.details(
          fixtures.investment.fdiInvestmentWithNoFDIType.id
        )
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        [fixtures.investment.fdiInvestmentWithNoFDIType.name]: null,
      })
    })

    it('should render a summary containing None FDI type replacing undefined', () => {
      cy.get('[data-test="project-details-table"]').contains('Investment type')
      cy.get('[data-test="project-details-table"]').contains('FDI, None')
    })
  })
})
