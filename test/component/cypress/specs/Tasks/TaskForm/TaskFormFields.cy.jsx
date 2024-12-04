import React from 'react'
import { capitalize } from 'lodash'

import { faker } from '../../../../../sandbox/utils/random.js'

import {
  assertFieldDate,
  assertFieldError,
  assertFieldInput,
  assertFieldRadiosWithLegend,
  assertFieldSingleTypeahead,
  assertFieldTextarea,
  assertLink,
  assertNotExists,
  assertVisible,
} from '../../../../../functional/cypress/support/assertions'
import { clickButton } from '../../../../../functional/cypress/support/actions'
import urls from '../../../../../../src/lib/urls'
import TaskFormFields from '../../../../../../src/client/modules/Tasks/TaskForm/TaskFormFields'
import {
  taskFaker,
  taskWithCompanyFaker,
  taskWithInvestmentProjectFaker,
} from '../../../../../functional/cypress/fakers/task'
import { transformAPIValuesForForm } from '../../../../../../src/client/modules/Tasks/TaskForm/transformers'
import advisersListFaker, {
  adviserFaker,
} from '../../../../../functional/cypress/fakers/advisers'
import { OPTION_NO, OPTION_YES } from '../../../../../../src/common/constants'
import { convertDateToFieldDateObject } from '../../../../../../src/client/utils/date'
import { companyFaker } from '../../../../../functional/cypress/fakers/companies'

