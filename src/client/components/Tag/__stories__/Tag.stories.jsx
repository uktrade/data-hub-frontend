import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { SPACING } from '@govuk-react/constants'

import Tag from 'Tag'
import defaultReadme from './default.md'
import usageReadme from './usage.md'

const List = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  strong {
    margin-bottom: ${SPACING.SCALE_3};
  }
`

storiesOf('Tag', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: defaultReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <List>
      <Tag>BETA</Tag>
      <Tag colour="grey">INACTIVE</Tag>
      <Tag colour="green">NEW</Tag>
      <Tag colour="turquoise">ACTIVE</Tag>
      <Tag colour="blue">PENDING</Tag>
      <Tag colour="purple">RECEIVED</Tag>
      <Tag colour="pink">SENT</Tag>
      <Tag colour="red">REJECTED</Tag>
      <Tag colour="orange">DECLINED</Tag>
      <Tag colour="yellow">DELAYED</Tag>
    </List>
  ))
