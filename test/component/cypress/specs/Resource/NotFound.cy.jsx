import React from 'react'

import DataHubProvider, { dispatchResetAction } from '../provider'
import Resource from '../../../../../src/client/components/Resource/Resource'

const assertDefaultError = (noun) => {
  cy.contains(`Could not load ${noun}`)
  cy.contains('button', 'Retry')
  cy.contains('button', 'Dismiss')
}

const assertNoDefaultError = (noun) => {
  cy.contains(`Could not load ${noun}`).should('not.exist')
  cy.contains('button', 'Retry').should('not.exist')
  cy.contains('button', 'Dismiss').should('not.exist')
}

const I_SHOULD_NOT_BE_RENDERED = 'I should not be rendered'

describe('Resource notFoundView', () => {
  beforeEach(dispatchResetAction)

  context('If task rejects with an object with a httpStatusCode == 404', () => {
    it('Should render default error view if the `notFoundView` is not set', () => {
      cy.mount(
        <DataHubProvider
          resetTasks={true}
          tasks={{
            foo: () =>
              Promise.reject({
                httpStatusCode: 404,
              }),
          }}
        >
          <Resource name="foo" id="whatever" />
        </DataHubProvider>
      )

      assertDefaultError('foo')
    })

    it('Should render custom error view if `renderError` is set even if `notFoundView` is set', () => {
      cy.mount(
        <DataHubProvider
          resetTasks={true}
          tasks={{
            foo: () =>
              Promise.reject({
                httpStatusCode: 404,
              }),
          }}
        >
          <Resource
            name="foo"
            id="whatever"
            notFoundView={I_SHOULD_NOT_BE_RENDERED}
            taskStatusProps={{
              renderError: () => 'Custom error',
            }}
          />
        </DataHubProvider>
      )

      cy.contains(I_SHOULD_NOT_BE_RENDERED).should('not.exist')
      cy.contains('Custom error')
      assertNoDefaultError('foo')
    })

    it('Should render the value of `notFoundView` if set', () => {
      cy.mount(
        <DataHubProvider
          resetTasks={true}
          tasks={{
            foo: () =>
              Promise.reject({
                httpStatusCode: 404,
              }),
          }}
        >
          <Resource
            name="foo"
            id="whatever"
            notFoundView={<div>The thing doesn't exist</div>}
          />
        </DataHubProvider>
      )

      cy.contains("The thing doesn't exist")
      assertNoDefaultError('foo')
    })
  })

  context('If task rejects with an object with a httpStatusCode != 404', () => {
    it('Should render default error view if the `notFoundView` is set', () => {
      cy.mount(
        <DataHubProvider
          resetTasks={true}
          tasks={{
            foo: () =>
              Promise.reject({
                httpStatusCode: 123,
              }),
          }}
        >
          <Resource
            name="foo"
            id="whatever"
            notFoundView={I_SHOULD_NOT_BE_RENDERED}
          />
        </DataHubProvider>
      )

      cy.contains(I_SHOULD_NOT_BE_RENDERED).should('not.exist')
      assertDefaultError('foo')
    })

    it('Should render the default error view if renderError is not set', () => {
      cy.mount(
        <DataHubProvider
          resetTasks={true}
          tasks={{
            foo: () =>
              Promise.reject({
                httpStatusCode: 123,
              }),
          }}
        >
          <Resource
            name="foo"
            id="whatever"
            notFoundView={I_SHOULD_NOT_BE_RENDERED}
          />
        </DataHubProvider>
      )

      cy.contains(I_SHOULD_NOT_BE_RENDERED).should('not.exist')
      assertDefaultError('foo')
    })

    it('Should render custom error view if renderError is set', () => {
      cy.mount(
        <DataHubProvider
          resetTasks={true}
          tasks={{
            foo: () =>
              Promise.reject({
                httpStatusCode: 123,
              }),
          }}
        >
          <Resource
            name="foo"
            id="whatever"
            notFoundView={I_SHOULD_NOT_BE_RENDERED}
            taskStatusProps={{
              renderError: () => 'Custom error',
            }}
          />
        </DataHubProvider>
      )

      cy.contains(I_SHOULD_NOT_BE_RENDERED).should('not.exist')
      cy.contains('Custom error')
      assertNoDefaultError('foo')
    })
  })
})
