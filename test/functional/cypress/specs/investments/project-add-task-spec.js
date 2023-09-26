const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const {
  assertFieldInput,
  assertBreadcrumbs,
  assertFieldTextarea,
  assertFieldRadiosWithLegend,
  assertPayload,
  assertFlashMessage,
  assertExactUrl,
  assertFieldError,
} = require('../../support/assertions')
const { fill } = require('../../support/form-fillers')
const {
  clickButton,
  clickCancelLink,
} = require('../../../../functional/cypress/support/actions')

describe('Investment project task', () => {
  const fixture = fixtures.investment.investmentWithDetails
  const endpoint = '/api-proxy/v4/investmentprojecttask'
  const detailsUrl = urls.investments.projects.details(fixture.id)

  context('When creating a task', () => {
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
        [fixture.name]: detailsUrl,
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

    it('add task button should link to investments details page', () => {
      cy.intercept('POST', endpoint, {
        statusCode: 201,
      }).as('apiRequest')

      fill('[data-test=field-taskTitle]', 'test task')
      fill('[data-test=field-taskDescription]', 'test description')

      cy.get('[data-test=task-due-date-custom-date]').click()
      cy.get('[data-test=custom_date-day]').type(25)
      cy.get('[data-test=custom_date-month]').type(12)
      cy.get('[data-test=custom_date-year]').type(2023)

      cy.get('[data-test=field-taskRemindersEnabled]').click()
      cy.get('[data-test=task-reminder-days-input]').type(1)

      clickButton('Save task')

      assertPayload('@apiRequest', {
        investment_project: {
          id: fixture.id,
          name: fixture.name,
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

      assertExactUrl(detailsUrl)

      assertFlashMessage('Task created')
    })

    it('cancels form and returns to details page when back link is clicked', () => {
      cy.visit(
        urls.investments.projects.task.create(
          fixtures.investment.investmentWithDetails.id
        )
      )
      clickCancelLink()

      assertExactUrl(detailsUrl)
    })
  })

  context('When creating a task with no data', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.task.create(
          fixtures.investment.investmentWithDetails.id
        )
      )

      clickButton('Save task')
    })

    it('should display an error when no task title is entered', () => {
      assertFieldError(
        cy.get('[data-test="field-taskTitle"]'),
        'Enter a task title',
        false
      )
    })

    it('should display an error when no task due date is selected', () => {
      assertFieldError(
        cy.get('[data-test="field-taskDueDate"]'),
        'Specify task due date'
      )
    })

    it('should display an error when no task reminder is selected', () => {
      assertFieldError(
        cy.get('[data-test="field-taskRemindersEnabled"]'),
        'Specify reminder'
      )
    })
  })

  context('When creating a task with a custom date', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.task.create(
          fixtures.investment.investmentWithDetails.id
        )
      )
      fill('[data-test=field-taskTitle]', 'task with some data')

      cy.get('[data-test=task-due-date-custom-date]').click()
    })

    it('should display an error when no custom date is entered', () => {
      clickButton('Save task')

      cy.get('[data-test="field-customDate"]').should(
        'contain.text',
        'Enter a date'
      )
    })

    it('should display an error when invalid date is entered', () => {
      cy.get('[data-test=custom_date-day]').type(50)
      cy.get('[data-test=custom_date-month]').type(50)
      cy.get('[data-test=custom_date-year]').type(50)

      clickButton('Save task')

      cy.get('[data-test="field-customDate"]').should(
        'contain.text',
        'Enter a valid date'
      )
    })
  })

  context('When creating a task with task reminders', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.task.create(
          fixtures.investment.investmentWithDetails.id
        )
      )
      fill('[data-test=field-taskTitle]', 'task with some data')

      cy.get('[data-test=field-taskRemindersEnabled]').click()
    })

    it('should display an error when no task reminder days are entered', () => {
      clickButton('Save task')

      cy.get('[data-test="field-taskRemindersEnabled"]').should(
        'contain.text',
        'Enter a number between 1 and 365'
      )
    })

    it('should display an error when 0 is entered', () => {
      cy.get('[data-test=task-reminder-days-input]').type(0)
      clickButton('Save task')

      cy.get('[data-test="field-taskRemindersEnabled"]').should(
        'contain.text',
        'Enter a number between 1 and 365'
      )
    })

    it('should display an error when day higher than 365 is entered', () => {
      cy.get('[data-test=task-reminder-days-input]').type(366)
      clickButton('Save task')

      cy.get('[data-test="field-taskRemindersEnabled"]').should(
        'contain.text',
        'Enter a number between 1 and 365'
      )
    })
  })
})
