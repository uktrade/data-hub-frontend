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
  const basePayload = {
    limit: 50,
    offset: 0,
    adviser: [myAdviserId],
    sortby: 'due_date:asc',
  }

  function assertFilterName(element, text) {
    cy.intercept('POST', endpoint, {
      body: {
        count: 1,
        results: [TaskList[0]],
      },
    })
    cy.visit(tasksTab)

    cy.get(element).find('span').should('have.text', text)
  }

  function testFilterFromUrl(element, urlQuery, payload, selectedOption) {
    cy.intercept('POST', endpoint, {
      body: {
        count: 1,
        results: [TaskList[0]],
      },
    }).as('apiRequest')
    cy.visit(`${tasksTab}?${urlQuery}`)

    // This ignores the checkForMyTasks API call which happens on page load
    cy.wait('@apiRequest')

    assertPayload('@apiRequest', { ...basePayload, ...payload })
    assertListItems({ length: 1 })
    cy.get(`${element} select`).find(':selected').contains(selectedOption)
  }

  function testFilterFromUserInput(element, payload, selectedOption) {
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
    }).as('apiRequest')
    cy.get(`${element} select`).select(selectedOption)
    assertPayload('@apiRequest', { ...basePayload, ...payload })
    assertListItems({ length: 1 })
  }

  context('Created by', () => {
    const element = '[data-test="created-by-select"]'

    it('should have a "Created by" filter', () => {
      assertFilterName(element, 'Created by')
      cy.get(`${element} option`).then((createdByOptions) => {
        expect(transformOptions(createdByOptions)).to.deep.eq([
          { value: 'all-statuses', label: 'Show all' },
          { value: 'me', label: 'Me' },
          { value: 'others', label: 'Others' },
        ])
      })
    })

    it('should filter created by me from the url', () => {
      testFilterFromUrl(
        element,
        'created_by=me',
        { created_by: myAdviserId },
        'Me'
      )
    })

    it('should filter created by others from the url', () => {
      testFilterFromUrl(
        element,
        'created_by=others',
        { not_created_by: myAdviserId },
        'Others'
      )
    })

    it('should filter created by me from user input', () => {
      testFilterFromUserInput(element, { created_by: myAdviserId }, 'Me')
    })

    it('should filter created by others from user input', () => {
      testFilterFromUserInput(
        element,
        { not_created_by: myAdviserId },
        'Others'
      )
    })
  })

  context('Sort by', () => {
    const element = '[data-test="sortby-select"]'

    const sortbyOptionsData = [
      {
        label: 'Due date',
        value: 'due_date',
        sortBy: 'due_date:asc',
      },
      {
        label: 'Recently updated',
        value: 'recently_updated',
        sortBy: 'modified_on:desc',
      },
      {
        label: 'Least recently updated',
        value: 'least_recently_updated',
        sortBy: 'modified_on:asc',
      },
      {
        label: 'Company A-Z',
        value: 'company_ascending',
        sortBy: 'company.name:asc',
      },
      {
        label: 'Project A-Z',
        value: 'project_ascending',
        sortBy: 'investment_project.name:asc',
      },
    ]

    it('should have a "Sort by" filter', () => {
      assertFilterName(element, 'Sort by')
      cy.get(`${element} option`).then((sortByOptions) => {
        expect(transformOptions(sortByOptions)).to.deep.eq(
          transformOptions(sortbyOptionsData)
        )
      })
    })

    sortbyOptionsData.forEach(({ label, value, sortBy }) => {
      it(`should filter ${label} from the url`, () => {
        testFilterFromUrl(element, `sortby=${value}`, { sortby: sortBy }, label)
      })

      it(`should filter ${label} from user input`, () => {
        cy.intercept('POST', endpoint, {
          body: {
            count: 3,
            results: TaskList,
          },
        })
        cy.visit(tasksTab)
        assertListItems({ length: 3 })

        // Select a different option so the API is called when testing Due Date
        if (label === 'Due date') {
          cy.get(`${element} select`).select('Recently updated')
        }

        cy.intercept('POST', endpoint, {
          body: {
            count: 1,
            results: [TaskList[0]],
          },
        }).as('apiRequestSortBy')

        if (label === 'Due date') {
          cy.wait('@apiRequestSortBy')
        }

        cy.get(`${element} select`).select(label)
        assertPayload('@apiRequestSortBy', {
          limit: 50,
          offset: 0,
          adviser: [myAdviserId],
          sortby: sortBy,
        })
        assertListItems({ length: 1 })
      })
    })
  })

  context('Assigned to', () => {
    const element = '[data-test="assigned-to-select"]'

    it('should have a "Assigned to" filter', () => {
      assertFilterName(element, 'Assigned to')
      cy.get(`${element} option`).then((assignedToOptions) => {
        expect(transformOptions(assignedToOptions)).to.deep.eq([
          { value: 'all-statuses', label: 'Show all' },
          { value: 'me', label: 'Me' },
          { value: 'others', label: 'Others' },
        ])
      })
    })

    it('should filter assigned to me from the url', () => {
      testFilterFromUrl(
        element,
        'assigned_to=me',
        { advisers: [myAdviserId] },
        'Me'
      )
    })

    it('should filter assigned to others from the url', () => {
      testFilterFromUrl(
        element,
        'assigned_to=others',
        { not_advisers: [myAdviserId] },
        'Others'
      )
    })

    it('should filter assigned to me from user input', () => {
      testFilterFromUserInput(element, { advisers: [myAdviserId] }, 'Me')
    })

    it('should filter assigned to others from user input', () => {
      testFilterFromUserInput(
        element,
        { not_advisers: [myAdviserId] },
        'Others'
      )
    })
  })

  context('Status', () => {
    const element = '[data-test="status-select"]'

    it('should have a "Status" filter', () => {
      assertFilterName(element, 'Status')
      cy.get(`${element} option`).then((statusOptions) => {
        expect(transformOptions(statusOptions)).to.deep.eq([
          { value: 'all-statuses', label: 'Show all' },
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Completed' },
        ])
      })
    })

    it('should filter active status from the url', () => {
      testFilterFromUrl(element, 'status=active', { archived: false }, 'Active')
    })

    it('should filter completed status from the url', () => {
      testFilterFromUrl(
        element,
        'status=completed',
        { archived: true },
        'Completed'
      )
    })

    it('should filter active status from user input', () => {
      testFilterFromUserInput(element, { archived: false }, 'Active')
    })

    it('should filter completed status from user input', () => {
      testFilterFromUserInput(element, { archived: true }, 'Completed')
    })
  })
})
