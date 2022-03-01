import React from 'react'
import { storiesOf } from '@storybook/react'
import NewWindowLink from 'NewWindowLink'

const stories = storiesOf('NewWindowLink')

stories
  .add('Default', () => (
    <NewWindowLink href="https://example.com">This is a link</NewWindowLink>
  ))
  .add('Custom aria-label', () => (
    <NewWindowLink href="https://example.com" aria-label="custom help text">
      This is a link
    </NewWindowLink>
  ))
