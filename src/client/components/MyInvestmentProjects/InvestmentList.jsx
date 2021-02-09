import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import InvestmentListItem from './InvestmentListItem'

const StyledOrderedList = styled('ol')`
  margin-top: ${SPACING.SCALE_3};
`

const InvestmentList = ({ items }) => (
  <StyledOrderedList>
    {items.map((item) => (
      <InvestmentListItem key={item.id} {...item} />
    ))}
  </StyledOrderedList>
)

InvestmentList.propTypes = {
  items: PropTypes.array.isRequired,
}

export default InvestmentList
