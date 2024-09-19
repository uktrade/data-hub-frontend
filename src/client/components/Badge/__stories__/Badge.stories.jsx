import React from 'react'
import Link from '@govuk-react/link'
import { FONT_SIZE } from '@govuk-react/constants'

import Badge from '..'

export default {
  title: 'Badge',

  parameters: {
    component: Badge,
  },
}

export const Default = () => <Badge>This is a text</Badge>

export const CustomBorderColour = () => (
  <Badge borderColour="red">With a red border</Badge>
)

CustomBorderColour.story = {
  name: 'Custom border colour',
}

export const CustomTextColour = () => (
  <Badge textColour="red">With red text</Badge>
)

CustomTextColour.story = {
  name: 'Custom text colour',
}

export const CustomFontSize = () => (
  <Badge fontSize={FONT_SIZE.SIZE_24}>With the font set to 24</Badge>
)

CustomFontSize.story = {
  name: 'Custom font size',
}

export const HtmlContent = () => (
  <Badge>
    <Link href="http://example.com">This is a link</Link>
  </Badge>
)

HtmlContent.story = {
  name: 'HTML content',
}
