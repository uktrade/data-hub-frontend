import React from 'react'
import { storiesOf } from '@storybook/react'
import Link from '@govuk-react/link'
import { FONT_SIZE } from '@govuk-react/constants'
import Badge from 'Badge'

storiesOf('Badge', module)
  .addParameters({ component: Badge })
  .add('Default', () => <Badge>This is a text</Badge>)
  .add('Custom border colour', () => (
    <Badge borderColour="red">With a red border</Badge>
  ))
  .add('Custom text colour', () => (
    <Badge textColour="red">With red text</Badge>
  ))
  .add('Custom font size', () => (
    <Badge fontSize={FONT_SIZE.SIZE_24}>With the font set to 24</Badge>
  ))
  .add('HTML content', () => (
    <Badge>
      <Link href="http://example.com">This is a link</Link>
    </Badge>
  ))
