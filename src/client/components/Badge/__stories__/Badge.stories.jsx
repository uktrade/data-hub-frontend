import React from 'react'
import { storiesOf } from '@storybook/react'
import Link from '@govuk-react/link'
import Badge from 'Badge'

const stories = storiesOf('Badge')

stories.add('Default', () => <Badge>This is a text</Badge>)

stories.add('Custom colour', () => (
  <Badge borderColour="red">With a red border</Badge>
))

stories.add('HTML content', () => (
  <Badge>
    <Link href="http://example.com">This is a link</Link>
  </Badge>
))
