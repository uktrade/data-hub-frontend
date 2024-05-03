import React from 'react'

import { TaskOverdueFormFields } from '../../../../../../src/client/modules/Reminders/Settings/TaskOverdueForm'
import { assertFieldRadiosWithLegend } from '../../../../../functional/cypress/support/assertions'

describe('TaskOverdueSettings', () => {
  context('Display the reminder settings form', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <TaskOverdueFormFields settings={{ emailRemindersEnabled: true }} />
      )
    })

    it('should render an "Email notifications" legend', () => {
      cy.get('[data-test="field-emailRemindersEnabled"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Task overdue email notifications',
          optionsCount: 2,
          value: 'Yes',
        })
      })
    })

    it('should render a question', () => {
      cy.get('[data-test="field-emailRemindersEnabled"] label').should(
        'contain',
        'Do you want to get emails as well as on-line reminders?'
      )
    })
  })

  context('When the email reminders enabled is true', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <TaskOverdueFormFields settings={{ emailRemindersEnabled: true }} />
      )
    })

    it('should render the Yes radio button', () => {
      cy.get('[data-test="email-reminders-enabled-no"]').should(
        'not.be.checked'
      )
      cy.get('[data-test="email-reminders-enabled-yes"]').should('be.checked')
    })
  })

  context('When the email reminders enabled is false', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <TaskOverdueFormFields settings={{ emailRemindersEnabled: false }} />
      )
    })

    it('should render the Yes radio button', () => {
      cy.get('[data-test="email-reminders-enabled-no"]').should('be.checked')
      cy.get('[data-test="email-reminders-enabled-yes"]').should(
        'not.be.checked'
      )
    })
  })
})
