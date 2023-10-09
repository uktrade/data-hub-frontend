import { assertTextVisible } from './assertions'
import { assertMultiOptionTypeaheadValues } from './event-assertions'

import {
  fill,
  fillTypeahead,
  fillMultiOptionTypeahead,
  fillYesNoRadio,
  fillDate,
  fillTypeaheadWithLegend,
  fillMultiOptionTypeaheadWithLegend,
} from './form-fillers'

/**
 * @deprecated
 * THE LOGIC IN THIS FILE HAS BEEN MOVED TO THE /test/support FOLDER AS THE LOGIC IS SHARED BETWEEN
 *  THE COMPONENT AND FUNCTIONAL TESTS. THIS FILE IS ONLY HERE TO AVOID BREAKING ANY TESTS, NO
 * ADDITIONAL LOGIC SHOULD BE ADDED
 */

const selectors = require('../../../selectors/event/createOrEdit')

const UK = 'United Kingdom'
const ALL = 'All'

/**
 * @deprecated
 */
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
  // fill optional field first, as form gets submitted once
  // all required fields are filled in
  fillProgrammes(relatedProgrammes)

  fillHasRelatedTradeAgreementsRadio(hasRelatedTradeAgreements)
  if (hasRelatedTradeAgreements && relatedTradeAgreements) {
    fillRelatedTradeAgreements(relatedTradeAgreements)
  }
  fillEventName(eventName)
  fillEventTypeWithLegend(eventType)
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
}

/**
 * @deprecated
 */
export const fillEventNotes = (notes) => {
  fill(selectors.notesId, notes)
}

/**
 * @deprecated
 */
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
  fillCountryWithLegend(country)
  if (country && country === UK) {
    fillRegion(region)
  }
}

/**
 * @deprecated
 */
export const fillOrganiser = (organiser) => {
  fillTypeaheadWithLegend(selectors.organiserFieldId, organiser)
}

/**
 * @deprecated
 */
export const fillService = (service) => {
  fillTypeaheadWithLegend(selectors.serviceFieldId, service)
}

/**
 * @deprecated
 */
export const fillRegion = (region) => {
  fillTypeaheadWithLegend(selectors.ukRegionFieldId, region)
}

/**
 * @deprecated
 */
export const fillLeadTeam = (leadTeam) => {
  fillTypeaheadWithLegend(selectors.leadTeamFieldId, leadTeam)
}

/**
 * @deprecated
 */
export const fillCountry = (country) => {
  fillTypeaheadWithLegend(selectors.addressCountryFieldId, country)
}

/**
 * @deprecated
 */
export const fillCountryWithLegend = (country) => {
  fillTypeaheadWithLegend(selectors.addressCountryFieldId, country)
}

/**
 * @deprecated
 */
export const fillEventName = (name) => {
  fill(selectors.eventNameId, name)
}

/**
 * @deprecated
 */
export const fillAndAssertProgrammes = (programmes = []) => {
  fillProgrammes(programmes)

  assertMultiOptionTypeaheadValues(
    selectors.relatedProgrammesFieldId,
    'Related programmes (optional)',
    programmes
  )
}

/**
 * @deprecated
 */
export const fillProgrammes = (programmes = []) => {
  fillMultiOptionTypeaheadWithLegend(
    selectors.relatedProgrammesFieldId,
    programmes
  )
}

/**
 * @deprecated
 */
export const fillAndAssertSharedTeams = (teams = []) => {
  fillEventSharedRadio(true)
  fillTeams(teams)
  assertMultiOptionTypeaheadValues(selectors.teamsFieldId, 'Teams', teams)
}

/**
 * @deprecated
 */
export const fillAndAssertRelatedTradeAgreements = (tradeAgreements = []) => {
  assertTextVisible('Does the event relate to a trade agreement?')
  fillHasRelatedTradeAgreementsRadio(true)
  cy.get(selectors.relatedTradeAgreementsFieldId)
    .find('input')
    .should('have.attr', 'placeholder', 'Search trade agreements')

  fillRelatedTradeAgreements(tradeAgreements)
  assertMultiOptionTypeaheadValues(
    selectors.relatedTradeAgreementsFieldId,
    'Related Trade Agreements',
    tradeAgreements
  )
}

/**
 * @deprecated
 */
export const fillTeams = (teams = []) => {
  fillMultiOptionTypeahead(selectors.teamsFieldId, teams)
}

/**
 * @deprecated
 */
export const fillRelatedTradeAgreements = (tradeAgreements = []) => {
  fillMultiOptionTypeahead(
    selectors.relatedTradeAgreementsFieldId,
    tradeAgreements
  )
}

/**
 * @deprecated
 */
export const fillLocationType = (value) => {
  fillTypeaheadWithLegend(selectors.locationTypeFieldId, value)
}

/**
 * @deprecated
 */
export const fillEventType = (value) => {
  fillTypeahead(selectors.eventTypeFieldId, value)
}

/**
 * @deprecated
 */
export const fillEventTypeWithLegend = (value) => {
  fillTypeaheadWithLegend(selectors.eventTypeFieldId, value)
}

/**
 * @deprecated
 */
export const fillHasRelatedTradeAgreementsRadio = (isYes = false) => {
  fillYesNoRadio(selectors.relatedTradeAgreements, isYes)
}

/**
 * @deprecated
 */
export const fillEventSharedRadio = (isYes = false) => {
  fillYesNoRadio(selectors.eventShared, isYes)
}

/**
 * @deprecated
 */
export const fillStartDateWith = (day, month, year) => {
  fillDate(selectors.startDateId, day, month, year)
}

/**
 * @deprecated
 */
export const fillEndDateWith = (day, month, year) => {
  fillDate(selectors.endDateId, day, month, year)
}

// Click Events

/**
 * @deprecated
 */
export const clickAddEventButton = () => {
  cy.contains('button', 'Add event').click()
}
