import React from 'react'
import styled from 'styled-components'
import { H2 } from '@govuk-react/heading'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'
import InsetText from '@govuk-react/inset-text'
import { CollectionList } from '../../../../../../client/components/'
import { connect } from 'react-redux'

import { state2props } from './state'
import {
  EXPORTS_HISTORY__LOADED,
  EXPORTS_HISTORY__SELECT_PAGE,
} from '../../../../../../client/actions'

const Wrapper = styled('div')`
  margin-top: ${SPACING.SCALE_3};
`

function ExportsHistory({
  count,
  results,
  onPageClick,
  activePage,
  companyId,
  countryId,
  pageTitle,
  isComplete,
}) {
  const exportHistoryTask = {
    name: 'Exports history',
    id: 'exportsHistory',
    progressMessage: 'loading Exports History',
    startOnRender: {
      payload: { companyId, countryId, activePage },
      onSuccessDispatch: EXPORTS_HISTORY__LOADED,
    },
  }
  return (
    <Wrapper>
      <InsetText>
        You can only see the history of countries that were added or edited
        after 6th February 2020
      </InsetText>
      <H2 size={LEVEL_SIZE[3]}>{pageTitle}</H2>
      <CollectionList
        itemName="result"
        taskProps={exportHistoryTask}
        items={results}
        count={count}
        onPageClick={onPageClick}
        activePage={activePage}
        isComplete={isComplete}
        routedPagination={false}
      />
    </Wrapper>
  )
}

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: EXPORTS_HISTORY__SELECT_PAGE,
      page,
    })
  },
}))(ExportsHistory)
