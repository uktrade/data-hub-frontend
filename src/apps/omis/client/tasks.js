import axios from 'axios'

import { transformResponseToCollection } from './transformers'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const getOrders = ({
  limit = 10,
  page = 1,
  sortby = 'created_on:desc',
}) =>
  axios
    .post('/api-proxy/v3/search/order', {
      limit,
      offset: limit * (page - 1),
      sortby,
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)