describe('Task form', () => {
  context('When a task form renders without initial values', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <TaskFormFields cancelRedirectUrl={urls.companies.index()} />
      )
    })

    it('should display the task title field', () => {
      cy.dataTest('field-title').then((element) => {
        assertFieldInput({
          element,
          label: 'Task title',
        })
      })
    })

    it('should display the task description field', () => {
      cy.get('[data-test="field-description"]').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Task description (optional)',
          hint: 'Add details of the task, especially if you intend to assign it to someone else.',
        })
      })
    })

    it('should display the task assigned to field radios', () => {
      cy.get('[data-test="field-assignedTo"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Task assigned to',
          optionsCount: 2,
        })
      })
    })

    it('should display the task due date field radios', () => {
      cy.get('[data-test="field-dueDate"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Task due date',
          optionsCount: 4,
        })
      })
    })

    it('should display the task reminder field radios', () => {
      cy.get('[data-test="field-emailRemindersEnabled"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Do you want to set a reminder for this task?',
          optionsCount: 2,
        })
      })
    })

    it('should display the company typeahead field', () => {
      assertVisible('[data-test="field-company"]')
    })

    it('should hide the investment project typeahead field', () => {
      assertNotExists('[data-test="field-investmentProject"')
    })

    it('should render the cancel button with the correct url', () => {
      assertLink('cancel-button', urls.companies.index())
    })
  })

  describe('Task form validation', () => {
    context('When a task is missing all mandatory fields', () => {
      beforeEach(() => {
        cy.mountWithProvider(<TaskFormFields />)
        clickButton('Save task')
      })

      it('should display an error when for each mandatory field', () => {
        assertFieldError(
          cy.get('[data-test="field-title"]'),
          'Enter a task title',
          false
        )

        assertFieldError(
          cy.get('[data-test="field-assignedTo"]'),
          'Select who this task is assigned to'
        )

        assertFieldError(
          cy.get('[data-test="field-dueDate"]'),
          'Select task due date'
        )

        assertFieldError(
          cy.get('[data-test="field-emailRemindersEnabled"]'),
          'Select reminder'
        )
      })
    })

    context('When creating a task assigned to someone else', () => {
      beforeEach(() => {
        cy.mountWithProvider(<TaskFormFields />)

        cy.get('[data-test=assigned-to-someone-else]').click()
      })

      it('should display an error when no advisers are selected', () => {
        clickButton('Save task')

        cy.get('[data-test="field-advisers"]').should(
          'contain.text',
          'Select an adviser'
        )
      })
    })

    context('When a task is created a task with a custom date', () => {
      beforeEach(() => {
        cy.mountWithProvider(<TaskFormFields />)
        cy.get('[data-test=due-date-custom-date]').click()
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

    context('When creating a task with reminders', () => {
      beforeEach(() => {
        cy.mountWithProvider(<TaskFormFields />)

        cy.get('[data-test=field-emailRemindersEnabled]').click()
      })

      it('should display an error when no task reminder days are entered', () => {
        clickButton('Save task')

        cy.get('[data-test="field-emailRemindersEnabled"]').should(
          'contain.text',
          'Enter a number between 1 and 365'
        )
      })

      it('should display an error when 0 is entered', () => {
        cy.get('[data-test=reminder-days-input]').type(0)
        clickButton('Save task')

        cy.get('[data-test="field-emailRemindersEnabled"]').should(
          'contain.text',
          'Enter a number between 1 and 365'
        )
      })

      it('should display an error when day higher than 365 is entered', () => {
        cy.get('[data-test=reminder-days-input]').type(366)
        clickButton('Save task')

        cy.get('[data-test="field-emailRemindersEnabled"]').should(
          'contain.text',
          'Enter a number between 1 and 365'
        )
      })
    })
  })

  describe('Adding a task form', () => {
    context('When a task form renders with an interaction', () => {
      beforeEach(() => {
        cy.mountWithProvider(
          <TaskFormFields
            cancelRedirectUrl={urls.companies.index()}
            task={{ interaction: { id: 1, subject: 'a', notes: 'b' } }}
          />
        )
      })

      it('should hide the company field select', () => {
        assertNotExists('[data-test="field-company"')
      })

      it('should hide the investment project field select', () => {
        assertNotExists('[data-test="field-investmentProject"')
      })

      it('should render the cancel button with the correct url', () => {
        assertLink('cancel-button', urls.companies.index())
      })
    })
  })
  describe('Editing a task form', () => {
    context('When a generic task form renders with existing data', () => {
      const task = taskFaker()

      beforeEach(() => {
        cy.mountWithProvider(
          <TaskFormFields
            cancelRedirectUrl={urls.companies.index()}
            task={transformAPIValuesForForm(task)}
          />
        )
      })

      it('should display the task title field', () => {
        cy.dataTest('field-title').then((element) => {
          assertFieldInput({
            element,
            label: 'Task title',
            value: task.title,
          })
        })
      })

      it('should display the task description field', () => {
        cy.get('[data-test="field-description"]').then((element) => {
          assertFieldTextarea({
            element,
            label: 'Task description (optional)',
            hint: 'Add details of the task, especially if you intend to assign it to someone else.',
            value: task.description,
          })
        })
      })

      it('should display the custom date', () => {
        cy.get('[data-test="field-customDate"]').then((element) => {
          assertFieldDate({
            element,
            label: 'For example 28 11 2025',
            value: convertDateToFieldDateObject(task.dueDate),
          })
        })
      })

      it('should display the task due date field radios', () => {
        cy.get('[data-test="field-dueDate"]').then((element) => {
          assertFieldRadiosWithLegend({
            element,
            legend: 'Task due date',
            optionsCount: 7,
          })
        })
      })

      it('should display the task reminder field radios', () => {
        cy.get('[data-test="field-emailRemindersEnabled"]').then((element) => {
          assertFieldRadiosWithLegend({
            element,
            legend: 'Do you want to set a reminder for this task?',
            optionsCount: 3,
            value: task.emailRemindersEnabled
              ? capitalize(OPTION_YES)
              : capitalize(OPTION_NO),
          })
        })
      })

      it('should render the cancel button with the correct url', () => {
        assertLink('cancel-button', urls.companies.index())
      })
    })

    context('When a company task form renders with existing data', () => {
      const task = taskWithCompanyFaker()

      beforeEach(() => {
        cy.mountWithProvider(
          <TaskFormFields
            cancelRedirectUrl={urls.companies.index()}
            task={transformAPIValuesForForm(task)}
          />
        )
      })

      it('should display the company typeahead with selected value', () => {
        cy.get('[data-test="field-company"]').then((element) => {
          assertFieldSingleTypeahead({
            element,
            label: 'Company name (optional)',
            value: task.company.name,
            placeholder: '',
          })
        })
      })
    })

    context(
      'When an investment project task form renders with existing data',
      () => {
        const task = taskWithInvestmentProjectFaker()
        beforeEach(() => {
          cy.mountWithProvider(
            <TaskFormFields
              cancelRedirectUrl={urls.companies.index()}
              task={transformAPIValuesForForm(task)}
              companyInvestmentProjects={{ results: [task.investmentProject] }}
            />
          )
        })

        it('should display the company typeahead with selected value', () => {
          cy.get('[data-test="field-company"]').then((element) => {
            assertFieldSingleTypeahead({
              element,
              label: 'Company name (optional)',
              value: task.company.name,
              placeholder: '',
            })
          })
        })

        it('should display the investment project typeahead with selected value', () => {
          cy.get('[data-test="field-investmentProject"]').then((element) => {
            assertFieldSingleTypeahead({
              element,
              label: 'Investment project (optional)',
              value: task.investmentProject.name,
              placeholder: '',
            })
          })
        })
      }
    )
    context('Ensure adviser is passed to the investment project search', () => {
      const currentAdviserId = faker.string.uuid()
      const company = companyFaker()
      const task = taskWithInvestmentProjectFaker({
        investmentCompany: company,
        advisers: [currentAdviserId],
      })

      it('should include adviser parameter for Task payload', () => {
        const getProjectsTask = cy.stub()
        cy.intercept('GET', '/api-proxy/v4/company*', {
          count: 1,
          next: null,
          previous: null,
          results: [company],
        }).as('companySearch')
        cy.mountWithProvider(
          <TaskFormFields
            cancelRedirectUrl={urls.companies.index()}
            task={transformAPIValuesForForm(task, currentAdviserId)}
            currentAdviserId={currentAdviserId}
          />,
          {
            tasks: {
              TASK_GET_PROJECTS_LIST: getProjectsTask,
            },
          }
        )
        cy.get('[data-test="field-company"] input').type(
          task.investmentProject.investorCompany.name
        )
        cy.get('#field-company')
          .find('[data-test="typeahead-input"]')
          .blur()
          .click()
        cy.wait('@companySearch')
        cy.get('#field-company')
          .find('[data-test="typeahead-menu-option"]')
          .click()
          .then(() => {
            expect(getProjectsTask.args[0][0].adviser[0]).to.eq(
              currentAdviserId
            )
          })
      })
    })

    context(
      'When a task form renders with existing data that is assigned to me',
      () => {
        const currentAdviser = adviserFaker()
        const task = taskFaker({
          advisers: [currentAdviser],
        })

        beforeEach(() => {
          cy.mountWithProvider(
            <TaskFormFields
              cancelRedirectUrl={urls.companies.index()}
              task={transformAPIValuesForForm(task, currentAdviser.id)}
            />
          )
        })

        it('should display the task assigned to field radios with me selected', () => {
          cy.get('[data-test="field-assignedTo"]').then((element) => {
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

    context(
      'When a task form renders with existing data that is assigned to me and others',
      () => {
        const currentAdviser = adviserFaker()
        const otherAdviser = adviserFaker()
        const task = taskFaker({
          advisers: [currentAdviser, otherAdviser],
        })

        beforeEach(() => {
          cy.mountWithProvider(
            <TaskFormFields
              cancelRedirectUrl={urls.companies.index()}
              task={transformAPIValuesForForm(task, currentAdviser.id)}
            />
          )
        })

        it('should display the task assigned to field radios with me selected', () => {
          cy.get('[data-test="field-assignedTo"]').then((element) => {
            assertFieldRadiosWithLegend({
              element,
              legend: 'Task assigned to',
              optionsCount: 3,
              value: 'Someone else',
            })
          })
        })
      }
    )

    context(
      'When a task form renders with existing data that is assigned to someone else',
      () => {
        var adviserAssignedToTestRuns = [
          {
            advisers: advisersListFaker(),
          },
          {
            advisers: advisersListFaker((length = 2)),
          },
        ]

        adviserAssignedToTestRuns.forEach(function (run) {
          beforeEach(() => {
            const task = taskFaker({
              advisers: run.advisers,
            })

            cy.mountWithProvider(
              <TaskFormFields
                cancelRedirectUrl={urls.companies.index()}
                task={transformAPIValuesForForm(task)}
              />
            )
          })
          it('should display the task assigned to field radios with someone else selected', () => {
            cy.get('[data-test="field-assignedTo"]').then((element) => {
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
  })
})
