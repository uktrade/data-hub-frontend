import axios from 'axios'
import urls from '../../../../lib/urls'
import { transformResponseToEventDetails } from '../transformers'

export const getEventAventriDetails = (eventAventriId) =>
  axios
    .get(urls.events.aventriDetails(eventAventriId)) // TODO: Implements a controller to handle request
    .then(({ data }) => transformResponseToEventDetails(data))
    .catch(() => Promise.reject('Unable to load aventri event details.'))
