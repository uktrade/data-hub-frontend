import React from 'react'
import { storiesOf } from '@storybook/react'
import Link from '@govuk-react/link'
import { FONT_SIZE } from '@govuk-react/constants'
import Badge from 'Badge'
import exampleReadme from '../example.md'
import usageReadme from '../usage.md'

const stories = storiesOf('Badge', module)

stories.addParameters({
  options: { theme: undefined },
  readme: {
    content: exampleReadme,
    sidebar: usageReadme,
  },
})

stories.add('Default', () => <Badge>This is a text</Badge>)

stories.add('Custom border colour', () => (
  <Badge borderColour="red">With a red border</Badge>
))

stories.add('Custom text colour', () => (
  <Badge textColour="red">With red text</Badge>
))

stories.add('Custom font size', () => (
  <Badge fontSize={FONT_SIZE.SIZE_24}>With the font set to 24</Badge>
))

stories.add('HTML content', () => (
  <Badge>
    <Link href="http://example.com">This is a link</Link>
  </Badge>
))
