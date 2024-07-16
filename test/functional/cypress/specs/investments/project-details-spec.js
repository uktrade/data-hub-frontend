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
      cy.visit(
        urls.investments.projects.details(
          fixtures.investment.investmentWithRequirements.id
        )
      )
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
          'UK regions landed': 'North East',
          'UK recipient company': 'Mercury LtdEdit companyRemove company',
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
            fixtures.investment.investmentWithRequirements.id
          ) + '?name=Mercury Ltd'
        )

      cy.get('[data-test="remove-company-link"]')
        .should('exist')
        .should('have.text', 'Remove company')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.removeRecipientCompany(
            fixtures.investment.investmentWithRequirements.id
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
          urls.investments.projects.editRequirements(
            fixtures.investment.investmentWithRequirements.id
          )
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
      cy.visit(
        urls.investments.projects.details(
          fixtures.investment.investmentWithNoExistingRequirements.id
        )
      )
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
            fixtures.investment.investmentWithNoExistingRequirements.id
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
            fixtures.investment.investmentWithNoExistingRequirements.id
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
            fixtures.investment.investmentWithNoExistingRequirements.id
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
