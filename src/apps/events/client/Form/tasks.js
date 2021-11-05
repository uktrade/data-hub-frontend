import urls from '../../../../lib/urls'
import { getMetadataOptions } from '../../../../client/metadata'

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
      ]) => ({
        eventTypeOptions,
        relatedTradeAgreements,
        eventLocationTypes,
        countries,
        teams,
        services,
        programmes,
      })
    )
    .catch(handleError)

export { getEventFormMetadata }
