import _ from 'lodash'

import urls from '../../../../lib/urls'
import { getMetadataOptions } from '../../../../client/metadata'
import { transformResponseToEventForm } from './transformers'
import {
  catchApiError,
  apiProxyAxios,
} from '../../../../client/components/Task/utils'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

const getEventDetails = (eventId) =>
  eventId
    ? apiProxyAxios
        .get(`/v4/event/${eventId}`)
        .then(({ data }) =>
          Object.assign(data, transformResponseToEventForm(data))
        )
    : Promise.resolve({})

const getEventFormAndMetadata = (data) => {
  return Promise.all([
    getMetadataOptions(urls.metadata.eventType()),
    getMetadataOptions(urls.metadata.tradeAgreement()),
    getMetadataOptions(urls.metadata.locationType()),
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.team()),
    getMetadataOptions(urls.metadata.service()),
    getMetadataOptions(urls.metadata.programme()),
    getMetadataOptions(urls.metadata.ukRegion()),
    getEventDetails(data?.eventId),
  ])
    .then(
      ([
        eventTypeOptions,
        relatedTradeAgreements,
        eventLocationTypes,
        countries,
        teams,
        services,
        programmes,
        ukRegions,
        initialValues,
      ]) => ({
        metadata: {
          eventTypeOptions,
          relatedTradeAgreements,
          eventLocationTypes,
          countries,
          teams,
          services,
          programmes,
          ukRegions,
        },
        ...initialValues,
      })
    )
    .catch(handleError)
}

const saveEvent = (values) => {
  const request = values.id ? apiProxyAxios.patch : apiProxyAxios.post
  const payload = {
    ..._.omit(values, [
      'metadata',
      'disabled_on',
      'archived_documents_url_path',
    ]),
  }
  const endpoint = values.id ? `/v4/event/${values.id}` : '/v4/event'
  return request(endpoint, payload).catch(catchApiError)
}

export { getEventFormAndMetadata, saveEvent }
