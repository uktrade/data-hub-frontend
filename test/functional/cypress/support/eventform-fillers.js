import { assertTextVisible } from './assertions'
import { assertTypeaheadValuesWith } from './event-assertions'

import {
  fill,
  fillTypeahead,
  fillAddAnother,
  fillYesNoRadio,
  fillDate,
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
  fill(selectors.notesId, notes)
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
  fill(selectors.addressLine1Id, address1)
  fill(selectors.addressLine2Id, address2)
  fill(selectors.addressTownId, town)
  fill(selectors.addressCountryId, county)
  fill(selectors.addressPostcodeId, postcode)
  fillCountry(country)
  if (country && country === UK) {
    fillRegion(region)
  }
}

export const fillOrganiser = (organiser) => {
  fillTypeahead(selectors.organiserFieldId, organiser)
}

export const fillService = (service) => {
  fillTypeahead(selectors.serviceFieldId, service)
}

export const fillRegion = (region) => {
  fillTypeahead(selectors.ukRegionFieldId, region)
}

export const fillLeadTeam = (leadTeam) => {
  fillTypeahead(selectors.leadTeamFieldId, leadTeam)
}

export const fillCountry = (country) => {
  fillTypeahead(selectors.addressCountryFieldId, country)
}

export const fillEventName = (name) => {
  fill(selectors.eventNameId, name)
}

export const fillAndAssertProgrammes = (programmes = []) => {
  fillProgrammes(programmes)

  assertTypeaheadValuesWith(PROGRAMME_FIELD_PREFIX, programmes)
}

export const fillProgrammes = (programmes = []) => {
  fillAddAnother(
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
  fillAddAnother(selectors.teamsFieldId, TEAM_FIELD_PREFIX, teams)
}

export const fillRelatedTradeAgreements = (tradeAgreements = []) => {
  fillAddAnother(
    selectors.relatedTradeAgreementsFieldId,
    TRADE_AGREEMENT_FIELD_PREFIX,
    tradeAgreements
  )
}

export const fillLocationType = (value) => {
  fillTypeahead(selectors.locationTypeFieldId, value)
}

export const fillEventType = (value) => {
  fillTypeahead(selectors.eventTypeFieldId, value)
}

export const fillHasRelatedTradeAgreementsRadio = (isYes = false) => {
  fillYesNoRadio(selectors.relatedTradeAgreements, isYes)
}

export const fillEventSharedRadio = (isYes = false) => {
  fillYesNoRadio(selectors.eventShared, isYes)
}

export const fillStartDateWith = (day, month, year) => {
  fillDate(selectors.startDateId, day, month, year)
}

export const fillEndDateWith = (day, month, year) => {
  fillDate(selectors.endDateId, day, month, year)
}

// Click Events

export const clickAddEventButton = () => {
  cy.contains('button', 'Add event').click()
}
