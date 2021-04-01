import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { GREY_1 } from 'govuk-colours'

import InvestmentListItem from './InvestmentListItem'

const StyledOrderedList = styled('ol')`
  margin-top: ${SPACING.SCALE_3};
  border-top: 2px solid ${GREY_1};
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
