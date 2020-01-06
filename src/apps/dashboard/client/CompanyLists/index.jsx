import { GREY_2 } from 'govuk-colours'
import {
  SPACING, BORDER_WIDTH_MOBILE
} from '@govuk-react/constants'
import HintText from '@govuk-react/hint-text'
import SectionBreak from '@govuk-react/section-break'
import { get, orderBy } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import {
  COMPANY_LIST_VIEWER__FILTER,
  COMPANY_LIST_VIEWER__CHANGE,
  COMPANY_LIST_VIEWER__ORDER
} from '../../../../client/actions'
import Filters from './Filters'
import Header from './Header'
import ListHeader from './ListHeader'
import * as propTypes from './propTypes'
import Table from './Table'

const StyledRoot = styled.div({
  borderTop: `${BORDER_WIDTH_MOBILE} solid ${GREY_2}`,
  paddingTop: SPACING.SCALE_3,
})

const StyledSectionBreak = styled(SectionBreak)({
  marginBottom: SPACING.SCALE_3,
})

const EmptyListMsg = () => (
  <HintText>
    You have not added any companies to your list.
    <br />
    You can add companies to this list from a company page, and only you can see
    this list.
  </HintText>
)

const NoListsMsg = () => (
  <HintText>
    You have not yet created any lists with companies.
    <br />
    You can add companies to lists from a company page, and only you can see
    these lists.
  </HintText>
)

function CompanyLists ({
  lists, selectedIdx, sortBy, filter,
  onChange, onOrderChange, onSearch,
}) {
  const list = lists[selectedIdx]
  const companies = get(list, 'companies', [])
  const orderByParams = {
    recent: [c => c.latestInteraction.date || '', 'desc'],
    'least-recent': [c => c.latestInteraction.date || '', 'asc'],
    alphabetical: [c => c.company.name, 'asc'],
  }[sortBy]
  const filtered = companies.filter(
    c => c.company.name.match(new RegExp(filter, 'i'))
  )
  const ordered = orderBy(filtered, ...orderByParams)

  return (
    <StyledRoot>
      <Header lists={lists} onChange={onChange} />
      <StyledSectionBreak visible={true} />
      {list && <ListHeader list={list} />}
      {lists.length ? (
        companies.length ? (
          <>
            {companies.length > 1 &&
              <Filters
                list={list}
                onOrderChange={onOrderChange}
                onSearch={onSearch}
              />
            }
            <Table companies={ordered} />
          </>
        ) : <EmptyListMsg />
      ) : <NoListsMsg />
      }
    </StyledRoot>
  )
}

CompanyLists.propTypes = {
  lists: propTypes.lists.isRequired,
  selectedIdx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  sortBy: PropTypes.oneOf(['alphabetical', 'recent', 'least-recent']).isRequired,
  filter: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onOrderChange: PropTypes.func,
  onSearch: PropTypes.func,
}

export default connect(
  state => state.companyLists,
  dispatch => ({
    onChange: idx => dispatch({
      type: COMPANY_LIST_VIEWER__CHANGE,
      idx,
    }),
    onOrderChange: sortBy => dispatch({
      type: COMPANY_LIST_VIEWER__ORDER,
      sortBy,
    }),
    onSearch: filter => dispatch({
      type: COMPANY_LIST_VIEWER__FILTER,
      filter,
    }),
  })
)(CompanyLists)
