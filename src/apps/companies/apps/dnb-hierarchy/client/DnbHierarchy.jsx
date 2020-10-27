import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSearchParam } from 'react-use'
import { CollectionList } from '../../../../../client/components/'
import axios from 'axios'
import { Details, LoadingBox } from 'govuk-react'

const DnbHierarchy = ({ dataEndpoint, isGlobalHQ }) => {
  const [companies, setCompanies] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const activePage = parseInt(useSearchParam('page'), 10) || 1
  const getPageUrl = (page) => `${window.location.pathname}?page=${page}`
  const setActivePage = (page) =>
    window.history.pushState({}, '', getPageUrl(page))

  const onPageClick = (page) => {
    setActivePage(page)
  }

  useEffect(() => {
    async function fetchData() {
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

      {isGlobalHQ && (
        <Details summary="Why aren't all manually linked subsidiaries listed here?">
          This does not mean that Dun & Bradstreet does not know about those
          subsidiaries.
          <br />
          The Dun & Bradstreet hierarchy information can only show the company
          records in Data Hub that have been matched to a verified Dun &
          Bradstreet record. This matching process is ongoing and more related
          company records will appear in the future.
        </Details>
      )}

      <LoadingBox loading={isLoading}>
        <CollectionList
          collectionName="related company record"
          items={companies}
          count={totalItems}
          isComplete={true}
          // onPageClick={onPageClick}
          // getPageUrl={getPageUrl}
          activePage={activePage}
        />
      </LoadingBox>
    </>
  )
}

DnbHierarchy.propTypes = {
  dataEndpoint: PropTypes.string.isRequired,
  isGlobalHQ: PropTypes.bool.isRequired,
}

export default DnbHierarchy
