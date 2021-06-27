import axios from 'axios'

import urls from '../../../lib/urls'

import { transformResponseToCollection } from './transformers'

import { getMetadataOptions } from '../../../client/metadata'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

const getInteractionsMetadata = () =>
  Promise.all([getMetadataOptions(urls.metadata.service())])
    .then(([serviceOptions]) => ({
      serviceOptions: serviceOptions.sort((a, b) =>
        a.label > b.label ? 1 : b.label > a.label ? -1 : 0
      ),
    }))
    .catch(handleError)

const getInteractions = ({
  limit = 10,
  page = 1,
  kind,
  adviser,
  service,
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
      service,
    })
    .then(({ data }) => transformResponseToCollection(data), handleError)

export { getInteractions, getInteractionsMetadata }
