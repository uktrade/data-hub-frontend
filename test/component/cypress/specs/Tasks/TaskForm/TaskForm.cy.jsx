import React from 'react'

import DataHubProvider from '../../provider'
import {
  assertFieldError,
  assertFieldInput,
  assertFieldRadiosWithLegend,
  assertFieldTextarea,
  assertLink,
} from '../../../../../functional/cypress/support/assertions'
import { clickButton } from '../../../../../functional/cypress/support/actions'
import urls from '../../../../../../src/lib/urls'
import TaskForm from '../../../../../../src/client/modules/Tasks/TaskForm'

describe('Edit large capital profile', () => {
  const Component = (props) => (
    <DataHubProvider>
      <TaskForm {...props} />
    </DataHubProvider>
  )

  context('When a task is missing all mandatory fields', () => {
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
        cy.get('[data-test="field-taskDueDate"]'),
        'Select task due date'
      )

      assertFieldError(
        cy.get('[data-test="field-taskRemindersEnabled"]'),
        'Select reminder'
      )
    })
  })

  context('When a task is creating a task with a custom date', () => {
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
