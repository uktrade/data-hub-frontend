import React from 'react'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

const List = styled('ol')({
  padding: 0,
  listStyleType: 'none',
  marginTop: SPACING.SCALE_2,
  '& > li': {
    marginBottom: SPACING.SCALE_2,
  },
})

const CollectionList = ({
  results,
  disableDelete,
  onDeleteReminder,
  itemRenderer,
}) => (
  <List data-test="reminders-list">
    {results.map((item) => itemRenderer(item, onDeleteReminder, disableDelete))}
  </List>
)

export default CollectionList
