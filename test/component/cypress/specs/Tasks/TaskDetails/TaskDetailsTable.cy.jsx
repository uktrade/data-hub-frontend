import React from 'react'

import { pick } from 'lodash'

import { assertSummaryTable } from '../../../../../functional/cypress/support/assertions'
import {
  taskFaker,
  taskWithInvestmentProjectFaker,
} from '../../../../../functional/cypress/fakers/task'
import urls from '../../../../../../src/lib/urls'
import { formatLongDate } from '../../../../../../src/client/utils/date'
import { NOT_SET_TEXT } from '../../../../../../src/apps/companies/constants'
import TaskDetailsTable from '../../../../../../src/client/modules/Tasks/TaskDetails/TaskDetailsTable'
import DataHubProvider from '../../provider'
import { companyFaker } from '../../../../../functional/cypress/fakers/companies'

describe('Task details table', () => {
  const Component = (props) => (
    <DataHubProvider>
      <TaskDetailsTable {...props} />
    </DataHubProvider>
  )

  context('When a task has all optional fields set', () => {
    const investmentProjectTask = taskWithInvestmentProjectFaker()
    const company = investmentProjectTask.company
    const project = investmentProjectTask.investmentProject

    it('the table should show all expected values', () => {
      cy.mount(
        <Component
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
          ['Date due']: formatLongDate(investmentProjectTask.dueDate),
          'Assigned to': investmentProjectTask.advisers
            .map((adviser) => adviser.name)
            .join(''),
          'Task description': investmentProjectTask.description,
          'Reminders set': `${investmentProjectTask.reminderDays} days before due date`,
          'Date created': formatLongDate(investmentProjectTask.createdOn),
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
      cy.mount(
        <Component
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
          'Date created': formatLongDate(taskWithNoInvestmentProject.createdOn),
          'Created by': taskWithNoInvestmentProject.createdBy.name,
        },
      })
    })
  })
})
