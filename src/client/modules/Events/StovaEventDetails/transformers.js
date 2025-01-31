/* Missing

event type:
    We have a default Data Hub one but this seems to be given previously?

registrationStatusCounts
    What is this?

*/
import { compact } from 'lodash'

import { formatStartAndEndDate } from '../../../components/ActivityFeed/activities/date'
import { getDifferenceInDays } from '../../../utils/date'
import { transformDateStringToDateObject } from '../../../transformers'

export const transformResponeToStovaEventDetails = ({
  stova_event_id,
  // url,
  // city,
  // code,
  name,
  // state,
  // country,
  // timezone,
  // description,
  // max_reg,
  start_date,
  end_date,
  // folder_id,
  // live_date,
  // close_date,
  // created_by,
  // price_type,
  // modified_by,
  // contact_info,
  // created_date,
  location_city,
  location_name,
  // modified_date,
  // client_contact,
  // location_state,
  // default_language,
  location_country,
  // approval_required,
  location_address1,
  location_address2,
  // location_address3,
  location_postcode,
  // standard_currency,
}) => ({
  name,
  stovaEventId: stova_event_id,
  eventDate: formatStartAndEndDate(start_date, end_date),
  upcomingEvent:
    getDifferenceInDays(transformDateStringToDateObject(end_date)) > 0,
  location: location_name,
  fullAddress: compact([
    location_address1,
    location_address2,
    location_city,
    location_postcode,
    location_country,
  ]),
})
