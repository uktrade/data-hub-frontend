import {
  assertLocalHeader,
  assertBreadcrumbs,
} from '../../../cypress/support/assertions'
import { assertEventFormFields } from '../../../cypress/support/event-assertions'

describe('Event edit', () => {
  before(() => {
    cy.visit('/events/02586bc9-364a-47b9-886e-4493d44d6e3d/edit')
  })

  // TODO: Figure out if this should be sandboxed or intercepted

  it('should render the header', () => {
    assertLocalHeader('Edit event')
  })

  it('should render add event breadcrumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Events: '/events?page=1&sortby=modified_on:desc',
      'Edit event': null,
    })
  })

  it('should render expected form fields with original values ', () => {
    // TODO: When intercepter configured
    assertEventFormFields()
  })
})
