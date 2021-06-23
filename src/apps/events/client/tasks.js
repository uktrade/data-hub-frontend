import axios from 'axios'

import urls from '../../../lib/urls'
import { getMetadataOptions } from '../../../client/metadata'

import { transformResponseToEventCollection } from './transformers'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

const getEvents = ({
  limit = 10,
  page,
  sortby = 'modified_on:desc',
  name,
  organiser,
  country,
  uk_region,
}) =>
  axios
    .post('/api-proxy/v3/search/event', {
      limit,
      offset: limit * (page - 1) || 0,
      sortby,
      name,
      organiser,
      country,
      uk_region,
    })
    .then(({ data }) => transformResponseToEventCollection(data))
    .catch(handleError)

const getEventsMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.ukRegion()),
  ])
    .then(([countryOptions, ukRegionOptions]) => ({
      countryOptions,
      ukRegionOptions,
    }))
    .catch(handleError)

export { getEvents, getEventsMetadata }
