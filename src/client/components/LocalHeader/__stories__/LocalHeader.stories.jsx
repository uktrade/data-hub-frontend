import React from 'react'
import { storiesOf } from '@storybook/react'

import LocalHeader from '../LocalHeader'
import exampleReadme from './example.md'
import usageReadme from './usage.md'

const exampleText = 'Example'
const breadcrumbs = [{ link: '/', text: 'Home' }, { text: exampleText }]

storiesOf('LocalHeader', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <LocalHeader breadcrumbs={breadcrumbs} heading={exampleText} />
  ))
  .add('With link', () => (
    <LocalHeader
      breadcrumbs={breadcrumbs}
      heading={exampleText}
      headingLink={{
        url: '/',
        text: exampleText,
      }}
    />
  ))
  .add('With superheading', () => (
    <LocalHeader
      breadcrumbs={breadcrumbs}
      heading={exampleText}
      superheading={exampleText}
    />
  ))
  .add('With children', () => (
    <LocalHeader
      breadcrumbs={breadcrumbs}
      heading={exampleText}
      children={exampleText}
    />
  ))
