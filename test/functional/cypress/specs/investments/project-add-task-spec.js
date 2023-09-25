const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('Investment project task', () => {
  const fixture = fixtures.investment.investmentWithDetails
  context('When visiting the task create page', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.task.create(
          fixtures.investment.investmentWithDetails.id
        )
      )
    })

    it('should display the header', () => {
      cy.get('h1').should(
        'have.text',
        `Add task for ${fixture.investor_company.name}`
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        [fixture.name]: urls.investments.projects.detail(fixture.id),
        [`Add task for ${fixture.investor_company.name}`]: null,
      })
    })

    it('should display the task title field', () => {
      cy.get('[data-test="task-title-input"]').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Task title',
        })
      })
    })

    it('should display the task description field', () => {
      cy.get('[data-test="task-description-input"]').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Task description (optional)',
          hint: 'Add details of the task, especially if you intend to assign it to someone else.',
        })
      })

      // it('save strategy button should link to company account management page', () => {
      //   fill('[data-test=field-strategy]', 'test strategy')
      //   cy.get('[data-test="submit-button"]').contains('Save strategy').click()
      //   assertPayload('@apiRequest', {
      //     strategy: 'test strategy',
      //   })
      //   cy.location('pathname').should('eq', dnbCorpCompanyUrl)
      // })

      // it('cancels form when back link is clicked', () => {
      //   cy.get('[data-test="cancel-button"]').contains('Back').click()
      //   cy.location('pathname').should('eq', dnbCorpCompanyUrl)
      // })

      // it('displays a success flash message when form is submitted', () => {
      //   cy.get('[data-test="submit-button"]').contains('Save strategy').click()
      //   assertFlashMessage('Strategy saved')
      // })
    })
    //   context('When visiting the strategy edit page', () => {
    //     beforeEach(() => {
    //       cy.intercept(
    //         'PATCH',
    //         `/api-proxy/v4/company/${allActivitiesCompany.id}`
    //       ).as('apiRequest')
    //       cy.visit(
    //         urls.companies.accountManagement.strategy.edit(allActivitiesCompany.id)
    //       )
    //     })

    //     it('should display the header', () => {
    //       cy.get('h1').should(
    //         'have.text',
    //         `Edit strategy for ${allActivitiesCompany.name}`
    //       )
    //     })

    //     it('should edit the strategy field', () => {
    //       cy.get('[data-test="field-strategy"]').then((element) => {
    //         assertFieldTextarea({
    //           element,
    //           label: 'Strategy',
    //           hint: "This should outline a plan than provides a concise overview of the business direction and DBT's approach to help them achieve that.",
    //           value: allActivitiesCompany.strategy,
    //         })
    //         cy.get('[id="strategy"]').clear()
    //         fill('[data-test=field-strategy]', 'test strategy')
    //         cy.get('[data-test="submit-button"]').contains('Save strategy').click()
    //         assertPayload('@apiRequest', {
    //           strategy: 'test strategy',
    //         })
    //       })
    //     })

    //     it('cancels form when back link is clicked', () => {
    //       cy.get('[data-test="cancel-button"]').contains('Back').click()
    //       cy.location('pathname').should('eq', allActivitiesCompanyUrl)
    //     })

    //     it('displays a success flash message when form is submitted', () => {
    //       cy.get('[data-test="submit-button"]').contains('Save strategy').click()
    //       assertFlashMessage('Strategy saved')
    //     })
    //   })
  })
})
