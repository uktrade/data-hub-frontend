import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { MID_GREY } from '../../../client/utils/colors'

import InvestmentListItem from './InvestmentListItem'

const StyledOrderedList = styled('ol')`
  margin-top: 0;
  ${({ isPaginated }) => isPaginated && `border-bottom: 1px solid ${MID_GREY};`}
`

const InvestmentList = ({ items, isPaginated, showDetails, ...props }) => (
  <StyledOrderedList isPaginated={isPaginated} {...props}>
    {items.map((item) => (
      <InvestmentListItem key={item.id} showDetails={showDetails} {...item} />
    ))}
  </StyledOrderedList>
)

InvestmentList.propTypes = {
  items: PropTypes.array.isRequired,
}

export default InvestmentList
