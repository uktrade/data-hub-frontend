import {
  assertFormFields,
  assertFieldTextarea,
  assertFieldInput,
  assertFieldTypeahead,
  assertFieldDate,
  assertFieldRadiosWithLegend,
  assertTextVisible,
} from './assertions'

const YES = 'Yes'
const UK = 'United Kingdom'

const assertTradeAgreementArticle = (articleElement) => {
  cy.wrap(articleElement)
    .parent()
    .contains('Select a trade agreement and then a related event.')
  assertTextVisible(
    'Find more information (opens in a new tab) about selecting trade agreements.'
  )
  cy.contains('more information')
    .should('have.attr', 'href')
    .should(
      'contain',
      'https://data-services-help.trade.gov.uk/data-hub/how-articles/trade-agreement-activity/recording-trade-agreement-activity/'
    )
  cy.contains('more information').should(
    'have.attr',
    'aria-label',
    'more information (opens in a new tab)'
  )
}

const assertTeamsFields = (element, teams, isEventShared) => {
  const optionsCount = isEventShared === YES ? 3 : 2
  assertFieldRadiosWithLegend({
    element,
    legend: 'Is this a shared event? (optional)',
    optionsCount,
    value: isEventShared,
  })
  if (isEventShared && isEventShared === YES) {
    cy.get('#field-teams').then((teamsElement) => {
      assertFieldTypeahead({
        element: teamsElement,
        label: 'Teams',
        placeholder: !teams ? 'Select at least one team' : undefined,
        values: teams,
      })
    })
  }
}

const assertTradeAgreementsFields = (
  element,
  relatedTradeAgrements,
  hasRelatedTradeAgreement
) => {
  const optionsCount = hasRelatedTradeAgreement === YES ? 3 : 2
  assertFieldRadiosWithLegend({
    element,
    legend: 'Does the event relate to a trade agreement?',
    optionsCount,
    value: hasRelatedTradeAgreement,
  })
  if (hasRelatedTradeAgreement && hasRelatedTradeAgreement === YES) {
    cy.get('#field-related_trade_agreements').then((tradeAgrementsElement) => {
      assertFieldTypeahead({
        element: tradeAgrementsElement,
        label: '',
        placeholder: !relatedTradeAgrements
          ? 'Search trade agreements'
          : undefined,
        values: relatedTradeAgrements,
      })
    })
  }
}

const assertUkRegionOrNotesFields = ({ element, country, ukRegion, notes }) => {
  if (country && country === UK) {
    assertFieldTypeahead({
      element,
      label: 'UK Region',
      placeholder: !ukRegion ? 'Select region' : undefined,
      value: ukRegion,
    })
  } else {
    assertFieldTextarea({
      element,
      label: 'Event Notes (optional)',
      value: notes,
    })
  }
}

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
  assertFormFields(cy.get('form'), [
    assertTradeAgreementArticle,
    (element) =>
      assertTradeAgreementsFields(
        element,
        relatedTradeAgrements,
        hasRelatedTradeAgreement
      ),
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
      isMulti: false,
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
      isMulti: false,
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
      isMulti: false,
    },
    (element) =>
      assertUkRegionOrNotesFields({ element, country, ukRegion, notes }),
    {
      assert: assertFieldTypeahead,
      label: 'Team hosting the event',
      placeholder: !leadTeam ? 'Select team' : undefined,
      value: leadTeam,
      isMulti: false,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Service',
      placeholder: !service ? 'Select service' : undefined,
      value: service,
      isMulti: false,
    },
    {
      assert: assertFieldTypeahead,
      label: 'Organiser',
      placeholder: !organiser ? 'Type to search for organiser' : undefined,
      value: organiser,
      isMulti: false,
    },
    (element) => assertTeamsFields(element, teams, isEventShared),
    {
      assert: assertFieldTypeahead,
      label: 'Related programmes',
      placeholder: !relatedProgrammes ? 'Select programme' : undefined,
      values: relatedProgrammes,
    },
  ])
}

// Generic Assertions

export const assertMultiOptionTypeaheadValues = (
  selector,
  label,
  dataArray = []
) => {
  dataArray.map((value) => assertTypeaheadValue(selector, label, value))
}

export const assertTypeaheadValue = (selector, label, value) => {
  cy.get(selector).then((element) =>
    assertFieldTypeahead({
      element,
      label,
      value,
    })
  )
}

export const assertEventRequestBody = (expectedBody, callback) => {
  cy.wait('@eventHttpRequest').then((xhr) => {
    expect(xhr.request.body).to.deep.equal(expectedBody)
    callback(xhr)
  })
}
