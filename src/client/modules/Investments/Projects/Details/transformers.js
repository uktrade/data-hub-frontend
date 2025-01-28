import {
  transformBoolToRadioOption,
  transformRadioOptionToBool,
  transformRadioOptionToBoolWithNullCheck,
  checkIfItemHasValue,
} from '../transformers'
import { transformDateObjectToDateString } from '../../../../transformers'
import { OPTION_NO, OPTION_YES } from '../../../../../common/constants'
import { transformArray } from '../../../Companies/CompanyInvestments/LargeCapitalProfile/transformers'
import { FDI_TYPES, INVESTOR_TYPES } from '../constants'

const checkIfItemHasValueOrZero = (value) =>
  value === 0 ? 0 : checkIfItemHasValue(value)

const setConditionalArrayValue = (radioValue, array) =>
  transformRadioOptionToBool(radioValue) ? array.map((x) => x.value) : []

const setSiteAddressValues = (
  siteAddressIsCompanyAddress,
  ukCompany,
  address1,
  address2,
  city,
  postcode
) => {
  if (transformRadioOptionToBool(siteAddressIsCompanyAddress) === true) {
    if (ukCompany) {
      return {
        address_1: ukCompany.address1,
        address_2: ukCompany.address2,
        address_town: ukCompany.addressTown,
        address_postcode: ukCompany.addressPostcode,
      }
    } else {
      return {
        address_1: null,
        address_2: null,
        address_town: null,
        address_postcode: null,
      }
    }
  }
  if (transformRadioOptionToBool(siteAddressIsCompanyAddress) === false) {
    return {
      address_1: address1,
      address_2: address2,
      address_town: city,
      address_postcode: postcode,
    }
  }
  if (transformRadioOptionToBool(siteAddressIsCompanyAddress) === null) {
    return {
      address_1: null,
      address_2: null,
      address_town: null,
      address_postcode: null,
    }
  }
}

const checkLandDate = (estimatedLandDate) => {
  if (estimatedLandDate.day === '') {
    estimatedLandDate.day = '01'
  }
  return transformDateObjectToDateString(estimatedLandDate)
}

const setReferralSourceEvent = (values) => {
  const {
    referral_source_activity,
    referral_source_activity_marketing,
    referral_source_activity_website,
    referral_source_activity_event,
  } = values
  return checkIfItemHasValue(referral_source_activity_marketing) ||
    checkIfItemHasValue(referral_source_activity_website) ||
    checkIfItemHasValue(referral_source_activity)
    ? referral_source_activity_event
    : ''
}

const transformRadioOptionToInvertedBool = (radioOption) =>
  radioOption === null ? null : radioOption === OPTION_NO

const setConditionalStringValue = (inputValue, investmentValue) =>
  transformRadioOptionToBool(inputValue) ? investmentValue : null

const transformBoolToInvertedRadioOption = (boolean) =>
  boolean ? OPTION_NO : OPTION_YES

export const transformBoolToRadioOptionWithNullCheck = (boolean) =>
  boolean === null ? null : transformBoolToRadioOption(boolean)

export const transformBoolToInvertedRadioOptionWithNullCheck = (boolean) =>
  boolean === null ? null : transformBoolToInvertedRadioOption(boolean)

export const transformProjectRequirementsForApi = ({
  projectId,
  values,
  ukCompany,
}) => {
  const {
    address1,
    address2,
    city,
    client_considering_other_countries,
    client_requirements,
    competitor_countries,
    delivery_partners,
    postcode,
    site_address_is_company_address,
    strategic_drivers,
    uk_region_locations,
  } = values

  const siteAddressObject = setSiteAddressValues(
    site_address_is_company_address,
    ukCompany,
    address1,
    address2,
    city,
    postcode
  )

  const requirementsValues = {
    id: projectId,
    client_considering_other_countries: transformRadioOptionToBoolWithNullCheck(
      client_considering_other_countries
    ),
    client_requirements,
    competitor_countries: setConditionalArrayValue(
      client_considering_other_countries,
      competitor_countries
    ),
    delivery_partners: delivery_partners
      ? delivery_partners.map((x) => x.value)
      : [],
    site_address_is_company_address: transformRadioOptionToBoolWithNullCheck(
      site_address_is_company_address
    ),
    strategic_drivers: strategic_drivers
      ? strategic_drivers.map((x) => x.value)
      : [],
    uk_region_locations: uk_region_locations
      ? uk_region_locations.map((x) => x.value)
      : [],
  }

  return { ...siteAddressObject, ...requirementsValues }
}

