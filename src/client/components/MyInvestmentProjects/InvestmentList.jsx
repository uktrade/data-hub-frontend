import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import InvestmentListItem from './InvestmentListItem'

const StyledOrderedList = styled('ol')`
  margin-top: 0;
  ${({ isPaginated }) => isPaginated && `border-bottom: 2px solid red;`}
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
