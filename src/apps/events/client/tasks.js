import axios from 'axios'

import { transformResponseToEventCollection } from './transformers'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

const getEvents = ({ limit = 10, page, sortby = 'modified_on:desc' }) =>
  axios
    .post('/api-proxy/v3/search/event', {
      limit,
      offset: limit * (parseInt(page, 10) - 1) || 0,
      sortby,
    })
    .then(({ data }) => transformResponseToEventCollection(data))
    .catch(handleError)

export { getEvents }
