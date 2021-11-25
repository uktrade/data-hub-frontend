import { assertTextVisible } from './assertions'
import { assertTypeaheadValuesWith } from './event-assertions'

import {
  fillWith,
  fillTypeaheadWith,
  fillAddAnotherWithValues,
  fillRadioWith,
  fillDateWith,
} from './form-fillers'

const selectors = require('../../../selectors/event/createOrEdit')

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

export const fillEventNotes = (notes) => {
  fillWith(selectors.notesId, notes)
}

export const fillAddress = ({
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

export const fillOrganiser = (organiser) => {
  fillTypeaheadWith(selectors.organiserFieldId, organiser)
}

export const fillService = (service) => {
  fillTypeaheadWith(selectors.serviceFieldId, service)
}

export const fillRegion = (region) => {
  fillTypeaheadWith(selectors.ukRegionFieldId, region)
}

export const fillLeadTeam = (leadTeam) => {
  fillTypeaheadWith(selectors.leadTeamFieldId, leadTeam)
}

export const fillCountry = (country) => {
  fillTypeaheadWith(selectors.addressCountryFieldId, country)
}

export const fillEventName = (name) => {
  fillWith(selectors.eventNameId, name)
}

export const fillAndAssertProgrammes = (programmes = []) => {
  fillProgrammes(programmes)

  assertTypeaheadValuesWith(PROGRAMME_FIELD_PREFIX, programmes)
}

export const fillProgrammes = (programmes = []) => {
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

export const fillTeams = (teams = []) => {
  fillAddAnotherWithValues(selectors.teamsFieldId, TEAM_FIELD_PREFIX, teams)
}

export const fillRelatedTradeAgreements = (tradeAgreements = []) => {
  fillAddAnotherWithValues(
    selectors.relatedTradeAgreementsFieldId,
    TRADE_AGREEMENT_FIELD_PREFIX,
    tradeAgreements
  )
}

export const fillLocationType = (value) => {
  fillTypeaheadWith(selectors.locationTypeFieldId, value)
}

export const fillEventType = (value) => {
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

// Click Events

export const clickAddEventButton = () => {
  cy.contains('button', 'Add event').click()
}
