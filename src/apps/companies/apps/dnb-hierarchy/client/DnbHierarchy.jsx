import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSearchParam } from 'react-use'
import { CollectionList } from 'data-hub-components'
import axios from 'axios'
import { LoadingBox } from 'govuk-react'

const DnbHierarchy = ({ dataEndpoint }) => {
  const [companies, setCompanies] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const activePage = parseInt(useSearchParam('page'), 10) || 1
  const getPageUrl = (page) => `${window.location.pathname}?page=${page}`
  const setActivePage = (page) =>
    window.history.pushState({}, '', getPageUrl(page))

  const onPageClick = (page, event) => {
    setActivePage(page)
    event.target.blur()
    event.preventDefault()
  }

  useEffect(() => {
    async function fetchData () {
      const { data } = await axios.get(dataEndpoint, {
        params: {
          page: activePage,
        },
      })
      setCompanies(data.results)
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
          itemName="related company record"
          items={companies}
          totalItems={totalItems}
          onPageClick={onPageClick}
          getPageUrl={getPageUrl}
          activePage={activePage}
        />
      </LoadingBox>
    </>
  )
}

DnbHierarchy.propTypes = {
  dataEndpoint: PropTypes.string.isRequired,
}

export default DnbHierarchy
