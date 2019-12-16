import { GREY_2 } from 'govuk-colours'
import {
  SPACING, BORDER_WIDTH_MOBILE
} from '@govuk-react/constants'
import HintText from '@govuk-react/hint-text'
import SectionBreak from '@govuk-react/section-break'
import { get, orderBy } from 'lodash'
import React, { useReducer } from 'react'
import styled from 'styled-components'

import * as actions from './actions'
import reducer, { initialState } from './reducer'
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

function CompanyLists (props) {
  const [
    { lists, selectedIdx, sortBy, filter },
    dispatch,
  ] = useReducer(reducer, {
    ...initialState,
    // Reducer assumes the list of company lists is sorted.
    lists: orderBy(props.lists, 'name'),
  })

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
      <Header lists={lists}
        onChange={idx => dispatch({ type: actions.LIST_CHANGE, idx })} />
      <StyledSectionBreak visible={true} />
      {list && <ListHeader list={list} />}
      {lists.length ? (
        companies.length ? (
          <>
            {companies.length > 1 &&
              <Filters
                list={list}
                onOrderChange={
                  sortBy => dispatch({
                    type: actions.ORDER_CHANGE,
                    sortBy,
                  })
                }
                onSearch={
                  filter => dispatch({
                    type: actions.FILTER_CHANGE,
                    filter,
                  }) 
                }
              />}
            <Table companies={ordered} />
          </>
        ) : <EmptyListMsg />
      ) : <NoListsMsg />
      }
    </StyledRoot>
  )
}

CompanyLists.propTypes = {
  lists: propTypes.lists,
}

export default CompanyLists
