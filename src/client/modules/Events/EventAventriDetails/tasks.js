import axios from 'axios'
import urls from '../../../../lib/urls'
import { transformResponseToEventAventriDetails } from '../transformers'

export const getEventAventriDetails = (aventriEventId) => {
  return axios
    .get(urls.events.aventri.data(aventriEventId))
    .then(({ data }) => {
      return transformResponseToEventAventriDetails(data)
    })
    .catch(() => Promise.reject('Unable to load aventri event details.'))
}
