import React from 'react'
import { connect } from 'react-redux'

import { CollectionList } from '../../../../components'
import { listSkeletonPlaceholder } from '../../../../components/SkeletonPlaceholder'
import { TASK_GET_OPPORTUNITIES_LIST, ID, state2props } from './state'
import {
  INVESTMENTS__OPPORTUNITIES_LOADED,
  INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
} from '../../../../actions'
import AccessibleLink from '../../../../components/Link'

const LargeCapitalOpportunityCollection = ({
  count,
  results,
  payload,
  onPageClick,
  activePage,
  isComplete,
  optionMetadata,
}) => (
  <>
    <div data-test="opportunities-note">
      <p>
        This section is for major energy, infrastructure and real estate capital
        investment opportunities that have been approved for promotion by the
        gateway panel run by the Investment Directorate’s Opportunities &
        Propositions team.
      </p>
      <p>
        Only opportunities that have received panel approval should be added to
        this section.
      </p>

      <p>
        For further information email 
        <AccessibleLink href="mailto:capitalinvestment@trade.gov.uk">
          capitalinvestment@trade.gov.uk
        </AccessibleLink>
      </p>
    </div>
    <CollectionList
      taskProps={{
        name: TASK_GET_OPPORTUNITIES_LIST,
        id: ID,
        progressMessage: 'Loading opportunities',
        renderProgress: listSkeletonPlaceholder({
          listItemFields: 2,
        }),
        startOnRender: {
          payload: { payload, activePage },
          onSuccessDispatch: INVESTMENTS__OPPORTUNITIES_LOADED,
        },
      }}
      collectionName="opportunity"
      items={results}
      count={count}
      onPageClick={onPageClick}
      activePage={activePage}
      isComplete={isComplete}
      entityName="opportunity"
      entityNamePlural="opportunities"
      addItemUrl="/investments/opportunities/create"
      baseDownloadLink="/investments/opportunities/export"
      sortOptions={optionMetadata.sortOptions}
    />
  </>
)

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
      page,
    })
  },
}))(LargeCapitalOpportunityCollection)
