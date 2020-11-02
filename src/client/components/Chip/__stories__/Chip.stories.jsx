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
        <Chip label="Apple" />
      </div>
    )
  })
  .add('Multiple', () => {
    return (
      <div>
        <Chip label="Apple" />
        <Chip label="Pear" />
        <Chip label="Orange" />
        <Chip label="Bananna" />
      </div>
    )
  })
