const urls = require('../../../../../src/lib/urls')
const { assertSummaryTable } = require('../../support/assertions')

const taskFixture = {
  id: 'efb5a10d-5117-4b90-abbf-d77ca379f58d',
  title: 'New task',
  description: 'test',
  due_date: '2023-11-25',
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
    name: 'Nico Beans',
    first_name: 'Nico',
    last_name: 'Beans',
    id: 'dc2b62f8-5087-4b68-89cc-51930fae8c54',
  },
  created_on: '2023-09-25T14:02:29.926048Z',
  modified_on: '2023-09-25T14:02:29.926061Z',
}

describe('View task details', () => {
  context('When visiting task details', () => {
    it('should display the h1 heading of New Page', () => {
      cy.intercept('GET', '/api-proxy/v4/task/123', taskFixture)
      cy.visit(urls.tasks.details('123'))
      cy.get('h1').contains(taskFixture.title)
      assertSummaryTable({
        dataTest: 'task-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: 'n/a',
          'Date due': '25 November 2023',
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
