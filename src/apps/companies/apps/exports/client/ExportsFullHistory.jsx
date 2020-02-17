import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useSearchParam } from 'react-use'
import urls from '../../../../../lib/urls'
import { H2 } from '@govuk-react/heading'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'
import { CollectionList } from 'data-hub-components'
import LoadingBox from '@govuk-react/loading-box'
import ErrorSummary from '@govuk-react/error-summary'

import { connect } from 'react-redux'
import Task from '../../../../../client/components/Task/index.jsx'
import { state2props } from '../state'
import { EXPORTS_HISTORY } from '../../../../../client/actions'

const Wrapper = styled('div')`
  margin-top: ${SPACING.SCALE_3};
`

function ExportFullHistory({ companyId }) {
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const activePage = parseInt(useSearchParam('page'), 10) || 1
  const getPageUrl = (page) => `${window.location.pathname}?page=${page}`
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
        const { data } = await axios.get(urls.search.exportsHistory(), {
          params: {
            page: activePage,
            companyId,
          },
        })
        setItems(data.results)
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
      heading="There was an error getting the export countries history"
      description={errorMessage}
      errors={[]}
    />
  ) : (
    <LoadingBox loading={isLoading}>
      <Wrapper>
        <H2 size={LEVEL_SIZE[3]}>Export countries history</H2>
        <CollectionList
          itemName="result"
          items={items}
          totalItems={totalItems}
          onPageClick={onPageClick}
          getPageUrl={getPageUrl}
          activePage={activePage}
        />
      </Wrapper>
    </LoadingBox>
  )
}

ExportFullHistory.propTypes = {
  companyId: PropTypes.string.isRequired,
}

export default connect((state) => {
  const { loading, count, results } = state2props(state)
  return { loading, count, results }
})(({ loading, count, results, companyId }) => {
  return (
    <>
      <Task.Status
        name="Exports history"
        id="exportsHistory"
        progressMessage="loading exports history"
        startOnRender={{
          payload: companyId,
          onSuccessDispatch: EXPORTS_HISTORY,
        }}
      />
      {!loading && (
        <CollectionList itemName="result" items={results} totalItems={count} />
      )}
    </>
  )
})
