const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const {
  assertFieldInput,
  assertBreadcrumbs,
  assertFieldTextarea,
  assertFieldRadiosWithLegend,
  assertPayload,
} = require('../../support/assertions')
const { fill, fillDate } = require('../../support/form-fillers')

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
        [fixture.name]: urls.investments.projects.details(fixture.id),
        [`Add task for ${fixture.investor_company.name}`]: null,
      })
    })

    it('should display the task title field', () => {
      cy.dataTest('field-taskTitle').then((element) => {
        assertFieldInput({
          element,
          label: 'Task title',
        })
      })
    })

    it('should display the task description field', () => {
      cy.get('[data-test="field-taskDescription"]').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Task description (optional)',
          hint: 'Add details of the task, especially if you intend to assign it to someone else.',
        })
      })
    })

    it('should display the task due date field radios', () => {
      cy.get('[data-test="field-taskDueDate"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Task due date',
          optionsCount: 4,
        })
      })
    })

    it('should display the task reminder field radios', () => {
      cy.get('[data-test="field-taskRemindersEnabled"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Do you want to set a reminder for this task?',
          optionsCount: 2,
        })
      })
    })

    // it('should not show an error message when a valid date is set', () => {
    //   const validPastDate = getDateFromNow({ day: 1, monthAddition: -1 })
    //   assertRequiredChecks().then((element) => {
    //     clickRadioGroupOption({
    //       element,
    //       label: 'Cleared',
    //     })
    //     clearAndInputDateValueObject({
    //       element,
    //       value: {
    //         day: validPastDate.getDate().toString(),
    //         month: (validPastDate.getMonth() + 1).toString(),
    //         year: validPastDate.getFullYear().toString(),
    //       },
    //     })
    //   })

    it('add task button should link to investments details page', () => {
      fill('[data-test=field-taskTitle]', 'test task')
      fill('[data-test=field-taskDescription]', 'test description')
      cy.get('[data-test=task-due-date-custom-date]').click()
      fillDate('[data-test=field-customDate]', 25, 12, 2023)
      cy.get('[data-test="submit-button"]').contains('Save task').click()
      assertPayload('@apiRequest', {
        investment_project: {
          id: '',
          name: '',
        },
        task: {
          title: 'test task',
          description: 'test description',
          due_date: '2023-12-25',
          email_reminders_enabled: true,
          reminder_days: 1,
          advisers: [],
        },
      })
      cy.location('pathname').should(
        'eq',
        urls.investments.projects.details(fixture.id)
      )
    })

    // it('cancels form when back link is clicked', () => {
    //   cy.get('[data-test="cancel-button"]').contains('Back').click()
    //   cy.location('pathname').should('eq', dnbCorpCompanyUrl)
    // })

    // it('displays a success flash message when form is submitted', () => {
    //   cy.get('[data-test="submit-button"]').contains('Save strategy').click()
    //   assertFlashMessage('Strategy saved')
    // })

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
