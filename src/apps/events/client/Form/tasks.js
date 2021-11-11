import urls from '../../../../lib/urls'
import { getMetadataOptions } from '../../../../client/metadata'
import {
  transformEventFormForAPIRequest,
  transformResponseToEventForm,
} from './transformers'
import {
  catchApiError,
  apiProxyAxios,
} from '../../../../client/components/Task/utils'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

export const getEventDetails = (eventId) =>
  eventId
    ? apiProxyAxios
        .get(`/v4/event/${eventId}`)
        .then(({ data }) =>
          Object.assign(data, transformResponseToEventForm(data))
        )
    : Promise.resolve({})

const getEventFormAndMetadata = (eventId) => {
  return Promise.all([
    getMetadataOptions(urls.metadata.eventType()),
    getMetadataOptions(urls.metadata.tradeAgreement()),
    getMetadataOptions(urls.metadata.locationType()),
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.team()),
    getMetadataOptions(urls.metadata.service()),
    getMetadataOptions(urls.metadata.programme()),
    getMetadataOptions(urls.metadata.ukRegion()),
    getEventDetails(eventId),
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
        eventTypeOptions,
        relatedTradeAgreements,
        eventLocationTypes,
        countries,
        teams,
        services,
        programmes,
        ukRegions,
        initialValues,
      })
    )
    .catch(handleError)
}

const saveEvent = ({ values }) => {
  // console.log(values)
  const transformedValuesOnlyPayload = transformEventFormForAPIRequest(values)
  // console.log(transformedValuesOnlyPayload)
  if (transformedValuesOnlyPayload) {
    // Save this to the backend
    const request = values.id ? apiProxyAxios.patch : apiProxyAxios.post
    const payload = values.id
      ? {
          ...transformedValuesOnlyPayload,
        }
      : {
          ...values,
          ...transformedValuesOnlyPayload,
        }
    const endpoint = values.id ? `/v4/event/${values.id}` : '/v4/event'
    return request(endpoint, payload).catch(catchApiError)
  }
}

export { getEventFormAndMetadata, saveEvent }
