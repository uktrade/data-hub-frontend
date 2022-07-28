const { default: axios } = require('axios')
const urls = require('../../../../lib/urls')

export const getEventAventriAttendees = ({
  aventriEventId,
  selectedSortBy,
  page,
}) => {
  return axios
    .get(urls.events.aventri.attendeesData(aventriEventId), {
      params: { sortBy: selectedSortBy, page },
    })
    .then(({ data }) => data)
    .catch(() => {
      return Promise.reject('Unable to load Aventri Attendees.')
    })
}
