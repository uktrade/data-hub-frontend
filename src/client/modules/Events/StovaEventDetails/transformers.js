/* Missing

event type:
    We have a default Data Hub one but this seems to be given previously?

registrationStatusCounts
    What is this?

*/
import { compact } from 'lodash'

import { formatStartAndEndDate } from '../../../components/ActivityFeed/activities/date'
import { deepKeysToCamelCase } from '../../../utils'
import { getDifferenceInDays } from '../../../utils/date'
import { transformDateStringToDateObject } from '../../../transformers'

export const transformResponeToStovaEventDetails = (stovaEvent) => {
  const camelCaseResponse = deepKeysToCamelCase(stovaEvent)
  return {
    ...camelCaseResponse,
    eventDate: formatStartAndEndDate(
      camelCaseResponse.startDate,
      camelCaseResponse.endDate
    ),
    upcomingEvent:
      getDifferenceInDays(
        transformDateStringToDateObject(camelCaseResponse.endDate)
      ) > 0,
    location: camelCaseResponse.locationName,
    fullAddress: compact([
      camelCaseResponse.locationAddress1,
      camelCaseResponse.locationAddress2,
      camelCaseResponse.locationCity,
      camelCaseResponse.locationPostcode,
      camelCaseResponse.locationCountry,
    ]),
  }
}
