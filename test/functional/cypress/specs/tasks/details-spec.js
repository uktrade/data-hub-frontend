const urls = require('../../../../../src/lib/urls')
const {
  assertSummaryTable,
  assertBreadcrumbs,
} = require('../../support/assertions')

const taskFixture = {
  id: 'efb5a10d-5117-4b90-abbf-d77ca379f58d',
  title: 'Investment project task',
  description: 'test',
  due_date: '2023-12-25',
  reminder_days: 7,
  email_reminders_enabled: true,
  advisers: [
    {
      name: 'Grace Gru',
      first_name: 'Grace',
      last_name: 'Gru',
      id: '95a99736-5402-11eb-ae93-0242ac130002',
    },
  ],
  archived: false,
  archived_reason: '',
  archived_by: null,
  created_by: {
    name: 'Nico Beans',
    first_name: 'Nico',
    last_name: 'Beans',
    id: 'dc2b62f8-5087-4b68-89cc-51930fae8c54',
  },
  modified_by: {
    name: '',
    first_name: '',
    last_name: '',
    id: 'dc2b62f8-5087-4b68-89cc-51930fae8c54',
  },
  created_on: '2023-09-25T14:02:29.926048Z',
  modified_on: '2023-09-27T07:51:10.833346Z',
  investment_project_task: {
    investment_project: {
      investor_company: {
        name: 'One List Corp',
        id: '375094ac-f79a-43e5-9c88-059a7caa17f0',
      },
      id: 'b30dee70-b2d6-48cf-9ce4-b9264854470c',
    },
    id: '2ca987bf-3fed-48e1-93a6-542a5aa33724',
  },
}

describe('View task details', () => {
  context('When visiting investment project task details', () => {
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/task/${taskFixture.id}`, taskFixture)
      cy.visit(urls.tasks.details(taskFixture.id))
    })

    it('should display the company name and investment project task title in the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        'One List Corp': urls.companies.detail(
          '375094ac-f79a-43e5-9c88-059a7caa17f0'
        ),
        'Investment project task': null,
      })
    })

    it('should display the title of the investment project task', () => {
      cy.get('h1').contains(taskFixture.title)
    })

    it('should display the summary table', () => {
      assertSummaryTable({
        dataTest: 'task-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: {
            href: urls.companies.detail('375094ac-f79a-43e5-9c88-059a7caa17f0'),
            name: 'One List Corp',
          },
          'Date due': '25 December 2023',
          'Assigned to': 'Grace Gru',
          'Task description': 'test',
          'Reminders set': '7 days before due date',
          'Date created': '25 September 2023',
          'Created by': 'Nico Beans',
        },
      })
    })
  })
})
