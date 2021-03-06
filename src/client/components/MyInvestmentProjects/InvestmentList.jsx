import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GREY_1 } from 'govuk-colours'

import InvestmentListItem from './InvestmentListItem'

const StyledOrderedList = styled('ol')`
  margin-top: 0;
  ${({ isPaginated }) => isPaginated && `border-bottom: 2px solid ${GREY_1};`}
`

const InvestmentList = ({ items, isPaginated, showDetails }) => (
  <StyledOrderedList isPaginated={isPaginated}>
    {items.map((item) => (
      <InvestmentListItem key={item.id} showDetails={showDetails} {...item} />
    ))}
  </StyledOrderedList>
)

InvestmentList.propTypes = {
  items: PropTypes.array.isRequired,
}

export default InvestmentList
