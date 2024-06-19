import { OPTION_NO } from '../../../../../common/constants'
import {
  FDI_TYPES,
  INVESTOR_TYPES,
} from '../../../../../client/modules/Investments/Projects/constants'

const formatEstimatedLandDate = ({ year, month }) =>
  year && month ? `${year}-${month}-01` : null

const formatActualLandDate = ({ year, month, day }) =>
  year && month && day ? `${year}-${month}-${day}` : null

export const transformFormValuesToPayload = (values, csrfToken) => {
  const {
    company,
    investment_type,
    fdi_type,
    name,
    description,
    anonymous_description,
    sector,
    business_activities,
    client_contacts,
    other_business_activity,
    client_relationship_manager,
    referral_source_adviser,
    referral_source_activity,
    referral_source_activity_event,
    referral_source_activity_marketing,
    referral_source_activity_website,
    estimated_land_date,
    actual_land_date,
    investor_type,
    level_of_involvement,
    specific_programmes,
    adviser,
  } = values

  const payload = {
    _csrf: csrfToken,
    investor_company: company.id,
    investment_type: investment_type,
    fdi_type: fdi_type?.value,
    name: name,
    description: description,
    anonymous_description: anonymous_description ? anonymous_description : '',
    sector: sector.value,
    business_activities: business_activities.map(({ value }) => value),
    client_contacts: client_contacts.map(({ value }) => value),
    ...(other_business_activity ? { other_business_activity } : {}),
    client_relationship_manager:
      values.clientRelationshipManager === OPTION_NO
        ? client_relationship_manager.value
        : adviser.id,
    referral_source_adviser:
      values.referralSourceAdviser === OPTION_NO
        ? referral_source_adviser.value
        : adviser.id,
    referral_source_activity: referral_source_activity,
    referral_source_activity_event: referral_source_activity_event,
    referral_source_activity_marketing: referral_source_activity_marketing,
    referral_source_activity_website: referral_source_activity_website,
    estimated_land_date: formatEstimatedLandDate(estimated_land_date),
    actual_land_date: formatActualLandDate(actual_land_date),
    investor_type:
      fdi_type?.value === FDI_TYPES.expansionOfExistingSiteOrActivity.value
        ? INVESTOR_TYPES.existing.value
        : investor_type,
    level_of_involvement: level_of_involvement?.value,
    specific_programmes: specific_programmes?.value,
  }

  if (fdi_type?.value === FDI_TYPES.capitalOnly.value) {
    payload.number_new_jobs = 0
    payload.average_salary = null
    payload.number_safeguarded_jobs = 0
  }

  return payload
}
