import React from 'react'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import Tag, { TAG_COLOURS } from '..'

const List = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  strong {
    margin-bottom: ${SPACING.SCALE_3};
  }
`

export default {
  title: 'Tag',
  component: Tag,
  tags: ['autodocs'],
}

export const TagVariants = () => (
  <List>
    <Tag>Beta</Tag>
    <Tag colour={TAG_COLOURS.GREY}>Inactive</Tag>
    <Tag colour={TAG_COLOURS.GREEN}>New</Tag>
    <Tag colour={TAG_COLOURS.TURQUOISE}>Active</Tag>
    <Tag colour={TAG_COLOURS.BLUE}>Pending</Tag>
    <Tag colour={TAG_COLOURS.LIGHT_BLUE}>In progress</Tag>
    <Tag colour={TAG_COLOURS.PURPLE}>Received</Tag>
    <Tag colour={TAG_COLOURS.PINK}>Sent</Tag>
    <Tag colour={TAG_COLOURS.RED}>Rejected</Tag>
    <Tag colour={TAG_COLOURS.ORANGE}>Declined</Tag>
    <Tag colour={TAG_COLOURS.YELLOW}>Delayed</Tag>
    <Tag colour={TAG_COLOURS.DARK_GREEN}>My colours</Tag>
  </List>
)
