import axios from 'axios'
import urls from '../../../../lib/urls'
import { transformResponseToEventAventriDetails } from '../transformers'

export const getEventAventriDetails = (aventriEventId) =>
  axios
    .get(urls.events.aventri.detailsData(aventriEventId))
    .then(({ data }) => transformResponseToEventAventriDetails(data))
    .catch(() => Promise.reject('Unable to load aventri event details.'))
