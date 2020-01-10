import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSearchParam } from 'react-use'
import { H3 } from '@govuk-react/heading'
import { ErrorSummary, LoadingBox } from 'govuk-react'
import styled from 'styled-components'
import pluralise from 'pluralise'
import axios from 'axios'

import EditHistoryList from './EditHistoryList'
import { DEFAULT_ITEMS_PER_PAGE } from '../constants'

const StyledLoadingBox = styled(LoadingBox)`
  ${({ loading, minHeight }) => loading && `min-height: ${minHeight}px;`}
`

function EditHistory({ dataEndpoint }) {
  const [editHistory, setEditHistory] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const totalPages = Math.floor(totalItems / DEFAULT_ITEMS_PER_PAGE) + 1
  const activePage = parseInt(useSearchParam('page'), 10) || 1
  const setActivePage = (page) =>
    window.history.pushState({}, '', `${window.location.pathname}?page=${page}`)

  const onPageClick = (page, event) => {
    setActivePage(page)
    event.target.blur()
    event.preventDefault()
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(dataEndpoint, {
          params: {
            page: activePage,
          },
        })
        setEditHistory(data.results)
        setTotalItems(data.count)
        setIsLoading(false)
      } catch (err) {
        setErrorMessage(err.message)
      }
    }
    setIsLoading(true)
    window.scrollTo(0, 0)
    fetchData()
  }, [activePage])

  return errorMessage ? (
    <ErrorSummary
      heading="There was an error in fetching the Edit history. Please try again."
      description={errorMessage}
      errors={[]}
    />
  ) : (
    <StyledLoadingBox minHeight={window.innerHeight} loading={isLoading}>
      <H3>{`${totalItems} ${pluralise(totalItems, 'change')}`}</H3>
      <EditHistoryList
        items={editHistory}
        totalPages={totalPages}
        activePage={activePage}
        onPageClick={onPageClick}
      />
    </StyledLoadingBox>
  )
}

EditHistory.propTypes = {
  dataEndpoint: PropTypes.string.isRequired,
}

export default EditHistory
