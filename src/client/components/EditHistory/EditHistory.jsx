import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSearchParam } from 'react-use'
import { H3 } from '@govuk-react/heading'
import { ErrorSummary, LoadingBox } from 'govuk-react'
import styled from 'styled-components'
import pluralize from 'pluralize'
import axios from 'axios'

import EditHistoryList from './EditHistoryList'

const StyledLoadingBox = styled(LoadingBox)`
  ${({ loading, minHeight }) => loading && `min-height: ${minHeight}px;`}
`

function EditHistory({
  dataEndpoint,
  changeType,
  getUpdatedBy,
  getValue,
  itemsPerPage,
}) {
  const [editHistory, setEditHistory] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const activePage = parseInt(useSearchParam('page'), 10) || 1
  const setActivePage = (page) =>
    window.history.pushState({}, '', `${window.location.pathname}?page=${page}`)

  const onPageClick = (page) => {
    setActivePage(page)
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
      <H3>{pluralize('change', totalItems, true)}</H3>
      <EditHistoryList
        items={editHistory}
        totalPages={totalPages}
        activePage={activePage}
        onPageClick={onPageClick}
        changeType={changeType}
        getUpdatedBy={getUpdatedBy}
        getValue={getValue}
      />
    </StyledLoadingBox>
  )
}

EditHistory.propTypes = {
  dataEndpoint: PropTypes.string.isRequired,
  changeType: PropTypes.string.isRequired,
  getUpdatedBy: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number,
}

EditHistory.defaultProps = {
  itemsPerPage: 10,
}

export default EditHistory
