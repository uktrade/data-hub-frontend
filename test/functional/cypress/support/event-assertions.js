import {
  assertFieldAddAnother,
  assertFormFields,
  assertFieldTextarea,
  assertFieldInput,
  assertFieldTypeahead,
  assertFieldDate,
  assertFieldRadiosWithLegend,
} from './assertions'

const YES = 'Yes'
const UK = 'United Kingdom'

export const assertEventFormFields = ({
  hasRelatedTradeAgreement,
  relatedTradeAgrements,
  eventName,
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
  ukRegion,
  notes,
  leadTeam,
  service,
  organiser,
  isEventShared,
  teams,
  relatedProgrammes,
} = {}) => {
  const eventFormFields = [
    {
      assert: assertFieldRadiosWithLegend,
      legend: 'Does the event relate to a trade agreement?',
      optionsCount: 2,
      value: hasRelatedTradeAgreement,
    },
  ]
  if (
    hasRelatedTradeAgreement &&
    hasRelatedTradeAgreement === YES &&
    relatedTradeAgrements
  ) {
    eventFormFields.push({
      assert: assertFieldAddAnother,
      label: '',
      placeholder: !relatedTradeAgrements
        ? 'Search trade agreements'
        : undefined,
      values: relatedTradeAgrements,
    })
  }
  eventFormFields.push(
    {
      assert: assertFieldInput,
      label: 'Event name',
      value: eventName,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Type of event',
      placeholder: !eventType ? 'Select event type' : undefined,
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
      placeholder: !locationType ? 'Select event' : undefined,
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
      placeholder: !country ? 'Select country' : undefined,
      value: country,
    }
  )

  if (country && country === UK && ukRegion) {
    eventFormFields.push({
      assert: assertFieldTypeahead,
      label: 'UK Region',
      placeholder: !ukRegion ? 'Select region' : undefined,
      value: ukRegion,
    })
  }
  eventFormFields.push(
    {
      assert: assertFieldTextarea,
      label: 'Event Notes (optional)',
      value: notes,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Team hosting the event',
      placeholder: !leadTeam ? 'Select team' : undefined,
      value: leadTeam,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Service',
      placeholder: !service ? 'Select service' : undefined,
      value: service,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Organiser',
      placeholder: !organiser ? 'Type to search for organiser' : undefined,
      value: organiser,
    },
    {
      assert: assertFieldRadiosWithLegend,
      legend: 'Is this a shared event? (optional)',
      optionsCount: 2,
      value: isEventShared,
    }
  )

  if (isEventShared && isEventShared === YES && teams) {
    eventFormFields.push({
      assert: assertFieldAddAnother,
      label: 'Teams',
      placeholder: !teams ? 'Select at least one team' : undefined,
      values: teams,
    })
  }
  eventFormFields.push({
    assert: assertFieldAddAnother,
    label: 'Related programmes',
    values: relatedProgrammes,
  })

  assertFormFields(cy.get('form'), eventFormFields)
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

export const assertUrl = (url) => {
  cy.url().should('contain', url)
}

export const assertEventRequestBody = (expectedBody, callback) => {
  cy.wait('@eventHttpRequest').then((xhr) => {
    expect(xhr.request.body).to.deep.equal(expectedBody)
    callback(xhr)
  })
}
