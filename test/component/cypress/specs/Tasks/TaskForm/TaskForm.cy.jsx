import React from 'react'
import { capitalize } from 'lodash'

import DataHubProvider from '../../provider'
import {
  assertFieldDate,
  assertFieldError,
  assertFieldInput,
  assertFieldRadiosWithLegend,
  assertFieldTextarea,
  assertLink,
} from '../../../../../functional/cypress/support/assertions'
import { clickButton } from '../../../../../functional/cypress/support/actions'
import urls from '../../../../../../src/lib/urls'
import TaskForm from '../../../../../../src/client/modules/Tasks/TaskForm'
import { taskWithInvestmentProjectFaker } from '../../../../../functional/cypress/fakers/task'
import { transformAPIValuesForForm } from '../../../../../../src/client/modules/Investments/Projects/Tasks/transformers'
import advisersListFaker, {
  adviserFaker,
} from '../../../../../functional/cypress/fakers/advisers'
import { OPTION_NO, OPTION_YES } from '../../../../../../src/apps/constants'
import { convertDateToFieldDateObject } from '../../../../../../src/client/utils/date'

describe('Task form', () => {
  const Component = (props) => (
    <DataHubProvider>
      <TaskForm {...props} />
    </DataHubProvider>
  )

  context('When a task form renders without initial values', () => {
    beforeEach(() => {
      cy.mount(<Component cancelRedirectUrl={urls.companies.index()} />)
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

    it('should display the task assigned to field radios', () => {
      cy.get('[data-test="field-taskAssignedTo"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Task assigned to',
          optionsCount: 2,
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

    it('should render the cancel button with the correct url', () => {
      assertLink('cancel-button', urls.companies.index())
    })
  })

  context('When a task form renders with existing data', () => {
    const investmentProjectTask = taskWithInvestmentProjectFaker({})

    beforeEach(() => {
      cy.mount(
        <Component
          cancelRedirectUrl={urls.companies.index()}
          task={transformAPIValuesForForm(investmentProjectTask)}
        />
      )
    })

    it('should display the task title field', () => {
      cy.dataTest('field-taskTitle').then((element) => {
        assertFieldInput({
          element,
          label: 'Task title',
          value: investmentProjectTask.title,
        })
      })
    })

    it('should display the task description field', () => {
      cy.get('[data-test="field-taskDescription"]').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Task description (optional)',
          hint: 'Add details of the task, especially if you intend to assign it to someone else.',
          value: investmentProjectTask.description,
        })
      })
    })

    it('should display the custom date', () => {
      cy.get('[data-test="field-customDate"]').then((element) => {
        assertFieldDate({
          element,
          label: 'For example 28 11 2025',
          value: convertDateToFieldDateObject(investmentProjectTask.dueDate),
        })
      })
    })

    it('should display the task due date field radios', () => {
      cy.get('[data-test="field-taskDueDate"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Task due date',
          optionsCount: 7,
        })
      })
    })

    it('should display the task reminder field radios', () => {
      cy.get('[data-test="field-taskRemindersEnabled"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Do you want to set a reminder for this task?',
          optionsCount: 3,
          value: investmentProjectTask.emailRemindersEnabled
            ? capitalize(OPTION_YES)
            : capitalize(OPTION_NO),
        })
      })
    })

    it('should render the cancel button with the correct url', () => {
      assertLink('cancel-button', urls.companies.index())
    })
  })

  context(
    'When a task form renders with existing data that is assigned to me',
    () => {
      const currentAdviser = adviserFaker()
      const investmentProjectTask = taskWithInvestmentProjectFaker({
        advisers: [currentAdviser],
      })

      beforeEach(() => {
        cy.mount(
          <Component
            cancelRedirectUrl={urls.companies.index()}
            task={transformAPIValuesForForm(
              investmentProjectTask,
              currentAdviser.id
            )}
          />
        )
      })

      it('should display the task assigned to field radios', () => {
        cy.get('[data-test="field-taskAssignedTo"]').then((element) => {
          assertFieldRadiosWithLegend({
            element,
            legend: 'Task assigned to',
            optionsCount: 2,
            value: 'Me',
          })
        })
      })
    }
  )
  var adviserAssignedToTestRuns = [
    {
      advisers: advisersListFaker(),
    },
    {
      advisers: advisersListFaker((length = 2)),
    },
  ]

  context(
    'When a task form renders with existing data that is assigned to someone else',
    () => {
      adviserAssignedToTestRuns.forEach(function (run) {
        beforeEach(() => {
          const investmentProjectTask = taskWithInvestmentProjectFaker({
            advisers: run.advisers,
          })

          cy.mount(
            <Component
              cancelRedirectUrl={urls.companies.index()}
              task={transformAPIValuesForForm(investmentProjectTask)}
            />
          )
        })
        it('should display the task assigned to field radios with someone else selected', () => {
          cy.get('[data-test="field-taskAssignedTo"]').then((element) => {
            assertFieldRadiosWithLegend({
              element,
              legend: 'Task assigned to',
              optionsCount: 3,
              value: 'Someone else',
            })
          })
        })
      })
    }
  )

  context('When a task is missing all mandatory fields', () => {
    beforeEach(() => {
      cy.mount(<Component />)
      clickButton('Save task')
    })

    it('should display an error when for each mandatory field', () => {
      assertFieldError(
        cy.get('[data-test="field-taskTitle"]'),
        'Enter a task title',
        false
      )

      assertFieldError(
        cy.get('[data-test="field-taskAssignedTo"]'),
        'Select who this task is assigned to'
      )

      assertFieldError(
        cy.get('[data-test="field-taskDueDate"]'),
        'Select task due date'
      )

      assertFieldError(
        cy.get('[data-test="field-taskRemindersEnabled"]'),
        'Select reminder'
      )
    })
  })

  context('When creating a task assigned to someone else', () => {
    beforeEach(() => {
      cy.mount(<Component />)

      cy.get('[data-test=task-assigned-to-someone-else]').click()
    })

    it('should display an error when no advisers are selected', () => {
      clickButton('Save task')

      cy.get('[data-test="field-taskAdvisers"]').should(
        'contain.text',
        'Select an adviser'
      )
    })
  })

  context('When a task is created a task with a custom date', () => {
    beforeEach(() => {
      cy.mount(<Component />)
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

    it('should display an error when date in the past is entered', () => {
      cy.get('[data-test=custom_date-day]').clear().type(1)
      cy.get('[data-test=custom_date-month]').clear().type(1)
      cy.get('[data-test=custom_date-year]').clear().type(2000)

      clickButton('Save task')

      cy.get('[data-test="field-customDate"]').should(
        'contain.text',
        'Enter a date in the future'
      )
    })
  })

  context('When creating a task with task reminders', () => {
    beforeEach(() => {
      cy.mount(<Component />)

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
