import { useState } from 'react'

function useEntitySearch(searchEntitiesCallback) {
  const [entities, setEntities] = useState([])
  const [error, setError] = useState(null)
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)

  async function onEntitySearch(filters = {}) {
    try {
      setSearching(true)
      setError(null)
      const newEntities = await searchEntitiesCallback(filters)
      setEntities(newEntities)
    } catch (ex) {
      setEntities([])
      setError('Error occurred while searching entities.')
    } finally {
      setSearching(false)
      setSearched(true)
    }
  }

  return {
    onEntitySearch,
    entities,
    error,
    searching,
    searched,
  }
}

export default useEntitySearch
