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
  start_date_before,
  start_date_after,
  address_country,
  uk_region,
  event_type,
}) =>
  axios
    .post('/api-proxy/v3/search/event', {
      limit,
      offset: limit * (page - 1) || 0,
      sortby,
      name,
      organiser,
      start_date_before,
      start_date_after,
      address_country,
      uk_region,
      event_type,
    })
    .then(({ data }) => transformResponseToEventCollection(data))
    .catch(handleError)

const getEventsMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.ukRegion(), { filterDisabled: false }),
    getMetadataOptions(urls.metadata.eventType(), { filterDisabled: false }),
  ])
    .then(([countryOptions, ukRegionOptions, eventTypeOptions]) => ({
      countryOptions,
      ukRegionOptions,
      eventTypeOptions,
    }))
    .catch(handleError)

export { getEvents, getEventsMetadata }
