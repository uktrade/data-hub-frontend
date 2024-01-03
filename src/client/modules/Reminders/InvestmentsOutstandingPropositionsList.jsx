import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import qs from 'qs'

import { BLACK, GREY_1, GREY_2 } from '../../utils/colours'

import { REMINDERS__OUTSTANDING_PROPOSITIONS_LOADED } from '../../actions'
import { TASK_GET_OUTSTANDING_PROPOSITIONS_REMINDERS, ID } from './state'
import { maxItemsToPaginate, itemsPerPage } from './constants'

import InvestmentOPListItemRenderer from './ItemRenderers/Investments/InvestmentOPListItemRenderer'
import { RoutedPagination } from '../../components'
import CollectionHeader from './CollectionHeader'
import CollectionList from './CollectionList'
import Task from '../../components/Task'

const Summary = styled('p')({
  color: BLACK,
  paddingTop: SPACING.SCALE_2,
  fontSize: FONT_SIZE.SIZE_19,
})

const PaginationSummary = styled(Summary)({
  color: GREY_1,
  fontSize: FONT_SIZE.SIZE_16,
  paddingBottom: SPACING.SCALE_3,
  borderBottom: `solid 1px ${GREY_2}`,
})

const InvestmentsOutstandingPropositionsList = ({ reminders }) => {
  const { results, count } = reminders
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10) || 1
  const totalPages = Math.ceil(
    Math.min(count, maxItemsToPaginate) / itemsPerPage
  )

  return (
    <>
      <CollectionHeader settings={false} totalItems={count} />
      {results.length === 0 ? (
        <Summary data-test="investments-no-reminders">
          You have no reminders.
        </Summary>
      ) : (
        <PaginationSummary data-test="pagination-summary">
          {`Page ${page || 1} of ${totalPages}`}
        </PaginationSummary>
      )}
      <Task.Status
        name={TASK_GET_OUTSTANDING_PROPOSITIONS_REMINDERS}
        id={ID}
        startOnRender={{
          payload: { page, sortby: qsParams.sortby },
          onSuccessDispatch: REMINDERS__OUTSTANDING_PROPOSITIONS_LOADED,
        }}
      >
        {() => (
          <>
            <CollectionList
              results={results}
              itemRenderer={InvestmentOPListItemRenderer}
            />
            <RoutedPagination initialPage={page} items={count || 0} />
          </>
        )}
      </Task.Status>
    </>
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(InvestmentsOutstandingPropositionsList)
