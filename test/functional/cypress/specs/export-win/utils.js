import { addMonths, subMonths } from 'date-fns'

import {
  getRandomDateInRange,
  getStartDateOfTwelveMonthsAgo,
} from '../../../../../src/client/utils/date'
import { clickContinueButton } from '../../support/actions'
import { assertUrl } from '../../support/assertions'
import { formFields } from './constants'

export const populateWinWithValues = ({ alias, winType, values }) =>
  values.forEach((value, index) =>
    cy.get(alias).find(`[data-test="${winType}-${index}-input"]`).type(value)
  )

export const fillOfficerDetails = ({ leadOfficer, teamType, hqTeam }) => {
  const { officerDetails } = formFields
  leadOfficer &&
    cy.get(officerDetails.leadOfficer).selectTypeaheadOption(leadOfficer)
  teamType && cy.get(officerDetails.teamType).selectTypeaheadOption(teamType)
  hqTeam && cy.get(officerDetails.hqTeam).selectTypeaheadOption(hqTeam)
}

export const fillCreditForThisWin = ({
  contributingOfficer,
  teamType,
  hqTeam,
}) => {
  const { creditForThisWin } = formFields
  cy.get(creditForThisWin.radiosBtnYes).check()
  contributingOfficer &&
    cy
      .get(creditForThisWin.contributingOfficer)
      .selectTypeaheadOption(contributingOfficer)
  teamType && cy.get(creditForThisWin.teamType).selectTypeaheadOption(teamType)
  hqTeam && cy.get(creditForThisWin.hqTeam).selectTypeaheadOption(hqTeam)
}

export const fillCustomerDetails = ({
  contact,
  location,
  potential,
  experience,
}) => {
  const { customerDetails } = formFields
  contact && cy.get(customerDetails.contacts).selectTypeaheadOption(contact)
  location && cy.get(customerDetails.location).selectTypeaheadOption(location)
  potential &&
    cy
      .get(customerDetails.potential)
      .within(() => cy.get(`[aria-label="${potential}"]`).check())
  experience &&
    cy.get(customerDetails.experience).selectTypeaheadOption(experience)
}

export const fillWinDetails = ({
  country,
  dateMonth,
  dateYear,
  description,
  nameOfCustomerConfidential,
  nameOfCustomer,
  businessType,
  exportValues,
  businessSuccessValues,
  odiValues,
  goodsVsServices,
  nameOfExport,
  sector,
}) => {
  const { winDetails } = formFields

  country && cy.get(winDetails.country).selectTypeaheadOption(country)

  dateMonth && cy.get(winDetails.dateMonth).type(dateMonth)
  dateYear && cy.get(winDetails.dateYear).type(dateYear)

  description &&
    cy.get(winDetails.description).find('textarea').type(description)

  nameOfCustomerConfidential
    ? cy.get(winDetails.nameOfCustomerConfidentialYes).click()
    : cy.get(winDetails.nameOfCustomerConfidentialNo).click()

  !nameOfCustomerConfidential &&
    nameOfCustomer &&
    cy.get(winDetails.nameOfCustomer).find('input').type(nameOfCustomer)

  businessType &&
    cy.get(winDetails.businessType).find('input').type(businessType)

  cy.get(winDetails.winType).as('winType')

  exportValues && cy.get('@winType').find(winDetails.exportWinCheckbox).check()

  businessSuccessValues &&
    cy.get('@winType').find(winDetails.businessSuccessCheckbox).check()

  odiValues && cy.get('@winType').find(winDetails.odiCheckbox).check()

  exportValues &&
    populateWinWithValues({
      alias: '@winType',
      winType: 'export-win',
      values: exportValues,
    })

  businessSuccessValues &&
    populateWinWithValues({
      alias: '@winType',
      winType: 'business-success-win',
      values: businessSuccessValues,
    })

  odiValues &&
    populateWinWithValues({
      alias: '@winType',
      winType: 'odi-win',
      values: odiValues,
    })

  goodsVsServices === 'goods' &&
    cy.get(winDetails.goodsVsServices).find('input').eq(0).check()

  goodsVsServices === 'services' &&
    cy.get(winDetails.goodsVsServices).find('input').eq(1).check()

  nameOfExport &&
    cy.get(winDetails.nameOfExport).find('input').type(nameOfExport)

  sector && cy.get(winDetails.sector).selectTypeaheadOption(sector)
}

export const fillSupportProvided = ({
  hvc,
  typeOfSupport,
  associatedProgramme,
  personallyConfirmed,
  lineManagerConfirmed,
}) => {
  const { supportProvided } = formFields

  hvc && cy.get(supportProvided.hvc).selectTypeaheadOption(hvc)
  typeOfSupport &&
    cy.get(supportProvided.typeOfSupport).selectTypeaheadOption(typeOfSupport)
  associatedProgramme &&
    cy
      .get(supportProvided.associatedProgramme)
      .selectTypeaheadOption(associatedProgramme)
  personallyConfirmed &&
    cy
      .get(supportProvided.personallyConfirmed)
      .find('[data-test="checkbox-yes"]')
      .check()
  lineManagerConfirmed &&
    cy
      .get(supportProvided.lineManagerConfirmed)
      .find('[data-test="checkbox-yes"]')
      .check()
}

export const clickContinueAndAssertUrl = (url) => {
  clickContinueButton()
  assertUrl(url)
}

const getMonthAndYearFromDate = (date) => ({
  month: date.getMonth() + 1, // indexing starts at 0
  year: date.getFullYear(),
})

export const getDateWithinLastTwelveMonths = () =>
  getMonthAndYearFromDate(
    getRandomDateInRange(getStartDateOfTwelveMonthsAgo(), new Date())
  )

export const getDateThirteenMonthsAgo = () =>
  getMonthAndYearFromDate(subMonths(new Date(), 13))

export const getDateNextMonth = () =>
  getMonthAndYearFromDate(addMonths(new Date(), 1))

export const getStringWithLength = (length) =>
  Array.from({ length }, () => 'a').join('')
