import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSearchParam } from 'react-use'
import { CollectionList } from '../../../client/components/'
import LoadingBox from '@govuk-react/loading-box'
import ErrorSummary from '@govuk-react/error-summary'
import { investments } from '../../../lib/urls'

const LargeCapitalProfileCollection = () => {
  const [profiles, setProfiles] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const activePage = parseInt(useSearchParam('page') || 1, 10)
  const setActivePage = (page) =>
    window.history.pushState({}, '', `${window.location.pathname}?page=${page}`)

  const onPageClick = (page, event) => {
    setActivePage(page)
    event.target.blur()
    event.preventDefault()
  }

  const getPageUrl = (page) => `?page${page}`

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(investments.profiles.data(), {
          params: {
            page: activePage,
          },
        })
        setProfiles(data.results)
        setTotalItems(data.count)
        setIsLoading(false)
      } catch {
        setErrorMessage('Please try again later')
      }
    }
    setIsLoading(true)
    window.scrollTo(0, 0)
    fetchData()
  }, [activePage])

  return errorMessage ? (
    <ErrorSummary
      heading="There was an error getting the investor profiles"
      description={errorMessage}
      errors={[]}
    />
  ) : (
    <LoadingBox loading={isLoading}>
      <CollectionList
        itemName="profile"
        items={profiles}
        totalItems={totalItems}
        onPageClick={onPageClick}
        getPageUrl={getPageUrl}
        activePage={activePage}
      />
    </LoadingBox>
  )
}

export default LargeCapitalProfileCollection
