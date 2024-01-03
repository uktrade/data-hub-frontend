import React from 'react'
import styled from 'styled-components'

const StyledList = styled('ol')({})

const List = ({ items, itemRenderer }) => (
  <StyledList data-test="export-list">
    {items.map((item) => itemRenderer(item))}
  </StyledList>
)

export default List
