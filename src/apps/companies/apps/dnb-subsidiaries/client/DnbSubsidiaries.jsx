import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSearchParam } from 'react-use'
import { CollectionList } from 'data-hub-components'
import axios from 'axios'
import { LoadingBox } from 'govuk-react'

const DnbSubsidiaries = ({ dataEndpoint }) => {
  const [subsidiaries, setSubsidiaries] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const activePage = parseInt(useSearchParam('page'), 10) || 1
  const setActivePage = (page) =>
    window.history.pushState({}, '', `${window.location.pathname}?page=${page}`)

  const onPageClick = (page, event) => {
    setActivePage(page)
    event.target.blur()
    event.preventDefault()
  }

  const getPageUrl = (page) => `?page=${page}`

  useEffect(() => {
    async function fetchData () {
      const { data } = await axios.get(dataEndpoint, {
        params: {
          page: activePage,
        },
      })
      setSubsidiaries(data.results)
      setTotalItems(data.count)
      setIsLoading(false)
    }
    setIsLoading(true)
    window.scrollTo(0, 0)
    fetchData()
  }, [activePage])

  return (
    <>
      <p>This hierarchy information from Dun & Bradstreet cannot be edited.</p>

      <LoadingBox loading={isLoading}>
        <CollectionList
          itemName="related company"
          items={subsidiaries}
          totalItems={totalItems}
          onPageClick={onPageClick}
          getPageUrl={getPageUrl}
          activePage={activePage}
        />
      </LoadingBox>
    </>
  )
}

DnbSubsidiaries.propTypes = {
  dataEndpoint: PropTypes.string.isRequired,
}

export default DnbSubsidiaries
