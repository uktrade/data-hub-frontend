import React from 'react'
import HintText from '@govuk-react/hint-text'
import { SPACING, BORDER_WIDTH_MOBILE } from '@govuk-react/constants'
import { GREY_2 } from 'govuk-colours'
import styled from 'styled-components'

import useMyCompaniesContext from './useMyCompaniesContext'
import MyCompaniesTable from './MyCompaniesTable'
import ListSelector from './ListSelector'

const StyledDiv = styled.div({
  borderTop: `${BORDER_WIDTH_MOBILE} solid ${GREY_2}`,
  paddingTop: SPACING.SCALE_3,
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

function MyCompaniesTile() {
  const {
    state: { lists, selectedIdx },
  } = useMyCompaniesContext()
  const hasLists = lists.length
  const list = lists[selectedIdx]
  const hasCompanies = list && list.companies && list.companies.length

  return (
    <StyledDiv>
      <ListSelector />
      {/* eslint-disable no-nested-ternary */}
      {hasLists ? (
        hasCompanies ? (
          <MyCompaniesTable />
        ) : (
          <EmptyListMsg />
        )
      ) : (
        <NoListsMsg />
      )}
    </StyledDiv>
  )
}

export default MyCompaniesTile
