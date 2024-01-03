import { apiProxyAxios } from '../../../components/Task/utils'
import { getMetadataOptions } from '../../../metadata'
import { transformResponseToCollection } from './transformers'
import urls from '../../../../lib/urls'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const searchAttendee = ({
  name,
  companyId,
  company_name,
  address_country,
  email,
  company_uk_region,
  eventId,
}) => {
  return apiProxyAxios
    .post('/v3/search/contact', {
      limit: 10,
      offset: 0,
      archived: false,
      name,
      company: companyId,
      company_name,
      address_country,
      email,
      company_uk_region,
      eventId,
    })
    .then(
      ({ data }) => transformResponseToCollection(companyId, eventId, data),
      handleError
    )
}

export const getAttendeeMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.ukRegion(), { filterDisabled: false }),
  ])
    .then(([countryOptions, ukRegionOptions]) => ({
      countryOptions,
      ukRegionOptions,
    }))
    .catch(handleError)
