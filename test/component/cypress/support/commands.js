import React from 'react'
import { mount } from 'cypress/react18'

import { TASK_GET_REMINDER_SUMMARY } from '../../../../src/client/components/NotificationAlert/state'
import { INITIAL_STATE } from '../../../../src/client/components/NotificationAlert/reducer'
import { TASK_GET_TYPEAHEAD_OPTIONS } from '../../../../src/client/components/Typeahead/state'
import { getTypeaheadOptions } from '../../../../src/client/components/Typeahead/tasks'

import { createTestProvider } from '../specs/provider'

Cypress.Commands.add('mount', mount)

Cypress.Commands.add(
  'mountWithProvider',
  (children, { tasks, initialPath } = {}) => {
    const Provider = createTestProvider({
      tasks: {
        [TASK_GET_REMINDER_SUMMARY]: () => Promise.resolve(INITIAL_STATE),
        [TASK_GET_TYPEAHEAD_OPTIONS]: getTypeaheadOptions,
        ...tasks,
      },
      initialPath,
    })

    return cy.mount(<Provider>{children}</Provider>)
  }
)
