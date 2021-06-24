import axios from 'axios'

import { transformResponseToCollection } from './transformers'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const getInteractions = ({
  limit = 10,
  page = 1,
  kind,
  adviser,
  date_before,
  date_after,
}) =>
  axios
    .post('/api-proxy/v3/search/interaction', {
      limit,
      kind,
      dit_participants__adviser: adviser,
      offset: limit * (page - 1),
      sortby: 'date:desc',
      date_before,
      date_after,
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)
