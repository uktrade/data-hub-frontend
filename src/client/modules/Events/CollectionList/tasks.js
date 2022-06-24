import axios from 'axios'
import urls from '../../../../lib/urls'
import { apiProxyAxios } from '../../../components/Task/utils'
import { getMetadataOptions } from '../../../metadata'
import { getPageOffset } from '../../../utils/pagination'

import { transformResponseToEventCollection } from '../transformers'

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
  apiProxyAxios
    .post('/v3/search/event', {
      limit,
      offset: getPageOffset({ limit, page }),
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

const getDataHubEvents = () =>
  axios
    .get(urls.events.activity.data())
    .then(({ data }) => data)
    .catch(() => Promise.reject('Unable to load Data Hub events.'))

export { getEvents, getEventsMetadata, getDataHubEvents }
