import React from 'react'
import styled from 'styled-components'
import { H2 } from '@govuk-react/heading'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'
import { CollectionList } from 'data-hub-components'

import { connect } from 'react-redux'
import Task from '../../../../../client/components/Task/index.jsx'
import { state2props } from '../state'
import {
  EXPORTS_HISTORY,
  EXPORTS_HISTORY__CLICK,
} from '../../../../../client/actions'

const Wrapper = styled('div')`
  margin-top: ${SPACING.SCALE_3};
`

export default connect(
  (state) => {
    const { loading, count, results, activePage } = state2props(state)
    return { loading, count, results, activePage }
  },
  (dispatch) => ({
    onPageClick: (page, event) => {
      event.target.blur()
      event.preventDefault()
      dispatch({
        type: EXPORTS_HISTORY__CLICK,
        page,
        event,
      })
      window.history.pushState(
        {},
        '',
        `${window.location.pathname}?page=${page}`
      )
      window.scrollTo(0, 0)
    },
  })
)(({ loading, count, results, onPageClick, activePage, companyId }) => {
  return (
    <Wrapper>
      <Task.Status
        name="Exports history"
        id="exportsHistory"
        progressMessage="loading Exports History"
        startOnRender={{
          payload: { companyId, activePage },
          onSuccessDispatch: EXPORTS_HISTORY,
        }}
      />
      {!loading && (
        <>
          <H2 size={LEVEL_SIZE[3]}>Export countries history</H2>
          <CollectionList
            itemName="result"
            items={results}
            totalItems={count}
            onPageClick={onPageClick}
            activePage={activePage}
          />
        </>
      )}
    </Wrapper>
  )
})
