import {
  assertTypeaheadValuesWith,
  assertTextVisible,
} from './event-assertions'

export const fillEventForm = ({
  address1,
  address2,
  country,
  county,
  postcode,
  town,
  region,
  endDate,
  eventType,
  leadTeam,
  locationType,
  eventName,
  notes,
  organiser,
  hasRelatedTradeAgreements,
  relatedTradeAgreements,
  relatedProgrammes,
  startDate,
  eventShared,
  teams,
  service,
} = {}) => {
  fillHasRelatedTradeAgreementsRadio(hasRelatedTradeAgreements)
  if (hasRelatedTradeAgreements && relatedTradeAgreements) {
    fillRelatedTradeAgreements(relatedTradeAgreements)
  }
  fillEventName(eventName)
  fillEventType(eventType)
  fillStartDateWith(startDate?.day, startDate?.month, startDate.year)
  fillEndDateWith(endDate?.day, endDate?.month, endDate?.year)
  fillLocationType(locationType)
  fillAddress({
    address1,
    address2,
    town,
    county,
    postcode,
    country,
    region,
  })
  fillEventNotes(notes)
  fillLeadTeam(leadTeam)
  fillService(service)
  fillOrganiser(organiser)
  fillEventSharedRadio(eventShared)
  if (eventShared && teams) {
    fillTeams(teams)
  }
  fillProgrammes(relatedProgrammes)
}

const fillEventNotes = (notes) => {
  fillWith('#notes', notes)
}

const fillAddress = ({
  address1,
  address2,
  town,
  county,
  postcode,
  country = 'United Kingdom',
  region = 'All',
} = {}) => {
  fillWith('#address_1', address1)
  fillWith('#address_2', address2)
  fillWith('#address_town', town)
  fillWith('#address_county', county)
  fillWith('#address_postcode', postcode)
  fillCountry(country)
  if (country && country === 'United Kingdom') {
    fillRegion(region)
  }
}

const fillOrganiser = (organiser) => {
  fillTypeaheadWith('#field-organiser', organiser)
}

const fillService = (service) => {
  fillTypeaheadWith('#field-service', service)
}

const fillRegion = (region) => {
  fillTypeaheadWith('#field-uk_region', region)
}

const fillLeadTeam = (leadTeam) => {
  fillTypeaheadWith('#field-lead_team', leadTeam)
}

export const fillCountry = (country) => {
  fillTypeaheadWith('#field-address_country', country)
}

const fillEventName = (name) => {
  fillWith('#name', name)
}

export const fillAndAssertProgrammes = (programmes = []) => {
  fillProgrammes(programmes)

  assertTypeaheadValuesWith('programme-field-', programmes)
}

const fillProgrammes = (programmes = []) => {
  fillAddAnotherWithValues(
    '#field-related_programmes',
    'programme-field-',
    programmes
  )
}

export const fillAndAssertSharedTeams = (teams = []) => {
  fillEventSharedRadio(true)
  fillTeams(teams)
  assertTypeaheadValuesWith('team-field-', teams)
}

export const fillAndAssertRelatedTradeAgreements = (tradeAgreements = []) => {
  assertTextVisible('Does the event relate to a trade agreement?')
  fillHasRelatedTradeAgreementsRadio(true)
  assertTextVisible('Related named trade agreement(s)')
  assertTextVisible('Search trade agreements')

  fillRelatedTradeAgreements(tradeAgreements)

  assertTypeaheadValuesWith('trade-agreement-field-', tradeAgreements)
}

const fillTeams = (teams = []) => {
  fillAddAnotherWithValues('#field-teams', 'team-field-', teams)
}

const fillRelatedTradeAgreements = (tradeAgreements = []) => {
  fillAddAnotherWithValues(
    '#field-related_trade_agreements',
    'trade-agreement-field-',
    tradeAgreements
  )
}

const fillLocationType = (value) => {
  fillTypeaheadWith('#field-location_type', value)
}

const fillEventType = (value) => {
  fillTypeaheadWith('#field-event_type', value)
}

export const fillHasRelatedTradeAgreementsRadio = (isYes = false) => {
  fillRadioWith('[name="has_related_trade_agreements"]', isYes)
}

export const fillEventSharedRadio = (isYes = false) => {
  fillRadioWith('[name = "event_shared"]', isYes)
}

export const fillStartDateWith = (day, month, year) => {
  fillDateWith('start_date', day, month, year)
}

export const fillEndDateWith = (day, month, year) => {
  fillDateWith('end_date', day, month, year)
}

// Generic Fillers

export const fillAddAnotherWithValues = (
  addButtonSelector,
  AddAnotherDataTestPrefix,
  dataArray
) => {
  if (dataArray) {
    const max = dataArray.length - 1
    dataArray.forEach((item, index) => {
      if (index < max) clickAddAnotherButton(addButtonSelector)
      fillTypeaheadWith(`[data-test=${AddAnotherDataTestPrefix}${index}]`, item)
    })
  }
}

export const fillWith = (selector, value) => {
  cy.get(selector).type(value)
}

export const fillRadioWith = (selector, isYes) => {
  if (isYes === true) {
    cy.get(selector).eq(0).click()
  } else if (isYes === false) {
    cy.get(selector).eq(1).click()
  }
}

export const fillTypeaheadWith = (selector, value) => {
  cy.get(selector).selectTypeaheadOption(value)
}

export const fillDateWith = (dateId, day, month, year) => {
  cy.get(`#${dateId}\\.day`).type(day)
  cy.get(`#${dateId}\\.month`).type(month)
  cy.get(`#${dateId}\\.year`).type(year)
}

//  Click events

export const clickAddAnotherButton = (selector) => {
  cy.get(selector).find('button').click()
}

export const clickAddEventButton = () => {
  cy.contains('button', 'Add event').click()
}
