import React from 'react'

import { pick } from 'lodash'

import { assertSummaryTable } from '../../../../../functional/cypress/support/assertions'
import {
  taskFaker,
  taskWithInvestmentProjectFaker,
  taskWithInteractionFaker,
} from '../../../../../functional/cypress/fakers/task'
import urls from '../../../../../../src/lib/urls'
import {
  formatDate,
  DATE_FORMAT_FULL,
} from '../../../../../../src/client/utils/date-utils'
import { NOT_SET_TEXT } from '../../../../../../src/apps/companies/constants'
import TaskDetailsTable from '../../../../../../src/client/modules/Tasks/TaskDetails/TaskDetailsTable'
import { companyFaker } from '../../../../../functional/cypress/fakers/companies'

describe('Task details table', () => {
  context('When a task has all optional fields set', () => {
    const investmentProjectTask = taskWithInvestmentProjectFaker()
    const company = investmentProjectTask.company
    const project = investmentProjectTask.investmentProject

    it('the table should show all expected values', () => {
      cy.mountWithProvider(
        <TaskDetailsTable
          task={investmentProjectTask}
          company={company}
          project={project}
        />
      )

      assertSummaryTable({
        dataTest: 'task-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: {
            href: urls.companies.detail(company.id),
            name: company.name,
          },
          ['Investment project']: {
            href: urls.investments.projects.details(project.id),
            name: project.name,
          },
          ['Date due']: formatDate(
            investmentProjectTask.dueDate,
            DATE_FORMAT_FULL
          ),
          'Assigned to': investmentProjectTask.advisers
            .map((adviser) => adviser.name)
            .join(''),
          'Task description': investmentProjectTask.description,
          'Reminders set': `${investmentProjectTask.reminderDays} days before due date`,
          'Date created': formatDate(
            investmentProjectTask.createdOn,
            DATE_FORMAT_FULL
          ),
          'Created by': investmentProjectTask.createdBy.name,
        },
      })
    })
  })

  context('When a task is missing all optional fields', () => {
    const company = pick(companyFaker(), ['id', 'name'])
    const project = null

    const taskWithNoInvestmentProject = taskFaker({
      dueDate: undefined,
      description: undefined,
      emailRemindersEnabled: false,
      company: company,
      investmentProject: project,
    })

    it('the table should show all expected values', () => {
      cy.mountWithProvider(
        <TaskDetailsTable
          task={taskWithNoInvestmentProject}
          company={company}
          project={project}
        />
      )

      assertSummaryTable({
        dataTest: 'task-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: {
            href: urls.companies.detail(company.id),
            name: company.name,
          },
          ['Date due']: NOT_SET_TEXT,
          'Assigned to': taskWithNoInvestmentProject.advisers
            .map((adviser) => adviser.name)
            .join(''),
          'Task description': NOT_SET_TEXT,
          'Reminders set': NOT_SET_TEXT,
          'Date created': formatDate(
            taskWithNoInvestmentProject.createdOn,
            DATE_FORMAT_FULL
          ),
          'Created by': taskWithNoInvestmentProject.createdBy.name,
        },
      })
    })
  })

  context('When a task is linked to an interaction', () => {
    const taskWithInteraction = taskWithInteractionFaker()
    const company = taskWithInteraction.company

    it('the table should show all expected values', () => {
      cy.mountWithProvider(
        <TaskDetailsTable task={taskWithInteraction} company={company} />
      )

      assertSummaryTable({
        dataTest: 'task-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: {
            href: urls.companies.detail(company.id),
            name: company.name,
          },
          'Related interaction': {
            href: urls.interactions.detail(taskWithInteraction.interaction.id),
            name: taskWithInteraction.interaction.subject,
          },
          ['Date due']: formatDate(
            taskWithInteraction.dueDate,
            DATE_FORMAT_FULL
          ),
          'Assigned to': taskWithInteraction.advisers
            .map((adviser) => adviser.name)
            .join(''),
          'Task description': taskWithInteraction.description,
          'Reminders set': `${taskWithInteraction.reminderDays} days before due date`,
          'Date created': formatDate(
            taskWithInteraction.createdOn,
            DATE_FORMAT_FULL
          ),
          'Created by': taskWithInteraction.createdBy.name,
        },
      })
    })
  })
})
