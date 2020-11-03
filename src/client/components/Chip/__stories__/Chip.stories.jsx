import React from 'react'
import { storiesOf } from '@storybook/react'

import Chip from '../'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

storiesOf('Chips', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Single', () => {
    return (
      <div>
        <Chip>Apple</Chip>
      </div>
    )
  })
  .add('Multiple', () => {
    return (
      <div>
        <Chip>Apple</Chip>
        <Chip>Pear</Chip>
        <Chip>Orange</Chip>
        <Chip>Banana</Chip>
      </div>
    )
  })
