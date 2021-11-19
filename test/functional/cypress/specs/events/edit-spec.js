import {
  assertLocalHeader,
  assertBreadcrumbs,
} from '../../../cypress/support/assertions'

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
    assertFormFields(cy.get('form'), [
      {
        assert: assertBooleanFieldRadios,
        legend: 'Does the event relate to a trade agreement?',
        optionsCount: 2,
        value: 'TODO',
      },
      {
        assert: assertFieldInput,
        label: 'Event name',
        value: 'TODO',
      },
      {
        assert: assertFieldTypeahead,
        label: 'Type of event',
        placeholder: 'Select event type',
        value: 'TODO',
      },
      {
        assert: assertFieldDate,
        label: 'Event start date',
        value: 'TODO',
      },
      {
        assert: assertFieldDate,
        label: 'Event end date',
        value: 'TODO',
      },
      {
        assert: assertFieldTypeahead,
        label: 'Event location type (optional)',
        placeholder: 'Select event',
        value: 'TODO',
      },
      {
        assert: assertFieldInput,
        label: 'Address line 1',
        value: 'TODO',
      },
      {
        assert: assertFieldInput,
        label: 'Address line 2 (optional)',
        value: 'TODO',
      },
      {
        assert: assertFieldInput,
        label: 'Town or city',
        value: 'TODO',
      },
      {
        assert: assertFieldInput,
        label: 'County (optional)',
        value: 'TODO',
      },
      {
        assert: assertFieldInput,
        label: 'Postcode',
        value: 'TODO',
      },
      {
        assert: assertFieldTypeahead,
        label: 'Country',
        placeholder: 'Select country',
        value: 'TODO',
      },
      {
        assert: assertFieldTextarea,
        label: 'Event Notes (optional)',
        value: 'TODO',
      },
      {
        assert: assertFieldTypeahead,
        label: 'Team hosting the event',
        placeholder: 'Select team',
        value: 'TODO',
      },
      {
        assert: assertFieldTypeahead,
        label: 'Service',
        placeholder: 'Select service',
        value: 'TODO',
      },
      {
        assert: assertFieldTypeahead,
        label: 'Organiser',
        placeholder: 'Type to search for organiser',
        value: 'TODO',
      },
      {
        assert: assertBooleanFieldRadios,
        legend: 'Is this a shared event? (optional)',
        value: 'TODO',
        optionsCount: 2,
      },
      {
        assert: assertFieldAddAnother,
        label: 'Related programmes',
        values: 'TODO',
      },
    ])
  })
})
