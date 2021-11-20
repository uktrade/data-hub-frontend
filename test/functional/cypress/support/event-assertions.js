import {
  assertFieldAddAnother,
  assertFormFields,
  assertFieldTextarea,
  assertFieldInput,
  assertFieldTypeahead,
  assertFieldDate,
  assertFieldRadiosWithLegend,
} from './assertions'

export const assertEventFormFields = ({
  hasRelatedTradeAgreement,
  // relatedTradeAgrements,
  name,
  eventType,
  startDate,
  endDate,
  locationType,
  street1,
  street2,
  town,
  postcode,
  county,
  country,
  // ukRegion,
  notes,
  leadTeam,
  service,
  organiser,
  isEventShared,
  // teams,
  relatedProgrammes,
} = {}) => {
  assertFormFields(cy.get('form'), [
    {
      assert: assertFieldRadiosWithLegend,
      legend: 'Does the event relate to a trade agreement?',
      optionsCount: 2,
      value: hasRelatedTradeAgreement,
    },
    // TODO: FieldAddAnother relatedTradeAgreements when hidden fields understood
    {
      assert: assertFieldInput,
      label: 'Event name',
      value: name,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Type of event',
      placeholder: 'Select event type',
      value: eventType,
    },
    {
      assert: assertFieldDate,
      label: 'Event start date',
      value: startDate,
    },
    {
      assert: assertFieldDate,
      label: 'Event end date',
      value: endDate,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Event location type (optional)',
      placeholder: 'Select event',
      value: locationType,
    },
    {
      assert: assertFieldInput,
      label: 'Address line 1',
      value: street1,
    },
    {
      assert: assertFieldInput,
      label: 'Address line 2 (optional)',
      value: street2,
    },
    {
      assert: assertFieldInput,
      label: 'Town or city',
      value: town,
    },
    {
      assert: assertFieldInput,
      label: 'County (optional)',
      value: county,
    },
    {
      assert: assertFieldInput,
      label: 'Postcode',
      value: postcode,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Country',
      placeholder: 'Select country',
      value: country,
    },
    // TODO: UKRegion when hidden fields understood
    {
      assert: assertFieldTextarea,
      label: 'Event Notes (optional)',
      value: notes,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Team hosting the event',
      placeholder: 'Select team',
      value: leadTeam,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Service',
      placeholder: 'Select service',
      value: service,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Organiser',
      placeholder: 'Type to search for organiser',
      value: organiser,
    },
    {
      assert: assertFieldRadiosWithLegend,
      legend: 'Is this a shared event? (optional)',
      optionsCount: 2,
      value: isEventShared,
    },
    // TODO: FieldAddAnother hidden teams
    {
      assert: assertFieldAddAnother,
      label: 'Related programmes',
      values: relatedProgrammes,
    },
  ])
}

export const assertTypeaheadValuesWith = (
  fieldAddAnotherDataTestPrefix,
  dataArray = []
) => {
  if (dataArray) {
    dataArray.forEach((item, index) => {
      assertTypeaheadValueWith(
        `[data-test=${fieldAddAnotherDataTestPrefix}${index}]`,
        item
      )
    })
  }
}

export const assertTypeaheadValueWith = (selector, value) => {
  cy.get(selector).then((element) =>
    assertFieldTypeahead({
      element,
      value,
    })
  )
}

export const assertErrorSummary = (errors) => {
  cy.contains('h2', 'There is a problem')
    .next()
    .should('have.text', errors.join(''))
}

export const assertVisible = (selector) => {
  cy.get(selector).should('be.visible')
}

export const assertNotExists = (selector) => {
  cy.get(selector).should('not.exist')
}

export const assertTextVisible = (text) => {
  cy.contains(text).should('be.visible')
}

export const assertRedirectUrl = (url) => {
  cy.location('pathname').should('eq', url)
}

export const assertEventRequestBody = (expectedBody, callback) => {
  cy.wait('@eventHttpRequest').then((xhr) => {
    // eslint-disable-next-line no-console
    cy.log(
      'Request body fields that differ',
      objectDiff(xhr.request.body, expectedBody)
    )

    expect(xhr.request.body).to.deep.equal(expectedBody)

    callback(xhr)
  })
}
