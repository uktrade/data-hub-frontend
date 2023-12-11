import { assertPayload } from '../../support/assertions'
import urls from '../../../../../src/lib/urls'
import taskListFaker from '../../fakers/task'

const transformOptions = (options) =>
  [...options].map((o) => ({
    value: o.value,
    label: o.label,
  }))

const assertListItems = ({ length }) => {
  cy.get('[data-test="task-item"]').should('have.length', length)
}
const myAdviserId = '7d19d407-9aec-4d06-b190-d3f404627f21'

describe('Task filters', () => {
  const endpoint = '/api-proxy/v4/search/task'
  const tasksTab = urls.dashboard.myTasks()
  const TaskList = taskListFaker()

  context('Created by', () => {
    const element = '[data-test="created-by-select"]'

    it('should have a "Created by" filter', () => {
      cy.intercept('POST', endpoint, {
        body: {
          count: 1,
          results: [TaskList[0]],
        },
      }).as('apiRequestCreatedBy')
      cy.visit(`${tasksTab}?created_by=me&page=1`)

      cy.get(element).find('span').should('have.text', 'Created by')
      cy.get(`${element} option`).then((createdByOptions) => {
        expect(transformOptions(createdByOptions)).to.deep.eq([
          { value: 'all-statuses', label: 'Show all' },
          { value: 'me', label: 'Me' },
          { value: 'others', label: 'Others' },
        ])
      })
    })

    it('should filter from the url', () => {
      cy.intercept('POST', endpoint, {
        body: {
          count: 1,
          results: [TaskList[0]],
        },
      }).as('apiRequestCreatedBy')
      cy.visit(`${tasksTab}?created_by=me&page=1`)

      // This ignores the checkForMyTasks API call which happens on page load
      cy.wait('@apiRequestCreatedBy')

      assertPayload('@apiRequestCreatedBy', {
        created_by: myAdviserId,
        limit: 50,
        offset: 0,
        adviser: [myAdviserId],
        sortby: 'due_date:asc',
      })
      assertListItems({ length: 1 })
      cy.get(`${element} select`).find(':selected').contains('Me')
    })

    it('should filter from user input', () => {
      cy.intercept('POST', endpoint, {
        body: {
          count: 3,
          results: TaskList,
        },
      })
      cy.visit(tasksTab)
      assertListItems({ length: 3 })

      cy.intercept('POST', endpoint, {
        body: {
          count: 1,
          results: [TaskList[0]],
        },
      }).as('apiRequestCreatedBy')
      cy.get(`${element} select`).select('Me')
      assertPayload('@apiRequestCreatedBy', {
        created_by: myAdviserId,
        limit: 50,
        offset: 0,
        adviser: [myAdviserId],
        sortby: 'due_date:asc',
      })
      assertListItems({ length: 1 })
    })
  })
})
