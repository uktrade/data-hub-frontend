import urls from '../../../../lib/urls'
import { getMetadataOptions } from '../../../../client/metadata'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

const getEventFormMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.eventType(), { filterDisabled: false }),
    getMetadataOptions(urls.metadata.tradeAgreement(), {
      filterDisabled: false,
    }),
  ])
    .then(([eventTypeOptions, relatedTradeAgreements]) => ({
      eventTypeOptions,
      relatedTradeAgreements,
    }))
    .catch(handleError)

export { getEventFormMetadata }
