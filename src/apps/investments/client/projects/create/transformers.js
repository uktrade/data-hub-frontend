import { OPTION_YES, OPTION_NO } from '../../../../constants'

const getLandDate = ({ year, month, day = '01' }) => `${year}-${month}-${day}`

export const transformFormValuesToPayload = (values, csrfToken) => ({
  _csrf: csrfToken,
  investor_company: values.company.id,
  investment_type: values.investment_type,
  fdi_type: values.fdi_type,
  name: values.name,
  description: values.description,
  anonymous_description: values.anonymous_description,
  sector: values.sector.value,
  business_activities: values.business_activities.map(({ value }) => value),
  client_contacts: values.client_contacts.map(({ value }) => value),
  ...(values.otherBusinessActivity === OPTION_YES
    ? { other_business_activity: values.other_business_activity }
    : {}),
  client_relationship_manager:
    values.clientRelationshipManager === OPTION_NO
      ? values.client_relationship_manager
      : values.adviser.id,
  referral_source_adviser:
    values.referralSourceAdviser === OPTION_NO
      ? values.referral_source_adviser
      : values.adviser.id,
  referral_source_activity: values.referral_source_activity,
  referral_source_activity_event: values.referral_source_activity_event,
  referral_source_activity_marketing: values.referral_source_activity_marketing,
  referral_source_activity_website: values.referral_source_activity_website,
  estimated_land_date: getLandDate(values.estimated_land_date),
  actual_land_date: getLandDate(values.actual_land_date),
  investor_type: values.investor_type?.value,
  level_of_involvement: values.level_of_involvement?.value,
  specific_programme: values.specific_programme?.value,
})
