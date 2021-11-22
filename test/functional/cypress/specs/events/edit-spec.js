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
    assertEventFormFields({
      hasRelatedTradeAgreement: 'No',
      eventName: 'One-day exhibition',
      eventType: 'Exhibition',
      startDate: { day: '01', month: '01', year: '2021' },
      endDate: { day: '01', month: '01', year: '2021' },
      locationType: 'HQ',
      street1: 'Day Court Exhibition Centre',
      street2: 'Day Court Lane',
      town: 'China',
      county: '',
      postcode: 'SW9 9AB',
      country: 'China',
      notes: 'This is a dummy event for testing.',
      leadTeam: 'CBBC Hangzhou',
      service: 'Events : UK Based',
      organiser: 'John Rogers',
      isEventShared: 'Yes',
      teams: ['CBBC HangZhou', 'CBBC North West'],
      relatedProgrammes: 'Grown in Britain',
    })
  })
})
