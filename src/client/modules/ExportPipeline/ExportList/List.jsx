import React from 'react'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

const StyledList = styled('ol')({
  li: {
    marginBottom: SPACING.SCALE_2,
  },
})

const List = ({ items, itemRenderer }) => (
  <StyledList data-test="export-list">
    {items.map((item) => itemRenderer(item))}
  </StyledList>
)

export default List
