import urls from '../../../../../src/lib/urls'

import { companyFaker } from '../../fakers/companies'

export const company = companyFaker({
  name: 'Advanced Mini Devices',
})

export const successPageRegex = /\/exportwins\/[^/]+\/success/

// All form step URLs (creating an export win from scratch)
const create = urls.companies.exportWins.create(company.id)
export const officerDetailsStep = `${create}?step=officer_details`
export const creditForThisWinStep = `${create}?step=credit_for_this_win`
export const customerDetailsStep = `${create}?step=customer_details`
export const winDetailsStep = `${create}?step=win_details`
export const supportProvidedStep = `${create}?step=support_provided`
export const summaryStep = `${create}?step=summary`

export const formFields = {
  officerDetails: {
    heading: '[data-test="step-heading"]',
    leadOfficer: '[data-test="field-lead_officer"]',
    teamType: '[data-test="field-team_type"]',
    hqTeam: '[data-test="field-hq_team"]',
    teamMembers: '[data-test="field-team_members"]',
    teamMembersHintText: '[data-test="hint-text"]',
  },
  creditForThisWin: {
    heading: '[data-test="step-heading"]',
    hint: '[data-test="hint"]',
    hintText: '[data-test="hint-text"]',
    radiosBtns: '[data-test="field-credit_for_win"]',
    radiosBtnYes: '[data-test="credit-for-win-yes"]',
    radiosBtnNo: '[data-test="credit-for-win-no"]',
    fieldAddAnother: '[data-test="field-addAnother"]',
    addAnother: '[data-test="add-another"]',
    contributingOfficer: '[data-test="field-contributing_officer_0"]',
    contributingOfficer1: '[data-test="field-contributing_officer_1"]',
    teamType: '[data-test="field-team_type_0"]',
    hqTeam: '[data-test="field-hq_team_0"]',
    teamType1: '[data-test="field-team_type_1"]',
    hqTeam1: '[data-test="field-hq_team_1"]',
  },
  customerDetails: {
    heading: '[data-test="step-heading"]',
    editStatusMessage: '[data-test="status-message"]',
    contacts: '[data-test="field-company_contacts"]',
    contactHint: '[data-test="contact-hint"]',
    location: '[data-test="field-customer_location"]',
    potential: '[data-test="field-business_potential"]',
    experience: '[data-test="field-export_experience"]',
  },
  winDetails: {
    heading: '[data-test="step-heading"]',
    editStatusMessage: '[data-test="status-message"]',
    hint: '[data-test="hint"]',
    country: '[data-test="field-country"]',
    date: '[data-test="field-date"]',
    dateMonth: '[data-test="date-month"]',
    dateYear: '[data-test="date-year"]',
    description: '[data-test="field-description"]',
    nameOfCustomer: '[data-test="field-name_of_customer"]',
    nameOfCustomerConfidential:
      '[data-test="field-name_of_customer_confidential"]',
    nameOfCustomerConfidentialYes:
      '[data-test="name-of-customer-confidential-yes"]',
    nameOfCustomerConfidentialNo:
      '[data-test="name-of-customer-confidential-no"]',
    businessType: '[data-test="field-business_type"]',
    winType: '[data-test="field-win_type"]',
    goodsVsServices: '[data-test="field-goods_vs_services"]',
    nameOfExport: '[data-test="field-name_of_export"]',
    sector: '[data-test="field-sector"]',
    exportWinCheckbox: '[data-test="checkbox-export_win"]',
    businessSuccessCheckbox: '[data-test="checkbox-business_success_win"]',
    odiCheckbox: '[data-test="checkbox-odi_win"]',
    breakdownsExport: '[data-test="breakdowns-export_win"]',
    breakdownsBusSucc: '[data-test="breakdowns-business_success_win"]',
    breakdownsODI: '[data-test="breakdowns-odi_win"]',
    totalValue: '[data-test="total-value"]',
  },
  supportProvided: {
    heading: '[data-test="step-heading"]',
    hint: '[data-test="hint"]',
    hvc: '[data-test="field-hvc"]',
    typeOfSupport: '[data-test="field-type_of_support"]',
    associatedProgramme: '[data-test="field-associated_programme"]',
    personallyConfirmed: '[data-test="field-is_personally_confirmed"]',
    lineManagerConfirmed: '[data-test="field-is_line_manager_confirmed"]',
  },
  successPage: {
    flash: '[data-test="flash"]',
    heading: '[data-test="heading"]',
    review: '[data-test="review"]',
    email: '[data-test="email"]',
    exportWinsLink: '[data-test="export-wins-link"]',
  },
}
