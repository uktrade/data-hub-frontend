import {
  assertFieldAddAnother,
  assertFormFields,
  assertLocalHeader,
  assertBreadcrumbs,
  assertFieldTextarea,
  assertFieldInput,
  assertBooleanFieldRadios,
  assertFieldTypeahead,
  assertFieldDate,
} from '../../../cypress/support/assertions'

describe('Event create', () => {
  before(() => {
    cy.visit('/events/create')
  })

  it('should render the header', () => {
    assertLocalHeader('Add event')
  })

  it('should render add event breadcrumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Events: '/events?page=1&sortby=modified_on:desc',
      'Add event': null,
    })
  })

  it('should render expected form fields with default values ', () => {
    assertFormFields(cy.get('form'), [
      {
        assert: assertBooleanFieldRadios,
        legend: 'Does the event relate to a trade agreement?',
        optionsCount: 2,
        value: undefined,
      },
      {
        assert: assertFieldInput,
        label: 'Event name',
        value: undefined,
      },
      {
        assert: assertFieldTypeahead,
        label: 'Type of event',
        placeholder: 'Select event type',
        value: undefined,
      },
      {
        assert: assertFieldDate,
        label: 'Event start date',
        value: undefined,
      },
      {
        assert: assertFieldDate,
        label: 'Event end date',
        value: undefined,
      },
      {
        assert: assertFieldTypeahead,
        label: 'Event location type (optional)',
        placeholder: 'Select event',
        value: undefined,
      },
      {
        assert: assertFieldInput,
        label: 'Address line 1',
        value: undefined,
      },
      {
        assert: assertFieldInput,
        label: 'Address line 2 (optional)',
        value: undefined,
      },
      {
        assert: assertFieldInput,
        label: 'Town or city',
        value: undefined,
      },
      {
        assert: assertFieldInput,
        label: 'County (optional)',
        value: undefined,
      },
      {
        assert: assertFieldInput,
        label: 'Postcode',
        value: undefined,
      },
      {
        assert: assertFieldTypeahead,
        label: 'Country',
        placeholder: 'Select country',
        value: undefined,
      },
      {
        assert: assertFieldTextarea,
        label: 'Event Notes (optional)',
        value: undefined,
      },
      {
        assert: assertFieldTypeahead,
        label: 'Team hosting the event',
        placeholder: 'Select team',
        value: undefined,
      },
      {
        assert: assertFieldTypeahead,
        label: 'Service',
        placeholder: 'Select service',
        value: undefined,
      },
      {
        assert: assertFieldTypeahead,
        label: 'Organiser',
        placeholder: 'Type to search for organiser',
        value: undefined,
      },
      {
        assert: assertBooleanFieldRadios,
        legend: 'Is this a shared event? (optional)',
        value: undefined,
        optionsCount: 2,
      },
      {
        assert: assertFieldAddAnother,
        label: 'Related programmes',
        values: undefined,
      },
    ])
  })

  it('should contain trade agreement guidance', () => {
    cy.findByText(
      'If your Event is set up to focus on a Trade Agreement or contributes to implementing a Trade Agreement then select that the event relates to a Trade Agreement and the relevant Agreement(s)'
    ).should('be.visible')
    cy.findByText('See more guidance').should('be.visible')
    cy.findByText('See more guidance')
      .should('have.attr', 'href')
      .should(
        'contain',
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/trade-agreement-activity/recording-trade-agreement-activity/'
      )
    cy.findByText('See more guidance').should(
      'have.attr',
      'aria-label',
      'Opens in a new window or tab'
    )
    cy.findByText('(opens in a new window or tab)').should('be.visible')
  })

  it('should allow a user to add multiple named trade agreements', () => {
    cy.findByText('Does the event relate to a trade agreement?').should(
      'be.visible'
    )
    cy.get('[name="has_related_trade_agreements"]').first().click()
    cy.findByText('Related named trade agreement(s)').should('be.visible')
    cy.findByText('Search trade agreements').should('be.visible')
    cy.findAllByText('Add another')
      .first()
      .should('be.visible')
      .should('have.attr', 'aria-label', 'Add a 1nd trade agreement')
    cy.findAllByText('Add another').first().click()
    // Check two trade agreement selectors added
    cy.findAllByText('Search trade agreements').should('have.length', 2)
    cy.findAllByText('Add another')
      .first()
      .should('be.visible')
      .should('have.attr', 'aria-label', 'Add a 2rd trade agreement')

    cy.findAllByRole('combobox', { id: 'related_trade_agreements' })
      .eq(0)
      .type(
        'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
        { force: true }
      )
      .type('{enter}')

    cy.findAllByRole('combobox', { id: 'related_trade_agreements' })
      .eq(1)
      .type('UK-Australia Mutual Recognition Agreement', { force: true })
      .type('{enter}')

    cy.findAllByRole('region').then((element) =>
      assertFieldTypeahead({
        element,
        value:
          'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
      })
    )

    cy.findAllByRole('region').then((element) =>
      assertFieldTypeahead({
        element,
        value: 'UK-Australia Mutual Recognition Agreement',
      })
    )
  })

  it('should toggle uk region field', () => {
    cy.get('#address_country')
      .type('United Kingdom', { force: true })
      .type('{enter}')

    cy.get('#field-address_country').should('contain', 'United Kingdom')

    cy.get('#uk_region').should('be.visible')

    cy.get('#address_country').type('Uganda', { force: true }).type('{enter}')
    cy.get('#field-address_country').should('contain', 'Uganda')
    cy.get('#uk_region').should('not.exist')
  })

  it('should toggle teams section when interacting with shared options', () => {
    cy.findByText('Is this a shared event? (optional)').should('be.visible')
    cy.get('[name="event_shared"]').eq(0).click()
    cy.get('#teams').should('be.visible')

    cy.get('[name="event_shared"]').eq(1).click()
    cy.get('#teams').should('not.exist')
  })

  it('should allow user to add multiple shared teams', () => {
    // Select yes
    cy.get('[name="event_shared"]').eq(0).click()
    // Click Add another
    cy.findAllByText('Add another')
      .eq(0)
      .should('be.visible')
      .should('have.attr', 'aria-label', 'Add a 1nd team')
    cy.findAllByText('Add another').eq(0).click()
    cy.get('#teams').should('have.length', 2)

    //  Set first teams with BPI
    cy.get('#teams').eq(0).type('BPI', { force: true }).type('{enter}')
    cy.get('#field-teams').should('contain', 'BPI')
    // Set second with
    cy.get('#teams').eq(1).type('BN Americas', { force: true }).type('{enter}')
    cy.get('#field-teams').eq(1).should('contain', 'BN Americas')
  })

  // it('should allow user to add multiple programmes', () => {
  //   cy.get(selectors.eventCreate.sharedYes).click()
  //   cy.get(selectors.eventCreate.relatedProgrammes).eq(0).select('CEN Energy')
  //   cy.get(selectors.eventCreate.addAnotherProgramme).click()
  //   cy.get(selectors.eventCreate.relatedProgrammes).eq(1).select('CEN Services')

  //   cy.get(selectors.eventCreate.relatedProgrammes)
  //     .eq(0)
  //     .should('contain', 'CEN Energy')
  //   cy.get(selectors.eventCreate.relatedProgrammes)
  //     .eq(1)
  //     .should('contain', 'Services')
  // })
})
