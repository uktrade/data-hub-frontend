const { default: axios } = require('axios')
const urls = require('../../../../lib/urls')

export const getEventAventriAttendees = (aventriEventId) => {
  return axios
    .get(urls.events.aventriAttendees.data(aventriEventId))
    .then(({ data }) => data)
    .catch(() => {
      return Promise.reject('Unable to load Aventri Attendees')
    })
}
