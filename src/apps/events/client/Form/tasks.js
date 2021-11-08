import axios from 'axios'

import urls from '../../../../lib/urls'
import { getMetadataOptions } from '../../../../client/metadata'
import { transformEventFormForAPIRequest } from './transformers'
import { catchApiError } from '../../../../client/components/Task/utils'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

const getEventFormMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.eventType(), { filterDisabled: false }),
    getMetadataOptions(urls.metadata.tradeAgreement(), {
      filterDisabled: false,
    }),
    getMetadataOptions(urls.metadata.locationType(), {
      filterDisabled: false,
    }),
    getMetadataOptions(urls.metadata.country(), {
      filterDisabled: false,
    }),
    getMetadataOptions(urls.metadata.team(), {
      filterDisabled: false,
    }),
    getMetadataOptions(urls.metadata.service(), {
      filterDisabled: false,
    }),
    getMetadataOptions(urls.metadata.programme(), {
      filterDisabled: false,
    }),
    getMetadataOptions(urls.metadata.ukRegion(), {
      filterDisabled: false,
    }),
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
      ]) => ({
        eventTypeOptions,
        relatedTradeAgreements,
        eventLocationTypes,
        countries,
        teams,
        services,
        programmes,
        ukRegions,
      })
    )
    .catch(handleError)

const saveEvent = ({ values }) => {
  // console.log(values)
  const transformedValuesOnlyPayload = transformEventFormForAPIRequest(values)
  // console.log(transformedValuesOnlyPayload)
  if (transformedValuesOnlyPayload) {
    // Save this to the backend
    const request = values.id ? axios.patch : axios.post
    const payload = values.id
      ? {
          ...transformedValuesOnlyPayload,
        }
      : {
          ...values,
          ...transformedValuesOnlyPayload,
        }
    const endpoint = values.id
      ? `/api-proxy/v4/event/${values.id}`
      : '/api-proxy/v4/event'
    return request(endpoint, payload).catch(catchApiError)
  }
}

export { getEventFormMetadata, saveEvent }
