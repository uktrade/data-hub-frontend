import { transformDateObjectToDateString } from '../../../transformers'
import { OPTION_NO, OPTION_YES } from '../../../../apps/constants'

const checkIfItemHasValue = (item) => (item ? item : null)

export const transformArrayForTypeahead = (advisers) =>
  advisers.map((value) => ({
    label: value.name,
    value: value.id,
  }))

export const transformBoolToRadioOption = (boolean) =>
  boolean ? OPTION_YES : OPTION_NO

export const transformRadioOptionToBool = (radioOption) =>
  radioOption === OPTION_YES

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

const setReferralSourceAdviser = (currentAdviser, values) => {
  const { is_referral_source, referral_source_adviser } = values
  return is_referral_source === 'yes'
    ? currentAdviser
    : checkIfItemHasValue(referral_source_adviser?.value)
}

const setConditionalArrayValue = (radioValue, array) =>
  transformRadioOptionToBool(radioValue) ? array.map((x) => x.value) : []

const setSiteDecidedSubValues = (
  site_decided,
  address1,
  address2,
  city,
  postcode
) => {
  return transformRadioOptionToBool(site_decided)
    ? {
        address_1: address1,
        address_2: address2,
        address_town: city,
        address_postcode: postcode,
      }
    : {
        address_1: '',
        address_2: '',
        address_town: '',
        address_postcode: '',
      }
}

export const checkLandDate = (estimatedLandDate) => {
  if (estimatedLandDate.day === '') {
    estimatedLandDate.day = '01'
  }
  return transformDateObjectToDateString(estimatedLandDate)
}

export const transformProjectSummaryForApi = ({
  projectId,
  currentAdviser,
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
    specific_programme,
    business_activities,
    other_business_activity,
    client_contacts,
    referral_source_activity,
    referral_source_activity_marketing,
    referral_source_activity_website,
  } = values

  return {
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
    investor_type: checkIfItemHasValue(investor_type),
    level_of_involvement: checkIfItemHasValue(level_of_involvement?.value),
    specific_programme: checkIfItemHasValue(specific_programme?.value),
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
    referral_source_adviser: setReferralSourceAdviser(currentAdviser, values),
  }
}

export const transformProjectRequirementsForApi = ({ projectId, values }) => {
  const {
    actual_uk_regions,
    address1,
    address2,
    city,
    client_considering_other_countries,
    client_requirements,
    competitor_countries,
    delivery_partners,
    postcode,
    site_decided,
    strategic_drivers,
    uk_region_locations,
  } = values

  const siteDecidedObject = setSiteDecidedSubValues(
    site_decided,
    address1,
    address2,
    city,
    postcode
  )

  const requirementsValues = {
    id: projectId,
    actual_uk_regions: setConditionalArrayValue(
      site_decided,
      actual_uk_regions
    ),
    client_considering_other_countries: transformRadioOptionToBool(
      client_considering_other_countries
    ),
    client_requirements,
    competitor_countries: setConditionalArrayValue(
      client_considering_other_countries,
      competitor_countries
    ),
    delivery_partners: delivery_partners.map((x) => x.value),
    site_decided: transformRadioOptionToBool(site_decided),
    strategic_drivers: strategic_drivers.map((x) => x.value),
    uk_region_locations: uk_region_locations.map((x) => x.value),
  }

  return { ...siteDecidedObject, ...requirementsValues }
}
