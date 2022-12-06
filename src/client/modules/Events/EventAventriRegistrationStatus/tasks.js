import { transformResponseToEventAventriDetails } from '../transformers'

const { default: axios } = require('axios')
const urls = require('../../../../lib/urls')

export const getEventAventriRegistrationStatusAttendees = ({
  aventriEventId,
  aventriRegistrationStatuses,
  selectedSortBy,
  page,
  size,
}) => {
  return Promise.all([
    axios.get(urls.events.aventri.detailsData(aventriEventId)),
    axios.get(urls.events.aventri.registrationStatusData(aventriEventId), {
      params: {
        sortBy: selectedSortBy,
        page,
        size,
        registrationStatuses: aventriRegistrationStatuses,
      },
    }),
  ])
    .then(([{ data: aventriEventData }, { data: attendeesData }]) => ({
      ...transformResponseToEventAventriDetails(aventriEventData),
      ...attendeesData,
    }))
    .catch(() => Promise.reject('Unable to load Aventri Registration Status.'))
}
