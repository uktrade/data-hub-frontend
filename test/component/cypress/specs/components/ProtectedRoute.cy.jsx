import React from 'react'

import DataHubProvider from '../provider'
import { ProtectedRoute } from '../../../../../src/client/components/ProtectedRoute'

describe('AccessDenied', () => {
  const Component = (props) => (
    <DataHubProvider>
      <ProtectedRoute {...props}>
        <h1>I have permission</h1>
      </ProtectedRoute>
    </DataHubProvider>
  )

  context(
    'When a user has the module and user permissions needed by the route',
    () => {
      it('should render the route', () => {
        cy.mount(
          <Component
            module="m1"
            modulePermissions={['m1']}
            userPermissions={['u1']}
            routePermissions={['u1']}
          />
        )
        cy.get('h1').should('exist')
      })
    }
  )

  context(
    'When a user is missing the module permissions needed by the route',
    () => {
      it('should render the access denied component', () => {
        cy.mount(
          <Component
            module="m1"
            modulePermissions={['m2']}
            userPermissions={['u1']}
            routePermissions={['u1']}
          />
        )
        cy.get('[data-test="access-denied"]').should('exist')
      })
    }
  )

  context(
    'When a user is missing all the user permissions needed by the route',
    () => {
      it('should render the access denied component', () => {
        cy.mount(
          <Component
            module="m1"
            modulePermissions={['m1']}
            userPermissions={['u2']}
            routePermissions={['u1']}
          />
        )
        cy.get('[data-test="access-denied"]').should('exist')
      })
    }
  )

  context(
    'When a user is missing some of the user permissions needed by the route',
    () => {
      it('should render the access denied component', () => {
        cy.mount(
          <Component
            module="m1"
            modulePermissions={['m1']}
            userPermissions={['u2', 'u3']}
            routePermissions={['u1', 'u2', 'u3']}
          />
        )
        cy.get('[data-test="access-denied"]').should('exist')
      })
    }
  )
})
