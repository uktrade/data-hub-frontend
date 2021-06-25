import axios from 'axios'
import { metadata } from '../../../lib/urls'

export default function useAdministrativeAreaLookup() {
  return async function findAreaByCountryId(countryId = undefined) {
    const { data } = await axios(metadata.administrativeArea())
    return countryId ? filterAreaDataByCountry(data, countryId) : data
  }
}

export function filterAreaDataByCountry(data, countryId) {
  return data.filter((area) => area.country.id === countryId)
}
