import React from 'react'

import NewWindowLink from '..'

export default {
  title: 'NewWindowLink',

  parameters: {
    component: NewWindowLink,
  },
}

export const Default = () => (
  <NewWindowLink href="https://example.com">This is a link</NewWindowLink>
)

export const CustomAriaLabel = () => (
  <NewWindowLink
    href="https://example.com"
    aria-label="custom help text for screen readers which overrides the link text"
  >
    This is a link
  </NewWindowLink>
)

CustomAriaLabel.story = {
  name: 'Custom aria-label',
}
