import { transformDateObjectToDateString } from '../../../transformers'

const checkIfItemHasValue = (item) => (item ? item : null)

export const transformArrayForTypeahead = (advisers) =>
  advisers.map((value) => ({
    label: value.name,
    value: value.id,
  }))

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
    ? ''
    : referral_source_activity_event
}

const setReferralSourceAdviser = (currentAdviser, values) => {
  const { is_referral_source, referral_source_adviser } = values
  return is_referral_source === 'yes'
    ? currentAdviser
    : checkIfItemHasValue(referral_source_adviser?.value)
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
    estimated_land_date: transformDateObjectToDateString(estimated_land_date),
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
