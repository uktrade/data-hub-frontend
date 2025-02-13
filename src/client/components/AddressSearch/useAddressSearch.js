import { useState } from 'react'

function useAddressSearch(addressSearchCallback) {
  const [addressList, setAddressList] = useState(null)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onAddressSearch(postcode) {
    try {
      setIsSubmitting(true)
      setError(null)
      setAddressList(await addressSearchCallback(postcode))
      // eslint-disable-next-line no-unused-vars
    } catch (ex) {
      setAddressList(null)
      setError('Error occurred while searching for an address.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    error,
    addressList,
    isSubmitting,
    onAddressSearch,
  }
}

export default useAddressSearch
