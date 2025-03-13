import { useState } from 'react'

function useAdministrativeAreasSearch(areaSearchCallback) {
  const [administrativeAreaList, setAdministrativeAreaList] = useState(null)
  const [administrativeAreaSearchError, setAdministrativeAreaSearchError] =
    useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onAdministrativeAreaSearch(countryId = undefined) {
    try {
      setIsSubmitting(true)
      setAdministrativeAreaSearchError(null)
      setAdministrativeAreaList(await areaSearchCallback(countryId))
      // eslint-disable-next-line no-unused-vars
    } catch (ex) {
      setAdministrativeAreaList(null)
      setAdministrativeAreaSearchError(
        'Error occurred while searching for an administrative area.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    administrativeAreaSearchError,
    administrativeAreaList,
    isAreaFilterSubmitting: isSubmitting,
    onAdministrativeAreaSearch,
  }
}

export default useAdministrativeAreasSearch
