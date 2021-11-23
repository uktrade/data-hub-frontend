const selectors = require('../../../selectors/event/createOrEdit')

import {
  assertTypeaheadValuesWith,
  assertTextVisible,
} from './event-assertions'

const PROGRAMME_FIELD_PREFIX = 'programme-field-'
const TEAM_FIELD_PREFIX = 'team-field-'
const TRADE_AGREEMENT_FIELD_PREFIX = 'trade-agreement-field-'
const UK = 'United Kingdom'
const ALL = 'All'

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
  fillWith(selectors.notesId, notes)
}

const fillAddress = ({
  address1,
  address2,
  town,
  county,
  postcode,
  country = UK,
  region = ALL,
} = {}) => {
  fillWith(selectors.addressLine1Id, address1)
  fillWith(selectors.addressLine2Id, address2)
  fillWith(selectors.addressTownId, town)
  fillWith(selectors.addressCountryId, county)
  fillWith(selectors.addressPostcodeId, postcode)
  fillCountry(country)
  if (country && country === UK) {
    fillRegion(region)
  }
}

const fillOrganiser = (organiser) => {
  fillTypeaheadWith(selectors.organiserFieldId, organiser)
}

const fillService = (service) => {
  fillTypeaheadWith(selectors.serviceFieldId, service)
}

const fillRegion = (region) => {
  fillTypeaheadWith(selectors.ukRegionFieldId, region)
}

const fillLeadTeam = (leadTeam) => {
  fillTypeaheadWith(selectors.leadTeamFieldId, leadTeam)
}

export const fillCountry = (country) => {
  fillTypeaheadWith(selectors.addressCountryFieldId, country)
}

const fillEventName = (name) => {
  fillWith(selectors.eventNameId, name)
}

export const fillAndAssertProgrammes = (programmes = []) => {
  fillProgrammes(programmes)

  assertTypeaheadValuesWith(PROGRAMME_FIELD_PREFIX, programmes)
}

const fillProgrammes = (programmes = []) => {
  fillAddAnotherWithValues(
    selectors.relatedProgrammesFieldId,
    PROGRAMME_FIELD_PREFIX,
    programmes
  )
}

export const fillAndAssertSharedTeams = (teams = []) => {
  fillEventSharedRadio(true)
  fillTeams(teams)
  assertTypeaheadValuesWith(TEAM_FIELD_PREFIX, teams)
}

export const fillAndAssertRelatedTradeAgreements = (tradeAgreements = []) => {
  assertTextVisible('Does the event relate to a trade agreement?')
  fillHasRelatedTradeAgreementsRadio(true)
  assertTextVisible('Related named trade agreement(s)')
  assertTextVisible('Search trade agreements')

  fillRelatedTradeAgreements(tradeAgreements)

  assertTypeaheadValuesWith(TRADE_AGREEMENT_FIELD_PREFIX, tradeAgreements)
}

const fillTeams = (teams = []) => {
  fillAddAnotherWithValues(selectors.teamsFieldId, TEAM_FIELD_PREFIX, teams)
}

const fillRelatedTradeAgreements = (tradeAgreements = []) => {
  fillAddAnotherWithValues(
    selectors.relatedTradeAgreementsFieldId,
    TRADE_AGREEMENT_FIELD_PREFIX,
    tradeAgreements
  )
}

const fillLocationType = (value) => {
  fillTypeaheadWith(selectors.locationTypeFieldId, value)
}

const fillEventType = (value) => {
  fillTypeaheadWith(selectors.eventTypeFieldId, value)
}

export const fillHasRelatedTradeAgreementsRadio = (isYes = false) => {
  fillRadioWith(selectors.relatedTradeAgreements, isYes)
}

export const fillEventSharedRadio = (isYes = false) => {
  fillRadioWith(selectors.eventShared, isYes)
}

export const fillStartDateWith = (day, month, year) => {
  fillDateWith(selectors.startDateId, day, month, year)
}

export const fillEndDateWith = (day, month, year) => {
  fillDateWith(selectors.endDateId, day, month, year)
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
  cy.get(`${dateId}\\.day`).type(day)
  cy.get(`${dateId}\\.month`).type(month)
  cy.get(`${dateId}\\.year`).type(year)
}

//  Click events

export const clickAddAnotherButton = (selector) => {
  cy.get(selector).find('button').click()
}

export const clickAddEventButton = () => {
  cy.contains('button', 'Add event').click()
}

export const clickSaveAndReturnButton = () => {
  cy.contains('button', 'Save and return').click()
}

export const clickReturnWithoutSavingButton = () => {
  cy.contains('Return without saving').click()
}
