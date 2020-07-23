import axios from 'axios'
import pluralize from 'pluralize'

function usePostcodeLookup(apiEndpoint) {
  function createAddressCount(addresses) {
    const addressCount = pluralize('address', addresses.length, true)
    return {
      address1: `${addressCount} found`,
    }
  }

  return async function findAddress(postcode) {
    const { data } = await axios.get(`${apiEndpoint}/${postcode}`)
    const addressCount = createAddressCount(data)

    return [addressCount, ...data]
  }
}

export default usePostcodeLookup
