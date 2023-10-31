import React from 'react'

import {
  AssigneeTimeTable,
  NoAssigneesMessage,
} from '../../../../../src/client/modules/Omis/AssigneeTime'
import DataHubProvider, { dispatchResetAction } from '../provider'
import urls from '../../../../../src/lib/urls'
import {
  assertErrorSummary,
  assertFieldInputNoLabel,
  assertGovReactTable,
} from '../../../../functional/cypress/support/assertions'

const order = {
  id: '12345',
}

const assignees = [
  { adviser: { id: '123', name: 'Andras Test' }, estimatedTime: 60 },
  { adviser: { id: '456', name: 'Andreas Test' }, estimatedTime: 120 },
  { adviser: { id: '789', name: 'Andrei Test' }, estimatedTime: 180 },
  { adviser: { id: '101', name: 'Andrew Test' }, estimatedTime: 240 },
  { adviser: { id: '112', name: 'Andrey Test' }, estimatedTime: 300 },
]

const assigneesNoTime = [
  { adviser: { id: '123', name: 'Berek Test' }, estimatedTime: 0 },
  { adviser: { id: '456', name: 'Bernard Test' }, estimatedTime: 0 },
  { adviser: { id: '789', name: 'Bernardas Test' }, estimatedTime: 0 },
  { adviser: { id: '101', name: 'Bernardin Test' }, estimatedTime: 0 },
  { adviser: { id: '112', name: 'Bernardo Test' }, estimatedTime: 0 },
]

describe('AssigneeTime', () => {
  context('NoAssigneesMessage', () => {
    beforeEach(() => {
      cy.mount(<NoAssigneesMessage order={order} />)
    })

    it('should render the message', () => {
      cy.get('[data-test="no-assignees-message"]')
        .should('exist')
        .should(
          'have.text',
          'To add estimated hours you must add advisers in the market.Add advisers'
        )
    })

    it('should render the add advisers link', () => {
      cy.get('[data-test="add-advisers-link"]')
        .should('exist')
        .should('have.attr', 'href', urls.omis.edit.assignees(order.id))
    })

    it('should render the return link', () => {
      cy.get('[data-test="return-link"]')
        .should('exist')
        .should('have.attr', 'href', urls.omis.order(order.id))
    })
  })

  context('AssigneeTimeTable', () => {
    const Component = (props) => (
      <DataHubProvider>
        <AssigneeTimeTable {...props} />
      </DataHubProvider>
    )

    context('When the assignees already have estimated hours', () => {
      beforeEach(() => {
        cy.viewport(1024, 768)
        dispatchResetAction()
        cy.mount(<Component order={order} assignees={assignees} />)
      })

      it('should render the message', () => {
        cy.get('[data-test="estimated-hours-message"]')
          .should('exist')
          .should(
            'have.text',
            'Estimated hours will be used to calculate the cost of the order.All work will be charged at £55 per hour.'
          )
      })

      it('should render the table and the assignee names', () => {
        assertGovReactTable({
          element: '[data-test="assignee-table"]',
          rows: [
            ['', 'Estimated hours'],
            [assignees[0].adviser.name, ''],
            [assignees[1].adviser.name, ''],
            [assignees[2].adviser.name, ''],
            [assignees[3].adviser.name, ''],
            [assignees[4].adviser.name, ''],
          ],
        })
      })

      it('should render the input fields with initial values', () => {
        cy.get('[data-test="field-123"]').then((element) => {
          assertFieldInputNoLabel({
            element,
            value: '1',
          })
        })
        cy.get('[data-test="field-456"]').then((element) => {
          assertFieldInputNoLabel({
            element,
            value: '2',
          })
        })
        cy.get('[data-test="field-789"]').then((element) => {
          assertFieldInputNoLabel({
            element,
            value: '3',
          })
        })
        cy.get('[data-test="field-101"]').then((element) => {
          assertFieldInputNoLabel({
            element,
            value: '4',
          })
        })
        cy.get('[data-test="field-112"]').then((element) => {
          assertFieldInputNoLabel({
            element,
            value: '5',
          })
        })
      })

      it('should render the edit advisers link', () => {
        cy.get('[data-test="edit-advisers-link"]')
          .should('exist')
          .should('have.attr', 'href', urls.omis.edit.assignees(order.id))
      })
    })

    context('When the assignees do not have estimated hours', () => {
      beforeEach(() => {
        cy.viewport(1024, 768)
        dispatchResetAction()
        cy.mount(<Component order={order} assignees={assigneesNoTime} />)
      })

      it('should render the message', () => {
        cy.get('[data-test="estimated-hours-message"]')
          .should('exist')
          .should(
            'have.text',
            'Estimated hours will be used to calculate the cost of the order.All work will be charged at £55 per hour.'
          )
      })

      it('should render the table and the assignee names', () => {
        assertGovReactTable({
          element: '[data-test="assignee-table"]',
          rows: [
            ['', 'Estimated hours'],
            [assigneesNoTime[0].adviser.name, ''],
            [assigneesNoTime[1].adviser.name, ''],
            [assigneesNoTime[2].adviser.name, ''],
            [assigneesNoTime[3].adviser.name, ''],
            [assigneesNoTime[4].adviser.name, ''],
          ],
        })
      })

      it('should render the input fields with initial values', () => {
        cy.get('[data-test="field-123"]').then((element) => {
          assertFieldInputNoLabel({
            element,
            value: '',
          })
        })
        cy.get('[data-test="field-456"]').then((element) => {
          assertFieldInputNoLabel({
            element,
            value: '',
          })
        })
        cy.get('[data-test="field-789"]').then((element) => {
          assertFieldInputNoLabel({
            element,
            value: '',
          })
        })
        cy.get('[data-test="field-101"]').then((element) => {
          assertFieldInputNoLabel({
            element,
            value: '',
          })
        })
        cy.get('[data-test="field-112"]').then((element) => {
          assertFieldInputNoLabel({
            element,
            value: '',
          })
        })
      })

      it('should render the edit advisers link', () => {
        cy.get('[data-test="edit-advisers-link"]')
          .should('exist')
          .should('have.attr', 'href', urls.omis.edit.assignees(order.id))
      })

      it('should not allow invalid values to be entered', () => {
        cy.get('[data-test="adviser-0-input"]').type('not a number')
        cy.get('[data-test="adviser-1-input"]').type('0.5')
        cy.get('[data-test="adviser-2-input"]').type('@£$%^')
        cy.get('[data-test="submit-button"]').click()
        assertErrorSummary([
          'Enter a whole number',
          'Enter a whole number',
          'Enter a whole number',
        ])
      })
    })
  })
})