export const transformProjectSummaryForApi = ({
  projectId,
  currentAdviserId,
  values,
}) => {
  const {
    name,
    description,
    anonymous_description,
    estimated_land_date,
    investment_type,
    fdi_type,
    actual_land_date,
    sector,
    likelihood_to_land,
    investor_type,
    level_of_involvement,
    specific_programmes,
    is_referral_source,
    business_activities,
    other_business_activity,
    client_contacts,
    referral_source_activity,
    referral_source_activity_marketing,
    referral_source_activity_website,
  } = values

  const summaryPayload = {
    id: projectId,
    name,
    description,
    anonymous_description,
    estimated_land_date: checkLandDate(estimated_land_date),
    investment_type: checkIfItemHasValue(investment_type),
    fdi_type: checkIfItemHasValue(fdi_type?.value),
    actual_land_date: transformDateObjectToDateString(actual_land_date),
    sector: checkIfItemHasValue(sector?.value),
    likelihood_to_land: checkIfItemHasValue(likelihood_to_land?.value),
    investor_type:
      fdi_type?.value === FDI_TYPES.expansionOfExistingSiteOrActivity.value
        ? INVESTOR_TYPES.existing.value
        : checkIfItemHasValue(investor_type),
    level_of_involvement: checkIfItemHasValue(level_of_involvement?.value),
    other_business_activity,
    business_activities: business_activities.map((x) => x.value),
    client_contacts: client_contacts.map((x) => x.value),
    referral_source_activity: checkIfItemHasValue(referral_source_activity),
    referral_source_activity_marketing: checkIfItemHasValue(
      referral_source_activity_marketing
    ),
    referral_source_activity_website: checkIfItemHasValue(
      referral_source_activity_website
    ),
    referral_source_activity_event: setReferralSourceEvent(values),
    referral_source_adviser:
      is_referral_source === OPTION_YES
        ? currentAdviserId
        : values.referral_source_adviser.value,
  }

  if (Array.isArray(specific_programmes)) {
    summaryPayload.specific_programmes = specific_programmes.map((x) => x.value)
  } else if (typeof specific_programmes === 'object' && specific_programmes) {
    summaryPayload.specific_programmes = [specific_programmes?.value]
  } else {
    summaryPayload.specific_programmes = []
  }

  if (fdi_type?.value == FDI_TYPES.capitalOnly.value) {
    summaryPayload.number_new_jobs = 0
    summaryPayload.average_salary = null
    summaryPayload.number_safeguarded_jobs = 0
  }

  return summaryPayload
}

export const setGVAMessage = ({
  foreignEquityInvestment,
  sector,
  numberNewJobs,
  gvaMultiplier,
}) => {
  const { stringValue, valueExists } =
    gvaMultiplier?.sectorClassificationGvaMultiplier === 'capital'
      ? {
          stringValue: 'capital expenditure value',
          valueExists: !!foreignEquityInvestment,
        }
      : { stringValue: 'number of new jobs', valueExists: !!numberNewJobs }

  if (!valueExists && !sector) {
    return `Add ${stringValue} and primary sector (investment project summary) to calculate GVA`
  } else if (!valueExists) {
    return `Add ${stringValue} and click "Save" to calculate GVA`
  } else {
    return 'Add primary sector (investment project summary) to calculate GVA'
  }
}

export const transformProjectValueForApi = ({
  projectId,
  values,
  fdiTypeId,
}) => {
  const {
    average_salary,
    client_cannot_provide_foreign_investment,
    client_cannot_provide_total_investment,
    export_revenue,
    fdi_value,
    foreign_equity_investment,
    government_assistance,
    gross_value_added,
    new_tech_to_uk,
    non_fdi_r_and_d_budget,
    number_new_jobs,
    number_safeguarded_jobs,
    r_and_d_budget,
    total_investment,
  } = values

  const valuePayload = {
    id: projectId,
    average_salary: checkIfItemHasValue(average_salary),
    client_cannot_provide_foreign_investment:
      transformRadioOptionToInvertedBool(
        client_cannot_provide_foreign_investment
      ),
    client_cannot_provide_total_investment: transformRadioOptionToInvertedBool(
      client_cannot_provide_total_investment
    ),
    export_revenue: transformRadioOptionToBoolWithNullCheck(export_revenue),
    fdi_value: checkIfItemHasValue(fdi_value),
    foreign_equity_investment: setConditionalStringValue(
      client_cannot_provide_foreign_investment,
      foreign_equity_investment
    ),
    government_assistance: transformRadioOptionToBoolWithNullCheck(
      government_assistance
    ),
    gross_value_added: setConditionalStringValue(
      client_cannot_provide_foreign_investment,
      gross_value_added
    ),
    new_tech_to_uk: transformRadioOptionToBoolWithNullCheck(new_tech_to_uk),
    non_fdi_r_and_d_budget: transformRadioOptionToBoolWithNullCheck(
      non_fdi_r_and_d_budget
    ),
    number_new_jobs: checkIfItemHasValueOrZero(number_new_jobs),
    number_safeguarded_jobs: checkIfItemHasValueOrZero(number_safeguarded_jobs),
    r_and_d_budget: transformRadioOptionToBoolWithNullCheck(r_and_d_budget),
    total_investment: setConditionalStringValue(
      client_cannot_provide_total_investment,
      total_investment
    ),
  }

  if (fdiTypeId == FDI_TYPES.capitalOnly.value) {
    valuePayload.number_new_jobs = 0
    valuePayload.average_salary = null
    valuePayload.number_safeguarded_jobs = 0
  }

  return valuePayload
}

export const transformBusinessActivity = (
  businessActivity,
  otherBusinessActivity
) =>
  otherBusinessActivity
    ? transformArray(businessActivity) + ', ' + otherBusinessActivity
    : transformArray(businessActivity)
